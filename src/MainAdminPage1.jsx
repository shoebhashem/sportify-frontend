import React from "react";
import { useNavigate } from "react-router-dom";
import countryCodeMap from "./countryCodeMap";

const MainAdminPage = ({ players }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Action buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
          onClick={() => navigate("/admin/report-result")}
        >
          Report New Result
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
          onClick={() => navigate("/admin/add-player")}
        >
          Add Player
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
          onClick={() => navigate("/admin/remove-player")}
        >
          Remove Player
        </button>
      </div>

      {/* Player list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {players.map((player) => (
          <div
            key={player._id}
            className="bg-white p-4 rounded-lg shadow border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-2">
              <img
                src={player.imageUrl || "/placeholder.png"}
                alt={player.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-bold">{player.name}</h2>
                <p className="text-sm text-gray-600">{player.favoriteClub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Nationality:</span>
              <img
                src={`https://flagcdn.com/w40/${countryCodeMap[player.nationality]?.code.toLowerCase() || "un"}.png`}
                alt={player.nationality}
                style={{ width: 24, height: 16 }}
              />
              <span>{player.nationality}</span>
            </div>
            <div className="text-sm mt-2">
              CL Wins: {player.clWins} | UL Wins: {player.ulWins}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainAdminPage;
