const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Configure Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const CLOUDINARY_ENABLED = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const LOCAL_UPLOAD_DIR = path.join(__dirname, '../../uploads');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

// Ensure local upload directory exists
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

// Validate MIME types
const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  video: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
             'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  file: ['*'] // Allow all for generic files
};

// File size limits (in bytes)
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks for large files

/**
 * Validate file based on type and size
 */
const validateFile = (file, type = 'file') => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  // Get allowed MIME types for the specified category
  const allowedTypes = ALLOWED_MIME_TYPES[type] || ALLOWED_MIME_TYPES.file;
  
  // If specific types are defined (not '*'), validate MIME type
  if (!allowedTypes.includes('*')) {
    // Check if file has a valid MIME type
    if (!file.mimetype) {
      throw new Error('File type could not be determined');
    }
    
    // Check if MIME type is allowed
    const isAllowed = allowedTypes.some(pattern => {
      // Support wildcard patterns like 'image/*'
      if (pattern.endsWith('/*')) {
        const baseType = pattern.split('/')[0];
        return file.mimetype.startsWith(`${baseType}/`);
      }
      return file.mimetype === pattern;
    });
    
    if (!isAllowed) {
      throw new Error(`Invalid file type (${file.mimetype}). Allowed: ${allowedTypes.join(', ')}`);
    }
  }
  
  return true;
};

/**
 * Upload a file, handling large files with chunked upload if needed
 */
const uploadFile = async (file, options = {}) => {
  const { folder = 'lms-uploads', resourceType = 'auto', onProgress } = options;
  
  try {
    validateFile(file, resourceType);
    
    // For files larger than 20MB, use chunked upload if Cloudinary is enabled
    const useChunkedUpload = CLOUDINARY_ENABLED && file.size > 20 * 1024 * 1024;
    
    if (CLOUDINARY_ENABLED) {
      const uploadOptions = {
        folder,
        resource_type: resourceType === 'auto' ? 'auto' : resourceType,
        chunk_size: useChunkedUpload ? CHUNK_SIZE : undefined,
        on_progress: (progressEvent) => {
          if (onProgress) {
            const percent = Math.round((progressEvent.bytes / file.size) * 100);
            onProgress(percent);
          }
        }
      };
      
      // Upload to Cloudinary (handles chunked upload automatically if chunk_size is set)
      const result = await cloudinary.uploader.upload(file.path || file.tempFilePath, uploadOptions);
      
      // Clean up temp file
      if (file.path && fs.existsSync(file.path)) {
        await unlinkAsync(file.path).catch(console.error);
      }
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format,
        size: result.bytes,
        filename: file.originalname || file.name,
        mimeType: file.mimetype,
        width: result.width,
        height: result.height,
        duration: result.duration
      };
    } else {
      // Local storage fallback
      const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${(file.originalname || file.name).replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
      const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
      
      // Ensure directory exists
      if (!fs.existsSync(path.dirname(filepath))) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
      }
      
      // Handle different file input types
      if (file.path) {
        // For multer file objects
        await fs.promises.rename(file.path, filepath);
      } else if (file.data) {
        // For direct buffer uploads
        await fs.promises.writeFile(filepath, file.data);
      } else if (file.buffer) {
        // For buffer uploads
        await fs.promises.writeFile(filepath, file.buffer);
      } else if (file.stream) {
        // For stream uploads
        const writeStream = fs.createWriteStream(filepath);
        await new Promise((resolve, reject) => {
          file.stream.pipe(writeStream)
            .on('finish', resolve)
            .on('error', reject);
        });
      } else {
        throw new Error('Unsupported file upload format');
      }
      
      // Get file stats for size
      const stats = await fs.promises.stat(filepath);
      
      return {
        url: `${BASE_URL}/uploads/${filename}`,
        publicId: filename,
        format: file.mimetype ? file.mimetype.split('/').pop() : 'bin',
        mimeType: file.mimetype || 'application/octet-stream',
        size: stats.size,
        filename: file.originalname || file.name || 'file',
        localPath: filepath
      };
    }
  } catch (error) {
    // Clean up any partially uploaded files
    if (file && file.path && fs.existsSync(file.path)) {
      await unlinkAsync(file.path).catch(console.error);
    }
    
    // Enhance error message with more context
    const enhancedError = new Error(`File upload failed: ${error.message}`);
    enhancedError.originalError = error;
    enhancedError.code = error.code || 'UPLOAD_ERROR';
    
    throw enhancedError;
  }
};

/**
 * Upload from stream
 */
const uploadStream = (stream, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!CLOUDINARY_ENABLED) {
      reject(new Error('Stream upload requires Cloudinary configuration'));
      return;
    }
    
    const { folder = 'lms-uploads', resourceType = 'auto' } = options;
    
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          size: result.bytes
        });
      }
    );
    
    stream.pipe(uploadStream);
  });
};

/**
 * Delete file
 */
const deleteFile = async (publicIdOrPath) => {
  try {
    if (CLOUDINARY_ENABLED && !publicIdOrPath.startsWith(BASE_URL)) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicIdOrPath);
      return { success: true, message: 'File deleted from Cloudinary' };
    } else {
      // Delete from local storage
      const filename = path.basename(publicIdOrPath);
      const filepath = path.join(LOCAL_UPLOAD_DIR, filename);
      
      if (fs.existsSync(filepath)) {
        await unlinkAsync(filepath);
        return { success: true, message: 'File deleted locally' };
      }
      
      return { success: false, message: 'File not found' };
    }
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
};

/**
 * Upload multiple files
 */
const uploadMultipleFiles = async (files, options = {}) => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, options));
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Multiple file upload failed: ${error.message}`);
  }
};

module.exports = {
  uploadFile,
  uploadStream,
  deleteFile,
  uploadMultipleFiles,
  validateFile,
  CLOUDINARY_ENABLED
};