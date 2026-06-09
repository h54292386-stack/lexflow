import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getLawyerCaseRequests,
  acceptCaseRequest,
  showInterestInCase,
  declineCaseRequest,
  submitProposal,
} from "../../service/AuthService.js";
import CaseRequestCard from "../../components/CaseRequestCard.jsx";

export default function NewCaseRequests() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [proposalForm, setProposalForm] = useState({
    professionalFee: "",
    estimatedDuration: "",
    notes: "",
  });

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

  const handleProposalSubmit = async () => {
    try {
      await submitProposal(selectedCaseId, proposalForm);

      toast.success("Proposal submitted successfully");

      setShowProposalModal(false);

      setProposalForm({
        professionalFee: "",
        estimatedDuration: "",
        notes: "",
      });

      loadCases();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit proposal");
    }
  };

  const handleAccept = async (caseId) => {
    try {
      await acceptCaseRequest(caseId);

      toast.success("Case accepted successfully");

      loadCases();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept case");
    }
  };

  const handleInterest = async (caseId) => {
    try {
      await showInterestInCase(caseId);

      toast.success("Interest sent successfully");

      loadCases();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to show interest");
    }
  };

  const handleDecline = async (caseId) => {
    try {
      await declineCaseRequest(caseId);

      toast.success("Case declined");

      loadCases();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to decline case");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">New Case Requests</h1>

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
              onProposal={(caseId) => {
                setSelectedCaseId(caseId);
                setShowProposalModal(true);
              }}
            />
          ))}
        </div>
      )}
      {showProposalModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">
        Submit Proposal
      </h2>

      <input
        type="number"
        placeholder="Professional Fee"
        value={proposalForm.professionalFee}
        onChange={(e) =>
          setProposalForm({
            ...proposalForm,
            professionalFee: e.target.value,
          })
        }
        className="w-full border p-2 rounded mb-3"
      />

      <input
        type="text"
        placeholder="Estimated Duration"
        value={proposalForm.estimatedDuration}
        onChange={(e) =>
          setProposalForm({
            ...proposalForm,
            estimatedDuration: e.target.value,
          })
        }
        className="w-full border p-2 rounded mb-3"
      />

      <textarea
        placeholder="Notes"
        value={proposalForm.notes}
        onChange={(e) =>
          setProposalForm({
            ...proposalForm,
            notes: e.target.value,
          })
        }
        className="w-full border p-2 rounded mb-3"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() =>
            setShowProposalModal(false)
          }
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>

        <button
          onClick={handleProposalSubmit}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
