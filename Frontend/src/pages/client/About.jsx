import { FaCheckCircle, FaBalanceScale,FaArrowLeft } from "react-icons/fa";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

export default function About({ showBackButton = true }) {
   const navigate = useNavigate();

  return (
    <div className="bg-white h-[550px]">
          {showBackButton && (
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black"
        >
         <FaArrowLeft className="w-4 h-4 text-gray-500 hover:text-black transition" />
        </button>
      )}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl font-bold mb-6 text-black">About LexFlow</h1>
          <p className="text-gray-700 mb-4">
            LexFlow is a comprehensive legal case workflow management system
            designed to streamline communication between clients and lawyers
            while maintaining the highest standards of security and privacy.
          </p>
          <p className="text-gray-700 mb-4">
            Our platform ensures that only verified legal professionals can
            handle cases, with strict role-based access control to protect
            sensitive legal documents and information.
          </p>
          <p className="text-gray-700">
            Whether you're a client seeking legal representation or a lawyer
            managing multiple cases, LexFlow provides the tools you need for
            efficient and secure case management.
          </p>
        </div>

        <div className="bg-gray-100 rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Why Choose Us?</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-black mt-1" />
              <div>
                <h3 className="font-medium text-black">Verified Professionals</h3>
                <p className="text-gray-600 text-sm">
                  All lawyers are verified through our strict licensing process
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-black mt-1" />
              <div>
                <h3 className="font-medium text-black">Document Security</h3>
                <p className="text-gray-600 text-sm">
                  Full control over who can access your sensitive legal
                  documents
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FaCheckCircle className="text-black mt-1" />
              <div>
                <h3 className="font-medium text-black">Transparent Process</h3>
                <p className="text-gray-600 text-sm">
                  Track every step of your case with clear status updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

        <Footer />

    </div>
  );
}
