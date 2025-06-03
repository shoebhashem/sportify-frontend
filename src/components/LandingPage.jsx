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
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const openImageModal = (url) => setModalImage(url);
  const closeImageModal = () => setModalImage(null);
  const openPlayerModal = (player) => setSelectedPlayer(player);
  const closePlayerModal = () => setSelectedPlayer(null);

  const key = "clWins";
  
  // Enhanced sorting: Primary by CL wins (descending), Secondary by age (oldest first for ties)
  const sortedData = [...players].sort((a, b) => {
    // First, sort by CL wins (descending - higher wins first)
    if (b[key] !== a[key]) {
      return b[key] - a[key];
    }
    
    // If CL wins are equal, sort by age (descending - older players first)
    const ageA = calculateAge(a.birthDate);
    const ageB = calculateAge(b.birthDate);
    return ageB - ageA;
  });
  
  const rankedData = assignSharedRanks(sortedData, key);

  // Debug logging to see what data we're getting
  console.log('🔍 Debug: Players data in LandingPage:', players);
  console.log('🔍 Debug: Admin players:', players.filter(p => p.admin));

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

      {/* Header with hamburger menu in top right */}
      <div className="flex justify-end mb-3">
        <HamburgerMenu />
      </div>

      {/* Main Title - centrally located, moved closer to hamburger menu */}
      <h1 className="text-3xl font-bold mb-4">Rankings</h1>

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
              className="flex items-center bg-white px-5 py-4 rounded-xl shadow-md w-full cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => openPlayerModal(player)}
            >
              {/* CL Wins */}
              <div className="w-16 text-center text-sm text-gray-600">
                <div className="text-xs">CL Wins:</div>
                <div className="text-2xl font-bold text-blue-600">
                  {player.clWins}
                </div>
              </div>

              {/* Profile Picture (clickable) */}
              <div 
                className="mx-4 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering player modal
                  openImageModal(player.profilePictureUrl || "https://i.pravatar.cc/150?img=3");
                }}
              >
                <img
                  src={
                    player.profilePictureUrl ||
                    "https://i.pravatar.cc/150?img=3"
                  }
                  alt="player"
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

              {/* Flag with Admin Badge */}
              <div className="ml-2 flex flex-col items-center">
                {/* Admin Badge - moved above flag */}
                {player.admin && (
                  <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center mb-1">
                    S
                  </div>
                )}
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

        {/* Player Description Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-all duration-300 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center mb-4">
                <img
                  src={selectedPlayer.profilePictureUrl || "https://i.pravatar.cc/150?img=3"}
                  alt={selectedPlayer.name}
                  className="w-16 h-16 object-cover rounded-full border mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold">{selectedPlayer.name}</h3>
                  <p className="text-gray-600">{selectedPlayer.favoriteClub}</p>
                  <p className="text-sm text-gray-500">{selectedPlayer.nationality}</p>
                </div>
              </div>
              
              {selectedPlayer.description ? (
                <div>
                  <h4 className="font-semibold mb-2">About {selectedPlayer.name}:</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedPlayer.description}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No description available for this player.</p>
              )}
              
              <button
                onClick={closePlayerModal}
                className="mt-6 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
