import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function CaseCard({
  id,
  client,
  caseType,
  status,
  hearingDate,
  priority,
})  {
      const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">

      {/* Top */}
      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-lg font-semibold text-black">
            {client}
          </h2>

          <p className="text-sm text-gray-500">
            {caseType}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold
          ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Middle */}
      <div className="mt-5 space-y-2">

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Hearing Date
          </span>

          <span className="font-medium text-black">
            {hearingDate}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            Priority
          </span>

          <span
            className={`font-semibold
            ${
              priority === "High"
                ? "text-red-600"
                : priority === "Medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {priority}
          </span>
        </div>
      </div>

      {/* Button */}
           <button
        onClick={() => navigate(`/lawyer/cases/${id}`)}
        className="mt-5 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-2"
      >
        View Details

        <FaArrowRight className="text-sm" />
      </button>

    </div>
  );
}