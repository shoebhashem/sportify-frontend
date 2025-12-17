import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../config";
import { Card } from "./ui/Card";
import { Calendar, Users, Trophy, X } from "lucide-react";

const SessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      const response = await axios.get(`${backendUrl.replace('/players', '/sessions')}`);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Open session to view teams
  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  // Close session view
  const handleCloseSession = () => {
    setSelectedSession(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-lg">Loading sessions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Rankings
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Sessions History</h1>
          <p className="text-gray-600 mt-2">View past sessions and team lineups</p>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No sessions yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <Card
                key={session._id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSessionClick(session)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{session.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{session.totalAttendees} attendees</span>
                      </div>
                      {session.numberOfTeams > 0 && (
                        <div className="flex items-center gap-1">
                          <Trophy className="w-4 h-4" />
                          <span>{session.numberOfTeams} teams</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Session View Modal (Read-only) */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Session: {selectedSession.name}</h2>
              <button
                onClick={handleCloseSession}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Attendees */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Attendees ({selectedSession.totalAttendees})</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedSession.participants.map((p, idx) => (
                    <div key={idx} className="text-sm p-2 bg-gray-50 rounded">
                      {p.playerName}
                    </div>
                  ))}
                  {selectedSession.guestPlayers.map((g, idx) => (
                    <div key={idx} className="text-sm p-2 bg-blue-50 rounded">
                      {g.name} <span className="text-gray-500">(Guest)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teams */}
              {selectedSession.teams && selectedSession.teams.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Teams</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSession.teams.map(team => (
                      <div key={team.teamNumber} className="border rounded p-4 bg-gray-50">
                        <h4 className="font-semibold mb-2 text-center">Team {team.teamNumber}</h4>
                        <ul className="space-y-1">
                          {team.members.map((member, index) => (
                            <li key={index} className="text-sm">
                              {member.name}
                              {member.type === 'guest' && (
                                <span className="text-gray-500 ml-1">(Guest)</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={handleCloseSession}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
