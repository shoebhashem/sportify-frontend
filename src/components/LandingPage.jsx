import React, { useState } from "react";
import countryCodeMap from "../countryCodeMap";
import { Link } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import axios from "axios";
import { backendUrl } from "../config";


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
  const [filterType, setFilterType] = useState("totWins"); // Default filter
  const [statsPlayer, setStatsPlayer] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [allStats, setAllStats] = useState({});

  // Fetch all stats once on mount for badge rendering
  React.useEffect(() => {
    axios.get(backendUrl.replace('/players', '/players/stats/all'))
      .then(res => setAllStats(res.data))
      .catch(() => {});
  }, []);

  // Compute badge holders from current player list + allStats
  const today = new Date();
  const birthdayIds = new Set(
    players.filter(p => {
      const bd = new Date(p.birthDate);
      return bd.getMonth() === today.getMonth() && bd.getDate() === today.getDate();
    }).map(p => p._id)
  );

  const pickOldest = (candidates) =>
    candidates.reduce((best, p) => new Date(p.birthDate) < new Date(best.birthDate) ? p : best);

  const maxTotWins = players.length > 0 ? Math.max(...players.map(p => p.totWins)) : 0;
  const totWinsTied = players.filter(p => p.totWins === maxTotWins && maxTotWins > 0);
  const ballonDorIds = new Set(totWinsTied.length > 0 ? [pickOldest(totWinsTied)._id] : []);

  const clRates = Object.entries(allStats)
    .map(([id, s]) => ({ id, rate: s.clSuccessRate }))
    .filter(x => x.rate !== null);
  const maxClRate = clRates.length > 0 ? Math.max(...clRates.map(x => x.rate)) : null;
  const clRateTied = maxClRate !== null
    ? clRates.filter(x => x.rate === maxClRate).map(x => players.find(p => p._id === x.id)).filter(Boolean)
    : [];
  const fireIds = new Set(clRateTied.length > 0 ? [pickOldest(clRateTied)._id] : []);

  const openStatsModal = async (e, player) => {
    e.stopPropagation();
    setStatsPlayer(player);
    setStats(null);
    setStatsLoading(true);
    try {
      const res = await axios.get(`${backendUrl.replace('/players', `/players/${player._id}/stats`)}`);
      setStats(res.data);
    } catch {
      setStats({ error: true });
    } finally {
      setStatsLoading(false);
    }
  };

  const closeStatsModal = () => { setStatsPlayer(null); setStats(null); };

  const openImageModal = (url) => setModalImage(url);
  const closeImageModal = () => setModalImage(null);
  const openPlayerModal = (player) => setSelectedPlayer(player);
  const closePlayerModal = () => setSelectedPlayer(null);

  const key = filterType;
  
  // Enhanced sorting: Primary by selected filter (descending), Secondary by age (oldest first for ties)
  const sortedData = [...players].sort((a, b) => {
    // First, sort by selected filter (descending - higher wins first)
    if (b[key] !== a[key]) {
      return b[key] - a[key];
    }
    
    // If values are equal, sort by age (descending - older players first)
    const ageA = calculateAge(a.birthDate);
    const ageB = calculateAge(b.birthDate);
    return ageB - ageA;
  });
  
  const rankedData = assignSharedRanks(sortedData, key);

  // Get filter label
  const filterLabels = {
    totWins: "Total Wins",
    clWins: "CL Wins",
    ulWins: "EL Wins"
  };

  // Debug logging to see what data we're getting
  console.log('🔍 Debug: Players data in LandingPage:', players);
  console.log('🔍 Debug: Admin players:', players.filter(p => p.admin));
  console.log('🔍 Debug: Current filter:', filterType);

  return (
    <div className="min-h-screen bg-gray-70 p-4 pb-12 text-center relative">
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

      {/* Header with hamburger menu and centered title */}
      <div className="flex justify-between items-center mb-6">
        <div className="w-10"></div> {/* Spacer for balance */}
        <h1 className="text-3xl font-bold">Rankings</h1>
        <HamburgerMenu />
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setFilterType("totWins")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterType === "totWins"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          Total Wins
        </button>
        <button
          onClick={() => setFilterType("clWins")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterType === "clWins"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          CL Wins
        </button>
        <button
          onClick={() => setFilterType("ulWins")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filterType === "ulWins"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          EL Wins
        </button>
      </div>

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
              className="relative flex items-center bg-white px-5 py-4 rounded-xl shadow-md w-full cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => openPlayerModal(player)}
            >
              {/* Badges: top-right corner */}
              <div className="absolute top-1.5 right-2 flex items-center gap-1">
                {ballonDorIds.has(player._id) && (
                  <img
                    src="https://fineartfrance.com/cdn/shop/files/3c7f5eb982d543865a2154f680f5af3f_2048x.jpg?v=1773920976"
                    alt="Ballon d'Or"
                    className="w-6 h-6 object-cover rounded-full border-2 border-yellow-400 shadow-sm"
                    title="Leads total wins"
                  />
                )}
                {fireIds.has(player._id) && (
                  <span className="text-base leading-none" title="Highest CL success rate">🔥</span>
                )}
                {birthdayIds.has(player._id) && (
                  <span className="text-base leading-none" title="Happy birthday!">🎂</span>
                )}
              </div>
              {/* Rank and All Wins Types */}
              <div className="text-center text-sm text-gray-600 min-w-fit">
                <div className="text-lg font-bold text-gray-800 mb-1">
                  {rankedData.indexOf(player) + 1}
                </div>
                <div className="space-y-1">
                  <div className="text-xs">
                    <span className="font-semibold">Tot:</span> <span className="text-blue-600 font-bold">{player.totWins}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">CL:</span> <span className="text-green-600 font-bold">{player.clWins}</span>
                  </div>
                  <div className="text-xs">
                    <span className="font-semibold">EL:</span> <span className="text-purple-600 font-bold">{player.ulWins}</span>
                  </div>
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
              <div className="flex-1 text-sm min-w-0">
                <div className="font-semibold text-base truncate">{player.name}</div>
                <div className="text-gray-600 text-xs">
                  Age: {calculateAge(player.birthDate)}
                </div>
                <div className="text-gray-600 text-xs">
                  Club: {player.favoriteClub}
                </div>
              </div>

              {/* Flag with Admin Badge and Stats button */}
              <div className="ml-2 flex flex-col items-center gap-1">
                {player.admin && (
                  <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
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
                <button
                  onClick={(e) => openStatsModal(e, player)}
                  className="p-1 rounded bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-700 border border-gray-200 hover:border-indigo-300 transition-colors"
                >
                  <span className="flex items-end gap-px h-3.5">
                    <span className="w-1 rounded-sm bg-purple-500" style={{height:'40%'}} />
                    <span className="w-1 rounded-sm bg-green-500" style={{height:'70%'}} />
                    <span className="w-1 rounded-sm bg-blue-500" style={{height:'100%'}} />
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Modal */}
        {statsPlayer && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
              <div className="flex items-center mb-5">
                <img
                  src={statsPlayer.profilePictureUrl || "https://i.pravatar.cc/150?img=3"}
                  alt={statsPlayer.name}
                  className="w-12 h-12 object-cover rounded-full border mr-3"
                />
                <div>
                  <h3 className="text-lg font-semibold">{statsPlayer.name}</h3>
                  <p className="text-xs text-gray-500">Season statistics</p>
                </div>
              </div>

              {statsLoading && <p className="text-center text-gray-500 py-4">Loading...</p>}

              {!statsLoading && stats?.error && (
                <p className="text-center text-red-500 py-4">Failed to load stats.</p>
              )}

              {!statsLoading && stats && !stats.error && (
                <div className="space-y-4">
                  {/* Participation */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">Participation rate</span>
                      <span className="font-bold">{Math.round(stats.participationRate * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.round(stats.participationRate * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{stats.sessionsAttended} of {stats.totalSessions} sessions</p>
                  </div>

                  {/* CL success */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">CL success rate</span>
                      <span className="font-bold text-green-600">
                        {stats.clSuccessRate !== null ? `${Math.round(stats.clSuccessRate * 100)}%` : '—'}
                      </span>
                    </div>
                    {stats.clSuccessRate !== null ? (
                      <>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.round(stats.clSuccessRate * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{stats.clWins} wins in {stats.sessionsAttended} sessions attended</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">Need {stats.minSessionsForRates - stats.sessionsAttended} more sessions to unlock</p>
                    )}
                  </div>

                  {/* EL success */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">EL success rate</span>
                      <span className="font-bold text-purple-600">
                        {stats.elSuccessRate !== null ? `${Math.round(stats.elSuccessRate * 100)}%` : '—'}
                      </span>
                    </div>
                    {stats.elSuccessRate !== null ? (
                      <>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.round(stats.elSuccessRate * 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{stats.elWins} wins in {stats.elSessionsAttended} EL sessions attended</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">
                        {stats.sessionsAttended < stats.minSessionsForRates
                          ? `Need ${stats.minSessionsForRates - stats.sessionsAttended} more sessions to unlock`
                          : 'No EL sessions attended yet'}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={closeStatsModal}
                className="mt-6 w-full py-2 px-4 bg-gray-800 hover:bg-gray-900 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}

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
