import { FaUserCircle } from "react-icons/fa";
import { FaHeart, FaCheck, FaTimes, FaPhone } from "react-icons/fa";
import { MdChat } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function CaseRequestCard({
  caseData,
  onInterest,
  onAccept,
  onDecline,
  onProposal,
}) {
  const navigate = useNavigate();
  const status = caseData.lawyerStatus;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold">
            {caseData.caseDetails?.caseName}
          </h2>

          <p className="text-gray-500 text-sm">
            {caseData.caseDetails?.caseType}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            status === "new"
              ? "bg-blue-100 text-blue-700"
              : status === "interested"
                ? "bg-amber-100 text-amber-700"
                : status === "accepted"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
          }`}
        >
          {status?.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12">
          {caseData.clientId?.profileImage ? (
            <img
              src={caseData.clientId.profileImage}
              alt={caseData.clientId?.name}
              className="w-12 h-12 rounded-full object-cover border"
            />
          ) : (
            <FaUserCircle size={48} className="text-gray-400" />
          )}
        </div>

        <div>
          <p className="font-medium">{caseData.clientId?.name}</p>

          <p className="text-sm text-gray-500">{caseData.clientId?.email}</p>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">
        {caseData.caseDetails?.description}
      </p>

      <div className="flex gap-2 mb-4">
        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          {caseData.caseDetails?.caseType}
        </span>

        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
          {caseData.caseDetails?.urgencyLevel}
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Created: {new Date(caseData.createdAt).toLocaleDateString()}
      </div>

      {status === "new" && (
        <div className="flex gap-3">
          <button
            onClick={() => onInterest(caseData._id)}
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <FaHeart />
            Show Interest
          </button>

          <button
            onClick={() => onDecline(caseData._id)}
            className="w-28 border border-red-500 text-red-500 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <FaTimes />
            Decline
          </button>
        </div>
      )}

      {status === "interested" && (
        <div>
             <button
            disabled={!!caseData.proposal?.proposedAt}
            onClick={() => onProposal(caseData._id)}
            className={
              caseData.proposal?.proposedAt
                ? "bg-gray-800 text-white cursor-not-allowed w-full py-2 rounded-lg mb-3"
          
                : "bg-black text-white w-full py-2 rounded-lg mb-3"
          
            }
          >
            {caseData.proposal?.proposedAt
              ? "Proposal Submitted"
              : "Submit Proposal"}
          </button>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  navigate(`/lawyer/chat/${caseData.clientId._id}`)
                }
                className="bg-white border border-black text-black py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <MdChat />
                Chat
              </button>

              <button className="bg-white border border-black text-black py-2 rounded-lg flex items-center justify-center gap-2">
                <FaPhone />
                Audio Call
              </button>
            </div>
          </div>
          <br />
          <div className="flex gap-3">
            <button
              onClick={() => onAccept(caseData._id)}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <FaCheck />
              Accept Case
            </button>
            <button
              onClick={() => onDecline(caseData._id)}
              className="w-28 border border-red-500 text-red-500 py-2 rounded-lg flex items-center justify-center gap-2"
            >
              <FaTimes />
              Decline
            </button>
          </div>
        </div>
      )}

      {status === "accepted" && (
        <div className="bg-green-50 text-green-700 text-center py-2 rounded-lg font-semibold">
          ✓ Case Assigned
        </div>
      )}

      {status === "declined" && (
        <div className="bg-red-50 text-red-700 text-center py-2 rounded-lg font-semibold">
          <FaTimes />
          Case Declined
        </div>
      )}
    </div>
  );
}
