const axios = require('axios');

/**
 * Check plagiarism between two text inputs
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {Promise<Object>} - Object with similarityScore
 */
const checkPlagiarism = async (text1, text2) => {
  try {
    // TODO: Integrate with a real plagiarism API using process.env.PLAGIARISM_API_KEY
    // Example: const response = await axios.post('PLAGIARISM_API_URL', { text1, text2 }, { headers: { 'x-api-key': process.env.PLAGIARISM_API_KEY } });

    const similarity = compareText(text1, text2);
    return { similarityScore: similarity };
  } catch (error) {
    console.error('Plagiarism check failed:', error.message);
    throw new Error('Failed to check plagiarism');
  }
};

/**
 * Dummy similarity function (placeholder for real API)
 * Compares two texts by common words
 * @param {string} a 
 * @param {string} b 
 * @returns {number} - Similarity score in percentage
 */
function compareText(a, b) {
  const wordsA = a.split(' ');
  const wordsB = b.split(' ');
  const common = wordsA.filter(word => wordsB.includes(word)).length;
  const total = Math.max(wordsA.length, wordsB.length);
  return ((common / total) * 100).toFixed(2);
}

module.exports = { checkPlagiarism };
