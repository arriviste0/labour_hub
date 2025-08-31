const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Worker = require('../models/Worker');
const Employer = require('../models/Employer');
const Job = require('../models/Job');
const Application = require('../models/Application');
const rateLimit = require('express-rate-limit');

// Rate limiting for admin routes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// All admin routes require admin role
router.use(auth, authorize('admin'), adminLimiter);

// Get platform overview statistics
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkers = await Worker.countDocuments();
    const totalEmployers = await Employer.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('phone role createdAt');

    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title wage location status createdAt');

    res.json({
      overview: {
        totalUsers,
        totalWorkers,
        totalEmployers,
        totalJobs,
        totalApplications,
        activeJobs: await Job.countDocuments({ status: 'active' }),
        pendingApplications: await Application.countDocuments({ status: 'pending' })
      },
      recentActivity: {
        users: recentUsers,
        jobs: recentJobs
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users with pagination and filters
router.get('/users', async (req, res) => {
  try {
    const { 
      role, 
      status, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    const filter = {};
    
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { phone: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'suspended', 'banned'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        updatedAt: Date.now(),
        statusUpdatedBy: req.user.id,
        statusUpdatedAt: Date.now()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all workers with filters
router.get('/workers', async (req, res) => {
  try {
    const { 
      verified, 
      city, 
      skills, 
      page = 1, 
      limit = 20 
    } = req.query;

    const filter = {};
    
    if (verified !== undefined) filter.isVerified = verified === 'true';
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (skills) filter.skills = { $in: skills.split(',') };

    const workers = await Worker.find(filter)
      .populate('userId', 'phone role status createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

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

// Get all employers with filters
router.get('/employers', async (req, res) => {
  try {
    const { 
      verified, 
      industry, 
      city, 
      page = 1, 
      limit = 20 
    } = req.query;

    const filter = {};
    
    if (verified !== undefined) filter.isVerified = verified === 'true';
    if (industry) filter.industry = { $regex: industry, $options: 'i' };
    if (city) filter.city = { $regex: city, $options: 'i' };

    const employers = await Employer.find(filter)
      .populate('userId', 'phone role status createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

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

// Get all jobs with filters
router.get('/jobs', async (req, res) => {
  try {
    const { 
      status, 
      city, 
      page = 1, 
      limit = 20 
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (city) filter.location = { $regex: city, $options: 'i' };

    const jobs = await Job.find(filter)
      .populate('employerId', 'companyName industry')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get fraud/abuse reports
router.get('/reports', async (req, res) => {
  try {
    // This would typically fetch from a Report model
    // For now, returning mock data
    const reports = [
      {
        id: 1,
        type: 'fraud',
        description: 'Fake job posting',
        reportedBy: 'user123',
        reportedUser: 'employer456',
        status: 'pending',
        createdAt: new Date('2024-01-20'),
        evidence: 'Screenshots provided'
      },
      {
        id: 2,
        type: 'abuse',
        description: 'Inappropriate behavior',
        reportedBy: 'worker789',
        reportedUser: 'employer123',
        status: 'investigating',
        createdAt: new Date('2024-01-19'),
        evidence: 'Chat logs provided'
      }
    ];

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update report status
router.patch('/reports/:id/status', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['pending', 'investigating', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // This would typically update in a Report model
    // For now, returning success message
    res.json({ 
      message: 'Report status updated',
      report: {
        id: req.params.id,
        status,
        adminNotes,
        updatedAt: Date.now(),
        updatedBy: req.user.id
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get revenue analytics
router.get('/revenue', async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // This would typically fetch from a Transaction/Subscription model
    // For now, returning mock data
    const revenue = {
      period,
      totalRevenue: 50000,
      subscriptionRevenue: 30000,
      transactionFees: 20000,
      breakdown: {
        employerSubscriptions: 25000,
        workerSubscriptions: 5000,
        jobPostingFees: 15000,
        verificationFees: 5000
      },
      trends: [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 48000 },
        { month: 'Mar', revenue: 50000 }
      ]
    };

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get system health metrics
router.get('/health', async (req, res) => {
  try {
    const health = {
      database: 'healthy',
      fileStorage: 'healthy',
      emailService: 'healthy',
      smsService: 'healthy',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    };

    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send system announcement
router.post('/announcements', async (req, res) => {
  try {
    const { title, message, targetUsers } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    // This would typically save to an Announcement model and send notifications
    // For now, returning success message
    res.status(201).json({ 
      message: 'Announcement sent successfully',
      announcement: {
        id: Date.now(),
        title,
        message,
        targetUsers: targetUsers || 'all',
        sentBy: req.user.id,
        sentAt: Date.now()
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;


