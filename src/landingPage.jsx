import React from "react";
import countryCodeMap from "./countryCodeMap"; 
import { Link } from "react-router-dom";


const assignSharedRanks = (data, key) => {
  let lastValue = null;
  let rank = 1;

  return data.map((player, index) => {
    if (player[key] !== lastValue) {
      player.rank = rank;
    } else {
      player.rank = rank - 1;
    }
    lastValue = player[key];
    rank++;
    return player;
  });
};

const renderTable = (data, type) => {
  const key = type === "cl" ? "clWins" : "ulWins";
  const sortedData = [...data].sort((a, b) => b[key] - a[key]);
  const rankedData = assignSharedRanks(sortedData, key);

  return (
    <div className="w-full md:w-1/2 p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        {type === "cl" ? "Champions League Wins" : "UEFA League Wins"}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-md bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3">Rank</th>
              <th className="p-3">Player</th>
              <th className="p-3">Represents</th>
              <th className="p-3">Favorite Club</th>
              <th className="p-3">{type.toUpperCase()} Wins</th>
            </tr>
          </thead>
          <tbody>
            {rankedData.map((player) => (
              <tr key={player._id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{player.rank}</td>
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={player.imageUrl || "/placeholder.png"}
                    alt="player"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{player.name}</span>
                </td>
                <td className="p-3">
                  <img
                    src={`https://flagcdn.com/w320/${countryCodeMap[player.nationality]?.code.toLowerCase() || "un"}.png`}
                    alt={player.nationality}
                    style={{ width: 24, height: 16 }}
                  />
                </td>
                <td className="p-3">{player.favoriteClub}</td>
                <td className="p-3">
                  {type === "cl" ? player.clWins : player.ulWins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LandingPage = ({ players }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Link to="/admin-login">
        <button className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
          Admin
        </button>
      </Link>
      <h1 className="text-3xl font-bold text-center mb-8">Sportify Rankings</h1>
      <div className="flex flex-col md:flex-row">
        {renderTable(players, "cl")}
        {renderTable(players, "ul")}
      </div>
    </div>
  );
};

export default LandingPage;
