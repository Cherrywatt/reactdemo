import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, type Match, type League } from '@/lib/api';

// Hook para obtener eventos del día actual
export const useTodayEvents = () => {
  return useQuery({
    queryKey: ['events', 'today'],
    queryFn: apiService.getTodayEvents,
    staleTime: 30000, // 30 segundos
    refetchInterval: 60000, // Refrescar cada minuto
  });
};

// Hook para obtener eventos por deporte
export const useEventsBySport = (sport: string) => {
  return useQuery({
    queryKey: ['events', 'sport', sport],
    queryFn: () => apiService.getEventsBySport(sport),
    staleTime: 30000,
    refetchInterval: 60000,
    enabled: !!sport,
  });
};

// Hook para obtener eventos en vivo
export const useLiveEvents = () => {
  return useQuery({
    queryKey: ['events', 'live'],
    queryFn: apiService.getLiveEvents,
    staleTime: 10000, // 10 segundos
    refetchInterval: 30000, // Refrescar cada 30 segundos
  });
};

// Hook para obtener eventos por fecha
export const useEventsByDate = (date: string) => {
  return useQuery({
    queryKey: ['events', 'date', date],
    queryFn: () => apiService.getEventsByDate(date),
    staleTime: 30000,
    enabled: !!date,
  });
};

// Hook para obtener eventos por liga
export const useEventsByLeague = (leagueId: string) => {
  return useQuery({
    queryKey: ['events', 'league', leagueId],
    queryFn: () => apiService.getEventsByLeague(leagueId),
    staleTime: 30000,
    enabled: !!leagueId,
  });
};

// Hook para obtener todas las ligas
export const useAllLeagues = () => {
  return useQuery({
    queryKey: ['leagues', 'all'],
    queryFn: apiService.getAllLeagues,
    staleTime: 300000, // 5 minutos
  });
};

// Hook para obtener ligas por deporte
export const useLeaguesBySport = (sport: string) => {
  return useQuery({
    queryKey: ['leagues', 'sport', sport],
    queryFn: () => apiService.getLeaguesBySport(sport),
    staleTime: 300000,
    enabled: !!sport,
  });
};

// Hook para obtener equipos por liga
export const useTeamsByLeague = (leagueId: string) => {
  return useQuery({
    queryKey: ['teams', 'league', leagueId],
    queryFn: () => apiService.getTeamsByLeague(leagueId),
    staleTime: 300000,
    enabled: !!leagueId,
  });
};

// Hook para obtener próximos eventos
export const useUpcomingEvents = (sport?: string) => {
  return useQuery({
    queryKey: ['events', 'upcoming', sport],
    queryFn: () => apiService.getUpcomingEvents(sport),
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// Hook para obtener eventos de fútbol del día
export const useFootballEvents = () => {
  return useQuery({
    queryKey: ['events', 'football', 'today'],
    queryFn: async () => {
      try {
        return await apiService.getEventsBySport('Soccer');
      } catch (error) {
        console.error('Error fetching football events:', error);
        return [];
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// Hook para obtener eventos de baloncesto del día
export const useBasketballEvents = () => {
  return useQuery({
    queryKey: ['events', 'basketball', 'today'],
    queryFn: async () => {
      try {
        return await apiService.getEventsBySport('Basketball');
      } catch (error) {
        console.error('Error fetching basketball events:', error);
        return [];
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// Hook para obtener eventos de béisbol del día
export const useBaseballEvents = () => {
  return useQuery({
    queryKey: ['events', 'baseball', 'today'],
    queryFn: async () => {
      try {
        return await apiService.getEventsBySport('Baseball');
      } catch (error) {
        console.error('Error fetching baseball events:', error);
        return [];
      }
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};

// Hook para refrescar datos manualmente
export const useRefreshData = () => {
  const queryClient = useQueryClient();

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
    queryClient.invalidateQueries({ queryKey: ['leagues'] });
  };

  const refreshEvents = () => {
    queryClient.invalidateQueries({ queryKey: ['events'] });
  };

  const refreshLeagues = () => {
    queryClient.invalidateQueries({ queryKey: ['leagues'] });
  };

  return {
    refreshAll,
    refreshEvents,
    refreshLeagues,
  };
};
