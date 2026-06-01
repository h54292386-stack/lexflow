import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getPendingLawyers,
  approveLawyer,
  rejectLawyer,
} from "../../service/AuthService.js";
import Swal from "sweetalert2";


const LawyerVerification = () => {
  const [lawyers, setLawyers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchLawyers = async () => {
    try {
      const res =
        await getPendingLawyers();

      setLawyers(res.data);

    } catch (err) {
      toast.error(
        "Failed to fetch lawyers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, []);

 const handleApprove = async (lawyerId) => {
  const result = await Swal.fire({
    title: "Approve Lawyer?",
    text: "This lawyer will be allowed to use the platform.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Approve",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await approveLawyer(lawyerId);

    toast.success("Lawyer approved");

    fetchLawyers();

  } catch (err) {
    toast.error("Approval failed");
  }
};

const handleReject = async (lawyerId) => {
  const result = await Swal.fire({
    title: "Reject Lawyer?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Reject",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    await rejectLawyer(lawyerId);

    toast.success("Lawyer rejected");

    fetchLawyers();

  } catch (err) {
    toast.error("Rejection failed");
  }
};

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Lawyer Verification Requests
      </h1>

      {lawyers.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">
          No pending verification requests
        </div>
      ) : (
        <div className="grid gap-6">

          {lawyers.map((lawyer) => (
            <div
              key={lawyer.id}
              className="bg-white p-6 rounded-2xl shadow"
            >

              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-2xl font-bold">
                    {lawyer.name}
                  </h2>

                  <p className="text-gray-500">
                    {lawyer.email}
                  </p>

                  <p className="mt-2">
                    <span className="font-semibold">
                      Experience:
                    </span>{" "}
                    {
                      lawyer.experience
                    }{" "}
                    years
                  </p>

                  <p>
                    <span className="font-semibold">
                      Specialization:
                    </span>{" "}
                    {lawyer.specialization?.join(
                      ", "
                    )}
                  </p>
                </div>

                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      handleApprove(
                        lawyer.id
                      )
                    }
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleReject(
                        lawyer.id
                      )
                    }
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* EDUCATION */}

              <div className="mt-5">
                <h3 className="font-semibold mb-2">
                  Education
                </h3>

                <div className="space-y-3">

                  {lawyer.education?.map(
                    (edu, index) => (
                      <div
                        key={index}
                        className="border p-3 rounded-lg"
                      >
                        <p>
                          <span className="font-medium">
                            Degree:
                          </span>{" "}
                          {edu.degree}
                        </p>

                        <p>
                          <span className="font-medium">
                            University:
                          </span>{" "}
                          {
                            edu.university
                          }
                        </p>

                        <p>
                          <span className="font-medium">
                            Years:
                          </span>{" "}
                          {
                            edu.startYear
                          }{" "}
                          -{" "}
                          {edu.endYear}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* DOCUMENTS */}

              <div className="mt-5">
                <h3 className="font-semibold mb-3">
                  Documents
                </h3>

                <div className="flex flex-wrap gap-3">

                  <a
                    href={
                      lawyer.documents
                        ?.barCertificate
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-lg"
                  >
                    Bar Certificate
                  </a>

                  <a
                    href={
                      lawyer.documents
                        ?.enrollmentCertificate
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-lg"
                  >
                    Enrollment Certificate
                  </a>

                  <a
                    href={
                      lawyer.documents
                        ?.idProof
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black text-white px-4 py-2 rounded-lg"
                  >
                    ID Proof
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LawyerVerification;