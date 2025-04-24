import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = "https://ec2.publicvm.com/api/players";

const usePlayers = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/`);
        setPlayers(response.data);
      } catch (err) {
        setError(err);
        console.error("Error fetching players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return { players, setPlayers, loading, error };
};

export default usePlayers;
