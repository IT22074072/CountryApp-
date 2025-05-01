import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAllDetailsByCode } from "../services/countryService";
import {
  FaGlobe,
  FaMapMarkerAlt,
  FaUserFriends,
  FaLanguage,
  FaMoneyBill,
  FaArrowLeft, // Import the arrow icon
} from "react-icons/fa";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const CountryDetails = () => {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const result = await fetchAllDetailsByCode(code);
        setCountry(result[0]);
        console.log(result);
      } catch (err) {
        console.error("Error fetching country details:", err);
      }
    };

    getDetails();
  }, [code]);

  if (!country)
    return (
      <div className="p-10 text-center text-lg font-semibold text-primary">
        Loading...
      </div>
    );

  return (
    <div>
      <Navbar />
      <div
        className="min-h-screen bg-fixed bg-[url('/assets/world-pattern.svg')] bg-white/30 px-4 md:px-12 lg:px-24 py-16"
        style={{ backgroundBlendMode: "overlay" }}
      >
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-10">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-700 transition-transform duration-300 transform hover:scale-105"
          >
            <FaArrowLeft className="inline mr-2" /> Back
          </button>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Flag */}
            <div className="w-full lg:w-[40%]">
              <img
                src={country.flags.png}
                alt={country.name.common}
                className="w-full h-60 object-cover rounded-2xl shadow-lg"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-purple-700">
                {country.name.common}
              </h1>
              <p className="text-gray-600 italic text-lg">
                "{country.name.official}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-base text-gray-800">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-purple-500" />
                  <p>
                    <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-green-500" />
                  <p>
                    <strong>Region:</strong> {country.region}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaGlobe className="text-blue-500" />
                  <p>
                    <strong>Subregion:</strong> {country.subregion || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaUserFriends className="text-orange-500" />
                  <p>
                    <strong>Population:</strong>{" "}
                    {country.population.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaLanguage className="text-rose-500" />
                  <p>
                    <strong>Languages:</strong>{" "}
                    {Object.values(country.languages || {}).join(", ")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaMoneyBill className="text-yellow-500" />
                  <p>
                    <strong>Currencies:</strong>{" "}
                    {Object.values(country.currencies || {})
                      .map((c) => c.name)
                      .join(", ")}
                  </p>
                </div>
              </div>

              {/* Country Code */}
              <div className="pt-4">
                <span className="inline-block px-5 py-2 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">
                  Country Code: {code}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default CountryDetails;
