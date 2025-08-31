const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Employer = require('../models/Employer');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Rate limiting for employer routes
const employerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Get all employers (public)
router.get('/', employerLimiter, async (req, res) => {
  try {
    const { 
      industry, 
      city, 
      verified, 
      page = 1, 
      limit = 10 
    } = req.query;

    const filter = {};
    
    if (industry) filter.industry = { $regex: industry, $options: 'i' };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (verified) filter.isVerified = verified === 'true';

    const employers = await Employer.find(filter)
      .populate('userId', 'phone role createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, companySize: -1 });

    const total = await Employer.countDocuments(filter);

    res.json({
      employers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employer by ID (public)
router.get('/:id', employerLimiter, async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id)
      .populate('userId', 'phone role createdAt');

    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    res.json(employer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/Update employer profile (authenticated)
router.post('/', auth, authorize('employer'), async (req, res) => {
  try {
    const { 
      companyName, 
      industry, 
      companySize, 
      city, 
      state, 
      address,
      description,
      website,
      documents
    } = req.body;

    let employer = await Employer.findOne({ userId: req.user.id });

    if (employer) {
      // Update existing profile
      employer = await Employer.findByIdAndUpdate(
        employer._id,
        {
          companyName,
          industry,
          companySize,
          city,
          state,
          address,
          description,
          website,
          documents,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      employer = new Employer({
        userId: req.user.id,
        companyName,
        industry,
        companySize,
        city,
        state,
        address,
        description,
        website,
        documents
      });
      await employer.save();
    }

    res.status(201).json(employer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update employer profile (authenticated)
router.put('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    if (employer.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const updatedEmployer = await Employer.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json(updatedEmployer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete employer profile (authenticated)
router.delete('/:id', auth, authorize('employer'), async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    if (employer.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this profile' });
    }

    await Employer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employer profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employer's job postings (authenticated)
router.get('/:id/jobs', auth, async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    // This would typically fetch from a Job model
    // For now, returning mock data
    const jobPostings = [
      {
        id: 1,
        title: 'Construction Worker',
        description: 'Need skilled construction workers',
        wage: '₹500/day',
        location: 'Mumbai',
        postedDate: new Date(),
        status: 'active'
      }
    ];

    res.json(jobPostings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employer's workforce stats (authenticated)
router.get('/:id/workforce', auth, authorize('employer'), async (req, res) => {
  try {
    const employer = await Employer.findById(req.params.id);
    
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    if (employer.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this data' });
    }

    // This would typically fetch from various models
    // For now, returning mock data
    const workforceStats = {
      totalWorkers: 25,
      activeWorkers: 20,
      newHires: 5,
      averageRating: 4.2,
      complianceRate: 95
    };

    res.json(workforceStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


