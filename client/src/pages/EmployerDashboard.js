import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Star,
  CheckCircle,
  AlertCircle,
  XCircle,
  Download,
  Eye,
  Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('workforce');
  const [stats, setStats] = useState({
    totalWorkers: 45,
    workersOnSite: 38,
    requiredWorkers: 50,
    attendanceRate: 84,
    jobsPosted: 12,
    applications: 89,
    shortlisted: 23,
    hired: 15,
    totalWages: 125000,
    overtimeCost: 15000,
    absenteeismCost: 8000,
    kycVerified: 92,
    ppeCompliant: 88,
    safetyTrained: 95,
    insured: 100
  });

  const [recentJobs] = useState([
    { id: 1, title: 'Masonry Work', location: 'Site A', workers: 8, status: 'active', applications: 12 },
    { id: 2, title: 'Electrical Installation', location: 'Site B', workers: 5, status: 'active', applications: 8 },
    { id: 3, title: 'Plumbing Work', location: 'Site C', workers: 6, status: 'completed', applications: 15 }
  ]);

  const [recentApplications] = useState([
    { id: 1, name: 'Rajesh Kumar', skill: 'Masonry', experience: '5 years', rating: 4.2, status: 'shortlisted' },
    { id: 2, name: 'Suresh Patel', skill: 'Electrical', experience: '3 years', rating: 4.5, status: 'pending' },
    { id: 3, name: 'Amit Singh', skill: 'Plumbing', experience: '7 years', rating: 4.8, status: 'hired' }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
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
      {trend && (
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          <span className="text-green-600 font-medium">{trend}</span>
        </div>
      )}
    </motion.div>
  );

  const ProgressBar = ({ value, max, label, color = "blue" }) => (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}/{max}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-${color}-500`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
              <p className="text-gray-600">Manage your workforce and operations</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Workers on Site"
            value={`${stats.workersOnSite}/${stats.requiredWorkers}`}
            icon={Users}
            color="bg-blue-500"
            subtitle={`${stats.attendanceRate}% attendance`}
          />
          <StatCard
            title="Active Jobs"
            value={stats.jobsPosted}
            icon={UserPlus}
            color="bg-green-500"
            subtitle={`${stats.applications} applications`}
          />
          <StatCard
            title="Monthly Wages"
            value={`₹${(stats.totalWages / 1000).toFixed(0)}K`}
            icon={DollarSign}
            color="bg-yellow-500"
            subtitle={`₹${(stats.overtimeCost / 1000).toFixed(0)}K overtime`}
          />
          <StatCard
            title="Safety Score"
            value={`${stats.safetyTrained}%`}
            icon={Shield}
            color="bg-purple-500"
            subtitle="Compliance rate"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton id="workforce" label="Workforce Snapshot" icon={Users} isActive={activeTab === 'workforce'} />
            <TabButton id="hiring" label="Hiring Pipeline" icon={UserPlus} isActive={activeTab === 'hiring'} />
            <TabButton id="payroll" label="Cost & Payroll" icon={DollarSign} isActive={activeTab === 'payroll'} />
            <TabButton id="compliance" label="Risk & Compliance" icon={Shield} isActive={activeTab === 'compliance'} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Workforce Snapshot */}
          {activeTab === 'workforce' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Workforce Snapshot</h2>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All Workers</button>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Attendance Report</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Site Coverage</h3>
                  <ProgressBar value={stats.workersOnSite} max={stats.requiredWorkers} label="Workers Present" color="blue" />
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <span>Required: {stats.requiredWorkers}</span>
                    <span>Present: {stats.workersOnSite}</span>
                    <span>Shortage: {stats.requiredWorkers - stats.workersOnSite}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium">On Time</span>
                      </div>
                      <span className="text-sm text-gray-600">32 workers</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="text-sm font-medium">Late</span>
                      </div>
                      <span className="text-sm text-gray-600">6 workers</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="text-sm font-medium">Absent</span>
                      </div>
                      <span className="text-sm text-gray-600">12 workers</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentJobs.map(job => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {job.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{job.workers} workers</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hiring Pipeline */}
          {activeTab === 'hiring' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Hiring Pipeline</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Post New Job
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.jobsPosted}</div>
                  <div className="text-sm text-blue-600">Jobs Posted</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.applications}</div>
                  <div className="text-sm text-yellow-600">Applications</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.shortlisted}</div>
                  <div className="text-sm text-orange-600">Shortlisted</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
                  <div className="text-sm text-green-600">Hired</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h3>
                  <div className="space-y-3">
                    {recentApplications.map(app => (
                      <div key={app.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{app.name}</h4>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            app.status === 'hired' ? 'bg-green-100 text-green-800' :
                            app.status === 'shortlisted' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{app.skill} • {app.experience}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {app.rating}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Skills in Demand</h3>
                  <div className="space-y-3">
                    {['Masonry', 'Electrical', 'Plumbing', 'Carpentry', 'Painting'].map((skill, index) => (
                      <div key={skill} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{skill}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{15 - index * 2} applications</span>
                          <button className="text-blue-600 hover:text-blue-700 text-sm">View</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cost & Payroll */}
          {activeTab === 'payroll' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Cost & Payroll</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Generate Payroll
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Process Payouts
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">₹{stats.totalWages.toLocaleString()}</div>
                  <div className="text-blue-600 font-medium">Total Wages</div>
                  <div className="text-sm text-blue-500 mt-1">This month</div>
                </div>
                <div className="p-6 bg-yellow-50 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">₹{stats.overtimeCost.toLocaleString()}</div>
                  <div className="text-yellow-600 font-medium">Overtime Cost</div>
                  <div className="text-sm text-yellow-500 mt-1">12% of total</div>
                </div>
                <div className="p-6 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">₹{stats.absenteeismCost.toLocaleString()}</div>
                  <div className="text-red-600 font-medium">Absenteeism Cost</div>
                  <div className="text-sm text-red-500 mt-1">6.4% of total</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Wage Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Daily Wages</span>
                      <span className="font-medium">₹{Math.round(stats.totalWages * 0.7).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: '70%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overtime</span>
                      <span className="font-medium">₹{stats.overtimeCost.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-yellow-500" style={{ width: '12%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Bonuses</span>
                      <span className="font-medium">₹{Math.round(stats.totalWages * 0.08).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: '8%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Payouts</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Rajesh Kumar', amount: 8500, status: 'completed' },
                      { name: 'Suresh Patel', amount: 7200, status: 'pending' },
                      { name: 'Amit Singh', amount: 9100, status: 'completed' }
                    ].map((payout, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{payout.name}</p>
                          <p className="text-sm text-gray-600">₹{payout.amount.toLocaleString()}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          payout.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payout.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Risk & Compliance */}
          {activeTab === 'compliance' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Risk & Compliance</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    Compliance Report
                  </button>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Safety Training
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.kycVerified}%</div>
                  <div className="text-sm text-green-600">KYC Verified</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.ppeCompliant}%</div>
                  <div className="text-sm text-blue-600">PPE Compliant</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.safetyTrained}%</div>
                  <div className="text-sm text-purple-600">Safety Trained</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{stats.insured}%</div>
                  <div className="text-sm text-indigo-600">Insured</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">KYC Verification</span>
                      </div>
                      <span className="text-green-600 font-medium">{stats.kycVerified}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">PPE Compliance</span>
                      </div>
                      <span className="text-blue-600 font-medium">{stats.ppeCompliant}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-purple-500 mr-2" />
                        <span className="font-medium">Safety Training</span>
                      </div>
                      <span className="text-purple-600 font-medium">{stats.safetyTrained}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="font-medium">Insurance Coverage</span>
                      </div>
                      <span className="text-indigo-600 font-medium">{stats.insured}%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Alerts</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                        <span className="font-medium text-yellow-800">PPE Compliance Low</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">12 workers need PPE refresh</p>
                    </div>
                    
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <span className="font-medium text-red-800">Safety Training Expiring</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">8 workers need retraining</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium text-blue-800">KYC Verification Pending</span>
                      </div>
                      <p className="text-sm text-blue-700 mt-1">5 workers need verification</p>
                    </div>
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

export default EmployerDashboard;
