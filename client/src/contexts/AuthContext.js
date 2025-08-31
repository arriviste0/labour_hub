import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_TOKEN: 'SET_TOKEN',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  error: null
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case AUTH_ACTIONS.SET_USER:
      return { ...state, user: action.payload, isLoading: false, error: null };
    
    case AUTH_ACTIONS.SET_TOKEN:
      return { ...state, token: action.payload };
    
    case AUTH_ACTIONS.LOGOUT:
      return { ...state, user: null, token: null, isLoading: false, error: null };
    
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return { ...state, user: { ...state.user, ...action.payload } };
    
    case AUTH_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();

  // Set auth token in API headers
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          const response = await api.get('/auth/me');
          dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
        } catch (error) {
          console.error('Auth check failed:', error);
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, [state.token]);

  // Login with OTP
  const loginWithOTP = async (phone, role) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await api.post('/auth/otp/send', { phone, role });
      
      toast.success('OTP sent successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to send OTP';
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Verify OTP and login
  const verifyOTP = async (phone, otp, role) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await api.post('/auth/otp/verify', { phone, otp, role });
      
      dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: response.data.token });
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
      
      toast.success(response.data.message);
      
      // Redirect based on role
      if (response.data.isNewUser) {
        navigate(`/${role}/profile`);
      } else {
        navigate(`/${role}`);
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to verify OTP';
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Login with password
  const loginWithPassword = async (phone, password, role) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await api.post('/auth/login', { phone, password, role });
      
      dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: response.data.token });
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
      
      toast.success('Login successful!');
      
      // Redirect based on role
      navigate(`/${role}`);
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Set password
  const setPassword = async (password) => {
    try {
      const response = await api.post('/auth/set-password', { password });
      toast.success('Password set successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to set password';
      toast.error(message);
      throw error;
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    navigate('/');
    toast.success('Logged out successfully!');
  };

  // Update user profile
  const updateProfile = (profileData) => {
    dispatch({ type: AUTH_ACTIONS.UPDATE_PROFILE, payload: profileData });
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh-token', { refreshToken });
      
      dispatch({ type: AUTH_ACTIONS.SET_TOKEN, payload: response.data.token });
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: response.data.user });
      
      return response.data;
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user && state.user.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!state.token && !!state.user;
  };

  // Check if profile is complete
  const isProfileComplete = () => {
    return state.user && state.user.profileCompleted >= 80;
  };

  const value = {
    // State
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    loginWithOTP,
    verifyOTP,
    loginWithPassword,
    setPassword,
    logout,
    updateProfile,
    refreshToken,
    
    // Utilities
    hasRole,
    isAuthenticated,
    isProfileComplete
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
