import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaStar,
  FaBalanceScale,
  FaFolderOpen,
  FaTrophy,
  FaGraduationCap,
  FaBriefcase,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaAddressCard,
  FaArrowLeft,
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import { MdGavel } from "react-icons/md";
import { getLawyerById } from "../../service/AuthService.js";
import Footer from "../../components/Footer.jsx";
import { useNavigate } from "react-router-dom";

export default function LawyerDetails() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);

  useEffect(() => {
    fetchLawyer();
  }, []);

  const fetchLawyer = async () => {
    try {
      const res = await getLawyerById(id);

      console.log(res);

      setLawyer(res.data);
      console.log("LAWYER API DATA:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!lawyer) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <>
      <div className="bg-[#F5F5F5] min-h-screen py-10 px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <button
            onClick={() => navigate("/lawyers")}
            className="absolute top-6 left-8 text-xs text-gray-400 hover:underline"
          >
            <FaArrowLeft />
          </button>

          {/* 🔹 PROFILE CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative">
            {/* Profile Image */}
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border shadow-sm flex-shrink-0 bg-gray-200">
              <img
                src={lawyer.profileImage}
                alt="photo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {/* Name */}
              <h2 className="text-3xl font-bold text-gray-800">
                {lawyer.name}
              </h2>
              {/* Specialization */}
              <p className="text-gray-500 mt-1 text-lg">
                {lawyer.specialization?.join(", ") || "General Law"}
              </p>
              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start gap-3 mt-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.round(lawyer.rating || 0)
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>

                <span className="font-medium text-gray-700">
                  {lawyer.rating || 0}/5
                </span>

                <span className="text-sm text-gray-500">
                  ({lawyer.reviewCount || 0} reviews)
                </span>

                <span className="text-sm text-gray-400 border-l pl-3 flex items-center gap-1">
                  <FaMapMarkerAlt />
                  {lawyer.officeAddress?.city || "Location not available"}
                </span>
              </div>
              {/* Cases */}
              <div className="mt-3 text-sm text-gray-500">
                {lawyer.totalCases || 0} cases handled
              </div>
              {/* Button */}
              <button
                className="mt-6 flex items-center gap-2 border border-black px-5 py-2 rounded-lg hover:bg-black hover:text-white transition mx-auto md:mx-0"
                onClick={() => {

                  const lawyerId = lawyer?._id || lawyer?.id;


                  if (!lawyerId) {
                    alert("Lawyer ID missing");
                    return;
                  }

                  navigate(`/chat/${lawyerId}`);
                }}
              >
                <FiMessageSquare />
                Send Message
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-semibold text-[17px] border-b pb-3 mb-4">
                    About Lawyer
                  </h3>

                  <p className="text-sm text-gray-600 leading-7">
                    {lawyer.about || "No description available."}
                  </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-semibold text-[17px] border-b pb-3 mb-4">
                    Professional Details
                  </h3>

                  <div className="space-y-5 text-sm text-gray-700">
                    <div className="flex gap-3 items-start">
                      <FaGraduationCap className="mt-1" />
                      <span>
                        {lawyer.education
                          ? `${lawyer.education.degree} - ${lawyer.education.university}`
                          : "Not specified"}
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <FaAddressCard />
                      <span>
                        {lawyer.barCouncilNumber ||
                          "Bar Council ID not available"}
                      </span>
                    </div>

                    <div className="flex gap-3 items-center">
                      <FaBriefcase />
                      <span>{lawyer.experience || 0} Years Experience</span>
                    </div>

                    <div className="flex gap-3 items-start">
                      <FaMapMarkerAlt className="mt-1" />
                      <span>
                        {lawyer.officeAddress?.city || "Location not available"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-semibold text-[17px] border-b pb-3 mb-4">
                    Case Statistics
                  </h3>

                  <div className="space-y-5 text-sm text-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <MdGavel />
                        Active Cases
                      </span>

                      <span>{lawyer.activeCases || 0}</span>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="flex items-center gap-2">
                        <FaFolderOpen />
                        Total Cases
                      </span>

                      <span>{lawyer.totalCases || 0}</span>
                    </div>

                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="flex items-center gap-2">
                        <FaTrophy />
                        Cases Won
                      </span>

                      <span>{lawyer.casesWon || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-semibold text-[17px] border-b pb-3 mb-4">
                    Contact
                  </h3>

                  <div className="space-y-5 text-sm text-gray-700">
                    <div className="flex items-center gap-3 break-all">
                      <FaEnvelope />
                      {lawyer.email || "Not available"}
                    </div>

                    <div className="flex items-center gap-3">
                      <FaPhone />
                      {lawyer.phone || "Not available"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 h-full">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-full min-h-[420px]">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <h3 className="font-semibold text-[17px]">Client Reviews</h3>

                  <button className="text-xs text-gray-500 hover:text-black">
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(4)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-sm" />
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 leading-6">
                      Reviews feature coming soon...
                    </p>

                    <p className="text-right text-xs text-gray-500 mt-3">
                      — Client
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
