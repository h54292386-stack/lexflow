import { MdBalance } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = () => {
    setLoading(true);

    setTimeout(() => {
      navigate("/register");
    }, 700);
  };

  return (
    <>
      <nav className="flex items-center px-10 py-4 shadow-sm bg-white">
        
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MdBalance size={28} />
          LexFlow
        </h2>

        <ul className="flex gap-6 text-gray-600 ml-auto mr-20">
          <li><Link to="/" className="hover:text-black">Home</Link></li>
          <li><Link to="/features" className="hover:text-black">Features</Link></li>
          <li><Link to="/about" className="hover:text-black">About</Link></li>
        </ul>

        <button
          onClick={handleSignup}
          className="text-sm font-medium hover:text-gray-600"
        >
          Sign Up
        </button>
      </nav>

      {loading && (
        <div className="fixed inset-0 bg-white/15 flex items-center justify-center z-50">
          <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
}