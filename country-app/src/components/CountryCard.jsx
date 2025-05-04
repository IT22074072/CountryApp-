import React from "react";
import { useNavigate } from "react-router-dom";

const CountryCard = ({ country, onFavorite, isFavorite }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // For example, with window.location or your routing system
    navigate(`/country/${country.cca3}`);
  };

  return (
    <div 
      className="group relative overflow-hidden bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer w-full max-w-sm"
      onClick={handleCardClick}
      data-testid="country-card"
    >
      {/* Flag image with overlay gradient */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
        <img
          src={country.flags.png}
          alt={`${country.name.common} flag`}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Country info positioned over the image */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
          <h3 className="text-xl font-bold tracking-tight mb-1">
            {country.name.common}
          </h3>
          <p className="text-sm font-medium opacity-90">
            {country.region} {country.capital && `· ${country.capital[0]}`}
          </p>
        </div>
        
        {/*  Favorite Button Logic */}
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation(); // prevents card click from firing
              e.nativeEvent.stopImmediatePropagation();
              onFavorite(country);
            }}
            className={`p-2 rounded-full bg-white/80 backdrop-blur-sm 
              ${isFavorite ? "text-red-500" : "text-gray-400"} 
              hover:scale-110 transition-all duration-300 shadow-md`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {/* Heart icons will be provided by whatever icon system you're using */}
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
      
      {/* Additional country info below the image */}
      <div className="p-4 pt-3">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Pop: {country.population?.toLocaleString()}</span>
          <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{country.cca3}</span>
        </div>
      </div>
    </div>
  );
};

export default CountryCard;