import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../config";
import { Card } from "./ui/Card";
import { Trophy, ArrowUp, ArrowDown } from "lucide-react";

const HistoryPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [manualOnly, setManualOnly] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${backendUrl.replace('/players', '/points-history')}`
        );
        setEntries(response.data);
      } catch (err) {
        console.error("Error fetching points history:", err);
        setError("Failed to load points history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-lg">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Rankings
          </Link>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Points History</h1>
            <p className="text-gray-600 mt-2">
              Every CL and EL win awarded or revoked, and when it happened.
            </p>
          </div>
          <button
            onClick={() => setManualOnly((prev) => !prev)}
            className={`mt-1 shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              manualOnly
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
            }`}
          >
            Show only manuals
          </button>
        </div>

        {error && (
          <Card className="p-4 mb-4 bg-red-50 border border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {(() => {
          const filtered = manualOnly ? entries.filter((e) => e.source === 'manual') : entries;
          if (filtered.length === 0) return (
            <Card className="p-8 text-center">
              <p className="text-gray-500">{manualOnly ? 'No manual edits found.' : 'No points history yet.'}</p>
            </Card>
          );
          return (
          <div className="space-y-3">
            {filtered.map((entry) => {
              const isAward = entry.delta > 0;
              return (
                <Card key={entry._id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Trophy
                        className={`w-5 h-5 ${
                          entry.winType === 'CL' ? 'text-blue-600' : 'text-purple-600'
                        }`}
                      />
                      <div>
                        <p className="font-semibold">
                          {entry.playerName}{" "}
                          <span
                            className={`inline-flex items-center gap-0.5 font-medium ${
                              isAward ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {isAward ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            {Math.abs(entry.delta)} {entry.winType} Win{Math.abs(entry.delta) !== 1 ? 's' : ''}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          {entry.source === 'session'
                            ? `Session: ${entry.sessionName || 'Unknown'}`
                            : 'Manual edit'}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
          );
        })()}
      </div>
    </div>
  );
};

export default HistoryPage;
