import { Card, CardContent } from "./ui/Card";
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
    <Card className="flex items-center justify-between gap-4 p-4 w-full shadow-md rounded-xl">
      <div className="flex items-center gap-4">
        {profilePictureUrl && (
          <img
            src={profilePictureUrl}
            alt={`${name}'s profile`}
            className="w-16 h-16 object-cover rounded-full border border-gray-300"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{favoriteClub}</p>
          <div className="flex items-center gap-2 mt-1">
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
      <div className="flex flex-col items-center">
        <p className="text-sm font-semibold">CL Wins: {clWins}</p>
        <p className="text-sm font-semibold">UL Wins: {ulWins}</p>
      </div>
      <div className="flex gap-2">
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
