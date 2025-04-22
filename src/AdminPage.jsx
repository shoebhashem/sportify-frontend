import React, { useEffect, useState } from "react";
import axios from "axios";
import Flag from "react-world-flags";  // Importing the flag component

import countryCodeMap from "./countryCodeMap"; // Assuming countryCodeMap.js is in the same directory

const backendUrl = "http://16.171.60.61:5000/api/players";

const AdminPage = () => {
  const [players, setPlayers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    nationality: "",
    favoriteClub: "",
    clWins: 0,
    ulWins: 0,
    imageUrl: ""
  });

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/`);
      setPlayers(res.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPlayer = async () => {
    try {
      await axios.post(`${backendUrl}/add`, form);
      setForm({
        name: "",
        nationality: "",
        favoriteClub: "",
        clWins: 0,
        ulWins: 0,
        imageUrl: ""
      });
      fetchPlayers();
    } catch (error) {
      console.error("Error adding player:", error);
    }
  };

  const handleDeletePlayer = async (id) => {
    try {
      await axios.delete(`${backendUrl}/delete/${id}`);
      fetchPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const handleUpdatePlayer = async (id) => {
    try {
      await axios.put(`${backendUrl}/update/${id}`, form);
      fetchPlayers();
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  // Function to get country name and flag
  const getCountryDetails = (countryCode) => {
    const country = countryCodeMap[countryCode];
    return country || { name: countryCode, flag: "" }; // Fallback if no country is found
  };

  return (
    <div className="min-h-screen p-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={handleChange}
        />
        <select
          name="nationality"
          className="border p-2"
          value={form.nationality}
          onChange={handleChange}
        >
          <option value="">Select Nationality</option>
          {Object.keys(countryCodeMap).map((countryCode) => {
            const { name, flag } = getCountryDetails(countryCode);
            return (
              <option key={countryCode} value={countryCode}>
                {flag && <img src={flag} alt={name} className="inline-block w-5 h-5 mr-2" />}
                {name}
              </option>
            );
          })}
        </select>
        <input
          type="text"
          name="favoriteClub"
          placeholder="Favorite Club"
          className="border p-2"
          value={form.favoriteClub}
          onChange={handleChange}
        />
        <input
          type="number"
          name="clWins"
          placeholder="CL Wins"
          className="border p-2"
          value={form.clWins}
          onChange={handleChange}
        />
        <input
          type="number"
          name="ulWins"
          placeholder="UL Wins"
          className="border p-2"
          value={form.ulWins}
          onChange={handleChange}
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          className="border p-2"
          value={form.imageUrl}
          onChange={handleChange}
        />
      </div>

      <button
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
        onClick={handleAddPlayer}
      >
        Add Player
      </button>

      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Players</h2>
        {players.map((player) => (
          <div
            key={player._id}
            className="border p-4 mb-4 rounded shadow flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex items-center">
              <img
                src={player.imageUrl}
                alt={player.name}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <p><strong>Name:</strong> {player.name}</p>
                <p><strong>Nationality:</strong> {getCountryDetails(player.nationality).name}</p>
                <p><strong>Favorite Club:</strong> {player.favoriteClub}</p>
                <p><strong>CL Wins:</strong> {player.clWins}</p>
                <p><strong>UL Wins:</strong> {player.ulWins}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  setForm(player);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => handleDeletePlayer(player._id)}
              >
                Delete
              </button>
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => handleUpdatePlayer(player._id)}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
