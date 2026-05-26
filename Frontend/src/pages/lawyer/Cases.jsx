import { FaSearch } from "react-icons/fa";
import CaseCard from "../../components/CaseCard.jsx";

export default function Case() {
  return (
    <div className="space-y-8">

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold text-black">
          Lawyer Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Welcome back, manage your cases efficiently.
        </p>
      </div>

      <div className="flex items-center bg-white border border-gray-300 rounded-xl px-4 py-3 w-[320px] shadow-sm">

          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search cases..."
            className="ml-3 w-full outline-none text-sm"
          />
        </div>


      {/* Current Cases */}
      <div>

        <div className="flex items-center justify-between mb-5">

          <h2 className="text-2xl font-semibold text-black">
            Current Cases
          </h2>

          <button className="text-sm font-medium text-black hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">

          <CaseCard
            id="1"
            client="John Doe"
            caseType="Property Dispute"
            status="Active"
            hearingDate="25 May 2026"
            priority="High"
          />

          <CaseCard
            client="Emily Watson"
            caseType="Corporate Fraud"
            status="Pending"
            hearingDate="28 May 2026"
            priority="Medium"
          />

          <CaseCard
            client="Michael Brown"
            caseType="Divorce Case"
            status="Active"
            hearingDate="30 May 2026"
            priority="Low"
          />

        </div>
      </div>
    </div>
  );
}