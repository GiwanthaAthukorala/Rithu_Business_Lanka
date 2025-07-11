import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  login as apiLogin,
  getProfile,
  register as apiRegister,
} from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const userData = await getProfile(storedToken);
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error("Failed to authenticate with stored token:", error);
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (userData) => {
    setUser(userData.user);
    setToken(userData.token);
    localStorage.setItem("token", userData.token);
    router.push("/profile");
  };

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      if (response.token) {
        setUser({
          id: response._id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          phoneNumber: response.phoneNumber,
          bankName: response.bankName,
          bankBranch: response.bankBranch,
          bankAccountNo: response.bankAccountNo,
        });
        setToken(response.token);
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
