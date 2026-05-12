import { useEffect, useState } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import LawyerCard from "../../components/LawyerCard.jsx";
import {
  getAllLawyers,
  requestLawyer,
  getDraftCase,
} from "../../service/AuthService.js";
import toast from "react-hot-toast";
import { FaPaperPlane } from "react-icons/fa";

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

  const fetchDraftCase = async () => {
    try {
      const res = await getDraftCase();
      const draft = res?.data;

      if (draft?._id) {
        setCaseId(draft._id);

        setRequestedLawyers(draft.requestedLawyers || []);
      }
    } catch (err) {
      console.error(err);
    }
  };


 

  const handleView = (id) => {
    navigate(`/lawyerDetails/${id}`);
  };



  const handleSelect = (lawyerId) => {
    const id = lawyerId.toString();

    setSelectedLawyers((prev) => {
      const exists = prev.some((item) => item.toString() === id);

      if (exists) {
        return prev.filter((item) => item.toString() !== id);
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
          return (
            <LawyerCard
              key={lawyer._id || lawyer.id}
              lawyer={lawyer}
              onView={handleView}
              onSelect={handleSelect}
              isSelected={selectedLawyers.includes(lawyer.id?.toString())}
            />
          );
        })}
      </div>
    </div>
  );
}
