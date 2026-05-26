import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  updateLawyerProfile,
  uploadLawyerProfileImage,
} from "../../service/AuthService.js";

export default function CompleteLawyerProfile() {
  const navigate = useNavigate();

  const fileRef = useRef();

  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [image, setImage] = useState("");

  const [form, setForm] = useState({
    phone: "",
    alternatePhone: "",
    gender: "",
    dateOfBirth: "",

    officeAddress: {
      officeName: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.officeAddress) {
      setForm({
        ...form,
        officeAddress: {
          ...form.officeAddress,
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

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      const data = new FormData();

      data.append("image", file);

      const res = await uploadLawyerProfileImage(data);

      setImage(res.user.profileImage);

      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,
        profileImage: image,
      };

      await updateLawyerProfile(payload);

      toast.success("Lawyer profile completed");

      setRedirecting(true);

      setTimeout(() => {
        navigate("/lawyer/home", {
          replace: true,
        });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      {redirecting && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center">
          <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

          <p className="text-white mt-4 text-lg font-medium">
            Setting up your lawyer account...
          </p>
        </div>
      )}

      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {/* LEFT */}
        <div className="bg-black text-white p-8 flex flex-col items-center justify-center">
          <img
            src={
              image ||
              "https://i.pinimg.com/736x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg"
            }
            alt="profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white"
          />

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            className="hidden"
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />

          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="mt-4 bg-white text-black px-4 py-2 rounded-lg"
          >
            Upload Photo
          </button>

          <h2 className="text-2xl font-bold mt-8 text-center">
            Complete Lawyer Profile
          </h2>

          <p className="text-sm text-gray-300 text-center mt-2">
            Finish setting up your professional profile
          </p>
        </div>

        {/* RIGHT */}
        <div className="md:col-span-2 p-8 overflow-y-auto max-h-screen">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* BASIC */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />

              <input
                type="text"
                name="alternatePhone"
                placeholder="Alternate Phone"
                value={form.alternatePhone}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />
            </div>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Gender</option>

              <option value="male">Male</option>

              <option value="female">Female</option>

              <option value="other">Other</option>
            </select>

            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            {/* ADDRESS */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Office Address</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="officeName"
                  placeholder="officeName / Flat No"
                  value={form.officeAddress.officeName}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={form.officeAddress.street}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={form.officeAddress.city}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={form.officeAddress.state}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="pinCode"
                  placeholder="PIN Code"
                  value={form.officeAddress.pinCode}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />

                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={form.officeAddress.country}
                  onChange={handleChange}
                  className="border p-3 rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || redirecting}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold"
            >
              {loading || redirecting
                ? "Please wait..."
                : "Complete Setup"}{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
