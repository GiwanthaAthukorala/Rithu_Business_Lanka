import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProfile } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadUser = async () => {
    try {
      // Only attempt to load user if we have a token
      if (typeof window !== "undefined" && localStorage.getItem("token")) {
        const userData = await getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (userData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", userData.token);
    }
    await loadUser(); // Wait for user data to be loaded
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
