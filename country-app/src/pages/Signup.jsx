import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "http://localhost:3000";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/home");
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <motion.div className="p-10 bg-white/90 border-2 border-indigo-300 rounded-3xl w-96">
        <h2 className="mb-4 text-3xl font-bold text-center text-indigo-700">
          ✨ Join the Journey
        </h2>
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
          />
          <input
            className="w-full px-4 py-3 mb-4 border border-indigo-300 rounded-full"
            type="email"
            placeholder="Choose an email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full px-4 py-3 mb-4 border border-indigo-300 rounded-full"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-3 text-white bg-indigo-600 rounded-full hover:bg-indigo-800"
          >
            Sign Up 🌍
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 underline"
          >
            Log in
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
