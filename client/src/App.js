import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import WorkerDashboard from './pages/WorkerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Marketplace from './pages/Marketplace';
import AttendancePayout from './pages/AttendancePayout';
import TrustSafety from './pages/TrustSafety';
import JobList from './pages/jobs/JobList';
import JobDetail from './pages/jobs/JobDetail';
import PostJob from './pages/employer/PostJob';
import WorkerProfile from './pages/worker/WorkerProfile';
import EmployerProfile from './pages/employer/EmployerProfile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Styles
import './index.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/attendance-payout" element={<AttendancePayout />} />
                  <Route path="/trust-safety" element={<TrustSafety />} />
                  <Route path="/jobs" element={<JobList />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Worker Routes */}
                  <Route 
                    path="/worker/*" 
                    element={
                      <ProtectedRoute role="worker">
                        <Routes>
                          <Route path="/" element={<WorkerDashboard />} />
                          <Route path="/profile" element={<WorkerProfile />} />
                        </Routes>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Employer Routes */}
                  <Route 
                    path="/employer/*" 
                    element={
                      <ProtectedRoute role="employer">
                        <Routes>
                          <Route path="/" element={<EmployerDashboard />} />
                          <Route path="/profile" element={<EmployerProfile />} />
                          <Route path="/post-job" element={<PostJob />} />
                        </Routes>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute role="admin">
                        <Routes>
                          <Route path="/" element={<AdminDashboard />} />
                        </Routes>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
