import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance, { AUTH_LOGOUT_EVENT, AUTH_USER_KEY } from "./axiosinstance";

// Create AuthContext
const AuthContext = createContext();

const loadUser = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USER_KEY));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  // Only non-sensitive info is stored; the tokens are httpOnly cookies
  const [user, setUser] = useState(loadUser);

  // Call with the backend's login / OTP-verify / Google-login response data
  const login = useCallback((data) => {
    const email = data.email_address;
    const nextUser = {
      email,
      username: data.profile?.first_name || email?.split("@")[0] || "",
    };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem("gmail_access_token");
    sessionStorage.clear(); // chat histories belong to this user
    queryClient.clear(); // don't show this user's data to the next one
    setUser(null);
  }, [queryClient]);

  // Logout: ask the backend to clear the httpOnly cookies
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("api/auth/logout/");
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    clearSession();
  }, [clearSession]);

  // The axios instance fires this when the session can't be refreshed
  useEffect(() => {
    window.addEventListener(AUTH_LOGOUT_EVENT, clearSession);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, clearSession);
  }, [clearSession]);

  const auth = { email: user?.email || null, username: user?.username || null };
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
