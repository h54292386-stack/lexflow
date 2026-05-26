import { useParams } from "react-router-dom";

export default function CaseDetails() {

  const { id } = useParams();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-black">
              Case Details
            </h1>

            <p className="text-gray-500 mt-1">
              Case ID: {id}
            </p>
          </div>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            Active
          </span>
        </div>
      </div>

      {/* Case Information */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

        <h2 className="text-xl font-semibold mb-6">
          Case Information
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500 text-sm">
              Client Name
            </p>

            <h3 className="font-semibold text-lg">
              John Doe
            </h3>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Case Type
            </p>

            <h3 className="font-semibold text-lg">
              Property Dispute
            </h3>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Hearing Date
            </p>

            <h3 className="font-semibold text-lg">
              25 May 2026
            </h3>
          </div>

          <div>
            <p className="text-gray-500 text-sm">
              Priority
            </p>

            <h3 className="font-semibold text-lg text-red-600">
              High
            </h3>
          </div>

        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">

        <h2 className="text-xl font-semibold mb-4">
          Case Description
        </h2>

        <p className="text-gray-600 leading-7">
          This case involves a property ownership dispute
          between two parties regarding inheritance rights
          and legal transfer documents.
        </p>
      </div>

    </div>
  );
}