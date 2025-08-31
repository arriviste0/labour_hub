const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Worker = require('../models/Worker');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

// Rate limiting for worker routes
const workerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Get all workers (public)
router.get('/', workerLimiter, async (req, res) => {
  try {
    const { 
      skill, 
      city, 
      experience, 
      availability, 
      page = 1, 
      limit = 10,
      verified 
    } = req.query;

    const filter = {};
    
    if (skill) filter.skills = { $in: [skill] };
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (experience) filter.experience = { $gte: parseInt(experience) };
    if (availability) filter.availability = availability;
    if (verified) filter.isVerified = verified === 'true';

    const workers = await Worker.find(filter)
      .populate('userId', 'phone role')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ rating: -1, experience: -1 });

    const total = await Worker.countDocuments(filter);

    res.json({
      workers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get worker by ID (public)
router.get('/:id', workerLimiter, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('userId', 'phone role createdAt');

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create/Update worker profile (authenticated)
router.post('/', auth, authorize('worker'), async (req, res) => {
  try {
    const { 
      name, 
      age, 
      gender, 
      skills, 
      experience, 
      city, 
      state, 
      availability,
      expectedWage,
      bio,
      documents
    } = req.body;

    let worker = await Worker.findOne({ userId: req.user.id });

    if (worker) {
      // Update existing profile
      worker = await Worker.findByIdAndUpdate(
        worker._id,
        {
          name,
          age,
          gender,
          skills,
          experience,
          city,
          state,
          availability,
          expectedWage,
          bio,
          documents,
          updatedAt: Date.now()
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      worker = new Worker({
        userId: req.user.id,
        name,
        age,
        gender,
        skills,
        experience,
        city,
        state,
        availability,
        expectedWage,
        bio,
        documents
      });
      await worker.save();
    }

    res.status(201).json(worker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update worker profile (authenticated)
router.put('/:id', auth, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    if (worker.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    const updatedWorker = await Worker.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json(updatedWorker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete worker profile (authenticated)
router.delete('/:id', auth, authorize('worker'), async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    if (worker.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this profile' });
    }

    await Worker.findByIdAndDelete(req.params.id);
    res.json({ message: 'Worker profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get worker's job history (authenticated)
router.get('/:id/jobs', auth, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // This would typically fetch from a Job/Application model
    // For now, returning mock data
    const jobHistory = [
      {
        id: 1,
        title: 'Construction Worker',
        company: 'ABC Construction',
        duration: '3 months',
        rating: 4.5,
        completed: true
      }
    ];

    res.json(jobHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update worker availability (authenticated)
router.patch('/:id/availability', auth, authorize('worker'), async (req, res) => {
  try {
    const { availability } = req.body;
    const worker = await Worker.findById(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    if (worker.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this profile' });
    }

    worker.availability = availability;
    worker.updatedAt = Date.now();
    await worker.save();

    res.json(worker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;


