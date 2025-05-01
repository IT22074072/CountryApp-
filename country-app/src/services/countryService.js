const BASE_URL = 'https://restcountries.com/v3.1';

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorText = '';
    try {
      errorText = await response.text();
    } catch (e) {
      errorText = `HTTP error! status: ${response.status}`;
    }
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const fetchCountryByName = async (name) => {
  const encodedName = encodeURIComponent(name);
  const response = await fetch(`${BASE_URL}/name/${encodedName}`);
  return handleResponse(response);
};

export const fetchAllDetailsByCode = async (code) => {
  const lowerCode = code.toLowerCase();
  const response = await fetch(`${BASE_URL}/alpha/${lowerCode}`);
  return handleResponse(response);
};

export const fetchAllCountries = async () => {
  const response = await fetch(`${BASE_URL}/all`);
  return handleResponse(response);
};

export const fetchCountriesByRegion = async (region) => {
  const response = await fetch(`${BASE_URL}/region/${region}`);
  return handleResponse(response);
};
