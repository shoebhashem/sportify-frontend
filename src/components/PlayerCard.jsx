import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Pencil, Trash2 } from "lucide-react";
import countryCodeMap from "../countryCodeMap";
import { useState } from "react";

const PlayerCard = ({ player, deletePlayer, setEditPlayer }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const {
    _id,
    name,
    nationality,
    favoriteClub,
    clWins,
    ulWins,
    profilePictureUrl,
  } = player;

  const flagData = countryCodeMap[nationality];
  const flagUrl = flagData ? flagData.flag : "";

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    deletePlayer(_id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Card className="w-full p-4 shadow-md rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Left Section: Image + Info */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {profilePictureUrl && (
          <img
            src={profilePictureUrl}
            alt={`${name}'s profile`}
            className="w-20 h-20 object-cover rounded-full border border-gray-300"
          />
        )}
        <div className="text-center sm:text-left">
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{favoriteClub}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            {flagUrl && (
              <div className="flex flex-col items-center">
                {/* Admin Badge - moved above flag */}
                {player.admin && (
                  <div className="bg-blue-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center mb-1">
                    S
                  </div>
                )}
                <img
                  src={flagUrl}
                  alt={`${nationality} flag`}
                  className="w-6 h-4 object-cover rounded-sm"
                />
              </div>
            )}
            <span className="text-sm">{nationality}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="text-center sm:text-left">
        <p className="text-sm font-semibold">CL Wins: {clWins}</p>
        {/* <p className="text-sm font-semibold">UL Wins: {ulWins}</p> */}
      </div>

      {/* Buttons */}
      <div className="flex justify-center sm:justify-end gap-2">
        <Button variant="outline" size="icon" onClick={() => setEditPlayer(player)}>
          <Pencil className="w-4 h-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={handleDeleteClick}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PlayerCard;
