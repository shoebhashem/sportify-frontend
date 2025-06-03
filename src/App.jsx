import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AdminLoginPage from "./components/AdminLoginPage";
import MainAdminPage from "./components/MainAdminPage";
import AboutPage from "./components/AboutPage";
import usePlayers from "./hooks/usePlayers";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
  const { players, loading, error } = usePlayers();

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error loading players</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage players={players} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin-login" element={<AdminLoginPage setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/admin"
          element={
            isAuthenticated ? <MainAdminPage /> : <Navigate to="/admin-login" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
