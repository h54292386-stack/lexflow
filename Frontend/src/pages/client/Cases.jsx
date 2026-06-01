import { useEffect, useState } from "react";
import { FaFolderOpen, FaUserTie, FaClock,FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {getClientCases} from "../../service/AuthService.js"
import toast from "react-hot-toast";

export default function CasesPage() {
  const [cases, setCases] = useState([]);
  const navigate = useNavigate();
const [selectedCase, setSelectedCase] = useState(null);
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

const statusSteps = [
  "draft",
  "submitted",
  "requested",
  "assigned",
  "in_progress",
  "closed",
];
  return (
    
    <div className="min-h-screen bg-gray-100 p-8">
       <button
                        onClick={() => navigate("/home")}
                        className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black"
                      >
                       <FaArrowLeft className="w-4 h-4 text-gray-500 hover:text-black transition" />
                      </button>
                      <br/>
                      <br/>
      {selectedCase && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-[380px] rounded-xl p-6 shadow-xl">

      <h2 className="text-xl font-bold mb-4">Case Progress</h2>

      <div className="space-y-4">
        {statusSteps.map((step, index) => {
const currentIndex = statusSteps.indexOf(selectedCase?.status || "draft");
          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  index <= currentIndex ? "bg-green-600" : "bg-gray-300"
                }`}
              />

              <span
                className={`capitalize ${
                  index <= currentIndex
                    ? "text-black font-medium"
                    : "text-gray-400"
                }`}
              >
                {step.replace("_", " ")}
              </span>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setSelectedCase(null)}
        className="mt-6 w-full bg-black text-white py-2 rounded-lg"
      >
        Close
      </button>
    </div>
  </div>
)}
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

                <button
  onClick={() => setSelectedCase(item)}
  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
>
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
