// Configuración de TheSportsDB API
const API_BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// Tipos para TheSportsDB API
export interface TheSportsDBEvent {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string;
  strTime: string;
  strDate: string;
  strLeague: string;
  strSport: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strVenue?: string;
  strCountry?: string;
}

export interface TheSportsDBLeague {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
  strCountry?: string;
  strBadge?: string;
}

export interface TheSportsDBTeam {
  idTeam: string;
  strTeam: string;
  strSport: string;
  strLeague: string;
  strTeamBadge?: string;
  strCountry?: string;
  strStadium?: string;
}

// Tipos adaptados para nuestra aplicación
export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  time: string;
  status: "live" | "halftime" | "finished" | "scheduled";
  sport: string;
  league: string;
  date: string;
  venue?: string;
  homeTeamBadge?: string;
  awayTeamBadge?: string;
}

export interface League {
  id: string;
  name: string;
  sport: string;
  country?: string;
  badge?: string;
}

// Función para hacer peticiones HTTP
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`TheSportsDB API Error: ${response.status} ${response.statusText} - URL: ${url}`);
      throw new Error(`TheSportsDB API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from TheSportsDB:', error);
    throw error;
  }
}

// Función para convertir estado de TheSportsDB a nuestro formato
const convertStatus = (status: string): Match['status'] => {
  switch (status.toLowerCase()) {
    case 'live':
    case 'in play':
      return 'live';
    case 'halftime':
      return 'halftime';
    case 'finished':
    case 'match finished':
      return 'finished';
    default:
      return 'scheduled';
  }
};

// Función para convertir eventos de TheSportsDB a nuestro formato
const convertEventToMatch = (event: TheSportsDBEvent): Match => {
  // Validar y limpiar los datos
  const homeScore = event.intHomeScore ? parseInt(event.intHomeScore) : 0;
  const awayScore = event.intAwayScore ? parseInt(event.intAwayScore) : 0;
  
  return {
    id: event.idEvent || String(Date.now()),
    homeTeam: event.strHomeTeam || 'Equipo Local',
    awayTeam: event.strAwayTeam || 'Equipo Visitante',
    homeScore: isNaN(homeScore) ? 0 : homeScore,
    awayScore: isNaN(awayScore) ? 0 : awayScore,
    time: event.strTime || 'TBD',
    status: convertStatus(event.strStatus || 'scheduled'),
    sport: event.strSport || 'Desconocido',
    league: event.strLeague || 'Liga Desconocida',
    date: event.strDate || new Date().toISOString().split('T')[0],
    venue: event.strVenue || undefined,
    homeTeamBadge: event.strHomeTeamBadge || undefined,
    awayTeamBadge: event.strAwayTeamBadge || undefined,
  };
};

// Servicios de TheSportsDB API
export const apiService = {
  // Obtener eventos del día actual
  getTodayEvents: async (): Promise<Match[]> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetchAPI<{ events: TheSportsDBEvent[] | null }>(`/eventsday.php?d=${today}`);
      
      if (!response.events || !Array.isArray(response.events)) {
        console.log('No events found for today');
        return [];
      }
      
      // Filtrar eventos válidos antes de convertir
      const validEvents = response.events.filter(event => 
        event && event.strHomeTeam && event.strAwayTeam && event.strSport
      );
      
      console.log(`Valid events: ${validEvents.length} of ${response.events.length}`);
      
      return validEvents.map(convertEventToMatch);
    } catch (error) {
      console.error('Error in getTodayEvents:', error);
      return [];
    }
  },

  // Obtener eventos por fecha
  getEventsByDate: async (date: string): Promise<Match[]> => {
    const response = await fetchAPI<{ events: TheSportsDBEvent[] }>(`/eventsday.php?d=${date}`);
    return response.events?.map(convertEventToMatch) || [];
  },

  // Obtener eventos por deporte (filtrando desde eventos del día)
  getEventsBySport: async (sport: string): Promise<Match[]> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetchAPI<{ events: TheSportsDBEvent[] | null }>(`/eventsday.php?d=${today}`);
      
      if (!response.events || !Array.isArray(response.events)) {
        console.log('No events found');
        return [];
      }
      
      const events = response.events;
      
      console.log('Total events from API:', events.length);
      console.log('Looking for sport:', sport);
    
    // Mapeo de nombres de deportes
    const sportMapping: { [key: string]: string[] } = {
      'Soccer': ['soccer', 'football', 'fútbol', 'futbol'],
      'Basketball': ['basketball', 'baloncesto', 'basquetbol'],
      'Baseball': ['baseball', 'béisbol', 'beisbol']
    };
    
    // Encontrar el deporte correcto
    let targetSport = sport;
    for (const [apiSport, aliases] of Object.entries(sportMapping)) {
      if (aliases.some(alias => alias.toLowerCase() === sport.toLowerCase())) {
        targetSport = apiSport;
        break;
      }
    }
    
    console.log('Searching for API sport:', targetSport);
    
    // Filtrar por deporte (búsqueda flexible)
    const filteredEvents = events.filter(event => {
      // Validar que el evento tenga los campos necesarios
      if (!event || !event.strSport || !event.strHomeTeam || !event.strAwayTeam) {
        return false;
      }
      
      const eventSport = (event.strSport || '').toLowerCase();
      const searchSport = (targetSport || '').toLowerCase();
      
      if (!eventSport || !searchSport) {
        return false;
      }
      
      const match = eventSport.includes(searchSport) || searchSport.includes(eventSport);
      
      if (match) {
        console.log('Match found:', event.strSport, '-', event.strHomeTeam, 'vs', event.strAwayTeam);
      }
      
      return match;
    });
    
      console.log('Filtered events:', filteredEvents.length);
      
      return filteredEvents.map(convertEventToMatch);
    } catch (error) {
      console.error('Error in getEventsBySport:', error);
      return [];
    }
  },

  // Obtener eventos por liga
  getEventsByLeague: async (leagueId: string): Promise<Match[]> => {
    const response = await fetchAPI<{ events: TheSportsDBEvent[] }>(`/events.php?l=${leagueId}`);
    return response.events?.map(convertEventToMatch) || [];
  },

  // Obtener todas las ligas
  getAllLeagues: async (): Promise<League[]> => {
    const response = await fetchAPI<{ leagues: TheSportsDBLeague[] }>('/all_leagues.php');
    return response.leagues?.map(league => ({
      id: league.idLeague,
      name: league.strLeague,
      sport: league.strSport,
      country: league.strCountry,
      badge: league.strBadge,
    })) || [];
  },

  // Obtener ligas por deporte
  getLeaguesBySport: async (sport: string): Promise<League[]> => {
    const response = await fetchAPI<{ leagues: TheSportsDBLeague[] }>(`/search_all_leagues.php?s=${sport}`);
    return response.leagues?.map(league => ({
      id: league.idLeague,
      name: league.strLeague,
      sport: league.strSport,
      country: league.strCountry,
      badge: league.strBadge,
    })) || [];
  },

  // Obtener equipos por liga
  getTeamsByLeague: async (leagueId: string): Promise<TheSportsDBTeam[]> => {
    const response = await fetchAPI<{ teams: TheSportsDBTeam[] }>(`/lookup_all_teams.php?id=${leagueId}`);
    return response.teams || [];
  },

  // Obtener eventos en vivo (aproximación)
  getLiveEvents: async (): Promise<Match[]> => {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetchAPI<{ events: TheSportsDBEvent[] }>(`/eventsday.php?d=${today}`);
    const events = response.events || [];
    
    // Filtrar eventos que están en vivo o en juego
    return events
      .filter(event => 
        event.strStatus?.toLowerCase().includes('live') || 
        event.strStatus?.toLowerCase().includes('in play')
      )
      .map(convertEventToMatch);
  },

  // Obtener próximos eventos
  getUpcomingEvents: async (sport?: string): Promise<Match[]> => {
    const today = new Date().toISOString().split('T')[0];
    const response = await fetchAPI<{ events: TheSportsDBEvent[] }>(`/eventsday.php?d=${today}`);
    const events = response.events || [];
    
    // Filtrar eventos programados
    return events
      .filter(event => 
        event.strStatus?.toLowerCase().includes('scheduled') ||
        event.strStatus?.toLowerCase().includes('not started')
      )
      .filter(event => !sport || event.strSport.toLowerCase() === sport.toLowerCase())
      .map(convertEventToMatch);
  },
};
