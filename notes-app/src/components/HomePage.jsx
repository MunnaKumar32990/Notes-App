import { Link } from "react-router-dom";
import { useState } from "react";

const Homepage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* Fixed Navigation Bar */}
      <nav className="w-full fixed top-0 left-0 bg-white shadow-md py-4 px-8 flex justify-between items-center z-50">
        <h1 className="text-2xl font-bold text-gray-800">Notes App</h1>
        <button 
          className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          onClick={() => setShowModal(true)}
        >
          Get Started
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full mt-24">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
            The most powerful note-taking tool
          </h2>
          <p className="mt-4 text-gray-600">
            Organize your tasks, notes, and schedule efficiently to stay productive all day long.
          </p>
          <div className="mt-6 flex space-x-4">
            <Link to="/login" className="btn btn-primary px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition">
              Login
            </Link>
            <Link to="/signup" className="btn btn-success px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
              Signup
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
          <img src="/3297140.jpg" alt="Notes App Preview" className="w-full max-w-md rounded-lg shadow-lg transform transition duration-500 hover:scale-105" />
        </div>
      </div>

      {/* Modal for "Get Started" with Animation */}
      {showModal && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center z-50">
          <div 
            className="bg-white rounded-lg shadow-lg p-6 w-96 text-center transform transition duration-500 ease-out scale-95 opacity-0"
            style={{ animation: 'fadeIn 0.5s forwards' }}
          >
            <h2 className="text-2xl font-bold text-gray-800">Welcome to Notes App</h2>
            <p className="text-gray-600 mt-2">Please log in or sign up to continue.</p>
            <div className="mt-6 flex flex-col space-y-4">
              <Link to="/login" className="btn btn-primary px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition">
                Login
              </Link>
              <Link to="/signup" className="btn btn-success px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition">
                Signup
              </Link>
            </div>
            <button 
              className="mt-4 text-gray-500 hover:text-gray-700 transition"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DaisyUI Icon + Animation for Logo */}
      <div className="absolute bottom-6 left-6 animate-pulse">
        <span className="text-xl font-bold text-gray-800">
          <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>Bright Ideas
        </span>
      </div>

      {/* Custom Styles for Fade In Animation */}
      <style>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

    </div>
  );
};

export default Homepage;
