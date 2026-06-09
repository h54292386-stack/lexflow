import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCaseProposals, selectProposal } from "../../service/AuthService";
import toast from "react-hot-toast";
import { getCaseById } from "../../service/AuthService.js";

export default function CaseProposals() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
    loadCase();
  }, []);

  const loadProposals = async () => {
    try {
      const res = await getCaseProposals(caseId);

      setProposals(res.proposals || []);
    } catch (err) {
      toast.error("Failed to load proposals");
    } finally {
      setLoading(false);
    }
  };

  const loadCase = async () => {
    try {
      const res = await getCaseById(caseId);
      setCaseData(res._doc);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = async (requestId, lawyerId, lawyerName) => {
    console.log("caseId:", caseId);
    console.log("requestId:", requestId);
    console.log("lawyerId:", lawyerId);

    try {
      await selectProposal(caseId, requestId);

      toast.success("Proposal selected successfully");

      navigate(`/consultation/${caseId}/${lawyerId}`, {
        state: {
          lawyerName,
          caseName: caseData?.caseDetails?.caseName,
        },
      });
    } catch (err) {
      console.log("SELECT ERROR:", err);
      console.log("RESPONSE:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to select proposal");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lawyer Proposals</h1>

      {proposals.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          No proposals submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.requestId}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">
                    {proposal.lawyerId?.name}
                  </h2>

                  <p className="text-gray-500">
                    Fee: ₹{proposal.professionalFee}
                  </p>

                  <p className="text-gray-500">
                    Duration:
                    {proposal.estimatedDuration}
                  </p>

                  <p className="mt-3">{proposal.notes}</p>
                </div>

                <button
                  onClick={() =>{
                      console.log("CLICKED PROPOSAL", proposal)

                    handleSelect(
                      proposal.requestId,
                      proposal.lawyerId?.id,
                      proposal.lawyerId?.name,
                    )}
                  }
                  className="bg-black text-white px-4 py-2 rounded-lg"
                >
                  Select Proposal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
