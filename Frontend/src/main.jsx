import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx';
import "./index.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>
    <Toaster position="top-right" />
    </AuthProvider>
  </StrictMode>,
)
