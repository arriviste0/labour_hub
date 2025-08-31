import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Camera, 
  Clock, 
  DollarSign, 
  Download, 
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  Smartphone,
  CreditCard,
  Banknote,
  Eye,
  Filter,
  Search,
  RefreshCw,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

const AttendancePayout = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [scanning, setScanning] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedWorker, setSelectedWorker] = useState('all');
  
  const [attendanceData] = useState([
    {
      id: 1,
      workerId: 'WK001',
      workerName: 'Rajesh Kumar',
      date: '2024-01-15',
      checkIn: '08:00',
      checkOut: '17:00',
      totalHours: 9,
      status: 'present',
      location: 'Site A',
      verified: true
    },
    {
      id: 2,
      workerId: 'WK002',
      workerName: 'Suresh Patel',
      date: '2024-01-15',
      checkIn: '08:15',
      checkOut: '17:30',
      totalHours: 9.25,
      status: 'present',
      location: 'Site A',
      verified: true
    },
    {
      id: 3,
      workerId: 'WK003',
      workerName: 'Amit Singh',
      date: '2024-01-15',
      checkIn: '08:30',
      checkOut: '16:45',
      totalHours: 8.25,
      status: 'present',
      location: 'Site B',
      verified: true
    },
    {
      id: 4,
      workerId: 'WK004',
      workerName: 'Vikram Sharma',
      date: '2024-01-15',
      checkIn: null,
      checkOut: null,
      totalHours: 0,
      status: 'absent',
      location: 'Site A',
      verified: false
    }
  ]);

  const [payoutData] = useState([
    {
      id: 1,
      workerId: 'WK001',
      workerName: 'Rajesh Kumar',
      totalDays: 22,
      dailyWage: 800,
      overtimeHours: 8,
      overtimeRate: 100,
      totalAmount: 18400,
      status: 'pending',
      paymentMethod: 'UPI',
      upiId: 'rajesh@paytm'
    },
    {
      id: 2,
      workerId: 'WK002',
      workerName: 'Suresh Patel',
      totalDays: 20,
      dailyWage: 900,
      overtimeHours: 5,
      overtimeRate: 100,
      totalAmount: 18500,
      status: 'completed',
      paymentMethod: 'UPI',
      upiId: 'suresh@phonepe'
    },
    {
      id: 3,
      workerId: 'WK003',
      workerName: 'Amit Singh',
      totalDays: 21,
      dailyWage: 850,
      overtimeHours: 12,
      overtimeRate: 100,
      totalAmount: 18900,
      status: 'pending',
      paymentMethod: 'UPI',
      upiId: 'amit@googlepay'
    }
  ]);

  const [workers] = useState([
    { id: 'WK001', name: 'Rajesh Kumar', skill: 'Masonry', dailyWage: 800 },
    { id: 'WK002', name: 'Suresh Patel', skill: 'Electrical', dailyWage: 900 },
    { id: 'WK003', name: 'Amit Singh', skill: 'Plumbing', dailyWage: 850 },
    { id: 'WK004', name: 'Vikram Sharma', skill: 'Carpentry', dailyWage: 750 }
  ]);

  const [stats] = useState({
    totalWorkers: 45,
    presentToday: 38,
    absentToday: 7,
    totalHours: 342,
    averageHours: 9.0,
    totalWages: 125000,
    pendingPayouts: 3,
    completedPayouts: 42
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

  const AttendanceRow = ({ attendance }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.workerId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attendance.workerName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.date}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {attendance.checkIn ? attendance.checkIn : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {attendance.checkOut ? attendance.checkOut : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {attendance.totalHours > 0 ? `${attendance.totalHours}h` : '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          attendance.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {attendance.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.location}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        {attendance.verified ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
      </td>
    </tr>
  );

  const PayoutRow = ({ payout }) => (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.workerId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.workerName}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.totalDays}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payout.dailyWage}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.overtimeHours}h</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{payout.totalAmount.toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          payout.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {payout.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.paymentMethod}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Process
        </button>
      </td>
    </tr>
  );

  const ScanSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Worker Check-In/Check-Out</h3>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setScanning(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <QrCode className="h-5 w-5 mr-2" />
            Scan QR Code
          </button>
          <button className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Camera className="h-5 w-5 mr-2" />
            Face Recognition
          </button>
        </div>

        {scanning && (
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 rounded-lg p-8 mb-4">
              <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Scanning QR Code...</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setScanning(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel Scan
            </button>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p>• Workers can check in/out using QR codes or face recognition</p>
          <p>• Location and timestamp are automatically recorded</p>
          <p>• Real-time attendance tracking for all sites</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Attendance & Payout</h1>
              <p className="text-gray-600">Manage worker attendance and process payments</p>
            </div>
            <div className="flex space-x-3">
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Present Today"
            value={`${stats.presentToday}/${stats.totalWorkers}`}
            icon={Users}
            color="bg-green-500"
            subtitle={`${stats.averageHours}h average`}
          />
          <StatCard
            title="Total Hours"
            value={stats.totalHours}
            icon={Clock}
            color="bg-blue-500"
            subtitle="Worked today"
          />
          <StatCard
            title="Total Wages"
            value={`₹${(stats.totalWages / 1000).toFixed(0)}K`}
            icon={DollarSign}
            color="bg-yellow-500"
            subtitle="This month"
          />
          <StatCard
            title="Pending Payouts"
            value={stats.pendingPayouts}
            icon={AlertCircle}
            color="bg-red-500"
            subtitle="Require processing"
          />
        </div>

        {/* Check-In/Check-Out Section */}
        <ScanSection />

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex space-x-2 overflow-x-auto">
            <TabButton id="attendance" label="Attendance" icon={Clock} isActive={activeTab === 'attendance'} />
            <TabButton id="payout" label="Payouts" icon={DollarSign} isActive={activeTab === 'payout'} />
            <TabButton id="analytics" label="Analytics" icon={BarChart3} isActive={activeTab === 'analytics'} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Attendance Log</h2>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={selectedWorker}
                    onChange={(e) => setSelectedWorker(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Workers</option>
                    {workers.map(worker => (
                      <option key={worker.id} value={worker.id}>{worker.name}</option>
                    ))}
                  </select>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceData.map(attendance => (
                      <AttendanceRow key={attendance.id} attendance={attendance} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payout Tab */}
          {activeTab === 'payout' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Wage Payouts</h2>
                <div className="flex space-x-2">
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="h-4 w-4 mr-2 inline" />
                    Filter
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Generate Payroll
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Smartphone className="h-4 w-4 mr-2 inline" />
                    Bulk UPI Payout
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Wage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overtime</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payoutData.map(payout => (
                      <PayoutRow key={payout.id} payout={payout} />
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">UPI Payout Instructions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
                  <div>
                    <p className="font-medium">1. Generate Payroll</p>
                    <p>Calculate wages including overtime and deductions</p>
                  </div>
                  <div>
                    <p className="font-medium">2. Verify UPI IDs</p>
                    <p>Ensure all worker UPI IDs are correct</p>
                  </div>
                  <div>
                    <p className="font-medium">3. Process Payouts</p>
                    <p>Send UPI payment links to workers</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Attendance Analytics</h2>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                  </select>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4 mr-2 inline" />
                    Export Report
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Trends</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-500 mr-3" />
                        <div>
                          <p className="font-medium text-green-900">Attendance Rate</p>
                          <p className="text-sm text-green-700">This month</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">84.4%</p>
                        <p className="text-sm text-green-600">+2.1% vs last month</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-blue-500 mr-3" />
                        <div>
                          <p className="font-medium text-blue-900">Average Hours</p>
                          <p className="text-sm text-blue-700">Per worker per day</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">8.9h</p>
                        <p className="text-sm text-blue-600">+0.3h vs last month</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Site Performance</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Site A</span>
                        <span className="text-sm text-gray-600">32 workers</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-green-500" style={{ width: '92%' }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">92% attendance rate</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Site B</span>
                        <span className="text-sm text-gray-600">13 workers</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full bg-yellow-500" style={{ width: '77%' }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">77% attendance rate</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <FileText className="h-6 w-6 text-blue-500 mb-2" />
                    <h4 className="font-medium text-gray-900">Generate Report</h4>
                    <p className="text-sm text-gray-600">Create attendance summary</p>
                  </button>
                  
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <Smartphone className="h-6 w-6 text-green-500 mb-2" />
                    <h4 className="font-medium text-gray-900">Send Reminders</h4>
                    <p className="text-sm text-gray-600">Notify absent workers</p>
                  </button>
                  
                  <button className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors text-left">
                    <BarChart3 className="h-6 w-6 text-purple-500 mb-2" />
                    <h4 className="font-medium text-gray-900">View Insights</h4>
                    <p className="text-sm text-gray-600">Performance analytics</p>
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

export default AttendancePayout;
