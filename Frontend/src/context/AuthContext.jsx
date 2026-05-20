import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../socket.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
 const [user, setUser] = useState(() => {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
      return null;
    }

    return JSON.parse(savedUser);

  } catch (error) {
    console.error("Invalid user data in localStorage");

    localStorage.removeItem("user");

    return null;
  }
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
    }

    setLoading(false);
  }, []);

const login = (userData, token) => {
  localStorage.setItem("accessToken", token);
  localStorage.setItem("user", JSON.stringify(userData));

  setUser(userData);

  const s = connectSocket(token);
  setSocket(s);
};

 const logout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("caseDraft");

disconnectSocket();
setSocket(null);
setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};