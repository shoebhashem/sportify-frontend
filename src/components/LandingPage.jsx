import React, { useState } from "react";
import countryCodeMap from "../countryCodeMap";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";


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

const LandingPage = ({ players }) => {
  const [modalImage, setModalImage] = useState(null);

  const openImageModal = (url) => setModalImage(url);
  const closeImageModal = () => setModalImage(null);

  const key = "clWins";
  const sortedData = [...players].sort((a, b) => b[key] - a[key]);
  const rankedData = assignSharedRanks(sortedData, key);

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-12 text-center relative">
      {/* Modal for Enlarged Image */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-all duration-300 p-4">
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={modalImage}
              alt="Enlarged player"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 text-lg font-bold shadow-lg hover:bg-red-500 hover:text-white transition"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-end sm:items-center sm:flex-row sm:justify-between mb-4">
        <div className="sm:order-2">
          <HamburgerMenu />
        </div>
        <h1 className="text-3xl font-bold text-blue-600 sm:order-1 mt-2 sm:mt-0 text-right sm:text-center w-full sm:w-auto">
          Just Good Vibes
        </h1>
      </div>


      {/*<div className="flex justify-end mb-4">
        <Link to="/admin-login">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow">
            Admin
          </button>
        </Link>
      </div>*/}

      <h2 className="text-3xl font-bold mb-6">Rankings</h2>

      <div className="w-full px-2">
        {/*<div className="flex justify-center mb-2">
          <img
            src="/assets/CL.jpg"
            alt="Champions League Trophy"
            className="h-16 object-contain"
          />
        </div>/*}
        {/*<h2 className="text-xl font-semibold mb-4 text-center">
          Champions League Wins
        </h2>*/}
        <p className="text-sm text-gray-600 text-center mb-4">
          Total number of players: {players.length}
        </p>

        <div className="space-y-4">
          {rankedData.map((player) => (
            <div
              key={player._id}
              className="flex items-center bg-white px-5 py-4 rounded-xl shadow-md w-full"
            >
              {/* CL Wins */}
              <div className="w-16 text-center text-sm text-gray-600">
                <div className="text-xs">CL Wins:</div>
                <div className="text-2xl font-bold text-blue-600">
                  {player.clWins}
                </div>
              </div>

              {/* Profile Picture (clickable) */}
              <div className="mx-4 cursor-pointer">
                <img
                  src={
                    player.profilePictureUrl ||
                    "https://i.pravatar.cc/150?img=3"
                  }
                  alt="player"
                  onClick={() => openImageModal(player.profilePictureUrl || "https://i.pravatar.cc/150?img=3")}
                  className="w-14 h-18 object-cover border rounded-md hover:scale-105 transition-transform duration-300"
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
    </div>
  );
};

export default LandingPage;
