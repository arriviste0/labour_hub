import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Clock, 
  MapPin, 
  Star, 
  DollarSign, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  Phone,
  MessageCircle,
  Download,
  Eye,
  Award,
  Shield,
  FileText,
  Camera
} from 'lucide-react';
import { motion } from 'framer-motion';

const WorkerDashboard = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  
  const [profileStats] = useState({
    totalEarnings: 45000,
    thisMonth: 12500,
    pendingPayout: 3200,
    completedJobs: 28,
    rating: 4.6,
    kycVerified: true,
    skillBadges: 5,
    insuranceActive: true
  });

  const [jobOpportunities] = useState([
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
      urgent: true
    },
    {
      id: 2,
      title: 'Electrical Installation',
      company: 'PowerTech Solutions',
      location: 'Mumbai, Bandra',
      dailyWage: 1000,
      duration: '8 days',
      skills: ['Electrical', 'Installation'],
      rating: 4.5,
      distance: '5.1 km',
      urgent: false
    },
    {
      id: 3,
      title: 'Plumbing & Waterproofing',
      company: 'Aqua Systems',
      location: 'Mumbai, Juhu',
      dailyWage: 900,
      duration: '12 days',
      skills: ['Plumbing', 'Waterproofing'],
      rating: 4.1,
      distance: '3.8 km',
      urgent: true
    }
  ]);

  const [myJobs] = useState([
    {
      id: 1,
      title: 'Masonry Work - Site A',
      company: 'ABC Construction',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-01-30',
      dailyWage: 800,
      daysWorked: 8,
      totalEarned: 6400,
      location: 'Andheri West'
    },
    {
      id: 2,
      title: 'Electrical Work - Office Complex',
      company: 'PowerTech Solutions',
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-10',
      dailyWage: 1000,
      daysWorked: 10,
      totalEarned: 10000,
      location: 'Bandra East'
    },
    {
      id: 3,
      title: 'Plumbing - Hotel Project',
      company: 'Aqua Systems',
      status: 'applied',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      dailyWage: 900,
      daysWorked: 0,
      totalEarned: 0,
      location: 'Juhu'
    }
  ]);

  const [wageLedger] = useState([
    { date: '2024-01-15', job: 'Masonry - Site A', days: 8, rate: 800, total: 6400, status: 'paid' },
    { date: '2024-01-10', job: 'Electrical - Office', days: 10, rate: 1000, total: 10000, status: 'paid' },
    { date: '2024-01-05', job: 'Plumbing - Hotel', days: 12, rate: 900, total: 10800, status: 'paid' },
    { date: '2024-01-20', job: 'Masonry - Site A', days: 4, rate: 800, total: 3200, status: 'pending' }
  ]);

  const [reviews] = useState([
    { id: 1, company: 'ABC Construction', rating: 5, comment: 'Excellent work quality and punctuality', date: '2024-01-15' },
    { id: 2, company: 'PowerTech Solutions', rating: 4, comment: 'Good technical skills, reliable worker', date: '2024-01-10' },
    { id: 3, company: 'Aqua Systems', rating: 5, comment: 'Very professional and skilled plumber', date: '2024-01-05' }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-5 w-5 mr-2" />
      {label}
    </button>
  );

  const JobCard = ({ job, showApply = false }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
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
          {job.urgent && (
            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Urgent
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>Duration: {job.duration}</span>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          {job.rating}
        </div>
      </div>
      
      {showApply && (
        <div className="flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Apply Now
          </button>
          <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );

  const ProfileBadge = ({ icon: Icon, label, value, color, verified = false }) => (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded-full ${color} mr-3`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{value}</p>
      </div>
      {verified && (
        <CheckCircle className="h-5 w-5 text-green-500" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Worker Dashboard</h1>
              <p className="text-gray-600">Find jobs and manage your work</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                Update Photo
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Earnings"
            value={`₹${(profileStats.totalEarnings / 1000).toFixed(0)}K`}
            icon={DollarSign}
            color="bg-green-500"
            subtitle={`₹${profileStats.thisMonth.toLocaleString()} this month`}
          />
          <StatCard
            title="Pending Payout"
            value={`₹${profileStats.pendingPayout.toLocaleString()}`}
            icon={Clock}
            color="bg-yellow-500"
            subtitle="Available for withdrawal"
          />
          <StatCard
            title="Completed Jobs"
            value={profileStats.completedJobs}
            icon={Briefcase}
            color="bg-blue-500"
            subtitle="Total projects"
          />
          <StatCard
            title="Rating"
            value={profileStats.rating}
            icon={Star}
            color="bg-purple-500"
            subtitle="Based on {reviews.length} reviews"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton id="opportunities" label="Job Opportunities" icon={Briefcase} isActive={activeTab === 'opportunities'} />
            <TabButton id="myjobs" label="My Jobs" icon={Clock} isActive={activeTab === 'myjobs'} />
            <TabButton id="wages" label="Wage Ledger" icon={DollarSign} isActive={activeTab === 'wages'} />
            <TabButton id="reviews" label="Ratings & Reviews" icon={Star} isActive={activeTab === 'reviews'} />
            <TabButton id="profile" label="Profile Strength" icon={TrendingUp} isActive={activeTab === 'profile'} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Job Opportunities */}
          {activeTab === 'opportunities' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">Job Opportunities</h2>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                    />
                  </div>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Skills</option>
                    <option value="masonry">Masonry</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="carpentry">Carpentry</option>
                  </select>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Cities</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    <option value="bangalore">Bangalore</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobOpportunities.map(job => (
                  <JobCard key={job.id} job={job} showApply={true} />
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View More Opportunities →
                </button>
              </div>
            </div>
          )}

          {/* My Jobs */}
          {activeTab === 'myjobs' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">My Jobs</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar className="h-4 w-4 mr-2 inline" />
                    Schedule
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <MessageCircle className="h-4 w-4 mr-2 inline" />
                    Contact Support
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {myJobs.map(job => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </p>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' :
                        job.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Daily Wage</p>
                        <p className="font-semibold">₹{job.dailyWage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Days Worked</p>
                        <p className="font-semibold">{job.daysWorked}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Earned</p>
                        <p className="font-semibold">₹{job.totalEarned.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{job.startDate} - {job.endDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {job.status === 'active' && (
                        <>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                            Check In
                          </button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <Phone className="h-4 w-4 mr-2 inline" />
                            Call Supervisor
                          </button>
                        </>
                      )}
                      {job.status === 'completed' && (
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <Download className="h-4 w-4 mr-2 inline" />
                          Download Certificate
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Wage Ledger */}
          {activeTab === 'wages' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Wage Ledger</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Export CSV
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Withdraw Funds
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wageLedger.map((entry, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.job}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.days}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{entry.rate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{entry.total.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            entry.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">Available for Withdrawal</p>
                    <p className="text-sm text-blue-700">₹{profileStats.pendingPayout.toLocaleString()} ready to transfer</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Withdraw Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ratings & Reviews */}
          {activeTab === 'reviews' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Ratings & Reviews</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{profileStats.rating}</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                  <div className="flex items-center mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(profileStats.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.company}</h4>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Strength */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Strength</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Complete Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Verification Status</h3>
                  <div className="space-y-3">
                    <ProfileBadge
                      icon={Shield}
                      label="KYC Verification"
                      value={profileStats.kycVerified ? "Verified" : "Pending"}
                      color={profileStats.kycVerified ? "bg-green-500" : "bg-yellow-500"}
                      verified={profileStats.kycVerified}
                    />
                    <ProfileBadge
                      icon={Award}
                      label="Skill Badges"
                      value={`${profileStats.skillBadges} badges earned`}
                      color="bg-blue-500"
                    />
                    <ProfileBadge
                      icon={FileText}
                      label="Insurance"
                      value={profileStats.insuranceActive ? "Active" : "Inactive"}
                      color={profileStats.insuranceActive ? "bg-green-500" : "bg-red-500"}
                      verified={profileStats.insuranceActive}
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Completion</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Basic Information</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '95%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Skills & Experience</span>
                        <span className="font-medium">88%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-blue-500" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Documents</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">References</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-red-500" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Complete Your Profile</h4>
                    <p className="text-sm text-blue-700 mb-3">Complete profiles get 3x more job matches</p>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Add Missing Information →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
