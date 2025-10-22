import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MatchCardProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  time: string;
  status: "live" | "halftime" | "finished" | "scheduled";
  sport: string;
  league?: string;
  venue?: string;
  homeTeamBadge?: string;
  awayTeamBadge?: string;
}

const MatchCard = ({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  time,
  status,
  sport,
  league,
  venue,
  homeTeamBadge,
  awayTeamBadge
}: MatchCardProps) => {
  const getStatusBadge = () => {
    switch (status) {
      case "live":
        return (
          <Badge className="bg-live text-live-foreground hover:bg-live animate-pulse-live">
            EN VIVO
          </Badge>
        );
      case "halftime":
        return (
          <Badge className="bg-accent text-accent-foreground hover:bg-accent">
            Medio Tiempo
          </Badge>
        );
      case "finished":
        return (
          <Badge variant="secondary">
            Finalizado
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline">
            Programado
          </Badge>
        );
    }
  };

  return (
    <Card className="p-6 hover:shadow-glow transition-all duration-300 bg-card border-2 border-transparent hover:border-gradient-card relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{homeTeam.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{homeTeam}</p>
              <p className="text-sm text-muted-foreground">{sport}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{homeScore}</p>
          </div>
        </div>

        <div className="flex items-center justify-center my-4">
          <span className="text-lg font-bold text-primary">VS</span>
          {status === "live" && (
            <Badge className="ml-3 bg-primary text-primary-foreground hover:bg-primary animate-pulse-live">
              {time}
            </Badge>
          )}
          {status !== "live" && (
            <span className="ml-3 text-sm text-muted-foreground">{time}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-accent">{awayTeam.substring(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{awayTeam}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">{awayScore}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            {league || `Liga ${sport}`}
          </p>
          {venue && (
            <p className="text-xs text-muted-foreground text-center mt-1">{venue}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MatchCard;
