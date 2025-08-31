import React, { useState } from 'react';
import { Building2, MapPin, Phone, Mail, Calendar, Star, Award, Edit, Users, Briefcase } from 'lucide-react';

const EmployerProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data - replace with actual API call
  const profile = {
    companyName: 'ABC Construction Co.',
    industry: 'Construction & Infrastructure',
    founded: '2010',
    employees: '150+',
    location: 'Mumbai, Maharashtra',
    phone: '+91 98765 43210',
    email: 'hr@abcconstruction.com',
    website: 'www.abcconstruction.com',
    description: 'Leading construction company specializing in infrastructure development, commercial buildings, and residential projects across Maharashtra.',
    rating: 4.6,
    totalJobs: 89,
    completedJobs: 87,
    activeWorkers: 45,
    badges: ['Verified Company', 'Reliable Employer', 'Safety Certified'],
    projects: [
      'Mumbai Metro Extension',
      'Commercial Complex - Andheri',
      'Residential Tower - Bandra'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mr-6">
                {profile.companyName.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.companyName}</h1>
                <p className="text-gray-600 mb-2">{profile.industry}</p>
                <div className="flex items-center mb-2">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="text-gray-700 font-medium">{profile.rating}</span>
                  <span className="text-gray-500 ml-2">({profile.totalJobs} jobs posted)</span>
                </div>
                <p className="text-green-600 font-medium">Active and hiring</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{profile.totalJobs}</div>
              <div className="text-gray-600">Jobs Posted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile.completedJobs}</div>
              <div className="text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{profile.activeWorkers}</div>
              <div className="text-gray-600">Active Workers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{profile.founded}</div>
              <div className="text-gray-600">Established</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About Company</h2>
              <p className="text-gray-700 mb-4">{profile.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{profile.industry}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{profile.employees} employees</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>Est. {profile.founded}</span>
                </div>
              </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                Recent Projects
              </h2>
              <div className="space-y-3">
                {profile.projects.map((project, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">{project}</h3>
                    <p className="text-sm text-gray-600">Completed successfully</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Company Badges & Certifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.badges.map(badge => (
                  <div key={badge} className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Award className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800 font-medium">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <a href={`tel:${profile.phone}`} className="hover:text-blue-600">
                    {profile.phone}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href={`mailto:${profile.email}`} className="hover:text-blue-600">
                    {profile.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-5 w-5 mr-2" />
                  <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                    {profile.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Company Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">
                    {Math.round((profile.completedJobs / profile.totalJobs) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Worker Retention</span>
                  <span className="font-medium text-blue-600">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium text-green-600">Within 4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Safety Rating</span>
                  <span className="font-medium text-green-600">A+</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Post New Job
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  View Applications
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Manage Workers
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Company Settings
                </button>
              </div>
            </div>

            {/* Verification Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Company Verified</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">GST Verified</span>
                  <span className="text-green-600">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Safety Certified</span>
                  <span className="text-green-600">✓ Certified</span>
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

export default EmployerProfile;


