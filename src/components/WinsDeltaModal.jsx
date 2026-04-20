import React from "react";
import { Button } from "./ui/Button";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

const WinsDeltaModal = ({ delta, players, onConfirm, onCancel }) => {
  const getPlayerName = (playerId) => {
    const player = players.find(p => p._id === playerId);
    return player?.name || "Unknown Player";
  };

  const hasChanges =
    (delta.attendanceChanges?.added?.length || 0) +
    (delta.attendanceChanges?.removed?.length || 0) +
    (delta.clWinChanges?.added?.length || 0) +
    (delta.clWinChanges?.removed?.length || 0) +
    (delta.ulWinChanges?.added?.length || 0) +
    (delta.ulWinChanges?.removed?.length || 0) > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-orange-500" />
          <h3 className="text-lg font-semibold">Review Changes</h3>
        </div>

        {!hasChanges ? (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-700 text-sm">No changes detected.</p>
          </div>
        ) : (
          <>
            {/* Attendance Changes */}
            {(delta.attendanceChanges?.added?.length > 0 ||
              delta.attendanceChanges?.removed?.length > 0) && (
              <div className="mb-5 pb-4 border-b">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Attendance Changes:
                </h4>
                {delta.attendanceChanges?.added?.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1 text-green-700 text-sm mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Added:</span>
                    </div>
                    <ul className="ml-5 space-y-1">
                      {delta.attendanceChanges.added.map((p) => (
                        <li key={p.playerId} className="text-sm text-green-600">
                          • {p.playerName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {delta.attendanceChanges?.removed?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-red-700 text-sm mb-1">
                      <XCircle className="w-4 h-4" />
                      <span className="font-medium">Removed:</span>
                    </div>
                    <ul className="ml-5 space-y-1">
                      {delta.attendanceChanges.removed.map((p) => (
                        <li key={p.playerId} className="text-sm text-red-600">
                          • {p.playerName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* CL Win Changes */}
            {(delta.clWinChanges?.added?.length > 0 ||
              delta.clWinChanges?.removed?.length > 0) && (
              <div className="mb-5 pb-4 border-b">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🏆 CL Wins Changes:
                </h4>
                {delta.clWinChanges?.added?.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1 text-blue-700 text-sm mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Awarded:</span>
                    </div>
                    <ul className="ml-5 space-y-1">
                      {delta.clWinChanges.added.map((p) => (
                        <li key={p.playerId} className="text-sm text-blue-600">
                          • {p.playerName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {delta.clWinChanges?.removed?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-red-700 text-sm mb-1">
                      <XCircle className="w-4 h-4" />
                      <span className="font-medium">Revoked:</span>
                    </div>
                    <ul className="ml-5 space-y-1">
                      {delta.clWinChanges.removed.map((p) => (
                        <li key={p.playerId} className="text-sm text-red-600">
                          • {p.playerName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* EL Win Changes */}
            {(delta.ulWinChanges?.added?.length > 0 ||
              delta.ulWinChanges?.removed?.length > 0) && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🏆 EL Wins Changes:
                </h4>
                {delta.ulWinChanges?.added?.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center gap-1 text-purple-700 text-sm mb-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Awarded:</span>
                    </div>
                    <ul className="ml-5 space-y-1">
                      {delta.ulWinChanges.added.map((p) => (
                        <li
                          key={p.playerId}
                          className="text-sm text-purple-600"
                        >
                          • {p.playerName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {delta.ulWinChanges?.removed?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1 text-red-700 text-sm mb-1">
                      <XCircle className="w-4 h-4" />
                      <span className="font-medium">Revoked:</span>
                    </div>
                    <ul className="ml-5 space-y-1">
                      {delta.ulWinChanges.removed.map((p) => (
                        <li key={p.playerId} className="text-sm text-red-600">
                          • {p.playerName}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" className="flex-1">
            Go Back & Edit
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={!hasChanges}
          >
            Confirm Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WinsDeltaModal;
