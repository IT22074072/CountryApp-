import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { FaMapMarkerAlt, FaGlobeAmericas } from "react-icons/fa";
import {
  fetchAllCountries,
  fetchCountryByName,
  fetchCountriesByRegion,
} from "../services/countryService";
import CountryCard from "../components/CountryCard";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../services/favoriteService";

const ITEMS_PER_PAGE = 20;

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [visibleCountries, setVisibleCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
  const [currentIndex, setCurrentIndex] = useState(ITEMS_PER_PAGE);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadCountries();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setIsAuthenticated(true);
      fetchFavorites();
    } else {
      setIsAuthenticated(false);
    }
  };

  const loadCountries = async () => {
    try {
      const result = await fetchAllCountries();
      setCountries(result);
      setVisibleCountries(result.slice(0, ITEMS_PER_PAGE));
      setCurrentIndex(ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to load countries. Please try again later.");
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        const result = await fetchCountryByName(searchTerm);
        setCountries(result);
        setVisibleCountries(result.slice(0, ITEMS_PER_PAGE));
        setCurrentIndex(ITEMS_PER_PAGE);
      } catch (err) {
        setCountries([]);
        setVisibleCountries([]);
        toast.info("No countries found with that name.");
      }
    } else {
      loadCountries();
    }
  };

  const handleRegionChange = async (e) => {
    const selectedRegion = e.target.value;
    setRegion(selectedRegion);
    if (selectedRegion) {
      try {
        const result = await fetchCountriesByRegion(selectedRegion);
        setCountries(result);
        setVisibleCountries(result.slice(0, ITEMS_PER_PAGE));
        setCurrentIndex(ITEMS_PER_PAGE);
      } catch (err) {
        setCountries([]);
        setVisibleCountries([]);
        toast.info("No countries found in that region.");
      }
    } else {
      loadCountries();
    }
  };

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const favorites = await getUserFavorites();
      setFavoriteCountries(favorites || []);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);

      // Check more robustly for a 401 Unauthorized
      const status = error.response?.status;

      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        toast.info("Your session has expired. Please log in again.", {
          position: "top-center",
          autoClose: 3000,
          onClose: () => navigate("/login"),
        });
      } else {
        toast.error("Failed to load favorites. Please try again later.");
      }
    }
  };

  const handleFavorite = async (country) => {
    if (!isAuthenticated) {
      toast.error(
        "You need to be logged in to save favorites. Please log in first!",
        {
          position: "top-center",
          autoClose: 2000,
          onClose: () => navigate("/login"),
        }
      );
      return;
    }

    const countryCode = country.cca3;
    const isFavorite = favoriteCountries.some(
      (fav) => fav.countryId === countryCode
    );

    try {
      if (isFavorite) {
        await removeFromFavorites(countryCode);
        setFavoriteCountries(
          favoriteCountries.filter((fav) => fav.countryId !== countryCode)
        );
        toast.success("Removed from favorites!");
      } else {
        // Log for debugging
        console.log("Attempting to add country to favorites:", {
          countryCode,
          countryName: country.name.common,
        });

        await addToFavorites(countryCode);
        setFavoriteCountries([
          ...favoriteCountries,
          { countryId: countryCode },
        ]);
        toast.success("Added to favorites!");
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);

      if (err.message?.includes("401") || err.statusCode === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        toast.info("Your session has expired. Please log in again.");
        navigate("/login");
      } else if (err.message?.includes("500")) {
        // Handle 500 server error - more specific message
        toast.error(
          "Server error when updating favorites. The server might be experiencing issues."
        );
        console.error("Server error details:", err.message);
      } else {
        toast.error("Failed to update favorites. Please try again later.");
      }
    }
  };

  const loadMore = () => {
    const nextIndex = currentIndex + ITEMS_PER_PAGE;
    const nextCountries = countries.slice(0, nextIndex);
    setVisibleCountries(nextCountries);
    setCurrentIndex(nextIndex);
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />

      {/* Hero Section */}
      <div
        className="px-6 md:px-20 pt-20 pb-24 min-h-[300px] text-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?width=1200')",
        }}
      >
        <link
          rel="preload"
          href="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          as="image"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center text-5xl md:text-6xl text-purple-500 mb-4 animate-pulse">
            <FaGlobeAmericas />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-100 ">
            Explore the World
          </h1>
          <p className="mt-2 text-gray-300 text-base md:text-lg">
            Discover countries by name or region
          </p>

          <div className="flex flex-col items-center justify-center mt-8 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex items-center p-1 bg-white rounded-full shadow-md w-full max-w-md transition duration-300 hover:shadow-xl">
              <FaMapMarkerAlt className="ml-3 text-primary text-sm md:text-base" />
              <input
                type="text"
                placeholder="Enter country name"
                className="flex-1 px-2 md:px-4 py-2 text-sm md:text-base outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button
                onClick={handleSearch}
                className="px-3 py-2 md:px-5 md:py-2 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-md hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 flex-shrink-0"
              >
                Search
              </button>
            </div>

            {/* Filter */}
            <select
              value={region}
              onChange={handleRegionChange}
              className="px-4 py-2 text-sm bg-white border border-purple-300 rounded-xl shadow-md outline-none focus:ring-2 focus:ring-purple-400 transition-transform duration-300 transform hover:scale-105 w-72 md:w-auto"
            >
              <option value="">All Regions</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
        </div>
      </div>

      {/* Country Cards */}
      <div className="px-6 md:px-20 py-12 bg-white">
        <h2 className="mb-6 text-2xl font-bold text-primary text-center md:text-left">
          Countries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleCountries.length > 0 ? (
            visibleCountries.map((country) => (
              <CountryCard
                key={country.cca3}
                country={country}
                onFavorite={() => handleFavorite(country)}
                isFavorite={Boolean(
                  favoriteCountries?.some(
                    (fav) => fav.countryId === country.cca3
                  )
                )}
              />
            ))
          ) : (
            <p className="text-center col-span-full">No countries found.</p>
          )}
        </div>

        {/* Load More */}
        {currentIndex < countries.length && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-700 transition-transform duration-300 transform hover:scale-105"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
