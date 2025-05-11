import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../config"; // <-- import your backendUrl

const PlayerForm = ({ players, setPlayers, editPlayer, setEditPlayer }) => {
  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [favoriteClub, setFavoriteClub] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [clWins, setclWins] = useState("");
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
      //setulWins(editPlayer.ulWins);
      setProfilePictureUrl(editPlayer.profilePictureUrl);
    }
  }, [editPlayer]);

  // Check if all required fields are filled
  const isFormValid = name && nationality && favoriteClub && clWins;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlayer = {
      name,
      nationality,
      favoriteClub,
      birthDate,
      clWins,
      //ulWins,
      profilePictureUrl,
    };

    setLoading(true); // Start loading indicator
    setSuccessMessage(""); // Clear any previous success message

    if (editPlayer) {
      // Perform a PATCH request to update the player
      try {
        const response = await axios.patch(`${backendUrl}/${editPlayer._id}`, newPlayer);
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
        //setulWins(0);
        setProfilePictureUrl("");
      } catch (error) {
        console.error("Error updating player:", error);
        setSuccessMessage("Error updating player. Please try again.");
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
        <label htmlFor="profilePictureUrl" className="block">Picture URL</label>
        <input
          type="text"
          id="profilePictureUrl"
          value={profilePictureUrl}
          onChange={(e) => setProfilePictureUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

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
