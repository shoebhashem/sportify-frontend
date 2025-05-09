import React from "react";
import countryCodeMap from "../countryCodeMap"; 
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

const calculateAge = (birthDate) => {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};


const renderTable = (data, type) => {
  const key = type === "cl" ? "clWins" : "ulWins";
  const sortedData = [...data].sort((a, b) => b[key] - a[key]);
  const rankedData = assignSharedRanks(sortedData, key);

  return (
    <div className="w-full md:w-1/2 p-4">
      {/* Trophy Image */}
      <div className="flex justify-center mb-2">
        <img
          src={type === "cl" ? "/assets/CL.jpg" : "/assets/ul.jpg"}
          alt={type === "cl" ? "Champions League Trophy" : "UEFA League Trophy"}
          className="h-16 object-contain"
        />
      </div>
      <h2 className="text-xl font-semibold mb-4 text-center">
        {type === "cl" ? "Champions League Wins" : "UEFA League Wins"}
      </h2>

      <div className="overflow-x-auto">
        <div className="min-w-[600px] w-full">
          <table className="w-full table-fixed border border-gray-300 rounded-lg shadow-md bg-white text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="p-2 w-[40px]">Rank</th>
                <th className="p-2 w-[150px]">Player</th>
                <th className="p-2 w-[50px]">Age</th>
                <th className="p-2 w-[60px]">Rep.</th>
                <th className="p-2 w-[100px]">Club</th>
                <th className="p-2 w-[50px]">{type.toUpperCase()} Wins</th>
              </tr>
            </thead>
            <tbody>
              {rankedData.map((player) => (
                <tr key={player._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{player.rank}</td>
                  <td className="p-2 flex items-center gap-2">
                    <img
                      src={
                        player.profilePictureUrl ||
                        "https://i.pravatar.cc/150?img=3"
                      }
                      alt="player"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="truncate">{player.name}</span>
                  </td>
                  <td className="p-2">{calculateAge(player.birthDate)}</td>
                  <td className="p-2">
                    <img
                      src={`https://flagcdn.com/w320/${
                        countryCodeMap[player.nationality]?.code.toLowerCase() || "un"
                      }.png`}
                      alt={player.nationality}
                      className="w-6 h-4 object-cover"
                    />
                  </td>
                  <td className="p-2">{player.favoriteClub}</td>
                  <td className="p-2">
                    {type === "cl" ? player.clWins : player.ulWins}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      <h1 className="text-3xl font-bold text-center mb-8">Rankings</h1>
      <div className="flex flex-col md:flex-row">
        {renderTable(players, "cl")}
        {renderTable(players, "ul")}
      </div>
    </div>
  );
};

export default LandingPage;
