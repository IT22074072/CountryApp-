const API_URL = "http://localhost:3000";

// Helper function to get authorization header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Modify getUserFavorites to preserve error messages
export const getUserFavorites = async () => {
  try {
    const headers = getAuthHeader();
    const response = await fetch(`${API_URL}/api/favorites/all`, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized: Your session has expired');
      }
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GET favorites failed:', error);
    throw error; // Re-throw original error instead of creating new one
  }
};

export const addToFavorites = async (countryId) => {
  try {
    const headers = getAuthHeader();
    
    // Log the request data for debugging
    console.log('Adding to favorites with data:', { countryId });
    
    // Send countryCode instead of countryId to match backend expectations
    const response = await fetch(`${API_URL}/api/favorites/add`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ countryCode: countryId })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized: Your session has expired');
      }
      
      // Try to get more detailed error information from the response
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        // If we can't parse JSON, use the status text
        errorDetail = response.statusText;
      }
      
      throw new Error(`Error ${response.status}: ${errorDetail}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to add favorite:', error);
    throw error;
  }
};

export const removeFromFavorites = async (countryId) => {
  try {
    const headers = getAuthHeader();
    
    // Match the backend expectation - send as JSON in body instead of URL param
    const response = await fetch(`${API_URL}/api/favorites/remove`, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify({ countryCode: countryId })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized: Your session has expired');
      }
      
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = errorData.message || JSON.stringify(errorData);
      } catch (e) {
        errorDetail = response.statusText;
      }
      
      throw new Error(`Error ${response.status}: ${errorDetail}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    throw error;
  }
};