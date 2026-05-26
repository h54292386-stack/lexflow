import { useState } from "react";
import Footer from "../../components/Footer.jsx";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    id: 1,
    title: "Create Case",
    desc: "Register your legal case with all necessary details",
  },
  {
    id: 2,
    title: "Assign Lawyer",
    desc: "Connect with qualified lawyers for your case",
  },
  {
    id: 3,
    title: "Track Progress",
    desc: "Monitor case progress with real-time updates",
  },
  {
    id: 4,
    title: "Manage Documents",
    desc: "Securely share and manage case documents",
  },
  {
    id: 5,
    title: "Complete Case",
    desc: "Successfully close cases with full documentation",
  },
];

export default function HowItWorks({ showBackButton = true }) {
  const [active, setActive] = useState(1);
    const navigate = useNavigate();
  

  return (
    <>
      <section className="bg-gray-100 py-20 px-6">
              
                {showBackButton && (
                <button
                  onClick={() => navigate("/home")}
                  className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black"
                >
                  <FaArrowLeft className="w-4 h-4 text-gray-500 hover:text-black transition" />
                </button>
              )}
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
            How It Works
          </h2>
          <p className="text-gray-500 mt-2">
            Simple steps to get started
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          
          <div className="hidden md:block absolute top-10 left-0 right-0 h-[3px] bg-gray-300"></div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 relative">
            
            {steps.map((step) => {
              const isActive = active === step.id;

              return (
                <div
                  key={step.id}
                  onMouseEnter={() => setActive(step.id)}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  
                  <div
                    className={`w-20 h-20 flex items-center justify-center rounded-full text-lg font-semibold z-10 transition-all duration-300
                      ${
                        isActive
                          ? "bg-[#000000] text-white scale-110 shadow-xl"
                          : "bg-[#000000]/80 text-white group-hover:scale-105"
                      }
                    `}
                  >
                    {step.id}
                  </div>

                  <h3
                    className={`mt-4 font-semibold transition ${
                      isActive ? "text-black" : "text-gray-700"
                    }`}
                  >
                    {step.title}
                  </h3>

                  <p
                    className={`text-sm mt-2 max-w-[180px] transition ${
                      isActive ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gray-300"></div>
        </div>

      </section>

      <Footer />
    </>
  );
}