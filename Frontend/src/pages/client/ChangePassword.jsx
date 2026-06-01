import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../../service/AuthService";
import {
  FiLock,
  FiShield,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function ChangePassword() {
     const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      return toast.error(
        "Passwords do not match"
      );
    }

    try {
      setLoading(true);

      const response = await changePassword({
        currentPassword:
          formData.currentPassword,
        newPassword: formData.newPassword,
      });

      toast.success(response.message);

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Failed to change password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
 <button
                  onClick={() => navigate("/home")}
                  className="absolute top-6 left-6 flex items-center gap-2 text-gray-700 hover:text-black"
                >
                 <FaArrowLeft className="w-4 h-4 text-gray-500 hover:text-black transition" />
                </button>
      {/* Header */}
      <div className="bg-black px-8 py-6 text-white">

        <div className="flex items-center gap-3">

          <div className="bg-white/20 p-3 rounded-xl">
            <FiShield size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Change Password
            </h2>

            <p className="text-gray-300 text-sm mt-1">
              Keep your account secure by updating your password regularly.
            </p>
          </div>

        </div>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="p-8 space-y-6"
      >

        {/* Current Password */}
        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Password
          </label>

          <div className="relative">

            <FiLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type={
                showPassword.current
                  ? "text"
                  : "password"
              }
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Enter current password"
              className="w-full border border-gray-300 rounded-xl pl-11 pr-12 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />

            <button
              type="button"
              onClick={() =>
                togglePassword("current")
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword.current ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>

          </div>

        </div>

        {/* New Password */}
        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>

          <div className="relative">

            <FiLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type={
                showPassword.new
                  ? "text"
                  : "password"
              }
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={9}
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-xl pl-11 pr-12 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />

            <button
              type="button"
              onClick={() =>
                togglePassword("new")
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword.new ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>

          </div>

          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">

            <p className="text-sm text-gray-600 leading-relaxed">
              Your password should contain:
            </p>

            <ul className="text-sm text-gray-500 mt-2 space-y-1 list-disc list-inside">
              <li>At least 9 characters</li>
              <li>One uppercase or lowercase letter</li>
              <li>One number</li>
              <li>One special character</li>
            </ul>

          </div>

        </div>

        {/* Confirm Password */}
        <div>

          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm Password
          </label>

          <div className="relative">

            <FiLock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type={
                showPassword.confirm
                  ? "text"
                  : "password"
              }
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-xl pl-11 pr-12 py-3 outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />

            <button
              type="button"
              onClick={() =>
                togglePassword("confirm")
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
            >
              {showPassword.confirm ? (
                <FiEyeOff size={20} />
              ) : (
                <FiEye size={20} />
              )}
            </button>

          </div>

        </div>

        {/* Submit Button */}
        <div className="pt-2">

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-slate-900 disabled:bg-slate-700 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
          >
            {loading
              ? "Changing Password..."
              : "Update Password"}
          </button>

        </div>

      </form>

    </div>
  );
}