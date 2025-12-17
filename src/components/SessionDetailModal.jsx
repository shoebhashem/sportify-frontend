import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { Button } from "./ui/Button";
import { X, UserPlus, Shuffle } from "lucide-react";

const SessionDetailModal = ({ session, players, onClose }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState([]);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [generatedTeams, setGeneratedTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize with existing session data
  useEffect(() => {
    if (session) {
      setSelectedPlayers(session.participants.map(p => p.playerId));
      setGuests(session.guestPlayers || []);
      setGeneratedTeams(session.teams || []);
      if (session.numberOfTeams) setNumberOfTeams(session.numberOfTeams);
    }
  }, [session]);

  // Sort players alphabetically
  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

  // Toggle player selection
  const handlePlayerToggle = (playerId) => {
    setSelectedPlayers(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Add guest player
  const handleAddGuest = () => {
    if (guestName.trim()) {
      setGuests([...guests, { name: guestName.trim() }]);
      setGuestName("");
    }
  };

  // Remove guest player
  const handleRemoveGuest = (index) => {
    setGuests(guests.filter((_, i) => i !== index));
  };

  // Save attendance (participants and guests)
  const handleSaveAttendance = async () => {
    setLoading(true);
    try {
      const participants = selectedPlayers.map(playerId => {
        const player = players.find(p => p._id === playerId);
        return {
          playerId,
          playerName: player.name
        };
      });

      await axios.patch(
        `${backendUrl.replace('/players', '/sessions')}/${session._id}`,
        { participants, guestPlayers: guests }
      );

      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Failed to save attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate random teams
  const handleGenerateTeams = async () => {
    if (selectedPlayers.length + guests.length < numberOfTeams) {
      alert(`You need at least ${numberOfTeams} attendees to create ${numberOfTeams} teams.`);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl.replace('/players', '/sessions')}/${session._id}/generate-teams`,
        { numberOfTeams: parseInt(numberOfTeams) }
      );

      setGeneratedTeams(response.data.teams);
      alert("Teams generated successfully!");
    } catch (error) {
      console.error("Error generating teams:", error);
      alert("Failed to generate teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Session: {session.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Player Attendance */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Mark Attendance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded p-3">
              {sortedPlayers.map(player => (
                <label
                  key={player._id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPlayers.includes(player._id)}
                    onChange={() => handlePlayerToggle(player._id)}
                    className="w-4 h-4"
                  />
                  <span>{player.name}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Selected: {selectedPlayers.length} players
            </p>
          </div>

          {/* Guest Players */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Guest Players</h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Guest name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGuest()}
                className="flex-1 p-2 border rounded"
              />
              <Button onClick={handleAddGuest} variant="outline">
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
            {guests.length > 0 && (
              <div className="space-y-2">
                {guests.map((guest, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span>{guest.name}</span>
                    <button
                      onClick={() => handleRemoveGuest(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Guests: {guests.length}
            </p>
          </div>

          {/* Save Attendance Button */}
          <Button
            onClick={handleSaveAttendance}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Saving..." : "Save Attendance"}
          </Button>

          {/* Team Generation */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-3">Generate Teams</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                min="2"
                value={numberOfTeams}
                onChange={(e) => setNumberOfTeams(e.target.value)}
                className="w-24 p-2 border rounded"
              />
              <Button
                onClick={handleGenerateTeams}
                disabled={loading || (selectedPlayers.length + guests.length) < 2}
                className="flex items-center gap-2"
              >
                <Shuffle className="w-4 h-4" />
                Generate {numberOfTeams} Teams
              </Button>
            </div>

            {/* Display Generated Teams */}
            {generatedTeams.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedTeams.map(team => (
                  <div key={team.teamNumber} className="border rounded p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Team {team.teamNumber}</h4>
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
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t">
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;
