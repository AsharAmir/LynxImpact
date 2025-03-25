import React from "react";
import { Link } from "react-router-dom";
import { Car, Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed w-full top-0 z-50 bg-[#070a2a] backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-start space-x-2">
            <img
              src="../hero_logo.png"
              alt="CarAI Studio Logo"
              className="h-48 w-auto"
            />
          </Link>
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Hjem
            </Link>
            {/* <Link
              to="#"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Eksempler
            </Link> */}
            {/* <Link
              to="#"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              Priser
            </Link> */}
            <Link
              to="/upload"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Forbedre nå
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
