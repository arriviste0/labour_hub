const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'viewed', 'shortlisted', 'interviewed', 'hired', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  applicationDetails: {
    coverLetter: {
      type: String,
      maxlength: 500
    },
    expectedWage: {
      type: Number,
      min: 200,
      max: 10000
    },
    availability: {
      type: String,
      enum: ['immediate', 'next_week', 'next_month', 'flexible'],
      default: 'immediate'
    },
    startDate: Date,
    additionalNotes: String
  },
  employerResponse: {
    shortlistDate: Date,
    shortlistNotes: String,
    interviewDate: Date,
    interviewLocation: String,
    interviewNotes: String,
    hireDate: Date,
    hireNotes: String,
    rejectionReason: String,
    rejectionNotes: String
  },
  communication: {
    lastContactDate: Date,
    lastContactBy: {
      type: String,
      enum: ['worker', 'employer', 'system'],
      default: 'system'
    },
    contactMethod: {
      type: String,
      enum: ['app', 'phone', 'email', 'sms'],
      default: 'app'
    },
    notes: [{
      message: String,
      sender: {
        type: String,
        enum: ['worker', 'employer', 'system']
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  metrics: {
    responseTime: Number, // in hours
    shortlistTime: Number, // in hours
    hireTime: Number, // in hours
    viewCount: {
      type: Number,
      default: 0
    }
  },
  flags: {
    isUrgent: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    requiresAttention: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Indexes
applicationSchema.index({ jobId: 1, workerId: 1 }, { unique: true });
applicationSchema.index({ workerId: 1, status: 1 });
applicationSchema.index({ employerId: 1, status: 1 });
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ 'flags.isUrgent': 1, createdAt: -1 });
applicationSchema.index({ expiresAt: 1 });

// Virtual for application age
applicationSchema.virtual('age').get(function() {
  const now = new Date();
  const created = this.createdAt;
  const diffTime = Math.abs(now - created);
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  return diffHours;
});

// Virtual for isExpired
applicationSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Pre-save middleware
applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-set expiry date if not provided (7 days from creation)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  
  // Calculate response time when status changes
  if (this.isModified('status') && this.status !== 'applied') {
    const responseTime = Math.ceil((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
    this.metrics.responseTime = responseTime;
  }
  
  // Calculate shortlist time
  if (this.isModified('status') && this.status === 'shortlisted') {
    const shortlistTime = Math.ceil((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
    this.metrics.shortlistTime = shortlistTime;
    this.employerResponse.shortlistDate = new Date();
  }
  
  // Calculate hire time
  if (this.isModified('status') && this.status === 'hired') {
    const hireTime = Math.ceil((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
    this.metrics.hireTime = hireTime;
    this.employerResponse.hireDate = new Date();
  }
  
  next();
});

// Instance methods
applicationSchema.methods.addNote = function(message, sender) {
  this.communication.notes.push({
    message,
    sender,
    timestamp: new Date()
  });
  this.communication.lastContactDate = new Date();
  this.communication.lastContactBy = sender;
  return this.save();
};

applicationSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  
  // Update relevant fields based on status
  switch (newStatus) {
    case 'viewed':
      this.metrics.viewCount += 1;
      break;
    case 'shortlisted':
      this.employerResponse.shortlistNotes = notes;
      this.employerResponse.shortlistDate = new Date();
      break;
    case 'interviewed':
      this.employerResponse.interviewNotes = notes;
      this.employerResponse.interviewDate = new Date();
      break;
    case 'hired':
      this.employerResponse.hireNotes = notes;
      this.employerResponse.hireDate = new Date();
      break;
    case 'rejected':
      this.employerResponse.rejectionNotes = notes;
      break;
  }
  
  return this.save();
};

applicationSchema.methods.scheduleInterview = function(interviewDate, location, notes = '') {
  this.employerResponse.interviewDate = interviewDate;
  this.employerResponse.interviewLocation = location;
  this.employerResponse.interviewNotes = notes;
  this.status = 'interviewed';
  return this.save();
};

// Static methods
applicationSchema.statics.findByWorker = function(workerId, status = null) {
  const query = { workerId };
  if (status) query.status = status;
  return this.find(query).populate('jobId').sort({ createdAt: -1 });
};

applicationSchema.statics.findByEmployer = function(employerId, status = null) {
  const query = { employerId };
  if (status) query.status = status;
  return this.find(query).populate('workerId').sort({ createdAt: -1 });
};

applicationSchema.statics.findByJob = function(jobId, status = null) {
  const query = { jobId };
  if (status) query.status = status;
  return this.find(query).populate('workerId').sort({ createdAt: -1 });
};

applicationSchema.statics.findUrgent = function() {
  return this.find({
    'flags.isUrgent': true,
    status: { $in: ['applied', 'viewed', 'shortlisted'] },
    expiresAt: { $gt: new Date() }
  }).populate('jobId workerId');
};

applicationSchema.statics.findExpiringSoon = function(hours = 24) {
  const threshold = new Date(Date.now() + hours * 60 * 60 * 1000);
  return this.find({
    expiresAt: { $lte: threshold, $gt: new Date() },
    status: { $in: ['applied', 'viewed'] }
  });
};

// Aggregation methods
applicationSchema.statics.getApplicationStats = function(employerId = null, workerId = null) {
  const match = {};
  if (employerId) match.employerId = employerId;
  if (workerId) match.workerId = workerId;
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgResponseTime: { $avg: '$metrics.responseTime' },
        avgShortlistTime: { $avg: '$metrics.shortlistTime' },
        avgHireTime: { $avg: '$metrics.hireTime' }
      }
    }
  ]);
};

module.exports = mongoose.model('Application', applicationSchema);
