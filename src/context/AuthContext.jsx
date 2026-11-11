import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import api from "../api/client";

const AuthContext = createContext(null);

const extractErrorMessage = (err, fallback) => {
  if (err.response?.data) {
    const data = err.response.data;
    if (data.error?.message) return data.error.message;
    if (typeof data.detail === "string") return data.detail;
    if (typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      if (firstKey) {
        const val = data[firstKey];
        if (Array.isArray(val)) return `${firstKey}: ${val[0]}`;
        if (typeof val === "string") return `${firstKey}: ${val}`;
      }
    }
  }
  return err.message || fallback;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [activeRole, setActiveRole] = useState(null); // 'customer', 'worker', 'org_manager', 'admin'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("ql_user");
    const savedRole = localStorage.getItem("ql_active_role");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setActiveRole(savedRole || parsed.role || "customer");
      } catch {}
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          await fbUser.getIdToken();
        } catch (e) {
          console.warn("Firebase token sync warning", e);
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const persist = (userData, tokens = {}) => {
    if (tokens.access) localStorage.setItem("ql_access", tokens.access);
    if (tokens.refresh) localStorage.setItem("ql_refresh", tokens.refresh);
    if (userData) {
      localStorage.setItem("ql_user", JSON.stringify(userData));
      const role = userData.role || "customer";
      localStorage.setItem("ql_active_role", role);
      setUser(userData);
      setActiveRole(role);
    }
  };

  const clear = () => {
    localStorage.removeItem("ql_access");
    localStorage.removeItem("ql_refresh");
    localStorage.removeItem("ql_user");
    localStorage.removeItem("ql_active_role");
    setUser(null);
    setActiveRole(null);
  };

  // Universal 1-Click Login (no role selection needed from UI)
  const loginWithEmail = async (email, password) => {
    setError(null);
    try {
      const { data } = await api.post("/api/v1/auth/login/", {
        email,
        password,
      });

      // Superusers and Staff automatically get admin role
      const userObj = data.user;
      persist(userObj, { access: data.access, refresh: data.refresh });
      return userObj;
    } catch (err) {
      const msg = extractErrorMessage(
        err,
        "Invalid credentials. Please verify your email and password.",
      );
      setError(msg);
      throw new Error(msg);
    }
  };

  const registerWithEmail = async (payload) => {
    setError(null);
    try {
      const { data } = await api.post("/api/v1/auth/register/", payload);
      persist(data.user, { access: data.access, refresh: data.refresh });
      return data.user;
    } catch (err) {
      const msg = extractErrorMessage(
        err,
        "Registration failed. Check your information.",
      );
      setError(msg);
      throw new Error(msg);
    }
  };

  const loginWithGoogle = async () => {
    setError(null);
    if (!auth) throw new Error("Google authentication is not configured.");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const { data } = await api.post("/api/v1/auth/firebase/", {
        id_token: idToken,
        role: "customer",
      });
      persist(data.user, { access: data.access, refresh: data.refresh });
      return data.user;
    } catch (err) {
      const msg = extractErrorMessage(err, "Google sign-in failed.");
      setError(msg);
      throw new Error(msg);
    }
  };

  // Switch between Customer view and Primary Staff/Org/Admin view
  const switchRole = (newRole) => {
    setActiveRole(newRole);
    localStorage.setItem("ql_active_role", newRole);
  };

  const logout = async () => {
    try {
      if (auth) await firebaseSignOut(auth);
    } catch {}
    clear();
  };

  const updateProfile = (partial) => {
    const next = { ...user, ...partial };
    localStorage.setItem("ql_user", JSON.stringify(next));
    setUser(next);
  };

  const value = {
    user,
    activeRole: activeRole || user?.role || "customer",
    primaryRole: user?.role || "customer",
    switchRole,
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
