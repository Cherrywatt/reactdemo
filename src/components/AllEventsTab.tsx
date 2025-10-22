import { useTodayEvents } from "@/hooks/use-matches";
import MatchCard from "./MatchCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AllEventsTab = () => {
  const { data: allEvents = [], isLoading, error } = useTodayEvents();

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );

  const ErrorAlert = ({ error }: { error: Error }) => (
    <Alert variant="destructive">
      <AlertDescription>
        Error al cargar los eventos: {error.message}
      </AlertDescription>
    </Alert>
  );

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorAlert error={error} />;

  if (allEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No hay eventos deportivos programados para hoy
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Los datos se actualizarán automáticamente cada minuto
        </p>
      </div>
    );
  }

  // Agrupar por deporte
  const eventsBySport: { [key: string]: typeof allEvents } = {};
  allEvents.forEach(event => {
    if (!eventsBySport[event.sport]) {
      eventsBySport[event.sport] = [];
    }
    eventsBySport[event.sport].push(event);
  });

  return (
    <div className="space-y-8">
      {Object.entries(eventsBySport).map(([sport, events]) => (
        <div key={sport}>
          <h3 className="text-2xl font-bold text-accent mb-4">
            {sport} ({events.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((match) => (
              <MatchCard 
                key={match.id}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                homeScore={match.homeScore}
                awayScore={match.awayScore}
                time={match.time}
                status={match.status}
                sport={match.sport}
                league={match.league}
                venue={match.venue}
                homeTeamBadge={match.homeTeamBadge}
                awayTeamBadge={match.awayTeamBadge}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllEventsTab;
