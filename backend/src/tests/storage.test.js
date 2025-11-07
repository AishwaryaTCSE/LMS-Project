const storageService = require('../services/storage.service');
const fs = require('fs');
const path = require('path');

describe('Storage Service', () => {
  const testFilePath = path.join(__dirname, 'test-file.txt');

  beforeAll(() => {
    // Create test file
    fs.writeFileSync(testFilePath, 'Test content');
  });

  afterAll(() => {
    // Cleanup
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  describe('validateFile', () => {
    it('should validate file size', () => {
      const validFile = {
        size: 1024 * 1024, // 1MB
        mimetype: 'image/jpeg'
      };

      expect(() => storageService.validateFile(validFile, 'image')).not.toThrow();
    });

    it('should throw error for oversized file', () => {
      const oversizedFile = {
        size: 100 * 1024 * 1024, // 100MB
        mimetype: 'image/jpeg'
      };

      expect(() => storageService.validateFile(oversizedFile, 'image')).toThrow();
    });
  });

  describe('uploadFile', () => {
    it('should upload file locally when Cloudinary not configured', async () => {
      const mockFile = {
        originalname: 'test.txt',
        name: 'test.txt',
        path: testFilePath,
        size: 100,
        mimetype: 'text/plain'
      };

      const result = await storageService.uploadFile(mockFile);
      
      expect(result).toHaveProperty('url');
      expect(result).toHaveProperty('publicId');
      expect(result).toHaveProperty('filename');
    });
  });
});
