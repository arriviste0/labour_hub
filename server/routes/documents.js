const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/documents';
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
  // Allow only specific file types
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, JPG and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Rate limiting for document routes
const documentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20 // limit each IP to 20 requests per windowMs
});

// Upload document (authenticated)
router.post('/upload', auth, documentLimiter, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { documentType, description } = req.body;
    
    if (!documentType) {
      return res.status(400).json({ error: 'Document type is required' });
    }

    const document = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      documentType,
      description: description || '',
      uploadedBy: req.user.id,
      uploadedAt: Date.now(),
      status: 'pending' // pending verification
    };

    // Store document info in database (you might want to create a Document model)
    // For now, we'll return the document info
    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: Date.now(), // temporary ID
        ...document
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

// Get user's documents (authenticated)
router.get('/my-documents', auth, documentLimiter, async (req, res) => {
  try {
    // This would typically fetch from a Document model
    // For now, returning mock data
    const documents = [
      {
        id: 1,
        filename: 'aadhaar-card.pdf',
        originalName: 'Aadhaar Card',
        documentType: 'identity',
        status: 'verified',
        uploadedAt: new Date('2024-01-15'),
        verifiedAt: new Date('2024-01-16')
      },
      {
        id: 2,
        filename: 'skill-certificate.pdf',
        originalName: 'Skill Certificate',
        documentType: 'certification',
        status: 'pending',
        uploadedAt: new Date('2024-01-20')
      }
    ];

    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get document by ID (authenticated)
router.get('/:id', auth, documentLimiter, async (req, res) => {
  try {
    // This would typically fetch from a Document model
    // For now, returning mock data
    const document = {
      id: req.params.id,
      filename: 'aadhaar-card.pdf',
      originalName: 'Aadhaar Card',
      documentType: 'identity',
      status: 'verified',
      uploadedAt: new Date('2024-01-15'),
      verifiedAt: new Date('2024-01-16'),
      description: 'Government issued identity document'
    };

    res.json(document);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update document (authenticated - owner only)
router.put('/:id', auth, documentLimiter, async (req, res) => {
  try {
    const { description } = req.body;
    
    // This would typically update in a Document model
    // For now, returning success message
    res.json({ 
      message: 'Document updated successfully',
      document: {
        id: req.params.id,
        description
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete document (authenticated - owner only)
router.delete('/:id', auth, documentLimiter, async (req, res) => {
  try {
    // This would typically delete from a Document model and remove file
    // For now, returning success message
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify document (admin only)
router.patch('/:id/verify', auth, authorize('admin'), async (req, res) => {
  try {
    const { status, verificationNotes } = req.body;
    
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be verified or rejected.' });
    }

    // This would typically update in a Document model
    // For now, returning success message
    res.json({ 
      message: `Document ${status}`,
      document: {
        id: req.params.id,
        status,
        verificationNotes,
        verifiedAt: status === 'verified' ? Date.now() : null,
        verifiedBy: req.user.id
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get document statistics (admin only)
router.get('/stats/overview', auth, authorize('admin'), async (req, res) => {
  try {
    // This would typically fetch from a Document model
    // For now, returning mock data
    const stats = {
      totalDocuments: 150,
      pendingVerification: 25,
      verified: 120,
      rejected: 5,
      documentTypes: {
        identity: 50,
        certification: 45,
        address: 30,
        other: 25
      },
      recentUploads: [
        {
          id: 1,
          filename: 'new-document.pdf',
          documentType: 'identity',
          uploadedBy: 'user123',
          uploadedAt: new Date()
        }
      ]
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Download document (authenticated - owner or admin)
router.get('/:id/download', auth, documentLimiter, async (req, res) => {
  try {
    // This would typically fetch file path from a Document model
    // For now, returning error
    res.status(404).json({ error: 'Document not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  
  next();
});

module.exports = router;


