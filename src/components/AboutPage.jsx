import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Rankings
          </Link>
        </div>

        {/* Main Content */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-8">
            Just Good Vibes
          </h1>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;