import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "../../pages/Login";
import { useNavigate } from "react-router-dom";

// Mock external dependencies
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.spyOn(window, "alert").mockImplementation(() => {});
jest.spyOn(Storage.prototype, "setItem");

describe("Login Component", () => {
  const mockNavigate = jest.fn();
  const mockToken = "fake-jwt-token";
  const mockUser = { id: 1, email: "test@example.com" };

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
    axios.post.mockReset();
    window.alert.mockClear();
    mockNavigate.mockClear();
    localStorage.setItem.mockClear();
  });

  test("renders login form with all elements", () => {
    render(<Login />);

    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login 🚀/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  test("successful login navigates to home and stores token", async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: mockToken, user: mockUser },
    });

    render(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login 🚀/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/api/auth/login",
        {
          email: "test@example.com",
          password: "password123",
        }
      );
      expect(localStorage.setItem).toHaveBeenCalledWith("token", mockToken);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(mockUser)
      );
      expect(mockNavigate).toHaveBeenCalledWith("/home");
    });
  });

  test("failed login shows error alert", async () => {
    const errorMessage = "Invalid credentials";
    axios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /login /i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        `Login failed: ${errorMessage}`
      );
    });
  });

  test("clicking signup navigates to signup page", () => {
    render(<Login />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });

  test("renders floating flags with animations", () => {
    render(<Login />);

    const flags = screen.getAllByRole("img", { name: "flag" });
    expect(flags.length).toBe(13); // Matches flagList length

    flags.forEach((flag) => {
      expect(flag).toHaveClass("flag-floating");
      expect(flag).toHaveAttribute("src");
    });
  });

  test("renders background elements", () => {
    render(<Login />);

    expect(screen.getByAltText("globe")).toBeInTheDocument();
    expect(screen.getByText("✈️ Welcome Explorer")).toBeInTheDocument();
    expect(
      screen.getByText(/discover the world through a purple lens/i)
    ).toBeInTheDocument();
  });
});
