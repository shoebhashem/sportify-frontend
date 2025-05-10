import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Pencil, Trash2 } from "lucide-react";
import countryCodeMap from "../countryCodeMap";

const PlayerCard = ({ player, deletePlayer, setEditPlayer }) => {
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
              <img
                src={flagUrl}
                alt={`${nationality} flag`}
                className="w-6 h-4 object-cover rounded-sm"
              />
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
        <Button variant="destructive" size="icon" onClick={() => deletePlayer(_id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default PlayerCard;
