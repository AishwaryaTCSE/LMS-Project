const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize AI clients
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const googleAI = process.env.GOOGLE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
  : null;

// Configuration
const CONFIG = {
  OPENAI_ENABLED: !!process.env.OPENAI_API_KEY,
  GOOGLE_AI_ENABLED: !!process.env.GOOGLE_AI_API_KEY,
  
  // Rate limiting (requests per minute per user/IP)
  RATE_LIMIT: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 30,     // Max requests per window
    BUCKET_SIZE: 10,      // Burst capacity
    REFILL_RATE: 5,       // Tokens added per second
  },
  
  // Default models
  MODELS: {
    TEXT: {
      DEFAULT: 'gpt-3.5-turbo',
      FAST: 'gpt-3.5-turbo',
      SMART: 'gpt-4',
      CODE: 'gpt-4-1106-preview',
      GOOGLE: 'gemini-pro'
    },
    IMAGE: {
      DEFAULT: 'dall-e-3',
      GOOGLE: 'gemini-pro-vision'
    }
  },
  
  // Default parameters
  DEFAULTS: {
    TEMPERATURE: 0.7,
    MAX_TOKENS: 1000,
    TOP_P: 1.0,
    FREQUENCY_PENALTY: 0,
    PRESENCE_PENALTY: 0,
  }
};

// Rate limiting with token bucket algorithm
class RateLimiter {
  constructor(config) {
    this.config = config;
    this.buckets = new Map();
    
    // Start refill interval
    setInterval(() => this.refillBuckets(), 1000);
  }
  
  getBucket(key) {
    if (!this.buckets.has(key)) {
      this.buckets.set(key, {
        tokens: this.config.BUCKET_SIZE,
        lastRefill: Date.now()
      });
    }
    return this.buckets.get(key);
  }
  
  refillBuckets() {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      const timePassed = now - bucket.lastRefill;
      const tokensToAdd = Math.floor((timePassed / 1000) * this.config.REFILL_RATE);
      
      if (tokensToAdd > 0) {
        bucket.tokens = Math.min(
          bucket.tokens + tokensToAdd,
          this.config.BUCKET_SIZE
        );
        bucket.lastRefill = now;
      }
      
      // Clean up old buckets
      if (now - bucket.lastRefill > this.config.WINDOW_MS * 2) {
        this.buckets.delete(key);
      }
    }
  }
  
  checkLimit(key) {
    const bucket = this.getBucket(key);
    if (bucket.tokens < 1) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    bucket.tokens--;
    return true;
  }
}

const rateLimiter = new RateLimiter(CONFIG.RATE_LIMIT);

/**
 * Sanitize input to prevent prompt injection
 */
const sanitizeInput = (text) => {
  if (!text) return '';
  
  // Remove control characters and limit length
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202F\u205F-\u206F\u3000\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 10000); // Increased limit for complex prompts
};

/**
 * Check rate limit for a specific user/IP
 * @param {string} identifier - User ID or IP address
 */
const checkRateLimit = (identifier) => {
  if (!identifier) {
    throw new Error('Rate limiter requires an identifier');
  }
  rateLimiter.checkLimit(identifier);
};

/**
 * Get model configuration
 */
const getModelConfig = (modelType = 'text', modelVariant = 'default') => {
  const modelKey = modelVariant.toUpperCase();
  const model = CONFIG.MODELS[modelType]?.[modelKey] || CONFIG.MODELS[modelType]?.DEFAULT;
  
  if (!model) {
    throw new Error(`Invalid model type or variant: ${modelType}/${modelVariant}`);
  }
  
  return {
    model,
    isGoogle: model.includes('gemini'),
    isOpenAI: !model.includes('gemini')
  };
};

/**
 * Generate text using the specified AI model
 */
const generateText = async (prompt, options = {}) => {
  const {
    modelVariant = 'default',
    systemMessage = 'You are a helpful assistant for an LMS platform.',
    maxTokens = CONFIG.DEFAULTS.MAX_TOKENS,
    temperature = CONFIG.DEFAULTS.TEMPERATURE,
    userId = 'anonymous',
    ...otherOptions
  } = options;
  
  try {
    if (!CONFIG.OPENAI_ENABLED && !CONFIG.GOOGLE_AI_ENABLED) {
      throw new Error('No AI service is configured');
    }
    
    checkRateLimit(userId);
    
    const { model, isGoogle } = getModelConfig('TEXT', modelVariant);
    const sanitizedPrompt = sanitizeInput(prompt);
    
    if (isGoogle) {
      if (!CONFIG.GOOGLE_AI_ENABLED) {
        throw new Error('Google AI is not configured');
      }
      
      const genAI = googleAI.getGenerativeModel({ model });
      const result = await genAI.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: `${systemMessage}\n\n${sanitizedPrompt}` }]
        }]
      });
      
      return {
        success: true,
        text: await result.response.text(),
        model,
        provider: 'google',
        usage: result.usageMetadata
      };
    } else {
      if (!CONFIG.OPENAI_ENABLED) {
        throw new Error('OpenAI is not configured');
      }
      
      const response = await openai.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: sanitizedPrompt }
        ],
        max_tokens: maxTokens,
        temperature,
        ...otherOptions
      });
      
      return {
        success: true,
        text: response.choices[0].message.content,
        model,
        provider: 'openai',
        usage: response.usage
      };
    }
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error(`AI service error: ${error.message}`);
  }
};

