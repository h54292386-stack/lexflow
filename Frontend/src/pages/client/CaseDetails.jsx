import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaGavel,
  FaUser,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaFileAlt,
} from "react-icons/fa";

import {
  getCaseById,
  updateCaseDetails,
  uploadCaseDocuments,
  deleteCaseDoc,
} from "../../service/AuthService";
import toast from "react-hot-toast";

export default function CaseDetails() {
  const { caseId } = useParams();

  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (caseId) {
      fetchCaseDetails();
    }
  }, [caseId]);

  const fetchCaseDetails = async () => {
    try {
      const res = await getCaseById(caseId);

      setCaseData(res._doc); // or correct structure
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false); // ✅ THIS WAS MISSING
    }
  };

  useEffect(() => {
    if (caseData) {
      setFormData(caseData);
    }
  }, [caseData]);
  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = {
        personalData: formData.personalData,
        caseDetails: formData.caseDetails,
        shareWithLawyer: formData.shareWithLawyer,
      };

      const res = await updateCaseDetails(caseId, payload);

      setCaseData(res.data);

      toast.success("Case updated successfully");

      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");

      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (path, value) => {
    setFormData((prev) => {
      const updated = structuredClone(prev);

      const keys = path.split(".");

      let current = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return updated;
    });
  };
  const handleFileUpload = async (e) => {
    try {
      const files = e.target.files;

      if (!files || files.length === 0) return;

      const formData = new FormData();

      formData.append("documentName", documentName);
      formData.append("documentType", documentType);

      for (let file of files) {
        formData.append("files", file);
      }

      await uploadCaseDocuments(caseId, formData);

      toast.success("Documents uploaded");

      setDocumentName("");
      setDocumentType("");

      fetchCaseDetails();
    } catch (err) {
      console.log(err);

      toast.error("Upload failed");
    }
  };

  const handleDelete = async (docId) => {
    toast.custom((t) => (
      <div className="bg-white shadow-lg rounded-xl p-4 border w-80">
        <p className="font-semibold text-black mb-3">Delete this document?</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              try {
                await deleteCaseDoc(caseId, docId);

                toast.dismiss(t.id);

                toast.success("Document deleted");

                fetchCaseDetails();
              } catch (err) {
                console.log(err);

                toast.error(err.response?.data?.message || "Delete failed");
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const getUrgencyColor = (level) => {
    switch (level?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        No Case Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">
              {caseData.caseDetails?.caseName}
            </h1>
            <p className="text-gray-500 mt-1">
              Case ID : CASE-{caseData._id?.slice(-5).toUpperCase()}
            </p>{" "}
          </div>
          <button
            onClick={() => {
              if (!isEditing) {
                toast.custom((t) => (
                  <div className="bg-white shadow-lg rounded-xl p-4 border w-80">
                    <p className="font-semibold text-black mb-3">
                      Enable edit mode?
                    </p>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 border rounded-lg"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => {
                          setIsEditing(true);
                          toast.dismiss(t.id);
                          toast.success("Edit mode enabled");
                        }}
                        className="px-3 py-1 bg-black text-white rounded-lg"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                ));
              } else {
                setIsEditing(false);
                toast("Edit cancelled");
              }
            }}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            {isEditing ? "Cancel Edit" : "Edit Case"}
          </button>

          {isEditing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <FaArrowLeft />
            Back
          </button>
        </div>

        {/* STATUS */}
        <span
          className={`px-4 py-2 rounded-full text-sm border ${getUrgencyColor(caseData.caseDetails?.urgencyLevel)}`}
        >
          {caseData.caseDetails?.urgencyLevel}
        </span>

        {/* PERSONAL DETAILS */}
        <div className="border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaUser className="text-black" />
            <h2 className="text-xl font-semibold">Personal Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Full Name:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.personalData?.fullName || ""}
                  onChange={(e) =>
                    handleInputChange("personalData.fullName", e.target.value)
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.personalData?.fullName}</p>
              )}
            </div>
            <div>
              <strong>Email:</strong>

              {isEditing ? (
                <input
                  type="email"
                  value={formData.personalData?.email || ""}
                  onChange={(e) =>
                    handleInputChange("personalData.email", e.target.value)
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.personalData?.email}</p>
              )}
            </div>
            <div>
              <strong>Phone:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.personalData?.phone || ""}
                  onChange={(e) =>
                    handleInputChange("personalData.phone", e.target.value)
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.personalData?.phone}</p>
              )}
            </div>
            <div>
              <strong>ID Number:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.personalData?.idProof?.number || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "personalData.idProof.number",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.personalData?.idProof?.number}</p>
              )}
            </div>
          </div>
        </div>

        {/* CASE DETAILS */}
        <div className="border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaGavel className="text-black" />
            <h2 className="text-xl font-semibold">Case Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <strong>Case Type:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.caseDetails?.caseType || ""}
                  onChange={(e) =>
                    handleInputChange("caseDetails.caseType", e.target.value)
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.caseDetails?.caseType}</p>
              )}
            </div>

            <div>
              <strong>Incident Date:</strong>

              {isEditing ? (
                <input
                  type="date"
                  value={
                    formData.caseDetails?.incidentDate
                      ? formData.caseDetails.incidentDate.split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "caseDetails.incidentDate",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>
                  {caseData.caseDetails?.incidentDate
                    ? new Date(
                        caseData.caseDetails.incidentDate,
                      ).toLocaleDateString()
                    : "N/A"}
                </p>
              )}
            </div>

            <div>
              <strong>Description:</strong>

              {isEditing ? (
                <textarea
                  value={formData.caseDetails?.description || ""}
                  onChange={(e) =>
                    handleInputChange("caseDetails.description", e.target.value)
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.caseDetails?.description}</p>
              )}
            </div>

            <div>
              <strong>Urgency:</strong>

              {isEditing ? (
                <select
                  value={formData.caseDetails?.urgencyLevel || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "caseDetails.urgencyLevel",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <p>{caseData.caseDetails?.urgencyLevel}</p>
              )}
            </div>
          </div>
        </div>

        {/* OPPONENT DETAILS */}
        <div className="border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Opponent Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Name:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.caseDetails?.opponent?.name || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "caseDetails.opponent.name",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.caseDetails?.opponent?.name}</p>
              )}
            </div>

            <div>
              <strong>Relation:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.caseDetails?.opponent?.relation || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "caseDetails.opponent.relation",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.caseDetails?.opponent?.relation}</p>
              )}
            </div>
            <div>
              <strong>Contact:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.caseDetails?.opponent?.contact || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "caseDetails.opponent.contact",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.caseDetails?.opponent?.contact}</p>
              )}
            </div>
          </div>
        </div>

        {/* INCIDENT LOCATION */}
        <div className="border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt />
            <h2 className="text-xl font-semibold">Incident Location</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <strong>City:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.caseDetails?.incidentLocation?.city || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "caseDetails.incidentLocation.city",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.caseDetails?.incidentLocation?.city}</p>
              )}
            </div>

            <div>
              <strong>State:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.caseDetails?.incidentLocation?.state || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "caseDetails.incidentLocation.state",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.caseDetails?.incidentLocation?.state}</p>
              )}
            </div>

            <div>
              <strong>Country:</strong>

              {isEditing ? (
                <input
                  type="text"
                  value={formData.caseDetails?.incidentLocation?.country || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "caseDetails.incidentLocation.country",
                      e.target.value,
                    )
                  }
                  className="border p-2 rounded w-full mt-1"
                />
              ) : (
                <p>{caseData.caseDetails?.incidentLocation?.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* DOCUMENTS */}
        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaFileAlt />
            <h2 className="text-xl font-semibold">Documents</h2>
          </div>

          {/* UPLOAD */}
          {isEditing && (
            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="Document Name"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="border p-2 rounded w-full"
              />

              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Type</option>
                <option value="evidence">Evidence</option>
                <option value="legal_notice">Legal Notice</option>
                <option value="agreement">Agreement</option>
                <option value="other">Other</option>
              </select>

              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="mb-4"
              />
            </div>
          )}

        <div className="border-2 border-black/10 bg-gray-50 rounded-xl p-5 mb-6 shadow-sm">
  {/* Header */}
  <div className="flex items-start justify-between">
    <div>
      <h3 className="font-semibold text-lg text-black">
         Share Documents With Lawyer
      </h3>

      <p className="text-sm text-gray-600 mt-1">
        Control whether assigned or requested lawyers can access case documents
      </p>
    </div>

    {/* Toggle */}
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={formData?.shareWithLawyer || false}
        disabled={!isEditing}
        onChange={(e) =>
          handleInputChange("shareWithLawyer", e.target.checked)
        }
      />

      {/* Track */}
      <div
        className={`w-11 h-6 rounded-full transition-all duration-200
          peer-checked:bg-black
          ${isEditing ? "bg-gray-300" : "bg-gray-200 opacity-50 cursor-not-allowed"}
        `}
      ></div>

      {/* Thumb */}
      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
    </label>
  </div>

  {/* Extra highlight info */}
  <div className="mt-4 text-xs text-yellow-900 bg-yellow-100 border rounded-lg p-3">
     When enabled, lawyers you request or assign will be able to view uploaded case documents.
  </div>
</div>
          {caseData.documents?.length > 0 ? (
            <div className="space-y-3">
              {caseData.documents.map((doc) => (
                <div
                  key={doc._id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{doc.documentName}</p>
                    <p className="text-sm text-gray-500">{doc.documentType}</p>
                  </div>

                  <div className="flex gap-3 items-center">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-black text-white px-4 py-2 rounded-lg"
                    >
                      View
                    </a>

                    {isEditing && (
                      <button
                        onClick={() => handleDelete(doc._id)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No documents uploaded</p>
          )}
        </div>
      </div>
    </div>
  );
}
