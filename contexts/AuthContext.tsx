"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { loginUser, registerUser } from "@/lib/api/auth";
import type {
  AuthContextType,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

function setCookie(name: string, value: string, days: number = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stored auth data on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading stored auth data:", error);
      // Clear corrupted data
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
            setIsLoading(true);
            setError(null);
        
            try {
              const response = await loginUser(credentials);
        
              if (response.data?.token) {
                const userData: User = {
                  id: credentials.username,
                  username: credentials.username,
                  email: credentials.username,
                };
        
                setToken(response.data.token);
                setUser(userData);
        
                localStorage.setItem(TOKEN_KEY, response.data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(userData));
                setCookie(TOKEN_KEY, response.data.token);
        
                // Wait a brief moment to ensure cookie is set
                await new Promise(resolve => setTimeout(resolve, 100));
              } else {
                throw new Error(response.message || "Login failed");
              }
            } catch (error: any) {
              const errorMessage = error.message || "Login failed. Please try again.";
              setError(errorMessage);
              throw error;
            } finally {
              setIsLoading(false);
            }
          };
;
;

  const register = async (credentials: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerUser(credentials);

      if (response.data?.token) {
        const userData: User = {
          id: credentials.username,
          username: credentials.username,
          email: credentials.email,
        };

        setToken(response.data.token);
        setUser(userData);

        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        setCookie(TOKEN_KEY, response.data.token);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    deleteCookie(TOKEN_KEY);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