/**
 * Get assistant suggestion for message reply
 */
const getAssistantSuggestion = async (conversation, options = {}) => {
  const systemMessage = 'You are a helpful assistant for an LMS platform. Provide concise, professional, and educational responses.';
  const prompt = conversation
    .map(msg => `${msg.role}: ${msg.content}`)
    .join('\n');
  
  const result = await generateText(prompt, {
    ...options,
    systemMessage,
    maxTokens: 150,
    modelVariant: 'fast'
  });
  
  return {
    ...result,
    suggestion: result.text
  };
};

/**
 * Generate quiz questions based on content
 */
const generateQuiz = async (content, options = {}) => {
  const {
    numQuestions = 5,
    questionType = 'multiple_choice', // or 'true_false', 'short_answer'
    difficulty = 'medium',
    ...otherOptions
  } = options;
  
  const prompt = `Generate ${numQuestions} ${difficulty} difficulty ${questionType} questions based on the following content. 
  For each question, provide 4 options and the correct answer. Format the response as JSON.
  
  Content: ${content}`;
  
  const systemMessage = `You are an expert quiz generator for an educational platform. 
  Generate ${questionType} questions that test understanding of the provided content.
  Format your response as a JSON array of question objects with 'question', 'options', and 'answer' fields.`;
  
  const result = await generateText(prompt, {
    ...otherOptions,
    systemMessage,
    modelVariant: 'smart',
    response_format: { type: 'json_object' }
  });
  
  try {
    const questions = JSON.parse(result.text);
    return {
      ...result,
      questions: Array.isArray(questions) ? questions : [questions]
    };
  } catch (e) {
    throw new Error('Failed to parse quiz questions: ' + e.message);
  }
};

/**
 * Generate assignment feedback
 */
const generateFeedback = async (assignmentText, criteria = {}, options = {}) => {
  try {
    const prompt = `Please provide detailed feedback on the following assignment submission based on these criteria:
    ${JSON.stringify(criteria, null, 2)}
    
    Submission: ${assignmentText}`;
    
    const systemMessage = 'You are an experienced educator providing constructive feedback on student assignments.';
    
    const result = await generateText(prompt, {
      ...options,
      systemMessage,
      modelVariant: 'smart'
    });
    
    return {
      ...result,
      feedback: result.text
    };
  } catch (error) {
    console.error('Feedback generation error:', error);
    throw new Error(`Feedback generation failed: ${error.message}`);
  }
};

/**
 * Summarize content using AI
 */
const summarizeContent = async (content, options = {}) => {
  const {
    length = 'medium', // short, medium, long
    focus = 'key_points', // key_points, overview, detailed
    ...otherOptions
  } = options;
  
  const prompt = `Create a ${length} summary (${focus}) of the following content:\n\n${content}`;
  
  const systemMessage = 'You are a professional summarizer. Create clear, concise, and accurate summaries.';
  
  const result = await generateText(prompt, {
    ...otherOptions,
    systemMessage,
    modelVariant: 'smart'
  });
  
  return {
    ...result,
    summary: result.text
  };
};

/**
 * Generate an image based on a prompt
 */
const generateImage = async (prompt, options = {}) => {
  const {
    size = '1024x1024',
    quality = 'standard',
    modelVariant = 'default',
    userId = 'anonymous',
    ...otherOptions
  } = options;
  
  try {
    checkRateLimit(userId);
    
    const { model, isGoogle } = getModelConfig('IMAGE', modelVariant);
    const sanitizedPrompt = sanitizeInput(prompt);
    
    if (isGoogle) {
      // Google's image generation would go here
      throw new Error('Google image generation not implemented');
    } else {
      if (!CONFIG.OPENAI_ENABLED) {
        throw new Error('OpenAI is not configured');
      }
      
      const response = await openai.images.generate({
        model,
        prompt: sanitizedPrompt,
        n: 1,
        size,
        quality,
        ...otherOptions
      });
      
      return {
        success: true,
        images: response.data,
        model,
        provider: 'openai'
      };
    }
  } catch (error) {
    console.error('Image generation error:', error);
    throw new Error(`Image generation failed: ${error.message}`);
  }
};

module.exports = {
  // Core functions
  generateText,
  generateImage,
  
  // Helper functions
  getAssistantSuggestion,
  generateFeedback,
  generateQuiz,
  summarizeContent,
  
  // Configuration
  CONFIG,
  
  // Status
  isOpenAIEnabled: () => CONFIG.OPENAI_ENABLED,
  isGoogleAIEnabled: () => CONFIG.GOOGLE_AI_ENABLED,
  isAnyAIEnabled: () => CONFIG.OPENAI_ENABLED || CONFIG.GOOGLE_AI_ENABLED,
  
  // Models
  getAvailableModels: () => ({
    text: Object.entries(CONFIG.MODELS.TEXT).map(([key, value]) => ({
      id: value,
      name: key,
      provider: value.includes('gemini') ? 'google' : 'openai'
    })),
    image: Object.entries(CONFIG.MODELS.IMAGE).map(([key, value]) => ({
      id: value,
      name: key,
      provider: value.includes('gemini') ? 'google' : 'openai'
    }))
  })
};