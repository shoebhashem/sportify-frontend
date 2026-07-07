import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config";
import { Button } from "./ui/Button";
import { X, UserPlus, Shuffle, AlertCircle } from "lucide-react";
import WinsDeltaModal from "./WinsDeltaModal";

const SessionDetailModal = ({ session, players, isEditMode, onClose }) => {
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState([]);
  const [numberOfTeams, setNumberOfTeams] = useState(2);
  const [generatedTeams, setGeneratedTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Edit mode specific states
  const [attendanceSaved, setAttendanceSaved] = useState(false);
  const [clWinPlayers, setClWinPlayers] = useState([]);
  const [ulWinPlayers, setUlWinPlayers] = useState([]);
  const [delta, setDelta] = useState(null);
  const [showDeltaConfirmation, setShowDeltaConfirmation] = useState(false);
  const [editError, setEditError] = useState("");

  // Initialize with existing session data
  useEffect(() => {
    if (session) {
      setSelectedPlayers(session.participants.map(p => p.playerId));
      setGuests(session.guestPlayers || []);
      setGeneratedTeams(session.teams || []);
      if (session.numberOfTeams) setNumberOfTeams(session.numberOfTeams);
      
      // In edit mode, also load win reports
      if (isEditMode) {
        setClWinPlayers(session.clWinReports ? session.clWinReports.map(w => w.playerId) : []);
        setUlWinPlayers(session.ulWinReports ? session.ulWinReports.map(w => w.playerId) : []);
        setAttendanceSaved(true); // Treat as already saved in edit mode
      }
    }
  }, [session, isEditMode]);

  // Sort players alphabetically
  const sortedPlayers = [...players].sort((a, b) => a.name.localeCompare(b.name));

  // Filter to show only attended players
  const attendedPlayers = sortedPlayers.filter(p => selectedPlayers.includes(p._id));

  // Toggle player selection
  const handlePlayerToggle = (playerId) => {
    setSelectedPlayers(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Toggle CL win
  const handleToggleClWin = (playerId) => {
    setClWinPlayers(prev =>
      prev.includes(playerId)
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Toggle UL win
  const handleToggleUlWin = (playerId) => {
    setUlWinPlayers(prev =>
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

  // Review changes before saving (shows delta)
  const handleReviewChanges = async () => {
    setLoading(true);
    setEditError("");
    try {
      // Prepare data
      const participantData = selectedPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      const clWinData = clWinPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      const ulWinData = ulWinPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      // Call delta endpoint
      const response = await axios.post(
        `${backendUrl.replace('/players', '/sessions')}/${session._id}/delta`,
        {
          participants: participantData,
          clWinReports: clWinData,
          ulWinReports: ulWinData
        }
      );

      setDelta(response.data);
      setShowDeltaConfirmation(true);
    } catch (error) {
      console.error("Error calculating changes:", error);
      setEditError("Failed to calculate changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save all changes after delta confirmation
  const handleSaveAllChanges = async () => {
    setLoading(true);
    setEditError("");
    try {
      const participantData = selectedPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      const clWinData = clWinPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      const ulWinData = ulWinPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      await axios.patch(
        `${backendUrl.replace('/players', '/sessions')}/${session._id}`,
        {
          participants: participantData,
          guestPlayers: guests,
          clWinReports: clWinData,
          ulWinReports: ulWinData
        }
      );

      alert("Session updated successfully!");
      setShowDeltaConfirmation(false);
      onClose();
    } catch (error) {
      console.error("Error saving session:", error);
      // Close the confirmation dialog so the error banner above (which was
      // already being set, just hidden behind this dialog's overlay) becomes
      // visible, and the admin can adjust and retry instead of being stuck.
      setShowDeltaConfirmation(false);
      setEditError(error.response?.data?.error || "Failed to save session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save CL wins only (for new sessions) - PRESERVE existing EL wins
  const handleSaveClWinsOnly = async () => {
    setLoading(true);
    setEditError("");
    try {
      const participantData = selectedPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      const clWinData = clWinPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      // Fetch current session to get existing EL wins
      const currentSession = await axios.get(
        `${backendUrl.replace('/players', '/sessions')}/${session._id}`
      );
      
      const existingElWins = currentSession.data.ulWinReports || [];

      await axios.patch(
        `${backendUrl.replace('/players', '/sessions')}/${session._id}`,
        {
          participants: participantData,
          guestPlayers: guests,
          clWinReports: clWinData,
          ulWinReports: existingElWins  // PRESERVE existing EL wins!
        }
      );

      alert("CL wins saved successfully!");
      // Don't clear selection - keep them visible!
    } catch (error) {
      console.error("Error saving CL wins:", error);
      setEditError("Failed to save CL wins. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save EL wins only (for new sessions) - PRESERVE existing CL wins
  const handleSaveElWinsOnly = async () => {
    setLoading(true);
    setEditError("");
    try {
      const participantData = selectedPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      const ulWinData = ulWinPlayers.map(playerId => ({
        playerId,
        playerName: players.find(p => p._id === playerId)?.name || "Unknown"
      }));

      // Fetch current session to get existing CL wins
      const currentSession = await axios.get(
        `${backendUrl.replace('/players', '/sessions')}/${session._id}`
      );
      
      const existingClWins = currentSession.data.clWinReports || [];

      await axios.patch(
        `${backendUrl.replace('/players', '/sessions')}/${session._id}`,
        {
          participants: participantData,
          guestPlayers: guests,
          clWinReports: existingClWins,  // PRESERVE existing CL wins!
          ulWinReports: ulWinData
        }
      );

      alert("EL wins saved successfully!");
      // Don't clear selection - keep them visible!
    } catch (error) {
      console.error("Error saving EL wins:", error);
      setEditError("Failed to save EL wins. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save attendance (initial save in new session mode)
  const handleSaveAttendanceOnly = async () => {
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
        { 
          participants, 
          guestPlayers: guests,
          clWinReports: [],
          ulWinReports: []
        }
      );

      setAttendanceSaved(true);
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
          <div>
            <h2 className="text-2xl font-bold">Session: {session.name}</h2>
            {isEditMode && <p className="text-sm text-blue-600">Edit Mode</p>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error message */}
          {editError && (
            <div className="bg-red-50 border border-red-200 rounded p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{editError}</p>
            </div>
          )}

          {/* PHASE 1: Mark Attendance */}
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
                    disabled={isEditMode && attendanceSaved && selectedPlayers.length === 0}
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

          {/* Save Attendance Button - Different behavior for edit vs new */}
          {!attendanceSaved ? (
            <Button
              onClick={handleSaveAttendanceOnly}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save Attendance"}
            </Button>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded p-3 text-green-700 text-sm font-medium">
              ✓ Attendance Saved
            </div>
          )}

          {/* PHASE 2: Report Wins (Only visible after attendance saved) */}
          {attendanceSaved && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Report CL Wins</h3>
                <p className="text-sm text-gray-600 mb-3">Select players who won CL (only attended players shown)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                  {attendedPlayers.length > 0 ? (
                    attendedPlayers.map(player => (
                      <label
                        key={player._id}
                        className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={clWinPlayers.includes(player._id)}
                          onChange={() => handleToggleClWin(player._id)}
                          className="w-4 h-4"
                        />
                        <span>{player.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2">No attended players</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {clWinPlayers.length}
                </p>
                
                {/* Save CL Wins button - only for new sessions */}
                {!isEditMode && (
                  <Button
                    onClick={handleSaveClWinsOnly}
                    disabled={loading || clWinPlayers.length === 0}
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Saving..." : "Save CL Wins"}
                  </Button>
                )}
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">Report EL Wins</h3>
                <p className="text-sm text-gray-600 mb-3">Select players who won EL (only attended players shown)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded p-3">
                  {attendedPlayers.length > 0 ? (
                    attendedPlayers.map(player => (
                      <label
                        key={player._id}
                        className="flex items-center gap-2 p-2 hover:bg-purple-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={ulWinPlayers.includes(player._id)}
                          onChange={() => handleToggleUlWin(player._id)}
                          className="w-4 h-4"
                        />
                        <span>{player.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-2">No attended players</p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {ulWinPlayers.length}
                </p>
                
                {/* Save EL Wins button - only for new sessions */}
                {!isEditMode && (
                  <Button
                    onClick={handleSaveElWinsOnly}
                    disabled={loading || ulWinPlayers.length === 0}
                    className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                  >
                    {loading ? "Saving..." : "Save EL Wins"}
                  </Button>
                )}
              </div>

              {/* Show/Hide button for review in edit mode */}
              {isEditMode && (
                <Button
                  onClick={handleReviewChanges}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Calculating..." : "Review Changes"}
                </Button>
              )}
            </>
          )}

          {/* Team Generation - Always available */}
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
            {isEditMode && attendanceSaved && !showDeltaConfirmation ? "Done Editing" : "Close"}
          </Button>
        </div>
      </div>

      {/* Delta Confirmation Modal */}
      {showDeltaConfirmation && delta && (
        <WinsDeltaModal
          delta={delta}
          players={players}
          onConfirm={handleSaveAllChanges}
          onCancel={() => setShowDeltaConfirmation(false)}
        />
      )}
    </div>
  );
};

export default SessionDetailModal;
