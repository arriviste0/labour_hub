const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Worker = require('../models/Worker');
const rateLimit = require('express-rate-limit');

// Rate limiting for application routes
const applicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});

// Get all applications (authenticated - employers can see their job applications, workers can see their own)
router.get('/', auth, applicationLimiter, async (req, res) => {
  try {
    const { 
      jobId, 
      status, 
      page = 1, 
      limit = 10 
    } = req.query;

    let filter = {};
    
    if (jobId) filter.jobId = jobId;
    if (status) filter.status = status;

    // Workers can only see their own applications
    if (req.user.role === 'worker') {
      filter.workerId = req.user.id;
    }
    // Employers can only see applications for their jobs
    else if (req.user.role === 'employer') {
      const jobs = await Job.find({ employerId: req.user.id }).select('_id');
      filter.jobId = { $in: jobs.map(job => job._id) };
    }

    const applications = await Application.find(filter)
      .populate('jobId', 'title wage location')
      .populate('workerId', 'name skills experience')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Application.countDocuments(filter);

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get application by ID (authenticated)
router.get('/:id', auth, applicationLimiter, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId', 'title description wage location employerId')
      .populate('workerId', 'name skills experience rating');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check authorization
    if (req.user.role === 'worker' && application.workerId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this application' });
    }
    
    if (req.user.role === 'employer') {
      const job = await Job.findById(application.jobId._id);
      if (!job || job.employerId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to view this application' });
      }
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new application (authenticated workers only)
router.post('/', auth, authorize('worker'), applicationLimiter, async (req, res) => {
  try {
    const { jobId, coverLetter, expectedWage } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    if (job.status !== 'active') {
      return res.status(400).json({ error: 'Job is not active' });
    }

    // Check if worker already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      workerId: req.user.id
    });
    if (existingApplication) {
      return res.status(400).json({ error: 'Already applied for this job' });
    }

    // Check if worker has a profile
    const worker = await Worker.findOne({ userId: req.user.id });
    if (!worker) {
      return res.status(400).json({ error: 'Please complete your profile before applying' });
    }

    const application = new Application({
      jobId,
      workerId: req.user.id,
      coverLetter,
      expectedWage: expectedWage || job.wage,
      status: 'pending'
    });

    await application.save();

    // Populate the response
    const populatedApplication = await Application.findById(application._id)
      .populate('jobId', 'title wage location')
      .populate('workerId', 'name skills experience');

    res.status(201).json(populatedApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update application status (authenticated employers only)
router.patch('/:id/status', auth, authorize('employer'), async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if employer owns the job
    const job = await Job.findById(application.jobId);
    if (!job || job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    // Validate status transition
    const validStatuses = ['pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    application.status = status;
    application.updatedAt = Date.now();

    if (status === 'accepted') {
      application.acceptedAt = Date.now();
    }

    await application.save();

    const updatedApplication = await Application.findById(id)
      .populate('jobId', 'title wage location')
      .populate('workerId', 'name skills experience');

    res.json(updatedApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Withdraw application (authenticated workers only)
router.patch('/:id/withdraw', auth, authorize('worker'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.workerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to withdraw this application' });
    }

    if (application.status !== 'pending' && application.status !== 'shortlisted') {
      return res.status(400).json({ error: 'Cannot withdraw application in current status' });
    }

    application.status = 'withdrawn';
    application.updatedAt = Date.now();
    await application.save();

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete application (authenticated workers only, only if pending)
router.delete('/:id', auth, authorize('worker'), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.workerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this application' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'Cannot delete application in current status' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get application statistics (authenticated employers only)
router.get('/stats/overview', auth, authorize('employer'), async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id }).select('_id');
    const jobIds = jobs.map(job => job._id);

    const stats = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
    const pendingApplications = await Application.countDocuments({ 
      jobId: { $in: jobIds }, 
      status: 'pending' 
    });

    res.json({
      totalApplications,
      pendingApplications,
      statusBreakdown: stats,
      recentApplications: await Application.find({ jobId: { $in: jobIds } })
        .populate('jobId', 'title')
        .populate('workerId', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


