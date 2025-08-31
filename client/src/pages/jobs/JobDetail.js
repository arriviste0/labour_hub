import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Building2, Calendar, User, Phone, Mail } from 'lucide-react';

const JobDetail = () => {
  const { id } = useParams();
  const [isApplying, setIsApplying] = useState(false);

  // Mock data - replace with actual API call
  const job = {
    id: parseInt(id),
    title: 'Construction Worker',
    company: 'ABC Construction Co.',
    location: 'Mumbai, Maharashtra',
    wage: '₹800-1000',
    duration: 'Daily',
    skills: ['Masonry', 'Concrete Work', 'Safety Training'],
    postedDate: '2 hours ago',
    urgent: true,
    description: `We are looking for experienced construction workers to join our team for a major infrastructure project in Mumbai. The ideal candidate should have experience in masonry and concrete work, with a strong focus on safety.

Key Responsibilities:
• Perform masonry and concrete work according to specifications
• Follow safety protocols and wear appropriate PPE
• Work collaboratively with team members
• Maintain tools and equipment
• Report any safety concerns immediately

Requirements:
• Minimum 2 years of experience in construction
• Knowledge of masonry and concrete techniques
• Safety training certification preferred
• Physical stamina for manual labor
• Team player with good communication skills`,
    requirements: [
      'Minimum 2 years of experience in construction',
      'Knowledge of masonry and concrete techniques',
      'Safety training certification preferred',
      'Physical stamina for manual labor',
      'Team player with good communication skills'
    ],
    benefits: [
      'Competitive daily wages',
      'Safety equipment provided',
      'On-site training opportunities',
      'Performance bonuses',
      'Health insurance coverage'
    ],
    contact: {
      phone: '+91 98765 43210',
      email: 'hr@abcconstruction.com',
      address: '123 Construction Site, Andheri East, Mumbai'
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      alert('Application submitted successfully!');
    }, 2000);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job not found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700">
            ← Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back to Jobs */}
        <div className="mb-6">
          <Link to="/jobs" className="text-blue-600 hover:text-blue-700 flex items-center">
            ← Back to Jobs
          </Link>
        </div>

        {/* Job Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 mb-3">{job.company}</p>
            </div>
            {job.urgent && (
              <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
                Urgent
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>{job.duration}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2" />
              <span>{job.wage}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {job.skills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Posted {job.postedDate}</p>
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-gray max-w-none">
                {job.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{job.contact.address}</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  <a href={`tel:${job.contact.phone}`} className="hover:text-blue-600">
                    {job.contact.phone}
                  </a>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  <a href={`mailto:${job.contact.email}`} className="hover:text-blue-600">
                    {job.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Apply Now
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Save Job
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                  Share Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;

