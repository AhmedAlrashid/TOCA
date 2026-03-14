const API_BASE_URL = 'http://localhost:3001/api';

// Types for session-related data
export interface Session {
  id: string;
  playerId: string;
  trainerName: string;
  startTime: string;
  endTime: string;
  numberOfBalls: number;
  bestStreak: number;
  numberOfGoals: number;
  score: number;
  avgSpeedOfPlay: number;
  numberOfExercises: number;
}

export interface SessionResponse {
  success: boolean;
  data: Session;
  message?: string;
}

export interface PlayerSessionsResponse {
  success: boolean;
  count: number;
  data: Session[];
  message?: string;
  error?: string;
}

// API functions
export const sessionApi = {
  /**
   * Get a single session by ID
   * @param sessionId - The ID of the session
   * @returns Promise with session data
   */
  getSession: async (sessionId: string): Promise<SessionResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SessionResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  },

  /**
   * Get all sessions for a specific player
   * @param playerId - The ID of the player
   * @returns Promise with array of sessions for the player
   */
  getPlayerSessions: async (playerId: string): Promise<PlayerSessionsResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/player/${playerId}/sessions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlayerSessionsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching player sessions:', error);
      throw error;
    }
  },

  /**
   * Get recent sessions for a player (convenience method)
   * @param playerId - The ID of the player
   * @param limit - Maximum number of sessions to return
   * @returns Promise with limited array of recent sessions
   */
  getRecentPlayerSessions: async (playerId: string, limit: number = 10): Promise<PlayerSessionsResponse> => {
    try {
      const result = await sessionApi.getPlayerSessions(playerId);
      
      if (result.success && result.data) {
        // Sessions are already sorted by most recent first from the backend
        const limitedSessions = result.data.slice(0, limit);
        return {
          ...result,
          data: limitedSessions,
          count: limitedSessions.length
        };
      }
      
      return result;
    } catch (error) {
      console.error('Error fetching recent player sessions:', error);
      throw error;
    }
  },
};

// Convenience functions for easy usage
export const getSession = sessionApi.getSession;
export const getPlayerSessions = sessionApi.getPlayerSessions;
export const getRecentPlayerSessions = sessionApi.getRecentPlayerSessions;