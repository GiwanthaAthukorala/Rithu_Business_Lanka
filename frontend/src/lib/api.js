import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if we get 401 response
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      console.error("Unauthorized request - token cleared");
    }
    return Promise.reject(error);
  }
);

export const register = async (userData) => {
  try {
    const response = await API.post("/users/signup", {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      bankName: userData.bankName,
      bankBranch: userData.bankBranch,
      bankAccountNo: userData.bankAccountNo,
      password: userData.password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw (
      error.response?.data?.message || error.message || "Registration failed"
    );
  }
};

export const login = async (email, password) => {
  try {
    const response = await API.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data?.message || error.message || "Login failed";
  }
};

export const getProfile = async () => {
  try {
    // Only attempt on client side
    if (typeof window === "undefined") {
      throw new Error("Cannot fetch profile on server side");
    }

    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await API.get("/users/profile");
    return response.data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch profile"
    );
  }
};
