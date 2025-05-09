import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { FaGlobeAmericas, FaUsers, FaSearchLocation } from "react-icons/fa";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-b from-purple-500 to-indigo-600 overflow-hidden flex items-center">
        {/* Centered Animated Background World Map */}
        <motion.img
          src="/images/world-map.png"
          alt="World Map"
          className="absolute inset-0 m-auto w-full max-w-5xl opacity-20 pointer-events-none"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 2 }}
        />

        {/* Floating Globe Icon */}
        <motion.div
          className="absolute top-1/4 left-10 text-white text-4xl"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FaGlobeAmericas />
        </motion.div>

        {/* Floating Location Icon */}
        <motion.div
          className="absolute bottom-20 right-16 text-white text-4xl"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <FaSearchLocation />
        </motion.div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Discover the World Like Never Before
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Explore countries, learn about cultures, and connect with the world
            around you.
          </motion.p>

          <motion.button
            onClick={() => navigate("/home")}
            className="px-8 py-4 text-lg font-semibold bg-white text-purple-700 rounded-full shadow-md hover:bg-purple-100 transition"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            whileHover={{ scale: 1.1, backgroundColor: "#ede9fe" }}
          >
            Start Exploring
          </motion.button>

          <motion.div
            className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <button
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/20 text-white border border-white/30 backdrop-blur-md rounded-full font-medium shadow-lg hover:bg-white/30 hover:shadow-xl transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m12 0l-4-4m4 4l-4 4m10 4v-1a3 3 0 00-3-3H9a3 3 0 00-3 3v1"/></svg>
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-full font-medium shadow-lg hover:bg-purple-100 hover:shadow-xl transition duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Sign Up
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-purple-800 mb-16">
            Why Choose GeoPortal?
          </h2>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center p-8 shadow-lg rounded-2xl hover:shadow-xl transition">
              <FaGlobeAmericas className="text-5xl text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Global Discovery</h3>
              <p className="text-gray-600">
                Access detailed information about every country, its culture,
                languages, and unique facts.
              </p>
            </div>

            <div className="text-center p-8 shadow-lg rounded-2xl hover:shadow-xl transition">
              <FaUsers className="text-5xl text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Connect & Share</h3>
              <p className="text-gray-600">
                Save your favorite countries, share discoveries with friends,
                and celebrate cultural diversity.
              </p>
            </div>

            <div className="text-center p-8 shadow-lg rounded-2xl hover:shadow-xl transition">
              <FaSearchLocation className="text-5xl text-purple-600 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Smart Search</h3>
              <p className="text-gray-600">
                Filter countries by region, language, or population and explore
                the world the way you want.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-purple-800 mb-16">
            What Our Users Say
          </h2>

          <div className="grid gap-12 md:grid-cols-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <p className="text-gray-700 mb-6">
                "World Explorer opened my eyes to cultures I had never even
                heard about. The design is beautiful and easy to use!"
              </p>
              <h4 className="text-purple-700 font-semibold">
                — Jennie, Travel Blogger
              </h4>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <p className="text-gray-700 mb-6">
                "As a student, this app helped me in my geography project. I
                loved the clean UI and quick information access!"
              </p>
              <h4 className="text-purple-700 font-semibold">
                — Sanjana, University Student
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default LandingPage;