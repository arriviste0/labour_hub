const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyInfo: {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    type: {
      type: String,
      enum: ['construction', 'manufacturing', 'logistics', 'agriculture', 'retail', 'hospitality', 'other'],
      required: true
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'enterprise'],
      default: 'small'
    },
    industry: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxlength: 500
    },
    logo: {
      type: String
    },
    website: {
      type: String,
      match: /^https?:\/\/.+/
    }
  },
  contactInfo: {
    primaryContact: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      designation: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        type: String,
        required: true,
        match: /^[6-9]\d{9}$/
      },
      email: {
        type: String,
        required: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      }
    },
    secondaryContact: {
      name: String,
      designation: String,
      phone: String,
      email: String
    },
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
      pincode: {
        type: String,
        required: true,
        match: /^[1-9][0-9]{5}$/
      }
    }
  },
  businessInfo: {
    gstNumber: {
      type: String,
      match: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
    },
    panNumber: {
      type: String,
      match: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    },
    registrationNumber: String,
    yearEstablished: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear()
    },
    employeeCount: {
      type: Number,
      min: 1
    },
    annualTurnover: {
      type: String,
      enum: ['<1cr', '1-5cr', '5-25cr', '25-100cr', '>100cr']
    }
  },
  workLocations: [{
    name: {
      type: String,
      required: true
    },
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
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  preferences: {
    preferredWorkerTypes: [{
      type: String,
      enum: ['skilled', 'semi-skilled', 'unskilled', 'supervisor', 'foreman']
    }],
    preferredSkills: [String],
    preferredCities: [String],
    maxBudgetPerDay: {
      type: Number,
      min: 200,
      max: 10000
    },
    preferredShiftTimings: [{
      type: String,
      enum: ['morning', 'afternoon', 'night', 'flexible']
    }],
    contractDuration: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'project-based']
    }
  },
  ratings: {
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    ratingBreakdown: {
      paymentTimeliness: { type: Number, default: 0 },
      workConditions: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      safetyStandards: { type: Number, default: 0 }
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: false
    },
    features: [String]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'pending_verification'
  },
  verificationStatus: {
    businessDocuments: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    contactVerification: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    addressVerification: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  profileCompletion: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
employerSchema.index({ 'contactInfo.address.city': 1 });
employerSchema.index({ 'contactInfo.address.state': 1 });
employerSchema.index({ 'companyInfo.type': 1 });
employerSchema.index({ 'companyInfo.industry': 1 });
employerSchema.index({ 'workLocations.address.city': 1 });
employerSchema.index({ status: 1, 'verificationStatus.businessDocuments': 1 });
employerSchema.index({ 'subscription.plan': 1, 'subscription.isActive': 1 });

// Virtual for company display name
employerSchema.virtual('displayName').get(function() {
  return this.companyInfo.name || 'Unnamed Company';
});

// Virtual for verification status
employerSchema.virtual('isFullyVerified').get(function() {
  return Object.values(this.verificationStatus).every(status => status === 'verified');
});

// Pre-save middleware to calculate profile completion
employerSchema.pre('save', function(next) {
  let completion = 0;
  const fields = [
    'companyInfo.name', 'companyInfo.type', 'companyInfo.industry',
    'contactInfo.primaryContact.name', 'contactInfo.primaryContact.phone',
    'contactInfo.primaryContact.email', 'contactInfo.address.city',
    'contactInfo.address.state', 'contactInfo.address.pincode'
  ];
  
  fields.forEach(field => {
    if (this.get(field)) completion += 11.11; // 9 fields * 11.11% ≈ 100%
  });
  
  this.profileCompletion = Math.min(100, completion);
  next();
});

// Instance methods
employerSchema.methods.updateRating = function(newRating, category) {
  const currentTotal = this.ratings.totalRatings;
  const currentAvg = this.ratings.averageRating;
  
  // Update total ratings
  this.ratings.totalRatings = currentTotal + 1;
  
  // Update average rating
  this.ratings.averageRating = ((currentAvg * currentTotal) + newRating) / this.ratings.totalRatings;
  
  // Update category rating if provided
  if (category && this.ratings.ratingBreakdown[category] !== undefined) {
    this.ratings.ratingBreakdown[category] = newRating;
  }
  
  return this.save();
};

employerSchema.methods.addWorkLocation = function(location) {
  this.workLocations.push(location);
  return this.save();
};

employerSchema.methods.updateSubscription = function(plan, features, duration) {
  this.subscription.plan = plan;
  this.subscription.features = features;
  this.subscription.startDate = new Date();
  this.subscription.endDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000); // duration in days
  this.subscription.isActive = true;
  return this.save();
};

// Static methods
employerSchema.statics.findByLocation = function(city, state) {
  return this.find({
    $or: [
      { 'contactInfo.address.city': { $regex: city, $options: 'i' } },
      { 'contactInfo.address.state': { $regex: state, $options: 'i' } },
      { 'workLocations.address.city': { $regex: city, $options: 'i' } },
      { 'workLocations.address.state': { $regex: state, $options: 'i' } }
    ]
  });
};

employerSchema.statics.findByIndustry = function(industry) {
  return this.find({
    'companyInfo.industry': { $regex: industry, $options: 'i' }
  });
};

employerSchema.statics.findVerified = function() {
  return this.find({
    status: 'active',
    'verificationStatus.businessDocuments': 'verified',
    'verificationStatus.contactVerification': 'verified'
  });
};

employerSchema.statics.findSubscribed = function() {
  return this.find({
    'subscription.isActive': true,
    'subscription.endDate': { $gt: new Date() }
  });
};

module.exports = mongoose.model('Employer', employerSchema);
