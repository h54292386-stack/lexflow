import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerClient ,googleLoginClient} from "../../service/AuthService.js";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import legal from "../../assets/legal-5.jpg.png";
import { MdBalance } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

function Register() {
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      if (loading) return; // 🔥 VERY IMPORTANT

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await registerClient(formData);

      toast.success(res.message || "OTP sent to email");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: {
            email: formData.email,
          },
        });
      }, 1000);
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong ";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

   const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLoginClient(credentialResponse.credential);

      const { accessToken, user } = res;

      login(user, accessToken);

      toast.success("Google login successful ");

      navigate("/home");
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
<>
     <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <FaArrowLeft className="w-4 h-4 text-gray-500 hover:text-black transition" />
        </button>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-[750px] bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="w-1/2 hidden md:block relative">
          <img
            src={legal}
            alt="law"
            className="h-[450px] w-full object-cover"
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
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
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

           <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center ">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Google Login Failed")}
          />
        </div>
        </div>
      </div>
    </div>

    </>
  );
}

export default Register;
