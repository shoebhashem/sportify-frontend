import { useState, useEffect } from "react";
import axios from "axios";
import * as config from "../config";

const usePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const versionKey = "playersVersion";
  const dataKey = "playersData";

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Get latest version from backend
        const versionRes = await axios.get(`${config.backendUrl}/version`);
        const latestVersion = versionRes.data.version;

        const cachedVersion = localStorage.getItem(versionKey);
        const cachedData = localStorage.getItem(dataKey);

        if (cachedVersion === String(latestVersion) && cachedData) {
          // Use cached data
          setPlayers(JSON.parse(cachedData));
        } else {
          // Fetch fresh data
          const response = await axios.get(`${config.backendUrl}/`);
          setPlayers(response.data);
          localStorage.setItem(dataKey, JSON.stringify(response.data));
          localStorage.setItem(versionKey, String(latestVersion));
        }
      } catch (err) {
        setError(err);
        console.error("Error fetching players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  const deletePlayer = async (playerId) => {
    try {
      await axios.delete(`${config.backendUrl}/${playerId}`);
      setPlayers((prev) => prev.filter(player => player._id !== playerId));
      // Clear cache to force refetch next time
      localStorage.removeItem("playersData");
      localStorage.removeItem("playersVersion");
    } catch (err) {
      console.error("Error deleting player:", err);
      setError(err);
    }
  };

  return { players, setPlayers, loading, error, deletePlayer };
};

export default usePlayers;
