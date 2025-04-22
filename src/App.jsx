import React from "react";
import LandingPage from "./landingPage";
import AdminLogin from "./AdminLogin";
import MainAdminPage from "./MainAdminPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import usePlayers from "./hooks/usePlayers"; // ✅ Your custom hook

function App() {
  const { players, loading, error } = usePlayers();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  if (loading) return <p className="p-4 text-center">Loading players...</p>;
  if (error) return <p className="p-4 text-center text-red-600">Error loading players.</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage players={players} />} />
        <Route
          path="/admin-login"
          element={<AdminLogin setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/admin"
          element={
            isAuthenticated ? (
              <MainAdminPage players={players} />
            ) : (
              <Navigate to="/admin-login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
