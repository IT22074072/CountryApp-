import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Signup from "../../pages/Signup";

// Mock external dependencies
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });
window.alert = jest.fn();

describe("Signup Component", () => {
  const mockNavigate = jest.fn();
  const mockUser = { id: 1, username: "testuser", email: "test@example.com" };
  const mockToken = "fake-jwt-token";

  beforeEach(() => {
    useNavigate.mockImplementation(() => mockNavigate);
    axios.post.mockReset();
    localStorage.setItem.mockClear();
    mockNavigate.mockReset();
    window.alert.mockClear();
  });

  test("renders signup form correctly", () => {
    render(<Signup />);

    expect(
      screen.getByPlaceholderText("Choose a username")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Choose an email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Create a password")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign Up /i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Already have an account?/i)).toBeInTheDocument();
  });

  test("submits form with valid data", async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: mockToken, user: mockUser },
    });

    render(<Signup />);

    fireEvent.change(screen.getByPlaceholderText("Choose a username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Choose an email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up /i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:3000/api/auth/signup",
        {
          username: "testuser",
          email: "test@example.com",
          password: "Password123!",
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

  test("handles signup failure with server error", async () => {
    const errorMessage = "Email already exists";
    axios.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    render(<Signup />);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText("Choose a username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Choose an email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up /i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        `Signup failed: ${errorMessage}`
      );
    });
  });

  test("handles network errors", async () => {
    const errorMessage = "Network Error";
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    render(<Signup />);

    // Fill required fields
    fireEvent.change(screen.getByPlaceholderText("Choose a username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Choose an email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Create a password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Sign Up /i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        `Signup failed: ${errorMessage}`
      );
    });
  });
});
