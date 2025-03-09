import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiUser, FiUsers, FiVideo, FiArrowRight, FiSearch } from 'react-icons/fi';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      // Here you would integrate with Google Auth
      // For demonstration, we'll simulate a successful login
      const mockUser = {
        id: '12345',
        name: 'Demo User',
        email: 'demo@example.com',
        picture: 'https://via.placeholder.com/150'
      };
      dispatch(loginSuccess(mockUser));
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Co<span className="text-teal-300">AI</span></h1>
        </div>
        
        <div className="max-w-md">
          <h2 className="text-white text-4xl font-bold mb-6">Collaborate with AI in a whole new way</h2>
          <p className="text-indigo-100 text-lg mb-8">
            Join teams using CoAI to search multiple AI services at once and collaborate in real-time with WebRTC.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 bg-opacity-25 flex items-center justify-center mr-4">
                <FiSearch className="text-white text-xl" />
              </div>
              <p className="text-white">Search multiple AI services with one prompt</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 bg-opacity-25 flex items-center justify-center mr-4">
                <FiUsers className="text-white text-xl" />
              </div>
              <p className="text-white">Collaborate with your team in real-time</p>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-500 bg-opacity-25 flex items-center justify-center mr-4">
                <FiVideo className="text-white text-xl" />
              </div>
              <p className="text-white">Connect via voice and video with WebRTC</p>
            </div>
          </div>
        </div>
        
        <div className="text-indigo-200 text-sm">
          &copy; {new Date().getFullYear()} CoAI. All rights reserved.
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-10">
            <h1 className="text-indigo-600 text-3xl font-bold">Co<span className="text-teal-500">AI</span></h1>
            <p className="text-slate-600 mt-2">Your collaborative AI workspace</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome Back</h2>
            <p className="text-slate-600 mb-8">Sign in to your account to continue</p>
            
            <button 
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition shadow-sm mb-6"
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              Sign in with Google
            </button>
            
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400">or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            <form className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full pl-10 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="block w-full pl-10 py-3 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition shadow-md"
              >
                Sign In
                <FiArrowRight />
              </button>
            </form>
          </div>
          
          <p className="text-center mt-8 text-slate-600">
            Don't have an account?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;