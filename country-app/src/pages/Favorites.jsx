import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';
import { getUserFavorites, removeFromFavorites } from '../services/favoriteService'; 
import CountryCard from '../components/CountryCard';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import 'react-toastify/dist/ReactToastify.css';

const FavoritePage = () => {
  const [favoriteEntries, setFavoriteEntries] = useState([]);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      loadFavorites();
    }
  }, [navigate]);
  

  const loadFavorites = async () => {
    try {
      const favorites = await getUserFavorites(); // [{ countryId: "LKR", ... }, { countryId: "GRC", ... }]
      setFavoriteEntries(favorites);

      const countryCodes = favorites.map(fav => fav.countryId).join(',');
      if (countryCodes) {
        const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${countryCodes}`);
        const data = await res.json();
        setFavoriteCountries(data);
      } else {
        setFavoriteCountries([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleRemoveFavorite = async (countryId) => {
    try {
      await removeFromFavorites(countryId); // assumes backend uses countryId
      toast.success('Country removed from favorites!');
      loadFavorites(); // reload after removal
    } catch (error) {
      toast.error('Error removing country from favorites!');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <ToastContainer />
      <div className="px-20 py-12 bg-white">
        <h1 className="text-center text-3xl font-bold text-purple-500 mb-6">
          Your Favorite Countries
        </h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteCountries.length > 0 ? (
            favoriteCountries.map((country) => (
              <div key={country.cca3} className="relative">
                <CountryCard
                  country={country}
                  // clicking the heart removes it from favorites
                  onFavorite={() => handleRemoveFavorite(country.cca3)}
                  // since already on the favorites page, it’s always “favorited”
                  isFavorite={true}
                />
                
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">No favorites added yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FavoritePage;
