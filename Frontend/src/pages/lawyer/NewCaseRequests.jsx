import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getLawyerCaseRequests,
  acceptCaseRequest,
  showInterestInCase,
  declineCaseRequest,
} from "../../service/AuthService";
import CaseRequestCard from "../../components/CaseRequestCard.jsx";

export default function NewCaseRequests() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const res = await getLawyerCaseRequests();

      console.log("CASE RESPONSE:", res);
      console.log("CASES:", res.cases);

      setCases(res.cases || []);
    } catch (err) {
      toast.error("Failed to load case requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (caseId) => {
    try {
      await acceptCaseRequest(caseId);

      toast.success("Case accepted successfully");

      loadCases();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to accept case"
      );
    }
  };

  const handleInterest = async (caseId) => {
    try {
      await showInterestInCase(caseId);

      toast.success("Interest sent successfully");

      loadCases();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to show interest"
      );
    }
  };

  const handleDecline = async (caseId) => {
    try {
      await declineCaseRequest(caseId);

      toast.success("Case declined");

      loadCases();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to decline case"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">
      New Case Requests
    </h1>

    {cases.length === 0 ? (
      <div className="bg-white rounded-xl shadow p-6">
        No case requests found.
      </div>
    ) : (
      <div className="grid gap-6">
        {cases.map((item) => (
          <CaseRequestCard
            key={item._id}
            caseData={item}
            onInterest={handleInterest}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ))}
      </div>
    )}
  </div>
);}