const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

// Configure multer for general file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/general';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow common file types
  const allowedTypes = [
    'image/jpeg', 
    'image/png', 
    'image/jpg', 
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, Word documents, and text files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Rate limiting for upload routes
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30 // limit each IP to 30 requests per windowMs
});

// Single file upload
router.post('/single', auth, uploadLimiter, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { description, category } = req.body;
    
    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      description: description || '',
      category: category || 'general',
      uploadedBy: req.user.id,
      uploadedAt: Date.now()
    };

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: Date.now(), // temporary ID
        ...fileInfo
      }
    });
  } catch (error) {
    // Clean up uploaded file if there's an error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
});

// Multiple files upload
router.post('/multiple', auth, uploadLimiter, upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const { description, category } = req.body;
    
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      description: description || '',
      category: category || 'general',
      uploadedBy: req.user.id,
      uploadedAt: Date.now()
    }));

    res.status(201).json({
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles.map((file, index) => ({
        id: Date.now() + index, // temporary ID
        ...file
      }))
    });
  } catch (error) {
    // Clean up uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    res.status(400).json({ error: error.message });
  }
});

// Profile picture upload
router.post('/profile-picture', auth, uploadLimiter, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Only image files are allowed for profile pictures' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      category: 'profile-picture',
      uploadedBy: req.user.id,
      uploadedAt: Date.now()
    };

    res.status(201).json({
      message: 'Profile picture uploaded successfully',
      file: {
        id: Date.now(),
        ...fileInfo
      }
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
});

// Company logo upload
router.post('/company-logo', auth, uploadLimiter, upload.single('companyLogo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Check if it's an image
    if (!req.file.mimetype.startsWith('image/')) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Only image files are allowed for company logos' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      category: 'company-logo',
      uploadedBy: req.user.id,
      uploadedAt: Date.now()
    };

    res.status(201).json({
      message: 'Company logo uploaded successfully',
      file: {
        id: Date.now(),
        ...fileInfo
      }
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ error: error.message });
  }
});

// Get user's uploaded files
router.get('/my-files', auth, uploadLimiter, async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    // This would typically fetch from a File model
    // For now, returning mock data
    const files = [
      {
        id: 1,
        filename: 'profile-pic.jpg',
        originalName: 'Profile Picture',
        category: 'profile-picture',
        size: 1024000,
        uploadedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        filename: 'resume.pdf',
        originalName: 'Resume',
        category: 'general',
        size: 2048000,
        uploadedAt: new Date('2024-01-20')
      }
    ];

    res.json({
      files,
      totalPages: 1,
      currentPage: page,
      total: files.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete uploaded file
router.delete('/:id', auth, uploadLimiter, async (req, res) => {
  try {
    // This would typically delete from a File model and remove file
    // For now, returning success message
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download file
router.get('/:id/download', auth, uploadLimiter, async (req, res) => {
  try {
    // This would typically fetch file path from a File model
    // For now, returning error
    res.status(404).json({ error: 'File not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum is 5 files.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  
  next();
});

module.exports = router;


