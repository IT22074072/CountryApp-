import {
  fetchAllCountries,
  fetchCountryByName,
  fetchCountriesByRegion,
  fetchAllDetailsByCode,
} from "../../services/countryService";

const BASE_URL = "https://restcountries.com/v3.1";

// Mock the global fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe("API Service", () => {
  const mockResponse = (data, ok = true) => ({
    ok,
    json: () => Promise.resolve(data),
  });

  describe("fetchAllCountries", () => {
    it("should fetch all countries", async () => {
      const mockData = [{ name: "Country1" }, { name: "Country2" }];
      fetch.mockResolvedValue(mockResponse(mockData));

      const result = await fetchAllCountries();

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/all`);
      expect(result).toEqual(mockData);
    });
  });

  describe("fetchCountryByName", () => {
    it("should fetch country by name", async () => {
      const countryName = "Germany";
      const mockData = [{ name: countryName }];
      fetch.mockResolvedValue(mockResponse(mockData));

      const result = await fetchCountryByName(countryName);

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/name/${countryName}`);
      expect(result).toEqual(mockData);
    });

    it("should handle special characters in name", async () => {
      const countryName = "Côte d'Ivoire";
      const encodedName = encodeURIComponent(countryName);
      fetch.mockResolvedValue(mockResponse([]));

      await fetchCountryByName(countryName);

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/name/${encodedName}`);
    });
  });

  describe("fetchCountriesByRegion", () => {
    it("should fetch countries by region", async () => {
      const region = "Europe";
      const mockData = [{ region: "Europe" }];
      fetch.mockResolvedValue(mockResponse(mockData));

      const result = await fetchCountriesByRegion(region);

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/region/${region}`);
      expect(result).toEqual(mockData);
    });
  });

  describe("fetchAllDetailsByCode", () => {
    it("should fetch country details by lowercase code", async () => {
      const code = "US";
      const mockData = [{ name: "United States" }];
      fetch.mockResolvedValue(mockResponse(mockData));

      const result = await fetchAllDetailsByCode(code);

      expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/alpha/us`);
      expect(result).toEqual(mockData);
    });
  });

  describe("Error Handling", () => {
    it("should throw error when response is not ok", async () => {
      const errorMessage = "Not Found";
      fetch.mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage),
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      await expect(fetchCountryByName("invalid-country")).rejects.toThrow(
        errorMessage
      );
    });

    it("should handle non-text error responses", async () => {
      fetch.mockResolvedValue({
        ok: false,
        text: () => Promise.reject(new Error("No error text")),
        status: 500,
      });

      await expect(fetchAllCountries()).rejects.toThrow(
        "HTTP error! status: 500"
      );
    });
  });
});
