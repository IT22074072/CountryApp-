import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CountryCard from "../../components/CountryCard";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("CountryCard", () => {
  const country = {
    cca3: "USA",
    flags: { png: "https://flagcdn.com/us.png" },
    name: { common: "United States" },
    region: "Americas",
  };

  beforeEach(() => {
    mockNavigate.mockClear(); // Clear mock between tests
  });

  const renderCard = (isFavorite = false, onFavorite = jest.fn()) =>
    render(
      <CountryCard
        country={country}
        isFavorite={isFavorite}
        onFavorite={onFavorite}
      />
    );

  it("renders image, name, region, and the correct heart icon", () => {
    renderCard(false);
    const img = screen.getByRole("img", { name: /united states/i });
    expect(img).toHaveAttribute("src", country.flags.png);
    expect(screen.getByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Americas")).toBeInTheDocument();
    expect(screen.getByLabelText(/add to favorites/i)).toBeInTheDocument();
  });

  it("renders filled heart when isFavorite=true", () => {
    renderCard(true);
    expect(screen.getByLabelText(/remove from favorites/i)).toBeInTheDocument();
  });

  it("navigates to the detail page when card is clicked", () => {
    renderCard();
    fireEvent.click(screen.getByText("United States"));
    expect(mockNavigate).toHaveBeenCalledWith("/country/USA");
  });

  it("calls onFavorite and stops propagation when heart button is clicked", () => {
    const onFavorite = jest.fn();
    renderCard(false, onFavorite);

    const button = screen.getByRole("button", { name: /add to favorites/i });
    fireEvent.click(button);

    expect(onFavorite).toHaveBeenCalledWith(country);
    expect(mockNavigate).not.toHaveBeenCalled(); // Check navigation wasn't triggered
  });
});
