import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MatchCard from "./MatchCard";
import { CircleDot, Dribbble, Circle } from "lucide-react";

const SportsTabs = () => {
  const soccerMatches = [
    {
      id: 1,
      homeTeam: "Real Madrid",
      awayTeam: "Barcelona",
      homeScore: 2,
      awayScore: 1,
      time: "78'",
      status: "live" as const,
      sport: "Fútbol"
    },
    {
      id: 2,
      homeTeam: "Manchester United",
      awayTeam: "Liverpool",
      homeScore: 1,
      awayScore: 1,
      time: "HT",
      status: "halftime" as const,
      sport: "Fútbol"
    },
    {
      id: 3,
      homeTeam: "PSG",
      awayTeam: "Bayern Munich",
      homeScore: 0,
      awayScore: 2,
      time: "Final",
      status: "finished" as const,
      sport: "Fútbol"
    }
  ];

  const basketballMatches = [
    {
      id: 4,
      homeTeam: "Lakers",
      awayTeam: "Warriors",
      homeScore: 98,
      awayScore: 95,
      time: "Q3 5:23",
      status: "live" as const,
      sport: "Baloncesto"
    },
    {
      id: 5,
      homeTeam: "Celtics",
      awayTeam: "Nets",
      homeScore: 110,
      awayScore: 108,
      time: "Final",
      status: "finished" as const,
      sport: "Baloncesto"
    }
  ];

  const baseballMatches = [
    {
      id: 6,
      homeTeam: "Yankees",
      awayTeam: "Red Sox",
      homeScore: 4,
      awayScore: 3,
      time: "7th Inning",
      status: "live" as const,
      sport: "Béisbol"
    },
    {
      id: 7,
      homeTeam: "Dodgers",
      awayTeam: "Giants",
      homeScore: 6,
      awayScore: 2,
      time: "Final",
      status: "finished" as const,
      sport: "Béisbol"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-accent">Juegos destacados</h2>
        <button className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
          Ver todos
        </button>
      </div>

      <Tabs defaultValue="soccer" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="soccer" className="flex items-center gap-2">
            <Dribbble className="w-4 h-4" />
            Fútbol
          </TabsTrigger>
          <TabsTrigger value="basketball" className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Baloncesto
          </TabsTrigger>
          <TabsTrigger value="baseball" className="flex items-center gap-2">
            <CircleDot className="w-4 h-4" />
            Béisbol
          </TabsTrigger>
        </TabsList>

        <TabsContent value="soccer" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {soccerMatches.map((match) => (
            <MatchCard 
              key={match.id}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              time={match.time}
              status={match.status}
              sport={match.sport}
            />
          ))}
        </TabsContent>

        <TabsContent value="basketball" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {basketballMatches.map((match) => (
            <MatchCard 
              key={match.id}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              time={match.time}
              status={match.status}
              sport={match.sport}
            />
          ))}
        </TabsContent>

        <TabsContent value="baseball" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {baseballMatches.map((match) => (
            <MatchCard 
              key={match.id}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              homeScore={match.homeScore}
              awayScore={match.awayScore}
              time={match.time}
              status={match.status}
              sport={match.sport}
            />
          ))}
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-accent">Equipos</h2>
          <button className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
            Ver clasificación
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["RM", "FCB", "PSG", "MU"].map((team, idx) => (
            <div
              key={idx}
              className="bg-card p-8 rounded-lg flex items-center justify-center hover:shadow-glow transition-all group"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-3xl font-bold text-white">{team}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportsTabs;
