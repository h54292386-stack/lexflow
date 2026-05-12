import { useEffect, useState } from "react";
import { FaFolderOpen, FaUserTie, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {getClientCases} from "../../service/AuthService.js"
import toast from "react-hot-toast";

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
  fetchCases();
}, []);

const fetchCases = async () => {
  try {
    const res = await getClientCases();

    setCases(res.cases || []);
  } catch (err) {
    console.log(err);
    toast.error("Failed to fetch cases");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black">My Cases</h1>
          <p className="text-gray-500 mt-1">
            Track your registered legal cases
          </p>
        </div>

        <button
          onClick={() => navigate("/createCase")}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          + New Case
        </button>
      </div>

      {/* Empty State */}
      {cases.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center border">
          <FaFolderOpen className="text-5xl mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Cases Found</h2>
          <p className="text-gray-500 mb-5">
            You haven't registered any cases yet.
          </p>

          <button
            onClick={() => navigate("/createCase")}
            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
          >
            Register Case
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition"
            >
              {/* Title */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-black">
{item.caseDetails?.caseName || "Untitled Case"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
{item.caseDetails?.caseType}
                  </p>
                </div>

                <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
                  {item.status}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaUserTie />
                  <span>{item.requestedLawyers?.length || 0} lawyer requests sent</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(`/case/${item._id}`)}
                  className="flex-1 border border-black text-black py-2 rounded-lg hover:bg-gray-100"
                >
                  View Details
                </button>

                <button className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800">
                  Track Status
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
