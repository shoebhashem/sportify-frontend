import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config"; // <-- import your backendUrl

const PlayerForm = ({ players, setPlayers, editPlayer, setEditPlayer }) => {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [favoriteClub, setFavoriteClub] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [clWins, setclWins] = useState("");
  const [admin, setAdmin] = useState(false);
  const [description, setDescription] = useState("");
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  //const [ulWins, setulWins] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState ("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // If editPlayer is not null, pre-fill the form with the player's data
  useEffect(() => {
    if (editPlayer) {
      setName(editPlayer.name);
      setNationality(editPlayer.nationality);
      setFavoriteClub(editPlayer.favoriteClub);
      setBirthDate(editPlayer.birthDate ? editPlayer.birthDate.slice(0, 10) : "");
      setclWins(editPlayer.clWins);
      setAdmin(editPlayer.admin || false);
      setDescription(editPlayer.description || "");
      //setulWins(editPlayer.ulWins);
      setProfilePictureUrl(editPlayer.profilePictureUrl);
    }
  }, [editPlayer]);

  // Check if all required fields are filled
  const isFormValid = name;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlayer = {
      name,
      nationality,
      favoriteClub,
      birthDate,
      clWins,
      admin,
      description,
      //ulWins,
      profilePictureUrl,
    };

    setLoading(true); // Start loading indicator
    setSuccessMessage(""); // Clear any previous success message

    if (editPlayer) {
      // Perform a PATCH request to update the player
      try {
        console.log('🔍 Debug: Updating player with ID:', editPlayer._id);
        console.log('🔍 Debug: Update data:', newPlayer);
        console.log('🔍 Debug: Backend URL:', backendUrl);
        
        const response = await axios.patch(`${backendUrl}/${editPlayer._id}`, newPlayer);
        
        console.log('🔍 Debug: Update response:', response.data);
        
        // Update the player list with the modified player immediately
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player._id === response.data._id ? response.data : player
          )
        );
        localStorage.removeItem("playersData");
        localStorage.removeItem("playersVersion");

        setSuccessMessage("Player updated successfully!"); // Display success message
        setEditPlayer(null); // Clear the edit mode after updating
        // Clear the form fields
        setName("");
        setNationality("");
        setFavoriteClub("");
        setBirthDate("");
        setclWins(0);
        setAdmin(false);
        setDescription("");
        //setulWins(0);
        setProfilePictureUrl("");
      } catch (error) {
        console.error("🔍 Debug: Error updating player:", error);
        console.error("🔍 Debug: Error response:", error.response?.data);
        
        // More detailed error messages based on response
        if (error.response) {
          const { status, data } = error.response;
          
          if (status === 404) {
            setSuccessMessage("Player not found. Please refresh and try again.");
          } else if (status === 400) {
            setSuccessMessage(`Validation error: ${data.details || data.error || "Invalid data provided."}`);
          } else if (status >= 500) {
            setSuccessMessage("Server error. Please try again later.");
          } else {
            setSuccessMessage(`Error: ${data.error || "Failed to update player."}`);
          }
        } else if (error.request) {
          setSuccessMessage("Network error. Please check your connection.");
        } else {
          setSuccessMessage("Error updating player. Please try again.");
        }
      }
    } else {
      // Perform a POST request to add a new player
      try {
        const response = await axios.post(`${backendUrl}/`, newPlayer);
        setPlayers([...players, response.data]); // Add the newly created player to list
        localStorage.removeItem("playersData");
        localStorage.removeItem("playersVersion");
        setName("");
        setNationality("");
        setFavoriteClub("");
        setBirthDate("");
        setclWins();
        setAdmin(false);
        setDescription("");
        //setulWins();
        setProfilePictureUrl("");
      } catch (error) {
        console.error("Error adding player:", error);
        setSuccessMessage("Error adding player. Please try again.");
      }
    }
    setLoading(false); // Stop loading indicator
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label htmlFor="nationality" className="block">Flag</label>
        <input
          type="text"
          id="nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label htmlFor="favoriteClub" className="block">Favorite Club</label>
        <input
          type="text"
          id="favoriteClub"
          value={favoriteClub}
          onChange={(e) => setFavoriteClub(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="birthDate" className="block">Birth Date</label>
        <input
          type="date"
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="clWins" className="block">Number of CL wins</label>
        <input
          type="number"
          id="clWins"
          value={clWins}
          onChange={(e) => setclWins(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label htmlFor="admin" className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="admin"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Admin User</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">Check this box if the player should have admin rights</p>
      </div>
      
      <div>
        <label htmlFor="profilePictureUrl" className="block">Picture URL</label>
        <input
          type="text"
          id="profilePictureUrl"
          value={profilePictureUrl}
          onChange={(e) => setProfilePictureUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* About the Player Button */}
      <div>
        <button
          type="button"
          onClick={() => setShowDescriptionModal(true)}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          About the Player
        </button>
      </div>

      {/* Description Modal */}
      {showDescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">About the Player</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write something about this player..."
              rows={6}
              className="w-full p-3 border rounded-lg resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDescriptionModal(false)}
                className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setShowDescriptionModal(false)}
                className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display loading or success message */}
      {loading && <p className="text-blue-500">Updating player...</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      <div className="mt-4">
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full py-2 px-4 rounded ${isFormValid && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
        >
          {editPlayer ? "Update Player" : "Add Player"}
        </button>
      </div>
    </form>
  );
};

export default PlayerForm;
