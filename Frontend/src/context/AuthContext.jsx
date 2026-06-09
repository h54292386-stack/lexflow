import { createContext, useContext, useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "../socket.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
 const [user, setUser] = useState(() => {
  try {
    const savedUser = sessionStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
      return null;
    }

    return JSON.parse(savedUser);

  } catch (error) {
    console.error("Invalid user data in sessionStorage");

    sessionStorage.removeItem("user");

    return null;
  }
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
    }else {
    // Reconnect socket on page reload
    const s = connectSocket(token);
    setSocket(s);
  }

    setLoading(false);
  }, []);

const login = (userData, token) => {
  sessionStorage.setItem("accessToken", token);
  sessionStorage.setItem("user", JSON.stringify(userData));
  sessionStorage.setItem("role", userData.role);  // ← ADD THIS LINE

  setUser(userData);

  const s = connectSocket(token);
  setSocket(s);
};

 const logout = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("caseDraft");
  sessionStorage.removeItem("role");

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