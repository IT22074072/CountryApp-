import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = "https://country-app-theta-five.vercel.app";

const flagList = [
  "https://flagcdn.com/w80/fr.png",
  "https://flagcdn.com/w80/jp.png",
  "https://flagcdn.com/w80/gb.png",
  "https://flagcdn.com/w80/br.png",
  "https://flagcdn.com/w80/in.png",
  "https://flagcdn.com/w80/de.png",
  "https://flagcdn.com/w80/ca.png",
  "https://flagcdn.com/w80/lk.png",
  "https://flagcdn.com/w80/au.png",
  "https://flagcdn.com/w80/it.png",
  "https://flagcdn.com/w80/ru.png",
  "https://flagcdn.com/w80/cn.png",
  "https://flagcdn.com/w80/kr.png",
];

const random = (min, max) => Math.floor(Math.random() * (max - min) + min);

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });

      // Show success toast
      toast.success("Account created successfully! Redirecting to login...");
      
      // Delay navigation to allow toast to be visible
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      // Show error toast
      toast.error("Signup failed: " + (err.response?.data?.message || err.message));
      setIsLoading(false);
    }
  };

  const floatingFlags = useMemo(() => {
    return flagList.map((src) => ({
      src,
      size: 50,
      top: random(0, 90),
      left: random(0, 90),
      duration: random(20, 40),
      delay: random(0, 10),
    }));
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-r from-purple-500 to-indigo-600">
      {/* Background Globe */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg"
          alt="globe"
          className="w-[700px] animate-spin-slow opacity-20"
        />
      </div>

      {/* Floating Flags */}
      {floatingFlags.map((flag, index) => (
        <img
          key={index}
          src={flag.src}
          alt="flag"
          className="absolute flag-floating"
          style={{
            top: `${flag.top}%`,
            left: `${flag.left}%`,
            width: `${flag.size}px`,
            height: `${flag.size}px`,
            animationDuration: `${flag.duration}s`,
            animationDelay: `${flag.delay}s`,
          }}
        />
      ))}

      {/* Toast Container */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 p-10 bg-white/90 backdrop-blur-lg border-2 border-indigo-300 rounded-3xl w-96 shadow-2xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-3xl font-bold text-center text-indigo-700"
        >
          Join the Journey
        </motion.h2>

        <p className="mb-6 text-sm text-center text-gray-600">
          Sign up to start saving your favorite countries!
        </p>

        <form onSubmit={handleSignup}>
          <input
            className="w-full px-4 py-3 mb-4 border border-indigo-300 rounded-full"
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            className="w-full px-4 py-3 mb-4 border border-indigo-300 rounded-full"
            type="email"
            placeholder="Choose an email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            className="w-full px-4 py-3 mb-4 border border-indigo-300 rounded-full"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength="6"
          />
          <button
            type="submit"
            className="w-full py-3 text-white bg-indigo-600 rounded-full hover:bg-indigo-800 disabled:bg-indigo-400"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up 🌍"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 underline"
            disabled={isLoading}
          >
            Log in
          </button>
        </p>
      </motion.div>

      {/* Custom styles */}
      <style>{`
        @keyframes floatRandom {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.7; }
          25% { transform: translate(-40px, 50px) rotate(90deg); }
          50% { transform: translate(60px, -30px) rotate(180deg); }
          75% { transform: translate(-50px, 20px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); opacity: 0.7; }
        }

        .flag-floating {
          border-radius: 50%;
          animation-name: floatRandom;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          opacity: 0.7;
          pointer-events: none;
        }

        .animate-spin-slow {
          animation: spin 60s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Signup;