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
        // FORCE CLEAR CACHE for debugging admin functionality
        localStorage.removeItem("playersData");
        localStorage.removeItem("playersVersion");
        
        // Get latest version from backend
        const versionRes = await axios.get(`${config.backendUrl}/version`);
        const latestVersion = versionRes.data.version;

        // Always fetch fresh data for now (bypassing cache)
        console.log('🔍 Debug: Fetching fresh data from:', config.backendUrl);
        const response = await axios.get(`${config.backendUrl}/`);
        console.log('🔍 Debug: Received players:', response.data);
        setPlayers(response.data);
        localStorage.setItem(dataKey, JSON.stringify(response.data));
        localStorage.setItem(versionKey, String(latestVersion));
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
