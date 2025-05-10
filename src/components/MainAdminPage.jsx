import React, { useState } from "react";
import usePlayers from "../hooks/usePlayers";
import PlayerForm from "./PlayerForm";
//import PlayerList from "./PlayerList";
//import PlayerCard from "./PlayerCard";
import { useNavigate } from "react-router-dom";
import PlayerCard from "./PlayerCard";

const MainAdminPage = () => {
  const { players, setPlayers, loading, error, deletePlayer } = usePlayers();
  const [editPlayer, setEditPlayer] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {loading && <p>Loading players...</p>}
      {error && <p className="text-red-500">Error loading players</p>}
      {!loading && !error && (
        <>
        <PlayerForm 
          players={players}  
          setPlayers={setPlayers}
          editPlayer={editPlayer} // Pass the editPlayer state to the form
          setEditPlayer={setEditPlayer} // Allow form to update the player state
        />
          <div className="mt-8">
            {/* Loop through players to display each one */}
            {players.map((player) => (
              <PlayerCard
                key={player._id} // Make sure to add a unique key for each player
                player={player} // Pass individual player as prop
                setPlayers={setPlayers}
                deletePlayer={deletePlayer}
                setEditPlayer={(player) => {
                  setEditPlayer(player);
                  window.scrollTo({ top: 0, behavior: "smooth" }); // 👈 scroll to top
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MainAdminPage;
