import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
});

// Add request interceptor to include auth token
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const register = async (userData) => {
  try {
    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneNumber: userData.phonenumber,
      bankName: userData.bankname,
      bankBranch: userData.bankbranch,
      bankAccountNo: userData.bankaccountno,
      password: userData.password,
    };

    const response = await API.post("/users/signup", payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (email, password) => {
  try {
    const response = await API.post("/users/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProfile = async () => {
  try {
    const response = await API.get("/users/profile");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
