import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { MdBalance } from "react-icons/md";
import legal2 from "../../assets/legal-2.jpeg";
import ClientNavbar from "./ClientNav.jsx";
import HowItWorks from "./HowItWork.jsx";
import CreateCase from "./CreateCase.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    sessionStorage.removeItem("caseDraft");
    sessionStorage.removeItem("caseId");
    logout();
    toast.success("Logged out successfully ");
    navigate("/login");
  };

  return (
    <>
    
     <ClientNavbar />
      <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden">
      
      <img
        src={legal2}
        alt="Legal"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 text-white max-w-3xl px-4">
        
        <h1 className="text-4xl md:text-5xl font-bold italic">
          We fight for your justice
        </h1>
        <br />

        <p className="mt-3 text-sm italic text-gray-200">
          Justice is not just about winning cases, it is about protecting rights,
          ensuring fairness and standing for the truth when it matters the most.
        </p>
        <br/><br />

        <p className="mt-6 text-gray-200 text-sm">
          Track your legal cases, communicate with your lawyers, and manage all
          your legal documents in one place.
        </p>

        <button  
          onClick={
            () => navigate("/createCase")
          }
          className="mt-6 bg-indigo-700 px-6 py-2 rounded-md hover:bg-indigo-800 transition">
          Register New Case →
        </button>

      </div>
    </section>    
    <HowItWorks showBackButton={false}/>
    </>
  )
};

export default Home;