import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  Building,
  Award,
  Shield,
  CheckCircle,
  Eye,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Calendar,
  Briefcase,
  TrendingUp,
  Location,
  Filter as FilterIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedWage, setSelectedWage] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [viewMode, setViewMode] = useState('jobs'); // 'jobs' or 'workers' or 'companies'
  const [sortBy, setSortBy] = useState('relevance');

  const [jobs] = useState([
    {
      id: 1,
      title: 'Masonry Work - Residential Project',
      company: 'ABC Construction',
      location: 'Mumbai, Andheri',
      dailyWage: 800,
      duration: '15 days',
      skills: ['Masonry', 'Construction'],
      rating: 4.2,
      distance: '2.5 km',
      urgent: true,
      posted: '2 hours ago',
      workersNeeded: 8,
      verified: true
    },
    {
      id: 2,
      title: 'Electrical Installation - Office Complex',
      company: 'PowerTech Solutions',
      location: 'Mumbai, Bandra',
      dailyWage: 1000,
      duration: '8 days',
      skills: ['Electrical', 'Installation'],
      rating: 4.5,
      distance: '5.1 km',
      urgent: false,
      posted: '1 day ago',
      workersNeeded: 5,
      verified: true
    },
    {
      id: 3,
      title: 'Plumbing & Waterproofing - Hotel',
      company: 'Aqua Systems',
      location: 'Mumbai, Juhu',
      dailyWage: 900,
      duration: '12 days',
      skills: ['Plumbing', 'Waterproofing'],
      rating: 4.1,
      distance: '3.8 km',
      urgent: true,
      posted: '3 hours ago',
      workersNeeded: 6,
      verified: true
    },
    {
      id: 4,
      title: 'Carpentry - Furniture Workshop',
      company: 'WoodCraft Industries',
      location: 'Mumbai, Dadar',
      dailyWage: 750,
      duration: '20 days',
      skills: ['Carpentry', 'Furniture'],
      rating: 4.3,
      distance: '4.2 km',
      urgent: false,
      posted: '2 days ago',
      workersNeeded: 4,
      verified: false
    }
  ]);

  const [workers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      skills: ['Masonry', 'Construction', 'Tiling'],
      experience: '8 years',
      rating: 4.6,
      completedJobs: 45,
      location: 'Andheri West, Mumbai',
      dailyRate: 800,
      verified: true,
      badges: ['KYC Verified', 'Safety Trained', 'Insurance Active'],
      available: true
    },
    {
      id: 2,
      name: 'Suresh Patel',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      skills: ['Electrical', 'Installation', 'Maintenance'],
      experience: '5 years',
      rating: 4.4,
      completedJobs: 32,
      location: 'Bandra East, Mumbai',
      dailyRate: 900,
      verified: true,
      badges: ['KYC Verified', 'Skill Certified'],
      available: true
    },
    {
      id: 3,
      name: 'Amit Singh',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      skills: ['Plumbing', 'Waterproofing', 'Repair'],
      experience: '7 years',
      rating: 4.8,
      completedJobs: 58,
      location: 'Juhu, Mumbai',
      dailyRate: 850,
      verified: true,
      badges: ['KYC Verified', 'Safety Trained', 'Insurance Active', 'Top Rated'],
      available: false
    }
  ]);

  const [companies] = useState([
    {
      id: 1,
      name: 'ABC Construction',
      logo: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&h=100&fit=crop',
      industry: 'Construction',
      location: 'Mumbai, Maharashtra',
      rating: 4.3,
      totalReviews: 127,
      activeJobs: 12,
      completedJobs: 89,
      verified: true,
      description: 'Leading construction company specializing in residential and commercial projects.',
      specialties: ['Residential', 'Commercial', 'Infrastructure'],
      employeeCount: '50-100',
      established: '2015'
    },
    {
      id: 2,
      name: 'PowerTech Solutions',
      logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
      industry: 'Electrical',
      location: 'Mumbai, Maharashtra',
      rating: 4.5,
      totalReviews: 89,
      activeJobs: 8,
      completedJobs: 156,
      verified: true,
      description: 'Professional electrical services for commercial and industrial projects.',
      specialties: ['Commercial', 'Industrial', 'Maintenance'],
      employeeCount: '20-50',
      established: '2018'
    }
  ]);

  const JobCard = ({ job }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            {job.urgent && (
              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                Urgent
              </span>
            )}
            {job.verified && (
              <Shield className="h-4 w-4 text-blue-500" title="Verified Company" />
            )}
          </div>
          <p className="text-gray-600 mb-2">{job.company}</p>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location} • {job.distance}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {job.skills.map(skill => (
              <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">₹{job.dailyWage}</div>
          <div className="text-sm text-gray-500">per day</div>
          <div className="text-xs text-gray-400 mt-1">{job.posted}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>Duration: {job.duration}</span>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {job.workersNeeded} workers
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            {job.rating}
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Apply Now
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
          <Eye className="h-4 w-4" />
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
          <Heart className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );

  const WorkerCard = ({ worker }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start space-x-4 mb-4">
        <img 
          src={worker.photo} 
          alt={worker.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
            {worker.verified && (
              <CheckCircle className="h-4 w-4 text-green-500" title="Verified Worker" />
            )}
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              worker.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {worker.available ? 'Available' : 'Busy'}
            </span>
          </div>
          <p className="text-gray-600 mb-2">{worker.experience} experience</p>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {worker.location}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              {worker.rating}
            </span>
            <span className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {worker.completedJobs} jobs
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-green-600">₹{worker.dailyRate}</div>
          <div className="text-sm text-gray-500">per day</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {worker.skills.map(skill => (
          <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {worker.badges.map(badge => (
          <span key={badge} className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <Award className="h-3 w-3 mr-1" />
            {badge}
          </span>
        ))}
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Hire Now
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
          <MessageCircle className="h-4 w-4" />
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
          <Phone className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );

  const CompanyCard = ({ company }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start space-x-4 mb-4">
        <img 
          src={company.logo} 
          alt={company.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            {company.verified && (
              <Shield className="h-4 w-4 text-blue-500" title="Verified Company" />
            )}
          </div>
          <p className="text-gray-600 mb-2">{company.industry} • {company.location}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              {company.rating} ({company.totalReviews} reviews)
            </span>
            <span className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {company.activeJobs} active jobs
            </span>
          </div>
          <p className="text-sm text-gray-600">{company.description}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {company.specialties.map(specialty => (
          <span key={specialty} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            {specialty}
          </span>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Employees</p>
          <p className="font-medium">{company.employeeCount}</p>
        </div>
        <div>
          <p className="text-gray-500">Established</p>
          <p className="font-medium">{company.established}</p>
        </div>
        <div>
          <p className="text-gray-500">Completed</p>
          <p className="font-medium">{company.completedJobs} jobs</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          View Profile
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
          <MessageCircle className="h-4 w-4" />
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );

  const FilterSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button 
          onClick={() => {
            setSelectedSkill('all');
            setSelectedCity('all');
            setSelectedWage('all');
            setSelectedExperience('all');
          }}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skill</label>
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Skills</option>
            <option value="masonry">Masonry</option>
            <option value="electrical">Electrical</option>
            <option value="plumbing">Plumbing</option>
            <option value="carpentry">Carpentry</option>
            <option value="painting">Painting</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Cities</option>
            <option value="mumbai">Mumbai</option>
            <option value="delhi">Delhi</option>
            <option value="bangalore">Bangalore</option>
            <option value="chennai">Chennai</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Wage</label>
          <select
            value={selectedWage}
            onChange={(e) => setSelectedWage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Any Wage</option>
            <option value="500-800">₹500 - ₹800</option>
            <option value="800-1200">₹800 - ₹1200</option>
            <option value="1200+">₹1200+</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Any Experience</option>
            <option value="0-2">0-2 years</option>
            <option value="2-5">2-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600">Find jobs, workers, and companies</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Post a Job
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-4 w-4 mr-2 inline" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for jobs, skills, or companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Search
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('jobs')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'jobs' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="h-5 w-5 mr-2" />
              Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setViewMode('workers')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'workers' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Workers ({workers.length})
            </button>
            <button
              onClick={() => setViewMode('companies')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'companies' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Building className="h-5 w-5 mr-2" />
              Companies ({companies.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <FilterSection />

        {/* Sort Options */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="highest-wage">Highest Wage</option>
              <option value="rating">Rating</option>
              <option value="distance">Distance</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {viewMode === 'jobs' ? jobs.length : viewMode === 'workers' ? workers.length : companies.length} results
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {viewMode === 'jobs' && jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
          
          {viewMode === 'workers' && workers.map(worker => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
          
          {viewMode === 'companies' && companies.map(company => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium">
            Load More Results
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Briefcase className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">2,340+</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">12,450+</div>
            <div className="text-sm text-gray-600">Verified Workers</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <Building className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">890+</div>
            <div className="text-sm text-gray-600">Companies</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <TrendingUp className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
