const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['construction', 'manufacturing', 'logistics', 'agriculture', 'retail', 'hospitality', 'other'],
    required: true
  },
  skills: [{
    type: String,
    required: true,
    trim: true
  }],
  workerType: {
    type: String,
    enum: ['skilled', 'semi-skilled', 'unskilled', 'supervisor', 'foreman'],
    required: true
  },
  requirements: {
    minExperience: {
      type: Number,
      min: 0,
      max: 50,
      default: 0
    },
    education: {
      type: String,
      enum: ['any', 'illiterate', 'primary', 'secondary', 'higher_secondary', 'diploma', 'degree'],
      default: 'any'
    },
    ageRange: {
      min: {
        type: Number,
        min: 18,
        max: 70,
        default: 18
      },
      max: {
        type: Number,
        min: 18,
        max: 70,
        default: 70
      }
    },
    languages: [String],
    certifications: [String]
  },
  location: {
    address: {
      street: String,
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      pincode: String
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    workSite: {
      type: String,
      required: true,
      trim: true
    }
  },
  compensation: {
    wagePerDay: {
      type: Number,
      required: true,
      min: 200,
      max: 10000
    },
    overtimeRate: {
      type: Number,
      min: 1.0,
      max: 3.0,
      default: 1.5
    },
    bonus: {
      type: String,
      enum: ['none', 'performance', 'attendance', 'completion', 'other']
    },
    bonusAmount: Number,
    paymentFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'weekly'
    },
    advanceAvailable: {
      type: Boolean,
      default: false
    },
    advancePercentage: {
      type: Number,
      min: 0,
      max: 50,
      default: 0
    }
  },
  workDetails: {
    headcount: {
      type: Number,
      required: true,
      min: 1,
      max: 1000
    },
    shiftTiming: {
      start: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
      end: {
        type: String,
        required: true,
        match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      },
      duration: {
        type: Number,
        min: 1,
        max: 24,
        required: true
      }
    },
    workDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    }],
    startDate: {
      type: Date,
      required: true
    },
    endDate: Date,
    isUrgent: {
      type: Boolean,
      default: false
    }
  },
  benefits: {
    accommodation: {
      type: String,
      enum: ['none', 'provided', 'subsidy'],
      default: 'none'
    },
    food: {
      type: String,
      enum: ['none', 'provided', 'subsidy'],
      default: 'none'
    },
    transport: {
      type: String,
      enum: ['none', 'provided', 'subsidy'],
      default: 'none'
    },
    insurance: {
      type: Boolean,
      default: false
    },
    pfEsi: {
      type: Boolean,
      default: false
    },
    otherBenefits: [String]
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'expired', 'under_review'],
    default: 'active'
  },
  applications: {
    total: {
      type: Number,
      default: 0
    },
    shortlisted: {
      type: Number,
      default: 0
    },
    hired: {
      type: Number,
      default: 0
    }
  },
  visibility: {
    isPublic: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    }
  },
  metrics: {
    views: {
      type: Number,
      default: 0
    },
    applications: {
      type: Number,
      default: 0
    },
    shortlists: {
      type: Number,
      default: 0
    },
    hires: {
      type: Number,
      default: 0
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
jobSchema.index({ 'location.address.city': 1 });
jobSchema.index({ 'location.address.state': 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ workerType: 1 });
jobSchema.index({ 'compensation.wagePerDay': 1 });
jobSchema.index({ 'workDetails.startDate': 1 });
jobSchema.index({ status: 1, 'visibility.isPublic': 1 });
jobSchema.index({ 'visibility.featured': 1, 'visibility.priority': 1 });
jobSchema.index({ expiresAt: 1 });
jobSchema.index({ employerId: 1, status: 1 });

// Virtual for job duration
jobSchema.virtual('duration').get(function() {
  if (!this.workDetails.startDate || !this.workDetails.endDate) return null;
  const diffTime = Math.abs(this.workDetails.endDate - this.workDetails.startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for isExpired
jobSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Virtual for isUrgent
jobSchema.virtual('isUrgent').get(function() {
  return this.workDetails.isUrgent || this.visibility.priority === 'urgent';
});

// Pre-save middleware
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-set expiry date if not provided (30 days from start date)
  if (!this.expiresAt && this.workDetails.startDate) {
    this.expiresAt = new Date(this.workDetails.startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Instance methods
jobSchema.methods.incrementViews = function() {
  this.metrics.views += 1;
  return this.save();
};

jobSchema.methods.incrementApplications = function() {
  this.metrics.applications += 1;
  this.applications.total += 1;
  return this.save();
};

jobSchema.methods.updateApplicationStatus = function(status) {
  if (status === 'shortlisted') {
    this.applications.shortlisted += 1;
  } else if (status === 'hired') {
    this.applications.hired += 1;
  }
  return this.save();
};

jobSchema.methods.closeJob = function() {
  this.status = 'closed';
  return this.save();
};

// Static methods
jobSchema.statics.findActive = function() {
  return this.find({
    status: 'active',
    'visibility.isPublic': true,
    expiresAt: { $gt: new Date() }
  });
};

jobSchema.statics.findByLocation = function(city, state) {
  return this.find({
    'location.address.city': { $regex: city, $options: 'i' },
    status: 'active',
    expiresAt: { $gt: new Date() }
  });
};

jobSchema.statics.findBySkills = function(skills) {
  return this.find({
    skills: { $in: skills },
    status: 'active',
    expiresAt: { $gt: new Date() }
  });
};

jobSchema.statics.findByWageRange = function(minWage, maxWage) {
  return this.find({
    'compensation.wagePerDay': { $gte: minWage, $lte: maxWage },
    status: 'active',
    expiresAt: { $gt: new Date() }
  });
};

jobSchema.statics.findUrgent = function() {
  return this.find({
    $or: [
      { 'workDetails.isUrgent': true },
      { 'visibility.priority': 'urgent' }
    ],
    status: 'active',
    expiresAt: { $gt: new Date() }
  });
};

// Text search index for job search
jobSchema.index({
  title: 'text',
  description: 'text',
  skills: 'text',
  'location.workSite': 'text'
});

module.exports = mongoose.model('Job', jobSchema);
