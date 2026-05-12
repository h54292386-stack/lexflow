import {  FaBalanceScale } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black h-[280px] text-white py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaBalanceScale />
            <h3 className="text-lg font-semibold">
                <Link to="\">LexFlow</Link></h3>
          </div>
          <p className="text-sm text-gray-400">
            Efficient and secure legal case workflow management platform.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-gray-200">Home</Link></li>
            <li><Link to="/features" className="hover:text-gray-200">Features</Link></li>
            <li><Link to="/about" className="hover:text-gray-200">About</Link></li>
            <li><Link to="/login" className="hover:text-gray-200">Login</Link></li>
          </ul>
        </div>

         <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>info@lexflow.com</li>
            <li>+1 (555) 123-4567</li>
            <li>New York, NY</li>
          </ul>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-8">
        © 2026 LexFlow. All rights reserved.
      </p>
    </footer>
  );
}
