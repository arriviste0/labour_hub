const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Job = require('../models/Job');
const Employer = require('../models/Employer');
const { auth, requireEmployer, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all active jobs (public)
router.get('/', 
  optionalAuth,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('city').optional().trim().isLength({ min: 1 }).withMessage('City must not be empty'),
    query('state').optional().trim().isLength({ min: 1 }).withMessage('State must not be empty'),
    query('category').optional().isIn(['construction', 'manufacturing', 'logistics', 'agriculture', 'retail', 'hospitality', 'other']).withMessage('Invalid category'),
    query('skills').optional().isArray().withMessage('Skills must be an array'),
    query('minWage').optional().isInt({ min: 200, max: 10000 }).withMessage('Min wage must be between 200 and 10000'),
    query('maxWage').optional().isInt({ min: 200, max: 10000 }).withMessage('Max wage must be between 200 and 10000'),
    query('workerType').optional().isIn(['skilled', 'semi-skilled', 'unskilled', 'supervisor', 'foreman']).withMessage('Invalid worker type'),
    query('sortBy').optional().isIn(['createdAt', 'wagePerDay', 'startDate', 'priority']).withMessage('Invalid sort field'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('Order must be asc or desc')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        page = 1,
        limit = 20,
        city,
        state,
        category,
        skills,
        minWage,
        maxWage,
        workerType,
        sortBy = 'createdAt',
        order = 'desc',
        search
      } = req.query;

      // Build query
      const query = {
        status: 'active',
        'visibility.isPublic': true,
        expiresAt: { $gt: new Date() }
      };

      // Location filter
      if (city || state) {
        query.$or = [];
        if (city) {
          query.$or.push({ 'location.address.city': { $regex: city, $options: 'i' } });
        }
        if (state) {
          query.$or.push({ 'location.address.state': { $regex: state, $options: 'i' } });
        }
      }

      // Category filter
      if (category) {
        query.category = category;
      }

      // Skills filter
      if (skills && skills.length > 0) {
        query.skills = { $in: skills };
      }

      // Wage filter
      if (minWage || maxWage) {
        query['compensation.wagePerDay'] = {};
        if (minWage) query['compensation.wagePerDay'].$gte = parseInt(minWage);
        if (maxWage) query['compensation.wagePerDay'].$lte = parseInt(maxWage);
      }

      // Worker type filter
      if (workerType) {
        query.workerType = workerType;
      }

      // Text search
      if (search) {
        query.$text = { $search: search };
      }

      // Build sort object
      const sort = {};
      if (sortBy === 'priority') {
        sort['visibility.priority'] = order === 'asc' ? 1 : -1;
        sort.createdAt = -1;
      } else {
        sort[sortBy] = order === 'asc' ? 1 : -1;
      }

      // Execute query
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [jobs, total] = await Promise.all([
        Job.find(query)
          .populate('employerId', 'companyInfo.name companyInfo.type companyInfo.industry contactInfo.address.city')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Job.countDocuments(query)
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(total / parseInt(limit));
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      // Increment view count for logged-in users
      if (req.user) {
        jobs.forEach(job => {
          Job.findByIdAndUpdate(job._id, { $inc: { 'metrics.views': 1 } }).exec();
        });
      }

      res.json({
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs: total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      });

    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }
);

// Get job by ID (public)
router.get('/:id', 
  optionalAuth,
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)
        .populate('employerId', 'companyInfo.name companyInfo.type companyInfo.industry contactInfo.address.city contactInfo.primaryContact.name')
        .lean();

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.status !== 'active' || !job.visibility.isPublic) {
        return res.status(404).json({ error: 'Job not found' });
      }

      if (job.expiresAt < new Date()) {
        return res.status(404).json({ error: 'Job has expired' });
      }

      // Increment view count for logged-in users
      if (req.user) {
        Job.findByIdAndUpdate(job._id, { $inc: { 'metrics.views': 1 } }).exec();
      }

      res.json({ job });

    } catch (error) {
      console.error('Get job error:', error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Invalid job ID' });
      }
      res.status(500).json({ error: 'Failed to fetch job' });
    }
  }
);

