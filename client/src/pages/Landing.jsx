import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../redux/slices/authSlice";

import Overview from "../components/landing/Overview";
import Features from "../components/landing/Features";
import Purpose from "../components/landing/Purpose";
import Socials from "../components/landing/Socials";
import Home from "../components/landing/Home";
import Navbar from "../components/landing/Navbar";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-[url('./assets/landing.png')]">
      {/* Navigation */}
      <Navbar isScrolled={isScrolled} setAuthDialogOpen={setAuthDialogOpen} />

      {/* Hero Section */}
      <Home setAuthDialogOpen={setAuthDialogOpen} authDialogOpen={authDialogOpen} />

      {/* Overview Section */}
      <Overview setAuthDialogOpen={setAuthDialogOpen} />

      {/* Features Section */}
      <Features />

      {/* Why CoAI Section */}
      <Purpose />

      {/* Socials Section */}
      <Socials />

      {/* Footer Section */}
      <footer className="py-10 bg-black/60 backdrop-blur-[1px] border-t border-gray-900">
        <div className="container mx-auto px-6 text-center">
          <p className="font-Krona text-gray-400 text-xs">
            © {new Date().getFullYear()} CoAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
