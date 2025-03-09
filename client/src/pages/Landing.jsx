import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUsers, FiVideo, FiMessageSquare, FiArrowRight } from 'react-icons/fi';

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className={`fixed w-full z-10 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-indigo-600 text-2xl font-bold">Co<span className="text-teal-500">AI</span></span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-slate-700 hover:text-indigo-600 transition">Features</a>
            <a href="#how-it-works" className="text-slate-700 hover:text-indigo-600 transition">How It Works</a>
            <a href="#pricing" className="text-slate-700 hover:text-indigo-600 transition">Pricing</a>
          </div>
          <div>
            <button 
              onClick={handleGoogleSignIn}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            Collaborate with AI, <span className="text-indigo-600">Together</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            Search once, get results from multiple AI services. Collaborate in real-time with team members using built-in WebRTC.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleGoogleSignIn}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg text-lg flex items-center justify-center gap-2"
            >
              Get Started <FiArrowRight />
            </button>
            <a 
              href="#demo"
              className="px-8 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition shadow-md text-lg"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24 bg-white px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-16">
            All-in-One <span className="text-indigo-600">AI Platform</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <FiSearch className="text-2xl text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Multi-AI Search</h3>
              <p className="text-slate-600">Search once and receive results from multiple AI services to compare and choose from.</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <FiUsers className="text-2xl text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Team Collaboration</h3>
              <p className="text-slate-600">Work together with your team in real-time on AI-powered projects and tasks.</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FiVideo className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">WebRTC Integration</h3>
              <p className="text-slate-600">Connect via high-quality voice and video calls directly within the platform.</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FiMessageSquare className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Co-Prompting</h3>
              <p className="text-slate-600">Collaborate on AI prompts in real-time to achieve better results together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-slate-50 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-16">
            How <span className="text-indigo-600">CoAI</span> Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Sign In</h3>
              <p className="text-slate-600">Use Google authentication to quickly access your collaborative workspace.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Create or Join</h3>
              <p className="text-slate-600">Start a new project or join an existing collaborative AI workspace.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Collaborate</h3>
              <p className="text-slate-600">Search across AI services, communicate via WebRTC, and work together in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-indigo-600 to-purple-600 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Ready to Transform Your AI Experience?
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Join CoAI today and experience the power of collaborative artificial intelligence.
          </p>
          <button 
            onClick={handleGoogleSignIn}
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition shadow-lg text-lg font-medium"
          >
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-800 text-slate-300 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-white text-2xl font-bold">Co<span className="text-teal-400">AI</span></span>
              <p className="mt-2">The collaborative AI platform for teams</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="text-white font-semibold mb-3">Platform</h4>
                <ul className="space-y-2">
                  <li><a href="#features" className="hover:text-white transition">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                  <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#about" className="hover:text-white transition">About</a></li>
                  <li><a href="#blog" className="hover:text-white transition">Blog</a></li>
                  <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#terms" className="hover:text-white transition">Terms</a></li>
                  <li><a href="#privacy" className="hover:text-white transition">Privacy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} CoAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;