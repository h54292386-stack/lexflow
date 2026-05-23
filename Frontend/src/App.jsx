import { BrowserRouter, Routes, Route } from "react-router-dom";
import Unauthorized from "./pages/Unauthorized.jsx";
import { Toaster } from "react-hot-toast";

import BasicDetails from "./pages/client/BasicDetails.jsx";
import Features from "./pages/client/Features.jsx";
import About from "./pages/client/About.jsx";
import VerifyOTP from "./components/otp.jsx";

// client
import HowItWorks from "./pages/client/HowItWork.jsx";
import Login from "./pages/client/Login.jsx";
import Register from "./pages/client/Register.jsx";
import Home from "./pages/client/Home.jsx";
import CreateCase from "./pages/client/CreateCase.jsx";
import LawyerList from "./pages/client/LawyerSelect.jsx";
import LawyerDetails from "./pages/client/LawyerDetails.jsx";
import CasesPage from "./pages/client/Cases.jsx";
import CaseDetails from "./pages/client/CaseDetails.jsx";
import Chat from "./pages/client/Chat.jsx";
import Profile from "./pages/client/Profile.jsx";
import CompleteProfile from "./pages/client/CompleteProfile.jsx";
import Welcome from "./pages/client/Welcome.jsx";
import ChangePassword from "./pages/client/ChangePassword.jsx";

// lawyer
import LawyerRegister from "./pages/lawyer/Register.jsx";
import LawyerLogin from "./pages/lawyer/Login.jsx";
import LawyerHome from "./pages/lawyer/Home.jsx";
import LawyerWelcome from "./pages/lawyer/Welcome.jsx";
import LawyerCompleteProfile from "./pages/lawyer/CompleteProfile.jsx";



// admin
import AdminLogin from "./pages/admin/Login.jsx";
import AdminHome from "./pages/admin/Home.jsx";




function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<BasicDetails />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />


         {/* client */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/howitworking" element={<HowItWorks />} />
        <Route path="/createCase" element={<CreateCase />} />
        <Route path="/lawyers" element={<LawyerList />} />
        <Route path="/lawyerDetails/:id" element={<LawyerDetails />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/case/:caseId" element={<CaseDetails />} />
        <Route path="/chat/:lawyerId?" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />


        {/* lawyer */}
        <Route path="/lawyer/register" element={<LawyerRegister />} />
        <Route path="/lawyer/login" element={<LawyerLogin />} />
        <Route path="/lawyer/welcome" element={<LawyerWelcome />} />
        <Route path="/lawyer/complete-profile" element={<LawyerCompleteProfile />} />
        <Route path="/lawyer/home" element={<LawyerHome />} />



        {/* admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />



        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen text-xl">
              404 - Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
