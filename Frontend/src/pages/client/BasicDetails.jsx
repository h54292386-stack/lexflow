import Navbar from "../../components/Navbar";
import legal2 from "../../assets/legal-2.jpeg";
import Features from "./Features.jsx";
import About from "./About.jsx";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";


export default function BasicDetails() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGetStart = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/register");
    }, 700);
    };

  return (
    <>
   <Navbar />
   <section className="relative h-[515px] flex items-center justify-center text-center overflow-hidden">
  
   <img
    src={legal2}
    alt="Legal"
    className="absolute inset-0 w-full h-[660px] object-cover opacity-70"
    />

  <div className="absolute inset-0 bg-black/40"></div>

  <div className="relative z-10 text-white max-w-2xl px-4">
    <h1 className="font-aboreto text-4xl md:text-5xl text-white tracking-wide">
      Manage Legal Cases <br />
      Efficiently & Securely
    </h1>

    <p className="mt-4 text-gray-200">
      Connect with verified lawyers, manage documents securely, and track your
      legal cases seamlessly.
    </p>

   <div className="mt-6 flex justify-center gap-4">
  
  <button
    onClick={handleGetStart}
    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
  >
    Get Start →
  </button>
    {loading && (
        <div className="fixed inset-0 bg-white/15 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
    )}

  <button
    onClick={() => navigate("/features")}
    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
  >
    Learn More
  </button>

</div>
  </div>

</section>

    <section className="bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 text-center gap-8">
        
        <div>
          <h2 className="text-4xl font-bold">10000+</h2>
          <p className="text-gray-500">Total Cases</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold">5000+</h2>
          <p className="text-gray-500">Verified Lawyers</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold">98%</h2>
          <p className="text-gray-500">Success Rate</p>
        </div>

      </div>
    </section>
    <Features showBackButton={false} />
    <About showBackButton={false}/>
    </>
  );
}