import { FaStar, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

export default function LawyerCard({ lawyer, onView, onSelect, isSelected }) {
  const lawyerId = (lawyer._id || lawyer.id)?.toString();
  console.log("LAWYER CARD DATA:", lawyer);
  return (
    <div className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition">
      {/* Top Section */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-black flex items-center justify-center">
          {lawyer.profileImage ? (
            <img
              src={lawyer.profileImage}
              alt={lawyer.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl text-white font-bold">
              {lawyer.name?.charAt(0)?.toUpperCase() || "L"}
            </span>
          )}
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-lg">{lawyer.name}</h2>

          <div className="flex items-center gap-2 text-green-600 text-sm">
            <IoMdCheckmarkCircleOutline /> Verified
          </div>
        </div>

        <div className="flex items-center gap-1 text-yellow-500">
          <FaStar />
          <span className="text-sm text-gray-700">{lawyer.rating}</span>
        </div>
      </div>

      {/* Details */}
      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <FaBriefcase />
          {lawyer.specialization?.length
            ? lawyer.specialization.join(", ")
            : "General Law"}
        </div>

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt />
          <span>
            {lawyer.officeAddress
              ? `${lawyer.officeAddress.street}, ${lawyer.officeAddress.city}, ${lawyer.officeAddress.state}`
              : "Location not available"}
          </span>
        </div>

        <p className="text-gray-500 mt-1">
          {lawyer.experience || 0} years experience • {lawyer.totalCases || 0}{" "}
          cases handled
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onView(lawyerId)}
          className="flex-1 border border-black text-black py-2 rounded-md hover:bg-gray-100"
        >
          View Profile
        </button>
        <button
          onClick={() => onSelect(lawyerId)}
          disabled={isSelected}
          className={`flex-1 py-2 rounded-md ${
            isSelected
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}
