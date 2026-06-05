import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { MdBalance } from "react-icons/md";
import legal2 from "../../assets/legal-2.jpeg";
import LawyerNavbar from "./LawyerNav.jsx";
import GrowingPage from "./GrowingPage.jsx";

function LawyerHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully ");
    navigate("/lawyer/login");
  };

  return (
    <>
      <LawyerNavbar />
      <section className="relative h-[820px] flex items-center justify-center text-center overflow-hidden">
        {" "}
        <img
          src={legal2}
          alt="Legal"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-white max-w-3xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold italic whitespace-nowrap">
            Defending Rights, Delivering Justice
          </h1>

          <p className="mt-3 text-sm italic text-gray-200 whitespace-nowrap">
            Justice is not just about winning cases, it is about protecting
            rights, ensuring fairness and standing for the truth when it matters
            the most.
          </p>
          <br />
          <br />

          <p className="mt-6 text-gray-200 text-sm">
            Complete your lawyer verification process by submitting the required
            professional details and documents to activate your profile, build
            client trust, and access all lawyer features on the platform.
          </p>

          <div className="mt-6">
            {user?.verificationStatus === "approved" ? (
              <button
                onClick={() => navigate("/lawyer/dashboard")}
                className="bg-green-700 px-6 py-2 rounded-md hover:bg-green-800 transition"
              >
                Go To Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate("/lawyer/verification")}
                className="bg-indigo-700 px-6 py-2 rounded-md hover:bg-indigo-800 transition"
              >
                Verification Form
              </button>
            )}
          </div>
        </div>
      </section>
      <GrowingPage />
    </>
  );
}

export default LawyerHome;
