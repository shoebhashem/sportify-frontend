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

const renderMobileTable = (data) => {
  const key = "clWins";
  const sortedData = [...data].sort((a, b) => b[key] - a[key]);
  const rankedData = assignSharedRanks(sortedData, key);

  return (
    <div className="w-full px-2">
      <div className="flex justify-center mb-2">
        <img
          src="/assets/CL.jpg"
          alt="Champions League Trophy"
          className="h-16 object-contain"
        />
      </div>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Champions League Wins
      </h2>

      <div className="space-y-4">
        {rankedData.map((player) => (
          <div
            key={player._id}
            className="flex items-center bg-white px-5 py-4 rounded-xl shadow-md w-full"
          >
            {/* CL Wins Label + Number */}
            <div className="w-16 text-center text-sm text-gray-600">
              <div className="text-xs">CL Wins:</div>
              <div className="text-2xl font-bold text-blue-600">
                {player.clWins}
              </div>
            </div>

            {/* Profile Picture */}
            <div className="mx-4">
              <img
                src={
                  player.profilePictureUrl ||
                  "https://i.pravatar.cc/150?img=3"
                }
                alt="player"
                className="w-14 h-18 object-cover border rounded-md"
              />
            </div>

            {/* Name, Age, Club */}
            <div className="flex-1 text-sm">
              <div className="font-semibold text-base">{player.name}</div>
              <div className="text-gray-600 text-xs">
                Age: {calculateAge(player.birthDate)}
              </div>
              <div className="text-gray-600 text-xs">
                Club: {player.favoriteClub}
              </div>
            </div>

            {/* Flag */}
            <div className="ml-2">
              <img
                src={`https://flagcdn.com/w80/${
                  countryCodeMap[player.nationality]?.code.toLowerCase() || "un"
                }.png`}
                alt={player.nationality}
                className="w-6 h-4 object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


const LandingPage = ({ players }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-12">
      <Link to="/admin-login">
        <button className="absolute top-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
          Admin
        </button>
      </Link>
      <h1 className="text-3xl font-bold text-center mb-6">Rankings</h1>
      {renderMobileTable(players)}
    </div>
  );
};

export default LandingPage;
