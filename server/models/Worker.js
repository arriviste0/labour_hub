const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    max: 50
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    default: 'beginner'
  }
});

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: 50
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    profilePicture: {
      type: String
    }
  },
  contactInfo: {
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
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
  professionalInfo: {
    skills: [skillSchema],
    totalExperience: {
      type: Number,
      min: 0,
      max: 50,
      required: true
    },
    education: {
      type: String,
      enum: ['illiterate', 'primary', 'secondary', 'higher_secondary', 'diploma', 'degree'],
      default: 'secondary'
    },
    certifications: [{
      name: String,
      issuingAuthority: String,
      issueDate: Date,
      expiryDate: Date,
      documentUrl: String
    }],
    languages: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['basic', 'conversational', 'fluent', 'native'],
        default: 'basic'
      }
    }]
  },
  workPreferences: {
    preferredCities: [{
      type: String,
      required: true
    }],
    preferredShifts: [{
      type: String,
      enum: ['morning', 'afternoon', 'night', 'flexible'],
      default: 'flexible'
    }],
    minWagePerDay: {
      type: Number,
      min: 200,
      max: 5000,
      required: true
    },
    maxWagePerDay: {
      type: Number,
      min: 200,
      max: 10000
    },
    availability: {
      type: String,
      enum: ['immediate', 'next_week', 'next_month', 'flexible'],
      default: 'immediate'
    },
    workRadius: {
      type: Number,
      min: 5,
      max: 100,
      default: 25 // km
    }
  },
  documents: {
    aadhaar: {
      number: {
        type: String,
        match: /^[0-9]{12}$/
      },
      documentUrl: String,
      isVerified: {
        type: Boolean,
        default: false
      }
    },
    panCard: {
      number: String,
      documentUrl: String,
      isVerified: {
        type: Boolean,
        default: false
      }
    },
    itiCertificate: {
      documentUrl: String,
      isVerified: {
        type: Boolean,
        default: false
      }
    },
    otherDocuments: [{
      name: String,
      documentUrl: String,
      isVerified: {
        type: Boolean,
        default: false
      }
    }]
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
      punctuality: { type: Number, default: 0 },
      quality: { type: Number, default: 0 },
      safety: { type: Number, default: 0 },
      communication: { type: Number, default: 0 }
    }
  },
  status: {
    type: String,
    enum: ['available', 'busy', 'unavailable', 'suspended'],
    default: 'available'
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
workerSchema.index({ 'contactInfo.address.city': 1 });
workerSchema.index({ 'contactInfo.address.state': 1 });
workerSchema.index({ 'workPreferences.preferredCities': 1 });
workerSchema.index({ 'professionalInfo.skills.name': 1 });
workerSchema.index({ 'workPreferences.minWagePerDay': 1, 'workPreferences.maxWagePerDay': 1 });
workerSchema.index({ 'ratings.averageRating': -1 });
workerSchema.index({ status: 1, 'workPreferences.availability': 1 });

// Virtual for full name
workerSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`.trim();
});

// Virtual for age
workerSchema.virtual('age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.personalInfo.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Pre-save middleware to calculate profile completion
workerSchema.pre('save', function(next) {
  let completion = 0;
  const fields = [
    'personalInfo.firstName', 'personalInfo.lastName', 'personalInfo.dateOfBirth',
    'contactInfo.address.city', 'contactInfo.address.state', 'contactInfo.address.pincode',
    'professionalInfo.totalExperience', 'workPreferences.minWagePerDay'
  ];
  
  fields.forEach(field => {
    if (this.get(field)) completion += 12.5; // 8 fields * 12.5% = 100%
  });
  
  this.profileCompletion = Math.min(100, completion);
  next();
});

// Instance methods
workerSchema.methods.updateRating = function(newRating, category) {
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

// Static methods
workerSchema.statics.findByLocation = function(city, state) {
  return this.find({
    $or: [
      { 'contactInfo.address.city': { $regex: city, $options: 'i' } },
      { 'contactInfo.address.state': { $regex: state, $options: 'i' } },
      { 'workPreferences.preferredCities': { $in: [city, state] } }
    ]
  });
};

workerSchema.statics.findBySkills = function(skills) {
  return this.find({
    'professionalInfo.skills.name': { $in: skills }
  });
};

workerSchema.statics.findAvailable = function() {
  return this.find({
    status: 'available',
    'workPreferences.availability': { $in: ['immediate', 'next_week'] }
  });
};

module.exports = mongoose.model('Worker', workerSchema);
