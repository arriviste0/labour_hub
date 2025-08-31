import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  UserCheck,
  UserX,
  FileText,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  
  const [overviewStats] = useState({
    totalWorkers: 12450,
    totalEmployers: 890,
    activeJobs: 2340,
    completedJobs: 15680,
    totalRevenue: 1250000,
    monthlyRevenue: 125000,
    pendingVerifications: 156,
    fraudReports: 23
  });

  const [growthMetrics] = useState({
    workersGrowth: 12.5,
    employersGrowth: 8.2,
    jobsGrowth: 15.7,
    revenueGrowth: 22.3
  });

  const [verificationQueue] = useState([
    { id: 1, name: 'Rajesh Kumar', type: 'worker', document: 'Aadhaar Card', status: 'pending', submitted: '2 hours ago' },
    { id: 2, name: 'ABC Construction', type: 'employer', document: 'Business License', status: 'pending', submitted: '4 hours ago' },
    { id: 3, name: 'Suresh Patel', type: 'worker', document: 'PAN Card', status: 'pending', submitted: '6 hours ago' },
    { id: 4, name: 'PowerTech Solutions', type: 'employer', document: 'GST Certificate', status: 'pending', submitted: '1 day ago' }
  ]);

  const [fraudAlerts] = useState([
    { id: 1, type: 'Duplicate Profile', severity: 'high', description: 'Multiple accounts with same phone number', reported: '1 hour ago', status: 'investigating' },
    { id: 2, type: 'Fake Documents', severity: 'medium', description: 'Suspicious Aadhaar card submission', reported: '3 hours ago', status: 'investigating' },
    { id: 3, type: 'Payment Fraud', severity: 'high', description: 'Unauthorized payment attempt', reported: '5 hours ago', status: 'resolved' }
  ]);

  const [revenueData] = useState([
    { month: 'Jan', revenue: 98000, jobs: 2100, workers: 11800 },
    { month: 'Feb', revenue: 105000, jobs: 2250, workers: 12000 },
    { month: 'Mar', revenue: 112000, jobs: 2400, workers: 12200 },
    { month: 'Apr', revenue: 118000, jobs: 2550, workers: 12350 },
    { month: 'May', revenue: 125000, jobs: 2700, workers: 12450 }
  ]);

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle }) => (
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
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span className={`font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendValue}
          </span>
        </div>
      )}
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

  const VerificationItem = ({ item }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <UserCheck className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{item.name}</h4>
          <p className="text-sm text-gray-600">{item.type} • {item.document}</p>
          <p className="text-xs text-gray-500">Submitted {item.submitted}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
        }`}>
          {item.status}
        </span>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const FraudAlert = ({ alert }) => (
    <div className={`p-4 rounded-lg border-l-4 ${
      alert.severity === 'high' ? 'bg-red-50 border-red-400' :
      alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-400' :
      'bg-blue-50 border-blue-400'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertTriangle className={`h-5 w-5 mt-0.5 ${
            alert.severity === 'high' ? 'text-red-500' :
            alert.severity === 'medium' ? 'text-yellow-500' :
            'text-blue-500'
          }`} />
          <div>
            <h4 className="font-medium text-gray-900">{alert.type}</h4>
            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
            <p className="text-xs text-gray-500 mt-1">Reported {alert.reported}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
            alert.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {alert.status}
          </span>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </button>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Platform overview and management</p>
            </div>
            <div className="flex space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Workers"
            value={overviewStats.totalWorkers.toLocaleString()}
            icon={Users}
            color="bg-blue-500"
            trend="up"
            trendValue={`+${growthMetrics.workersGrowth}%`}
            subtitle="Registered workers"
          />
          <StatCard
            title="Total Employers"
            value={overviewStats.totalEmployers.toLocaleString()}
            icon={Building}
            color="bg-green-500"
            trend="up"
            trendValue={`+${growthMetrics.employersGrowth}%`}
            subtitle="Registered companies"
          />
          <StatCard
            title="Active Jobs"
            value={overviewStats.activeJobs.toLocaleString()}
            icon={Briefcase}
            color="bg-purple-500"
            trend="up"
            trendValue={`+${growthMetrics.jobsGrowth}%`}
            subtitle="Currently open"
          />
          <StatCard
            title="Monthly Revenue"
            value={`₹${(overviewStats.monthlyRevenue / 1000).toFixed(0)}K`}
            icon={DollarSign}
            color="bg-yellow-500"
            trend="up"
            trendValue={`+${growthMetrics.revenueGrowth}%`}
            subtitle="This month"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton id="overview" label="Overview" icon={BarChart3} isActive={activeTab === 'overview'} />
            <TabButton id="verifications" label="Verifications" icon={UserCheck} isActive={activeTab === 'verifications'} />
            <TabButton id="fraud" label="Fraud Monitoring" icon={Shield} isActive={activeTab === 'fraud'} />
            <TabButton id="revenue" label="Revenue Analytics" icon={PieChart} isActive={activeTab === 'revenue'} />
            <TabButton id="users" label="User Management" icon={Users} isActive={activeTab === 'users'} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Platform Overview</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Activity className="h-4 w-4 mr-2 inline" />
                    Real-time Data
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Download Report
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium text-blue-900">New Workers</p>
                          <p className="text-sm text-blue-700">This month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">+{Math.round(overviewStats.totalWorkers * 0.12)}</p>
                        <p className="text-sm text-blue-600">+12.5%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <p className="font-medium text-green-900">New Employers</p>
                          <p className="text-sm text-green-700">This month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">+{Math.round(overviewStats.totalEmployers * 0.08)}</p>
                        <p className="text-sm text-green-600">+8.2%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Job Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-purple-500 mr-3" />
                        <div>
                          <p className="font-medium text-purple-900">Jobs Posted</p>
                          <p className="text-sm text-purple-700">This month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600">+{Math.round(overviewStats.activeJobs * 0.15)}</p>
                        <p className="text-sm text-purple-600">+15.7%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-yellow-500 mr-3" />
                        <div>
                          <p className="font-medium text-yellow-900">Jobs Completed</p>
                          <p className="text-sm text-yellow-700">This month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-yellow-600">+{Math.round(overviewStats.completedJobs * 0.18)}</p>
                        <p className="text-sm text-yellow-600">+18.2%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-red-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                    <h3 className="text-lg font-medium text-red-900">Pending Verifications</h3>
                  </div>
                  <div className="text-3xl font-bold text-red-600">{overviewStats.pendingVerifications}</div>
                  <p className="text-sm text-red-600 mt-1">Require attention</p>
                  <button className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium">
                    Review Queue →
                  </button>
                </div>
                
                <div className="p-6 bg-yellow-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-yellow-500 mr-2" />
                    <h3 className="text-lg font-medium text-yellow-900">Fraud Reports</h3>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{overviewStats.fraudReports}</div>
                  <p className="text-sm text-yellow-600 mt-1">This month</p>
                  <button className="mt-3 text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                    View Alerts →
                  </button>
                </div>
                
                <div className="p-6 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-4">
                    <DollarSign className="h-6 w-6 text-blue-500 mr-2" />
                    <h3 className="text-lg font-medium text-blue-900">Revenue Growth</h3>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">+{growthMetrics.revenueGrowth}%</div>
                  <p className="text-sm text-blue-600 mt-1">vs last month</p>
                  <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View Analytics →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Verifications */}
          {activeTab === 'verifications' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Verification Queue</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2 inline" />
                    Filter
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Bulk Approve
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {verificationQueue.map(item => (
                  <VerificationItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View All Verifications →
                </button>
              </div>
            </div>
          )}

          {/* Fraud Monitoring */}
          {activeTab === 'fraud' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Fraud & Abuse Monitoring</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="h-4 w-4 mr-2 inline" />
                    Settings
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    <AlertTriangle className="h-4 w-4 mr-2 inline" />
                    Report Issue
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">5</div>
                  <div className="text-sm text-red-600">High Priority</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <div className="text-sm text-yellow-600">Medium Priority</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">6</div>
                  <div className="text-sm text-green-600">Resolved</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {fraudAlerts.map(alert => (
                  <FraudAlert key={alert.id} alert={alert} />
                ))}
              </div>
            </div>
          )}

          {/* Revenue Analytics */}
          {activeTab === 'revenue' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Revenue Analytics</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Export Data
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <BarChart3 className="h-4 w-4 mr-2 inline" />
                    Detailed Report
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h3>
                  <div className="space-y-4">
                    {revenueData.map((data, index) => (
                      <div key={data.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{data.month}</span>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{(data.revenue / 1000).toFixed(0)}K</p>
                          <p className="text-sm text-gray-600">{data.jobs} jobs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Sources</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-blue-500 mr-3" />
                        <span className="font-medium text-blue-900">Employer Subscriptions</span>
                      </div>
                      <span className="text-2xl font-bold text-blue-600">65%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-green-500 mr-3" />
                        <span className="font-medium text-green-900">Job Posting Fees</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">25%</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                      <div className="flex items-center">
                        <DollarSign className="h-5 w-5 text-purple-500 mr-3" />
                        <span className="font-medium text-purple-900">Transaction Fees</span>
                      </div>
                      <span className="text-2xl font-bold text-purple-600">10%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">₹{(overviewStats.totalRevenue / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">₹{(overviewStats.monthlyRevenue / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-600">Monthly Average</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">+{growthMetrics.revenueGrowth}%</div>
                    <div className="text-sm text-gray-600">Growth Rate</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Management */}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2 inline" />
                    Filter
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Export Users
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-blue-50 rounded-lg text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{overviewStats.totalWorkers.toLocaleString()}</div>
                  <div className="text-sm text-blue-600">Total Workers</div>
                  <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Manage →
                  </button>
                </div>
                
                <div className="p-6 bg-green-50 rounded-lg text-center">
                  <Building className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{overviewStats.totalEmployers.toLocaleString()}</div>
                  <div className="text-sm text-green-600">Total Employers</div>
                  <button className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium">
                    Manage →
                  </button>
                </div>
                
                <div className="p-6 bg-yellow-50 rounded-lg text-center">
                  <UserCheck className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{overviewStats.pendingVerifications}</div>
                  <div className="text-sm text-yellow-600">Pending Verification</div>
                  <button className="mt-2 text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                    Review →
                  </button>
                </div>
                
                <div className="p-6 bg-red-50 rounded-lg text-center">
                  <UserX className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">{overviewStats.fraudReports}</div>
                  <div className="text-sm text-red-600">Fraud Reports</div>
                  <button className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium">
                    Investigate →
                  </button>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <UserCheck className="h-6 w-6 text-blue-500 mb-2" />
                    <h4 className="font-medium text-gray-900">Bulk Verify Users</h4>
                    <p className="text-sm text-gray-600">Approve multiple verifications</p>
                  </button>
                  
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <Shield className="h-6 w-6 text-green-500 mb-2" />
                    <h4 className="font-medium text-gray-900">Security Settings</h4>
                    <p className="text-sm text-gray-600">Configure fraud detection</p>
                  </button>
                  
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <FileText className="h-6 w-6 text-purple-500 mb-2" />
                    <h4 className="font-medium text-gray-900">Generate Reports</h4>
                    <p className="text-sm text-gray-600">User analytics & insights</p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
