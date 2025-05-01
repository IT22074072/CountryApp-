import {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
} from "../../services/favoriteService";

const BASE_URL = "http://localhost:3000/api/favorites";
const mockToken = "fake-token";
const mockCountryId = "USA";

beforeEach(() => {
  // Mock localStorage
  Storage.prototype.getItem = jest.fn(() => mockToken);
  // Mock fetch
  global.fetch = jest.fn();
  // Mock console
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("API Service", () => {
  describe("getUserFavorites", () => {
    it("successfully fetches favorites", async () => {
      const mockData = [{ id: 1 }];
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const result = await getUserFavorites();
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${mockToken}`,
          "Content-Type": "application/json",
        },
      });
    });

    it("handles 401 unauthorized error", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      await expect(getUserFavorites()).rejects.toThrow(
        "401 Unauthorized: Your session has expired"
      );
    });

    it("handles missing token", async () => {
      Storage.prototype.getItem = jest.fn(() => null);

      await expect(getUserFavorites()).rejects.toThrow(
        "No authentication token found"
      );
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("addToFavorites", () => {
    it("successfully adds favorite", async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await addToFavorites(mockCountryId);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mockToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ countryCode: mockCountryId }),
      });
      expect(console.log).toHaveBeenCalledWith(
        "Adding to favorites with data:",
        { countryId: mockCountryId }
      );
    });

    it("handles error with server message", async () => {
      const errorMessage = "Country not found";
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      await expect(addToFavorites(mockCountryId)).rejects.toThrow(
        `Error 404: ${errorMessage}`
      );
    });
  });

  describe("removeFromFavorites", () => {
    it("successfully removes favorite", async () => {
      const mockResponse = { success: true };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await removeFromFavorites(mockCountryId);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${mockToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ countryCode: mockCountryId }),
      });
    });

    it("handles network error", async () => {
      fetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(removeFromFavorites(mockCountryId)).rejects.toThrow(
        "Network error"
      );
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("error handling edge cases", () => {
    it("handles invalid JSON response", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Server Error",
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(getUserFavorites()).rejects.toThrow(
        "Error 500: Server Error"
      );
    });

    it("handles empty error response", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: () => Promise.resolve({}),
      });

      await expect(addToFavorites(mockCountryId)).rejects.toThrow(
        "Error 400: {}"
      );
    });
  });
});
