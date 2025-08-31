import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Award, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Camera,
  Upload,
  Download,
  Eye,
  Filter,
  Search,
  UserCheck,
  Building,
  Phone,
  MessageCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Settings,
  Lock,
  Globe,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSafety = () => {
  const [activeTab, setActiveTab] = useState('kyc');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  
  const [kycData] = useState([
    {
      id: 1,
      userId: 'WK001',
      userName: 'Rajesh Kumar',
      userType: 'worker',
      documentType: 'Aadhaar Card',
      documentNumber: 'XXXX-XXXX-1234',
      status: 'verified',
      submitted: '2024-01-10',
      verified: '2024-01-12',
      verifiedBy: 'Admin User',
      documentImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      userId: 'EMP001',
      userName: 'ABC Construction',
      userType: 'employer',
      documentType: 'Business License',
      documentNumber: 'BL-2024-001',
      status: 'pending',
      submitted: '2024-01-15',
      verified: null,
      verifiedBy: null,
      documentImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      userId: 'WK002',
      userName: 'Suresh Patel',
      userType: 'worker',
      documentType: 'PAN Card',
      documentNumber: 'ABCDE1234F',
      status: 'rejected',
      submitted: '2024-01-08',
      verified: null,
      verifiedBy: null,
      documentImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ]);

  const [skillBadges] = useState([
    {
      id: 1,
      badgeName: 'Safety First',
      description: 'Completed safety training and certification',
      icon: '🛡️',
      category: 'Safety',
      requirements: ['Safety Training', 'Equipment Knowledge', 'Test Passed'],
      issuedCount: 1245,
      verifiedWorkers: 1180
    },
    {
      id: 2,
      badgeName: 'Skill Master',
      description: 'Advanced skill level in primary trade',
      icon: '🏆',
      category: 'Skills',
      requirements: ['5+ Years Experience', 'Portfolio Review', 'Reference Check'],
      issuedCount: 890,
      verifiedWorkers: 845
    },
    {
      id: 3,
      badgeName: 'Reliability Pro',
      description: 'Consistent attendance and quality work',
      icon: '⭐',
      category: 'Performance',
      requirements: ['95%+ Attendance', '4.5+ Rating', 'No Complaints'],
      issuedCount: 567,
      verifiedWorkers: 523
    }
  ]);

  const [insuranceData] = useState([
    {
      id: 1,
      workerId: 'WK001',
      workerName: 'Rajesh Kumar',
      policyType: 'Personal Accident',
      provider: 'LIC Insurance',
      policyNumber: 'PA-2024-001',
      coverage: '₹500,000',
      premium: '₹500/month',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      documents: ['Policy Document', 'Premium Receipt']
    },
    {
      id: 2,
      workerId: 'WK002',
      workerName: 'Suresh Patel',
      policyType: 'Health Insurance',
      provider: 'HDFC Health',
      policyNumber: 'HI-2024-002',
      coverage: '₹300,000',
      premium: '₹800/month',
      status: 'pending',
      startDate: '2024-02-01',
      endDate: '2025-01-31',
      documents: ['Application Form']
    }
  ]);

  const [disputes] = useState([
    {
      id: 1,
      disputeId: 'DISP-001',
      type: 'Payment Dispute',
      description: 'Worker claims non-payment for completed work',
      status: 'investigating',
      priority: 'high',
      reportedBy: 'Rajesh Kumar',
      reportedDate: '2024-01-15',
      assignedTo: 'Support Team',
      lastUpdated: '2024-01-16'
    },
    {
      id: 2,
      disputeId: 'DISP-002',
      type: 'Work Quality',
      description: 'Employer dissatisfied with work quality',
      status: 'resolved',
      priority: 'medium',
      reportedBy: 'ABC Construction',
      reportedDate: '2024-01-10',
      assignedTo: 'Support Team',
      lastUpdated: '2024-01-14'
    }
  ]);

  const [stats] = useState({
    totalVerifications: 12450,
    verifiedUsers: 11800,
    pendingVerifications: 650,
    rejectedVerifications: 120,
    activeBadges: 15,
    totalBadgesIssued: 4560,
    insuredWorkers: 8900,
    activeDisputes: 23,
    resolvedDisputes: 156
  });

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

  const KYCItem = ({ item }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <img 
          src={item.documentImage} 
          alt={item.userName}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div>
          <h4 className="font-medium text-gray-900">{item.userName}</h4>
          <p className="text-sm text-gray-600">{item.userType} • {item.documentType}</p>
          <p className="text-xs text-gray-500">Submitted {item.submitted}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          item.status === 'verified' ? 'bg-green-100 text-green-800' :
          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {item.status}
        </span>
        <button className="p-2 text-gray-400 hover:text-gray-600">
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const BadgeCard = ({ badge }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{badge.icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{badge.badgeName}</h3>
          <p className="text-sm text-gray-600">{badge.description}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-2">
          {badge.category}
        </span>
        <p className="text-sm text-gray-700 mb-3">{badge.description}</p>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900">Requirements:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {badge.requirements.map((req, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>Issued: {badge.issuedCount}</span>
        <span>Verified: {badge.verifiedWorkers}</span>
      </div>
      
      <div className="mt-4 flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Issue Badge
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const InsuranceItem = ({ item }) => (
    <div className="border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{item.workerName}</h3>
          <p className="text-gray-600">{item.policyType} • {item.provider}</p>
          <p className="text-sm text-gray-500">Policy: {item.policyNumber}</p>
        </div>
        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
          item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {item.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Coverage</p>
          <p className="font-medium">{item.coverage}</p>
        </div>
        <div>
          <p className="text-gray-500">Premium</p>
          <p className="font-medium">{item.premium}</p>
        </div>
        <div>
          <p className="text-gray-500">Start Date</p>
          <p className="font-medium">{item.startDate}</p>
        </div>
        <div>
          <p className="text-gray-500">End Date</p>
          <p className="font-medium">{item.endDate}</p>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          {item.status === 'active' ? 'Renew Policy' : 'Activate Policy'}
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const DisputeItem = ({ dispute }) => (
    <div className={`p-4 rounded-lg border-l-4 ${
      dispute.priority === 'high' ? 'bg-red-50 border-red-400' :
      dispute.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
      'bg-blue-50 border-blue-400'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{dispute.disputeId}</h4>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              dispute.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {dispute.status}
            </span>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              dispute.priority === 'high' ? 'bg-red-100 text-red-800' :
              dispute.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {dispute.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{dispute.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>Reported by: {dispute.reportedBy}</span>
            <span>Date: {dispute.reportedDate}</span>
            <span>Assigned to: {dispute.assignedTo}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <MessageCircle className="h-4 w-4" />
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
              <h1 className="text-2xl font-bold text-gray-900">Trust & Safety</h1>
              <p className="text-gray-600">Platform security and verification management</p>
            </div>
            <div className="flex space-x-3">
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Verified Users"
            value={`${stats.verifiedUsers.toLocaleString()}/${stats.totalVerifications.toLocaleString()}`}
            icon={UserCheck}
            color="bg-green-500"
            subtitle={`${Math.round((stats.verifiedUsers / stats.totalVerifications) * 100)}% verified`}
          />
          <StatCard
            title="Active Badges"
            value={stats.activeBadges}
            icon={Award}
            color="bg-blue-500"
            subtitle={`${stats.totalBadgesIssued.toLocaleString()} issued`}
          />
          <StatCard
            title="Insured Workers"
            value={stats.insuredWorkers.toLocaleString()}
            icon={Shield}
            color="bg-purple-500"
            subtitle="Coverage active"
          />
          <StatCard
            title="Active Disputes"
            value={stats.activeDisputes}
            icon={AlertTriangle}
            color="bg-red-500"
            subtitle={`${stats.resolvedDisputes} resolved`}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton id="kyc" label="KYC Verification" icon={UserCheck} isActive={activeTab === 'kyc'} />
            <TabButton id="badges" label="Skill Badges" icon={Award} isActive={activeTab === 'badges'} />
            <TabButton id="insurance" label="Insurance" icon={Shield} isActive={activeTab === 'insurance'} />
            <TabButton id="disputes" label="Dispute Resolution" icon={MessageCircle} isActive={activeTab === 'disputes'} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* KYC Verification Tab */}
          {activeTab === 'kyc' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">KYC Verification Queue</h2>
                <div className="flex space-x-2">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="worker">Workers</option>
                    <option value="employer">Employers</option>
                  </select>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Bulk Verify
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {kycData.map(item => (
                  <KYCItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">KYC Verification Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div>
                    <p className="font-medium">1. Document Upload</p>
                    <p>Users upload identity documents</p>
                  </div>
                  <div>
                    <p className="font-medium">2. Manual Review</p>
                    <p>Admin team verifies documents</p>
                  </div>
                  <div>
                    <p className="font-medium">3. Verification</p>
                    <p>Status updated and user notified</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skill Badges Tab */}
          {activeTab === 'badges' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Skill Badge Management</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2 inline" />
                    Filter
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Award className="h-4 w-4 mr-2 inline" />
                    Create Badge
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {skillBadges.map(badge => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900 mb-2">Badge Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                  <div>
                    <p className="font-medium">🏆 Recognition</p>
                    <p>Showcase skills and achievements</p>
                  </div>
                  <div>
                    <p className="font-medium">💰 Higher Wages</p>
                    <p>Badge holders earn 15-25% more</p>
                  </div>
                  <div>
                    <p className="font-medium">🎯 Job Priority</p>
                    <p>Get selected for premium jobs first</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Insurance Tab */}
          {activeTab === 'insurance' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Insurance Management</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2 inline" />
                    Filter
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Shield className="h-4 w-4 mr-2 inline" />
                    Enroll Worker
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Building className="h-4 w-4 mr-2 inline" />
                    Partner Insurance
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {insuranceData.map(item => (
                  <InsuranceItem key={item.id} item={item} />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900 mb-2">Insurance Coverage Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700">
                  <div>
                    <p className="font-medium">🛡️ Personal Accident</p>
                    <p>Coverage for work-related injuries</p>
                  </div>
                  <div>
                    <p className="font-medium">🏥 Health Insurance</p>
                    <p>Medical coverage for workers</p>
                  </div>
                  <div>
                    <p className="font-medium">🏗️ Work Equipment</p>
                    <p>Protection for tools and equipment</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dispute Resolution Tab */}
          {activeTab === 'disputes' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Dispute Resolution</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2 inline" />
                    Filter
                  </button>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    <AlertTriangle className="h-4 w-4 mr-2 inline" />
                    Report Issue
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {disputes.map(dispute => (
                  <DisputeItem key={dispute.id} dispute={dispute} />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-2">Dispute Resolution Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-yellow-700">
                  <div>
                    <p className="font-medium">1. Report</p>
                    <p>Issue reported by user</p>
                  </div>
                  <div>
                    <p className="font-medium">2. Investigation</p>
                    <p>Support team investigates</p>
                  </div>
                  <div>
                    <p className="font-medium">3. Mediation</p>
                    <p>Parties discuss resolution</p>
                  </div>
                  <div>
                    <p className="font-medium">4. Resolution</p>
                    <p>Issue resolved and closed</p>
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

export default TrustSafety;
