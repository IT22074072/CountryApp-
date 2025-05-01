import React from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CountryCard = ({ country, onFavorite, isFavorite }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  return (
    <div
      className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
      onClick={handleCardClick}
      data-testid="country-card"

    >
      <img
        src={country.flags.png}
        alt={country.name.common}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold text-gray-800">
        {country.name.common}
      </h3>
      <p className="text-sm text-gray-600">{country.region}</p>

      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevents card click from firing
            e.nativeEvent.stopImmediatePropagation();
            onFavorite(country);
          }}
          className={`text-xl ${
            isFavorite ? "text-red-500" : "text-gray-400"
          } hover:scale-110 transition-transform`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
};

export default CountryCard;
