import { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaUser,
  FaGavel,
  FaFileAlt,
} from "react-icons/fa";
import background from "../../assets/backgroundlegal.jpeg";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createCase,
  updateCaseDetails,
  uploadCaseDocuments,
  getDraftCase,
} from "../../service/AuthService.js";

/* ---------------- STEPPER ---------------- */
const Stepper = ({ step }) => {
  const steps = [
    { id: 1, label: "Personal Details", icon: <FaUser /> },
    { id: 2, label: "Case Details", icon: <FaGavel /> },
    { id: 3, label: "Documents", icon: <FaFileAlt /> },
  ];

  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200"></div>

        <div
          className="absolute top-5 left-0 h-1 bg-black transition-all"
          style={{ width: `${(step - 1) * 50}%` }}
        ></div>

        {steps.map((item) => (
          <div key={item.id} className="flex flex-col items-center z-10">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border-2
              ${
                step >= item.id
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-400 border-gray-300"
              }`}
            >
              {step > item.id ? "✓" : item.icon}
            </div>

            <span className="mt-2 text-xs">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  idType: "aadhaar",
  idNumber: "",

  caseName: "",
  caseType: "",
  incidentDate: "",
  description: "",
  urgency: "",

  opponentName: "",
  opponentRelation: "",
  opponentContact: "",

  city: "",
  state: "",
  country: "",

  documentName: "",
  documentType: "",
  file: [],
};

/* ---------------- MAIN ---------------- */
export default function CaseRegistration() {
  const [step, setStep] = useState(1);
  const [caseId, setCaseId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(initialFormState);

  const isStep1Valid =
    form.fullName && form.email && form.phone && form.idNumber;

  const isStep2Valid =
    form.caseName && form.caseType && form.description && form.urgency;

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? Array.from(files) : value,
    }));
  };

  /* ---------------- STEP 1 API ---------------- */
  const handleStep1 = async () => {
    if (!isStep1Valid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        personalData: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          idProof: {
            type: form.idType,
            number: form.idNumber,
          },
        },
      };

      const res = await createCase(payload);

      const caseIdFromRes = res?.data?.data?._id || res?.data?._id;

      if (!caseIdFromRes) {
        toast.error("Case ID not returned from server");
        return;
      }

      setCaseId(caseIdFromRes);

      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 2 API ---------------- */
  const handleStep2 = async () => {
    if (!caseId) {
      toast.error("Case not created yet");
      return;
    }

    if (!isStep2Valid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        caseName: form.caseName,
        caseType: form.caseType,
        incidentDate: form.incidentDate,
        description: form.description,
        urgencyLevel: form.urgency,
        opponent: {
          name: form.opponentName,
          relation: form.opponentRelation,
          contact: form.opponentContact,
        },
        incidentLocation: {
          city: form.city,
          state: form.state,
          country: form.country,
        },
      };

      await updateCaseDetails(caseId, payload); // FIXE]

      toast.success("Step 2 saved");

      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 3 API ---------------- */
  const handleSubmit = async () => {
    if (!form.files || form.files.length === 0) {
      toast.error("Please upload files");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("documentName", form.documentName);
      formData.append("documentType", form.documentType);

      form.files.forEach((file) => {
        formData.append("files", file);
      });

      await uploadCaseDocuments(caseId, formData);

      toast.success("Case submitted");

      setForm(initialFormState);

      setStep(1);
      setCaseId(null);

      navigate(`/lawyers?caseId=${caseId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDraft = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) return;

      try {
        const res = await getDraftCase();

        // because AuthService already returns res.data
        const draft = res?.data;

        if (!draft || draft.isDraft === false) {
          setForm(initialFormState);
          setCaseId(null);
          setStep(1);
          return;
        }

        setCaseId(draft._id);

        setStep(draft.stepCompleted || 1);
        setForm((prev) => ({
          ...prev,

          fullName: draft.personalData?.fullName || "",
          email: draft.personalData?.email || "",
          phone: draft.personalData?.phone || "",
          idNumber: draft.personalData?.idProof?.number || "",

          caseName: draft.caseDetails?.caseName || "",
          caseType: draft.caseDetails?.caseType || "",
          incidentDate: draft.caseDetails?.incidentDate
            ? draft.caseDetails.incidentDate.split("T")[0]
            : "",

          description: draft.caseDetails?.description || "",
          urgency: draft.caseDetails?.urgencyLevel || "",

          opponentName: draft.caseDetails?.opponent?.name || "",

          opponentRelation: draft.caseDetails?.opponent?.relation || "",

          opponentContact: draft.caseDetails?.opponent?.contact || "",

          city: draft.caseDetails?.incidentLocation?.city || "",

          state: draft.caseDetails?.incidentLocation?.state || "",

          country: draft.caseDetails?.incidentLocation?.country || "",
        }));
      } catch (err) {
        setForm(initialFormState);
        setCaseId(null);
        setStep(1);
      }
    };

    fetchDraft();
  }, []);

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const saveDraft = async () => {
    try {
      setLoading(true);

      let id = caseId;

      // STEP 1 DRAFT SAVE
      if (step === 1) {
        const payload = {
          personalData: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            idProof: {
              type: form.idType,
              number: form.idNumber,
            },
          },
          isDraft: true,
        };

        // create new draft
        if (!id) {
          const res = await createCase(payload);

          id = res?.data?.data?._id || res?.data?._id;

          setCaseId(id);
        }

        toast.success("Step 1 draft saved");
      }

      // STEP 2 DRAFT SAVE
      if (step === 2) {
        if (!id) {
          toast.error("Case not found");
          return;
        }

        await updateCaseDetails(id, {
          caseName: form.caseName,
          caseType: form.caseType,
          incidentDate: form.incidentDate,
          description: form.description,
          urgencyLevel: form.urgency,
          opponent: {
            name: form.opponentName,
            relation: form.opponentRelation,
            contact: form.opponentContact,
          },
          incidentLocation: {
            city: form.city,
            state: form.state,
            country: form.country,
          },
          isDraft: true,
        });

        toast.success("Step 2 draft saved");
      }

      if (step === 3) {
        toast.success("Documents ready for submission");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!caseId && step > 1) {
      setStep(1);
    }
  }, [caseId, step]);

  /* ---------------- CANCEL ---------------- */
  const cancel = () => {
    toast((t) => (
      <span>
        Cancel registration?
        <button
          onClick={() => {
            toast.dismiss(t.id);
            navigate("/home");
          }}
          className="ml-2 text-red-500 font-semibold"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="ml-2 text-gray-500"
        >
          No
        </button>
      </span>
    ));
  };

  return (
    <div className="min-h-screen relative p-6 overflow-hidden">
      {/* FULL PAGE BACKGROUND */}
      <img
        src={background}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>

      {/* CONTENT */}
      <div className="relative z-10">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          {/* HEADER */}
          <div className="mb-6 ">
            <h1 className="text-2xl font-bold text-black  flex justify-center items-center">
              Register New Case
            </h1>
            <p className="text-gray-500 text-sm mt-1  flex justify-center items-center">
              Please fill in the details to register your case
            </p>
          </div>

          {/* STEPPER */}
          <Stepper step={step} />

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Personal Details</h2>

              <input
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="input"
              />
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="input"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="input"
              />

              <select
                name="idType"
                value={form.idType}
                onChange={handleChange}
                className="input"
              >
                <option value="aadhaar">Aadhaar</option>
                <option value="passport">Passport</option>
                <option value="driving_license">Driving License</option>
                <option value="voter_id">Voter ID</option>
              </select>

              <input
                name="idNumber"
                placeholder="ID Number"
                value={form.idNumber}
                onChange={handleChange}
                className="input"
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  className="btn-outline"
                  disabled={!isStep1Valid || loading}
                  onClick={saveDraft}
                >
                  <FaSave /> Save Draft
                </button>
                <button onClick={cancel} className="btn-outline">
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleStep1}
                  className="btn-primary"
                  disabled={loading || !isStep1Valid}
                >
                  {" "}
                  Next <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Case Details</h2>
              <input
                name="caseName"
                placeholder="Case Name"
                value={form.caseName}
                onChange={handleChange}
                className="input"
              />
              <select
                name="caseType"
                value={form.caseType}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Case Type</option>
                <option value="criminal">Criminal</option>
                <option value="civil">Civil</option>
                <option value="specialized">Specialized</option>
                <option value="constitutional">Constitutional</option>
                <option value="adr">ADR</option>
              </select>{" "}
              <input
                type="date"
                name="incidentDate"
                value={form.incidentDate}
                onChange={handleChange}
                className="input"
              />
              <textarea
                name="description"
                placeholder="Case Description"
                value={form.description}
                onChange={handleChange}
                className="input"
              />
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Urgency</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <h3 className="font-medium mt-4">Opponent Details</h3>
              <input
                name="opponentName"
                placeholder="Name"
                value={form.opponentName}
                onChange={handleChange}
                className="input"
              />
              <input
                name="opponentRelation"
                value={form.opponentRelation}
                placeholder="Relationship"
                onChange={handleChange}
                className="input"
              />
              <input
                name="opponentContact"
                value={form.opponentContact}
                placeholder="Contact"
                onChange={handleChange}
                className="input"
              />
              <h3 className="font-medium mt-4">Incident Location</h3>
              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="input"
              />
              <input
                name="state"
                placeholder="State"
                value={form.state}
                onChange={handleChange}
                className="input"
              />
              <input
                name="country"
                placeholder="Country"
                value={form.country}
                onChange={handleChange}
                className="input"
              />
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={prevStep} className="btn-outline">
                  <FaArrowLeft /> Previous
                </button>
                <button
                  disabled={!isStep2Valid || loading}
                  className="btn-outline"
                  onClick={saveDraft}
                >
                  <FaSave /> Save Draft
                </button>
                <button onClick={cancel} className="btn-outline">
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleStep2}
                  className="btn-primary"
                  disabled={!isStep2Valid || loading}
                >
                  {" "}
                  Next <FaArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Upload Documents</h2>

              <input
                name="documentName"
                placeholder="Document Name"
                value={form.documentName}
                onChange={handleChange}
                className="input"
              />

              <select
                name="documentType"
                value={form.documentType}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Type</option>
                <option value="evidence">Evidence</option>
                <option value="legal_notice">Legal Notice</option>
                <option value="agreement">Agreement</option>
                <option value="other">Other</option>
              </select>

              <input
                type="file"
                name="files"
                multiple
                onChange={handleChange}
                className="input"
              />

              {form.files?.length > 0 && (
                <div className="text-sm text-gray-600">
                  {form.files.map((file, index) => (
                    <p key={index}>{file.name}</p>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={prevStep} className="btn-outline">
                  <FaArrowLeft /> Previous
                </button>
                <button onClick={saveDraft} className="btn-outline">
                  <FaSave /> Save Draft
                </button>
                <button onClick={cancel} className="btn-outline">
                  <FaTimes /> Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>{" "}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .input {
          width: 100%;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 8px;
          outline: none;
        }
        .input:focus {
          border-color: black;
        }
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 6px;
          background: black;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
        }
        .btn-outline {
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid black;
          padding: 8px 14px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}
