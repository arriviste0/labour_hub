import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Calendar, Star, Award, Edit, Briefcase, Clock, DollarSign, Shield, FileText, Camera, Download, Eye, CheckCircle } from 'lucide-react';

const WorkerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data - replace with actual API call
  const profile = {
    name: 'Rajesh Kumar',
    age: 32,
    experience: '8 years',
    location: 'Mumbai, Maharashtra',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    skills: ['Masonry', 'Construction', 'Plumbing', 'Electrical', 'Carpentry'],
    rating: 4.6,
    totalJobs: 156,
    completedJobs: 148,
    totalEarnings: 450000,
    thisMonthEarnings: 12500,
    badges: ['Verified Worker', 'Reliable', 'Safety Certified', 'Quick Learner', 'Team Player'],
    workHistory: [
      {
        company: 'ABC Construction',
        position: 'Senior Mason',
        duration: '2 years',
        completed: true,
        rating: 4.8
      },
      {
        company: 'PowerTech Solutions',
        position: 'Electrical Helper',
        duration: '1.5 years',
        completed: true,
        rating: 4.5
      },
      {
        company: 'Aqua Systems',
        position: 'Plumber',
        duration: '1 year',
        completed: true,
        rating: 4.7
      }
    ],
    certifications: [
      'Safety Training Certificate',
      'Construction Skills Certificate',
      'Electrical Safety Certificate'
    ],
    languages: ['Hindi', 'English', 'Marathi'],
    availability: 'Available for immediate work',
    preferredWork: 'Full-time, Part-time, Contract'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-green-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-6">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                <p className="text-gray-600 mb-2">{profile.experience} experience • {profile.age} years old</p>
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-gray-700 font-medium">{profile.rating}</span>
                  <span className="text-gray-500 ml-2">({profile.totalJobs} jobs completed)</span>
                </div>
                <p className="text-green-600 font-medium">{profile.availability}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile.totalJobs}</div>
              <div className="text-gray-600">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.completedJobs}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹{profile.totalEarnings.toLocaleString()}</div>
              <div className="text-gray-600">Total Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{profile.skills.length}</div>
              <div className="text-gray-600">Skills</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Work History */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Work History
              </h2>
              <div className="space-y-4">
                {profile.workHistory.map((job, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{job.position}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">{job.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-1">{job.company}</p>
                    <p className="text-sm text-gray-500">{job.duration}</p>
                    {job.completed && (
                      <span className="inline-flex items-center text-sm text-green-600 mt-2">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Certifications & Training
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Worker Badges & Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.badges.map(badge => (
                  <div key={badge} className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Shield className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span>{profile.age} years old</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <a href={`tel:${profile.phone}`} className="hover:text-green-600">
                    {profile.phone}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href={`mailto:${profile.email}`} className="hover:text-green-600">
                    {profile.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{profile.experience} experience</span>
                </div>
              </div>
            </div>

            {/* Work Preferences */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Preferences</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">{profile.availability}</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">{profile.preferredWork}</p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Worker Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Worker Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">
                    {Math.round((profile.completedJobs / profile.totalJobs) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-medium text-blue-600">₹{profile.thisMonthEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-medium text-yellow-600">{profile.rating}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Skills Count</span>
                  <span className="font-medium text-purple-600">{profile.skills.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                  Update Availability
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  View Job History
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Download Certificates
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Profile Settings
                </button>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Identity Verified</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Skills Verified</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Background Check</span>
                  <span className="text-green-600">✓ Passed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Payment Verified</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
