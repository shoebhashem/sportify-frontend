import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import { useNavigate } from "react-router-dom";

const BALLON_DOR_IMG = "https://fineartfrance.com/cdn/shop/files/3c7f5eb982d543865a2154f680f5af3f_2048x.jpg?v=1773920976";

const PastSeasonsPage = () => {
  const [archives, setArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/season-archives`)
      .then((res) => setArchives(res.data))
      .catch(() => setError("Failed to load season archives."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading seasons...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm">
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Past Seasons</h1>
      </div>

      {archives.length === 0 && (
        <p className="text-center text-gray-400 mt-12">No past seasons yet.</p>
      )}

      <div className="space-y-6">
        {archives.map((archive) => (
          <div key={archive._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Season header */}
            <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">Season {archive.season}</h2>
                {archive.legacy && (
                  <span className="text-blue-200 text-xs">Historical season</span>
                )}
              </div>
              {archive.ballonDorWinner && (
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                  <img
                    src={BALLON_DOR_IMG}
                    alt="Ballon d'Or"
                    className="w-6 h-6 object-cover rounded-full border-2 border-yellow-300"
                  />
                  <span className="text-white text-sm font-medium">{archive.ballonDorWinner}</span>
                </div>
              )}
            </div>

            {/* Meta row */}
            <div className="px-4 py-2 bg-gray-50 border-b flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              {archive.totalSessions > 0 && (
                <span>{archive.totalSessions} sessions</span>
              )}
              {archive.endDate && (
                <span>Ended {new Date(archive.endDate).toLocaleDateString("sv-SE")}</span>
              )}
            </div>

            {/* Legacy note */}
            {archive.legacy && archive.legacyNote && (
              <div className="px-4 py-3 text-sm text-gray-500 italic">{archive.legacyNote}</div>
            )}

            {/* Rankings table */}
            {archive.rankings && archive.rankings.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 text-xs border-b">
                      <th className="px-4 py-2 font-medium">#</th>
                      <th className="px-4 py-2 font-medium">Player</th>
                      <th className="px-4 py-2 font-medium text-right">TOT</th>
                      <th className="px-4 py-2 font-medium text-right">CL</th>
                      <th className="px-4 py-2 font-medium text-right">EL</th>
                      <th className="px-4 py-2 font-medium text-right">Sessions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {archive.rankings.map((r, i) => {
                      const hasGoldenCard = archive.goldenCardPlayers?.includes(r.playerName);
                      return (
                      <tr
                        key={i}
                        className={`border-b last:border-0 ${i === 0 ? "bg-yellow-50" : ""}`}
                      >
                        <td className="px-4 py-2 text-gray-400 text-xs">{i + 1}</td>
                        <td className="px-4 py-2 font-medium text-gray-800">
                          <div className="flex items-center gap-1">
                            {archive.ballonDorWinner === r.playerName && (
                              <img
                                src={BALLON_DOR_IMG}
                                alt=""
                                className="w-4 h-4 object-cover rounded-full border border-yellow-400 shrink-0"
                              />
                            )}
                            {hasGoldenCard && (
                              <span title="CL success rate > 50%">✨</span>
                            )}
                            {r.playerName}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-gray-800">{r.totWins}</td>
                        <td className="px-4 py-2 text-right text-blue-600">{r.clWins}</td>
                        <td className="px-4 py-2 text-right text-green-600">{r.ulWins}</td>
                        <td className="px-4 py-2 text-right text-gray-500">{r.sessionsAttended}</td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastSeasonsPage;
