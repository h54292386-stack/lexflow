import { FaUserCheck, FaLock, FaFileAlt, FaComments, FaClock, FaCreditCard ,FaArrowLeft} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <FaUserCheck />,
    title: "Verified Lawyers",
    desc: "Connect with licensed and verified legal professionals you can trust",
  },
  {
    icon: <FaLock />,
    title: "Secure Documents",
    desc: "Control document access with role-based permissions and encryption",
  },
  {
    icon: <FaFileAlt />,
    title: "Case Management",
    desc: "Track all your cases, hearings, and documents in one place",
  },
  {
    icon: <FaComments />,
    title: "Real-Time Chat",
    desc: "Communicate with your lawyer directly through secure messaging",
  },
  {
    icon: <FaClock />,
    title: "Hearing Tracking",
    desc: "Never miss a hearing with automated reminders and scheduling",
  },
  {
    icon: <FaCreditCard />,
    title: "Easy Payments",
    desc: "Secure payment processing with transparent transaction history",
  },
];

export default function Features({ showBackButton = true }) {
      const navigate = useNavigate();

  return (

    <section className="bg-gray-100 h-[650px] py-16 px-6">
      
        {showBackButton && (
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <FaArrowLeft className="w-4 h-4 text-gray-500 hover:text-black transition" />
        </button>
      )}

      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
          Powerful Features
        </h2>
        <p className="mt-3 text-gray-500">
          Everything you need to manage your legal cases effectively
        </p>
      </div>

      <div className="mt-12 max-w-6xl mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-lg mb-4">
              {item.icon}
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h3>

            <p className="mt-2 text-gray-500 text-sm">
              {item.desc}
            </p>
          </div>
        ))}

      </div>
    </section>
  );
}