// Create new job (employers only)
router.post('/',
  auth,
  requireEmployer,
  [
    body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('description').trim().isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20 and 1000 characters'),
    body('category').isIn(['construction', 'manufacturing', 'logistics', 'agriculture', 'retail', 'hospitality', 'other']).withMessage('Invalid category'),
    body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
    body('skills.*').trim().isLength({ min: 1 }).withMessage('Skill names cannot be empty'),
    body('workerType').isIn(['skilled', 'semi-skilled', 'unskilled', 'supervisor', 'foreman']).withMessage('Invalid worker type'),
    body('requirements.minExperience').optional().isInt({ min: 0, max: 50 }).withMessage('Min experience must be between 0 and 50'),
    body('requirements.education').optional().isIn(['any', 'illiterate', 'primary', 'secondary', 'higher_secondary', 'diploma', 'degree']).withMessage('Invalid education level'),
    body('location.address.city').trim().isLength({ min: 1 }).withMessage('City is required'),
    body('location.address.state').trim().isLength({ min: 1 }).withMessage('State is required'),
    body('location.workSite').trim().isLength({ min: 1 }).withMessage('Work site is required'),
    body('compensation.wagePerDay').isInt({ min: 200, max: 10000 }).withMessage('Wage per day must be between 200 and 10000'),
    body('workDetails.headcount').isInt({ min: 1, max: 1000 }).withMessage('Headcount must be between 1 and 1000'),
    body('workDetails.shiftTiming.start').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format (HH:MM)'),
    body('workDetails.shiftTiming.end').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format (HH:MM)'),
    body('workDetails.startDate').isISO8601().withMessage('Start date must be a valid date'),
    body('workDetails.endDate').optional().isISO8601().withMessage('End date must be a valid date')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if employer profile is complete
      const employer = await Employer.findOne({ userId: req.user.userId });
      if (!employer || employer.profileCompletion < 80) {
        return res.status(400).json({ 
          error: 'Please complete your employer profile before posting jobs' 
        });
      }

      // Validate shift timing
      const { start, end } = req.body.workDetails.shiftTiming;
      const startTime = new Date(`2000-01-01T${start}`);
      const endTime = new Date(`2000-01-01T${end}`);
      
      if (startTime >= endTime) {
        return res.status(400).json({ error: 'End time must be after start time' });
      }

      // Calculate shift duration
      const duration = Math.ceil((endTime - startTime) / (1000 * 60 * 60));

      // Create job
      const jobData = {
        ...req.body,
        employerId: req.user.userId,
        'workDetails.shiftTiming.duration': duration
      };

      const job = new Job(jobData);
      await job.save();

      // Populate employer info for response
      await job.populate('employerId', 'companyInfo.name companyInfo.type');

      res.status(201).json({
        message: 'Job posted successfully',
        job
      });

    } catch (error) {
      console.error('Create job error:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: error.message });
      }
      res.status(500).json({ error: 'Failed to create job' });
    }
  }
);

// Update job (employer only)
router.patch('/:id',
  auth,
  requireEmployer,
  [
    body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('description').optional().trim().isLength({ min: 20, max: 1000 }).withMessage('Description must be between 20 and 1000 characters'),
    body('status').optional().isIn(['active', 'paused', 'closed']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const job = await Job.findById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check ownership
      if (job.employerId.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized to update this job' });
      }

      // Update job
      Object.assign(job, req.body);
      job.updatedAt = new Date();
      
      await job.save();

      res.json({
        message: 'Job updated successfully',
        job
      });

    } catch (error) {
      console.error('Update job error:', error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Invalid job ID' });
      }
      res.status(500).json({ error: 'Failed to update job' });
    }
  }
);

// Delete job (employer only)
router.delete('/:id',
  auth,
  requireEmployer,
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      // Check ownership
      if (job.employerId.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Not authorized to delete this job' });
      }

      // Soft delete by changing status
      job.status = 'closed';
      await job.save();

      res.json({ message: 'Job deleted successfully' });

    } catch (error) {
      console.error('Delete job error:', error);
      if (error.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Invalid job ID' });
      }
      res.status(500).json({ error: 'Failed to delete job' });
    }
  }
);

// Get employer's jobs
router.get('/employer/my-jobs',
  auth,
  requireEmployer,
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['active', 'paused', 'closed', 'expired']).withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { page = 1, limit = 20, status } = req.query;

      const query = { employerId: req.user.userId };
      if (status) {
        query.status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const [jobs, total] = await Promise.all([
        Job.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Job.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / parseInt(limit));

      res.json({
        jobs,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalJobs: total,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit: parseInt(limit)
        }
      });

    } catch (error) {
      console.error('Get employer jobs error:', error);
      res.status(500).json({ error: 'Failed to fetch jobs' });
    }
  }
);

// Get urgent jobs
router.get('/urgent/all',
  optionalAuth,
  async (req, res) => {
    try {
      const urgentJobs = await Job.find({
        $or: [
          { 'workDetails.isUrgent': true },
          { 'visibility.priority': 'urgent' }
        ],
        status: 'active',
        'visibility.isPublic': true,
        expiresAt: { $gt: new Date() }
      })
      .populate('employerId', 'companyInfo.name companyInfo.type contactInfo.address.city')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

      res.json({ urgentJobs });

    } catch (error) {
      console.error('Get urgent jobs error:', error);
      res.status(500).json({ error: 'Failed to fetch urgent jobs' });
    }
  }
);

// Get job statistics
router.get('/stats/overview',
  auth,
  requireEmployer,
  async (req, res) => {
    try {
      const stats = await Job.aggregate([
        { $match: { employerId: req.user.userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalViews: { $sum: '$metrics.views' },
            totalApplications: { $sum: '$metrics.applications' }
          }
        }
      ]);

      const totalJobs = await Job.countDocuments({ employerId: req.user.userId });
      const activeJobs = await Job.countDocuments({ 
        employerId: req.user.userId, 
        status: 'active',
        expiresAt: { $gt: new Date() }
      });

      res.json({
        totalJobs,
        activeJobs,
        statusBreakdown: stats,
        recentJobs: await Job.find({ employerId: req.user.userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .select('title status createdAt metrics.views metrics.applications')
          .lean()
      });

    } catch (error) {
      console.error('Get job stats error:', error);
      res.status(500).json({ error: 'Failed to fetch job statistics' });
    }
  }
);

module.exports = router;
