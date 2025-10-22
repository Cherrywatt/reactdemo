import { CircleDot } from "lucide-react";

const LeaguesSidebar = () => {
  const leagues = [
    { id: 1, name: "Liga Endesa", active: true },
    { id: 2, name: "NBA", active: false },
    { id: 3, name: "LNB", active: false },
    { id: 4, name: "Superliga", active: false },
    { id: 5, name: "Euroliga", active: false },
    { id: 6, name: "Eurocup", active: false },
    { id: 7, name: "Champions League", active: false },
    { id: 8, name: "Mundial", active: false },
    { id: 9, name: "Champions League...", active: false },
    { id: 10, name: "AmeriCup", active: false },
  ];

  return (
    <aside className="w-80 bg-card rounded-lg p-6 h-fit sticky top-24">
      <h2 className="text-xl font-bold text-primary mb-6">LIGAS DE EJEMPLO</h2>
      <div className="space-y-2">
        {leagues.map((league) => (
          <button
            key={league.id}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              league.active
                ? "bg-accent text-accent-foreground"
                : "bg-secondary hover:bg-secondary/80 text-foreground"
            }`}
          >
            <CircleDot className="w-5 h-5 text-primary" />
            <span className="font-medium">{league.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};

export default LeaguesSidebar;
