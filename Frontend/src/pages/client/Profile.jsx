import { useEffect, useState, useRef } from "react";
import {
  getClientProfile,
  updateClientProfile,
  uploadProfileImage,
} from "../../service/AuthService.js";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getClientProfile();
        setUser(res.user);
      } catch (err) {
        console.log(err?.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (formData) => {
    try {
      const res = await updateClientProfile(formData);
      setUser(res.user);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.log(err?.response?.data || err.message);
      toast.error("Update failed");
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const data = new FormData();
      data.append("image", file);

      const res = await uploadProfileImage(data);
      setUser(res.user);

      toast.success("Profile image updated");
    } catch (err) {
      console.log(err?.response?.data || err.message);
      toast.error("Image upload failed");
    }
  };

  if (loading) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="md:col-span-1">
            <ProfileImageUpload
              image={user?.profileImage}
              onUpload={handleImageUpload}
            />

            <ProfileCard user={user} />
          </div>

          {/* RIGHT */}
          <div className="md:col-span-2">

            {/* EDIT BUTTON */}
            <div className="flex justify-end mb-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-black text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>

            <ProfileForm
              user={user}
              onSave={handleUpdate}
              isEditing={isEditing}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= PROFILE CARD ================= */
function ProfileCard({ user }) {
  return (
    <div className="bg-gray-50 p-4 rounded-xl mt-4">
      <p className="font-semibold text-lg">{user?.name}</p>
      <p className="text-gray-600">{user?.email}</p>
      <p className="text-gray-600">{user?.phone}</p>
      <p className="text-gray-600">{user?.gender}</p>
    </div>
  );
}

/* ================= PROFILE FORM ================= */
function ProfileForm({ user, onSave, isEditing }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    alternatePhone: user?.alternatePhone || "",
    gender: user?.gender || "",
    dateOfBirth: user?.dateOfBirth
      ? user.dateOfBirth.split("T")[0]
      : "",

    address: {
      houseFlatNo: user?.address?.houseFlatNo || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pinCode: user?.address?.pinCode || "",
      country: user?.address?.country || "India",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.address) {
      setForm({
        ...form,
        address: {
          ...form.address,
          [name]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="name"
        className="w-full p-2 border rounded"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="phone"
        className="w-full p-2 border rounded"
      />

      <input
        name="alternatePhone"
        value={form.alternatePhone}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="alternatePhone"
        className="w-full p-2 border rounded"
      />

      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
        disabled={!isEditing}
        className="w-full p-2 border rounded"
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
        disabled={!isEditing}
        placeholder="dateOfBirth"
        className="w-full p-2 border rounded"
      />

      {/* ADDRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        <input
          name="houseFlatNo"
          value={form.address.houseFlatNo}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="houseFlatNo"
          className="p-2 border rounded"
        />

        <input
          name="street"
          value={form.address.street}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="street"
          className="p-2 border rounded"
        />

        <input
          name="city"
          value={form.address.city}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="city"
          className="p-2 border rounded"
        />

        <input
          name="state"
          value={form.address.state}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="state"
          className="p-2 border rounded"
        />

        <input
          name="pinCode"
          value={form.address.pinCode}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="pinCode"
          className="p-2 border rounded"
        />

        <input
          name="country"
          value={form.address.country}
          onChange={handleChange}
          disabled={!isEditing}
          placeholder="country"
          className="p-2 border rounded"
        />

      </div>

      {isEditing && (
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      )}

    </form>
  );
}

/* ================= IMAGE UPLOAD ================= */
function ProfileImageUpload({ image, onUpload }) {
  const fileRef = useRef();

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="flex flex-col items-center mb-4">

      <img
        src={image || "https://i.pinimg.com/736x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg"}
        className="w-32 h-32 rounded-full object-cover border"
      />

      <input
        type="file"
        ref={fileRef}
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="mt-3 px-4 py-2 bg-black text-white rounded-lg"
      >
        Change Photo
      </button>

    </div>
  );
}