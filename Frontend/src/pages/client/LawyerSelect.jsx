import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LawyerCard from "../../components/LawyerCard.jsx";
import {
  getAllLawyers,
  requestLawyer,
} from "../../service/AuthService.js";
import toast from "react-hot-toast";
import { FaPaperPlane, FaArrowLeft } from "react-icons/fa";

export default function LawyerList() {
  const [lawyers, setLawyers] = useState([]);
  const [requestedLawyers, setRequestedLawyers] = useState([]);
  const [selectedLawyers, setSelectedLawyers] = useState([]);
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get("caseId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLawyers();
  }, []);

  useEffect(() => {
    console.log("selectedLawyers:", selectedLawyers);
  }, [selectedLawyers]);

  const fetchLawyers = async () => {
    try {
      const res = await getAllLawyers();

      const data = res?.data || res || [];

      setLawyers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setLawyers([]);
    }
  };


  const handleView = (id) => {
      navigate(
    caseId
      ? `/lawyerDetails/${id}?caseId=${caseId}`
      : `/lawyerDetails/${id}`
  );

  };
  const handleSelect = (lawyerId) => {
    const id = String(lawyerId).trim();

    setSelectedLawyers((prev) => {
      const exists = prev.some((item) => String(item).trim() === id);

      if (exists) {
        return prev.filter((item) => String(item).trim() !== id);
      }

      return [...prev, id];
    });
  };

  const handleSubmitRequests = async () => {
    try {
      if (!caseId) {
        toast.error("Case not found");
        return;
      }

      if (selectedLawyers.length === 0) {
        toast.error("Please select at least one lawyer");
        return;
      }

      for (const lawyerId of selectedLawyers) {
        await requestLawyer(caseId, lawyerId);
      }

      toast.success("Requests sent!");

      navigate("/cases");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <button
                              onClick={() => navigate("/home")}
                              className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black"
                            >
                             <FaArrowLeft className="w-4 h-4 text-gray-500 hover:text-black transition" />
                            </button>
                            <br/>
                            <br/>
      <h1 className="text-2xl font-bold text-center mb-8">
        Select Your Lawyer
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleSubmitRequests}
          className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <FaPaperPlane />
          Send Requests
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map((lawyer) => {
          const lawyerId = String(lawyer._id || lawyer.id).trim();

          return (
            <LawyerCard
              key={lawyerId}
              lawyer={lawyer}
              onView={handleView}
              onSelect={handleSelect}
              isSelected={selectedLawyers.some(
                (id) => String(id).trim() === lawyerId,
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
