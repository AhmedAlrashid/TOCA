const API_BASE_URL = 'http://localhost:3001/api';

// Types for appointment-related data
export interface AppointmentData {
  appointmentId: string;
  playerId: string;
  playerName: string;
  appointmentTime: string;
  endTime: string;
  sessionHistory: SessionHistory[];
}

export interface SessionHistory {
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

export interface AppointmentsByDate {
  [date: string]: AppointmentData[];
}

export interface AppointmentsResponse {
  success: boolean;
  data: AppointmentsByDate;
  message?: string;
}

// API functions
export const appointmentsApi = {
  /**
   * Get all appointments for a specific coach, grouped by date
   * @param coachName - The name of the coach
   * @returns Promise with appointments grouped by date
   */
  getAppointmentsForCoach: async (coachName: string): Promise<AppointmentsResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/coach/${encodeURIComponent(coachName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: AppointmentsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching appointments for coach:', error);
      throw error;
    }
  },
};

// Convenience function for easy usage
export const getCoachAppointments = appointmentsApi.getAppointmentsForCoach;