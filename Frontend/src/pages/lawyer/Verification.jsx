import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { submitLawyerVerification } from "../../service/AuthService.js";

export default function Verification() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    experience: "",

    specialization: "",

    education: [
      {
        degree: "",
        fieldOfStudy: "",
        university: "",
        startYear: "",
        endYear: "",
        grade: "",
      },
    ],
  });

  const [documents, setDocuments] = useState({
    barCertificate: null,
    enrollmentCertificate: null,
    idProof: null,
    additionalDocuments: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.education) {
      setForm({
        ...form,
        education: {
          ...form.education,
          [name]: value,
        },
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "additionalDocuments") {
      setDocuments({
        ...documents,
        additionalDocuments: [...files],
      });
    } else {
      setDocuments({
        ...documents,
        [name]: files[0],
      });
    }
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;

    const updatedEducation = [...form.education];

    updatedEducation[index][name] = value;

    setForm({
      ...form,
      education: updatedEducation,
    });
  };

  const addEducationField = () => {
    setForm({
      ...form,
      education: [
        ...form.education,
        {
          degree: "",
          fieldOfStudy: "",
          university: "",
          startYear: "",
          endYear: "",
          grade: "",
        },
      ],
    });
  };

  const removeEducationField = (index) => {
    const updatedEducation = form.education.filter((_, i) => i !== index);

    setForm({
      ...form,
      education: updatedEducation,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("experience", form.experience);

      formData.append(
        "specialization",
        JSON.stringify(form.specialization.split(",").map((s) => s.trim())),
      );

      formData.append("education", JSON.stringify(form.education));

      formData.append("barCertificate", documents.barCertificate);

      formData.append("enrollmentCertificate", documents.enrollmentCertificate);

      formData.append("idProof", documents.idProof);

      documents.additionalDocuments.forEach((file) => {
        formData.append("additionalDocuments", file);
      });

      await submitLawyerVerification(formData);

      toast.success("Verification submitted successfully");

      navigate("/lawyer/home", {
        replace: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="bg-black text-white p-8">
          <h1 className="text-3xl font-bold">Lawyer Verification</h1>

          <p className="text-gray-300 mt-2">
            Submit your professional details for verification
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* EXPERIENCE */}
          <div>
            <label className="block font-semibold mb-2">
              Years of Experience
            </label>

            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Enter experience"
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          {/* SPECIALIZATION */}
          <div>
            <label className="block font-semibold mb-2">Specialization</label>

            <input
              type="text"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Example: Criminal Law, Family Law"
              className="w-full border p-3 rounded-lg"
              required
            />

            <p className="text-sm text-gray-500 mt-1">
              Separate multiple specializations using commas
            </p>
          </div>

          {/* EDUCATION */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Education Details</h2>

              <button
                type="button"
                onClick={addEducationField}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                + Add Education
              </button>
            </div>

            {form.education.map((edu, index) => (
              <div key={index} className="border rounded-xl p-5 mb-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, e)}
                    placeholder="Degree"
                    className="border p-3 rounded-lg"
                    required
                  />

                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleEducationChange(index, e)}
                    placeholder="Field of Study"
                    className="border p-3 rounded-lg"
                  />

                  <input
                    type="text"
                    name="university"
                    value={edu.university}
                    onChange={(e) => handleEducationChange(index, e)}
                    placeholder="University"
                    className="border p-3 rounded-lg"
                    required
                  />

                  <input
                    type="number"
                    name="startYear"
                    value={edu.startYear}
                    onChange={(e) => handleEducationChange(index, e)}
                    placeholder="Start Year"
                    className="border p-3 rounded-lg"
                  />

                  <input
                    type="number"
                    name="endYear"
                    value={edu.endYear}
                    onChange={(e) => handleEducationChange(index, e)}
                    placeholder="End Year"
                    className="border p-3 rounded-lg"
                  />

                  <input
                    type="text"
                    name="grade"
                    value={edu.grade}
                    onChange={(e) => handleEducationChange(index, e)}
                    placeholder="Grade / CGPA"
                    className="border p-3 rounded-lg"
                  />
                </div>

                {form.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducationField(index)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {/* DOCUMENTS */}
          <div>
            <h2 className="text-xl font-bold mb-4">Upload Documents</h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">
                  Bar Certificate
                </label>

                <input
                  type="file"
                  name="barCertificate"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Enrollment Certificate
                </label>

                <input
                  type="file"
                  name="enrollmentCertificate"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">ID Proof</label>

                <input
                  type="file"
                  name="idProof"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Additional Documents
                </label>

                <input
                  type="file"
                  name="additionalDocuments"
                  multiple
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            {loading ? "Submitting..." : "Submit Verification"}
          </button>
        </form>
      </div>
    </div>
  );
}
