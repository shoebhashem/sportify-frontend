import React, { useState } from "react";
import usePlayers from "../hooks/usePlayers";
import PlayerForm from "./PlayerForm";
import PlayerCard from "./PlayerCard";
import AdminSessionsPage from "./AdminSessionsPage";
import { useNavigate } from "react-router-dom";
import { Users, Calendar } from "lucide-react";

const MainAdminPage = () => {
  const { players, setPlayers, loading, error, deletePlayer } = usePlayers();
  const [editPlayer, setEditPlayer] = useState(null);
  const [activeTab, setActiveTab] = useState("players"); // "players" or "sessions"
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  // Sort players alphabetically by name
  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("players")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors ${
              activeTab === "players"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <Users className="w-5 h-5" />
            Player Management
          </button>
          <button
            onClick={() => setActiveTab("sessions")}
            className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors ${
              activeTab === "sessions"
                ? "border-blue-600 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-gray-800"
            }`}
          >
            <Calendar className="w-5 h-5" />
            Session Management
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error loading data</p>}
      
      {!loading && !error && (
        <>
          {/* Players Tab */}
          {activeTab === "players" && (
            <>
              <PlayerForm 
                players={players}  
                setPlayers={setPlayers}
                editPlayer={editPlayer}
                setEditPlayer={setEditPlayer}
              />
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Players (Alphabetical Order)</h2>
                {sortedPlayers.map((player) => (
                  <PlayerCard
                    key={player._id}
                    player={player}
                    setPlayers={setPlayers}
                    deletePlayer={deletePlayer}
                    setEditPlayer={(player) => {
                      setEditPlayer(player);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <AdminSessionsPage players={players} />
          )}
        </>
      )}
    </div>
  );
};

export default MainAdminPage;
