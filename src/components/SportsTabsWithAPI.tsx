import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MatchCard from "./MatchCard";
import AllEventsTab from "./AllEventsTab";
import { CircleDot, Dribbble, Circle, RefreshCw, Trophy } from "lucide-react";
import { useFootballEvents, useBasketballEvents, useBaseballEvents, useLiveEvents, useRefreshData, useTodayEvents } from "@/hooks/use-matches";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const SportsTabsWithAPI = () => {
  // Obtener partidos por deporte usando TheSportsDB
  const { data: soccerMatches = [], isLoading: isLoadingSoccer, error: soccerError } = useFootballEvents();
  const { data: basketballMatches = [], isLoading: isLoadingBasketball, error: basketballError } = useBasketballEvents();
  const { data: baseballMatches = [], isLoading: isLoadingBaseball, error: baseballError } = useBaseballEvents();
  
  // Obtener partidos en vivo y todos los eventos
  const { data: liveMatches = [] } = useLiveEvents();
  const { data: allEvents = [] } = useTodayEvents();
  
  // Hook para refrescar datos
  const { refreshEvents } = useRefreshData();

  // Componente de carga
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );

  // Componente de error
  const ErrorAlert = ({ error }: { error: Error }) => (
    <Alert variant="destructive">
      <AlertDescription>
        Error al cargar los partidos: {error.message}
      </AlertDescription>
    </Alert>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-accent">Juegos destacados</h2>
        <div className="flex items-center gap-4">
          {liveMatches.length > 0 && (
            <div className="flex items-center gap-2 text-live">
              <CircleDot className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">{liveMatches.length} en vivo</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refreshEvents}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
          <button className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-semibold hover:bg-accent/90 transition-colors">
            Ver todos
          </button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Todos
            {allEvents.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {allEvents.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="soccer" className="flex items-center gap-2">
            <Dribbble className="w-4 h-4" />
            Fútbol
            {soccerMatches.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {soccerMatches.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="basketball" className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Baloncesto
            {basketballMatches.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {basketballMatches.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="baseball" className="flex items-center gap-2">
            <CircleDot className="w-4 h-4" />
            Béisbol
            {baseballMatches.length > 0 && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                {baseballMatches.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <AllEventsTab />
        </TabsContent>

        <TabsContent value="soccer" className="mt-6">
          {isLoadingSoccer ? (
            <LoadingSkeleton />
          ) : soccerError ? (
            <ErrorAlert error={soccerError} />
          ) : soccerMatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay partidos de fútbol programados para hoy
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Los datos se actualizarán automáticamente cada minuto
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  league={match.league}
                  venue={match.venue}
                  homeTeamBadge={match.homeTeamBadge}
                  awayTeamBadge={match.awayTeamBadge}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="basketball" className="mt-6">
          {isLoadingBasketball ? (
            <LoadingSkeleton />
          ) : basketballError ? (
            <ErrorAlert error={basketballError} />
          ) : basketballMatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay partidos de baloncesto programados para hoy
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Los datos se actualizarán automáticamente cada minuto
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  league={match.league}
                  venue={match.venue}
                  homeTeamBadge={match.homeTeamBadge}
                  awayTeamBadge={match.awayTeamBadge}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="baseball" className="mt-6">
          {isLoadingBaseball ? (
            <LoadingSkeleton />
          ) : baseballError ? (
            <ErrorAlert error={baseballError} />
          ) : baseballMatches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No hay partidos de béisbol programados para hoy
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Los datos se actualizarán automáticamente cada minuto
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  league={match.league}
                  venue={match.venue}
                  homeTeamBadge={match.homeTeamBadge}
                  awayTeamBadge={match.awayTeamBadge}
                />
              ))}
            </div>
          )}
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

export default SportsTabsWithAPI;
