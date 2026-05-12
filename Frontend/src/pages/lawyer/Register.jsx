import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerLawyer } from "../../service/AuthService.js";
import toast from "react-hot-toast";
import legal from "../../assets/legal-5.jpg.png";
import { MdBalance } from "react-icons/md";

const LawyerRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    barCouncilNumber: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!form.barCouncilNumber.trim()) {
      toast.error("Bar Council Number is required ⚖️");
      return false;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await registerLawyer(form);

      toast.success(res.message || "Lawyer registered successfully ");

      navigate("/lawyer/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="flex w-[750px] bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="w-1/2 hidden md:block relative">
          <img
            src={legal}
            alt="law"
            className="h-[460px] w-full object-cover"
          />

          <div className="absolute inset-0 flex pt-5 items-start justify-center">
            <p className="text-white text-sm bg-black/40 px-4 py-2 rounded">
              EASY AND CONVENIENT WAY TO SEEK JUSTICE
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-xl font-bold flex items-center justify-center gap-2">
            <MdBalance size={28} />
            LexFlow
          </h2>

          <p className="text-gray-500 text-sm mb-4 text-center">
            Create an Account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              name="barCouncilNumber"
              placeholder="Bar Council Number"
              value={form.barCouncilNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have an account?{" "}
            <Link to="/lawyer/login" className="text-indigo-600">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LawyerRegister;
