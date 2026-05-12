import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import { useAuth } from "../../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { MdBalance } from "react-icons/md";
import { loginClient } from "../../service/AuthService.js";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (form.password.length < 9) {
      toast.error("Password must be at least 9 characters");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginClient(form);

      const { accessToken, user } = res;

      login(user, accessToken);

      toast.success("Login successful ");

      navigate("/home");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold flex items-center justify-center gap-2">
          <MdBalance size={28} />
          LexFlow
        </h2>

        <p className="text-gray-500 text-sm mb-4 text-center">
          Welcome Back! Please enter your login details
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium">
            Register Now
          </Link>
        </p>

     

      </div>
    </div>
  );
};

export default Login;
