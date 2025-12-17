// src/components/PlayerList.jsx

import React from "react";

const PlayerList = ({ players, deletePlayer, setEditPlayer }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Current Players</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player._id} className="bg-white p-4 rounded shadow">
            <div className="w-full h-60 mb-2 flex items-center justify-center bg-gray-100 rounded">
              <img
                src={player.profilePictureUrl}
                alt={player.name}
                className="max-h-full max-w-full object-contain rounded"
              />
            </div>
            <h3 className="text-xl font-semibold">{player.name}</h3>
            <p><strong>Nationality:</strong> {player.nationality}</p>
            <p><strong>Club:</strong> {player.favoriteClub}</p>
            <p><strong>CL Wins:</strong> {player.clWins}</p>
            <p><strong>EL Wins:</strong> {player.ulWins}</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditPlayer(player)}
                className="bg-yellow-500 text-white py-1 px-3 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deletePlayer(player._id)}
                className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
