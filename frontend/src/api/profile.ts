const API_BASE_URL = 'http://localhost:3001/api';

// Types for profile-related data
export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  centerName: string;
  createdAt: string;
}

export interface PlayerAverages {
  playerId: string;
  totalSessions: number;
  avgNumberOfBalls: number;
  avgBestStreak: number;
  avgNumberOfGoals: number;
  avgScore: number;
  avgSpeedOfPlay: number;
  avgNumberOfExercises: number;
}

export interface ProfilesResponse {
  success: boolean;
  count: number;
  data: Profile[];
  message?: string;
  error?: string;
}

export interface ProfileResponse {
  success: boolean;
  data: Profile;
  message?: string;
  error?: string;
}

export interface PlayerAveragesResponse {
  success: boolean;
  data: PlayerAverages;
  message?: string;
  error?: string;
}

// API functions
export const profileApi = {
  /**
   * Get all profiles
   * @returns Promise with array of all profiles
   */
  getAllProfiles: async (): Promise<ProfilesResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProfilesResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching all profiles:', error);
      throw error;
    }
  },

  /**
   * Get a single profile by ID
   * @param profileId - The ID of the profile to retrieve
   * @returns Promise with single profile data
   */
  getProfileById: async (profileId: string): Promise<ProfileResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProfileResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching profile by ID:', error);
      throw error;
    }
  },

  /**
   * Get player performance averages
   * @param playerId - The ID of the player to get averages for
   * @returns Promise with player performance averages
   */
  getPlayerAverages: async (playerId: string): Promise<PlayerAveragesResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${playerId}/averages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PlayerAveragesResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching player averages:', error);
      throw error;
    }
  },

  /**
   * Get profile with performance averages (convenience method)
   * @param profileId - The ID of the profile/player
   * @returns Promise with profile and averages data combined
   */
  getProfileWithAverages: async (profileId: string): Promise<{ profile: Profile; averages: PlayerAverages } | null> => {
    try {
      const [profileResult, averagesResult] = await Promise.allSettled([
        profileApi.getProfileById(profileId),
        profileApi.getPlayerAverages(profileId)
      ]);

      if (profileResult.status === 'fulfilled' && profileResult.value.success) {
        const profile = profileResult.value.data;
        
        // Averages might not exist if player has no sessions
        let averages: PlayerAverages | null = null;
        if (averagesResult.status === 'fulfilled' && averagesResult.value.success) {
          averages = averagesResult.value.data;
        }

        return {
          profile,
          averages: averages || {
            playerId: profileId,
            totalSessions: 0,
            avgNumberOfBalls: 0,
            avgBestStreak: 0,
            avgNumberOfGoals: 0,
            avgScore: 0,
            avgSpeedOfPlay: 0,
            avgNumberOfExercises: 0
          }
        };
      }

      return null;
    } catch (error) {
      console.error('Error fetching profile with averages:', error);
      throw error;
    }
  },

  /**
   * Search profiles by name (client-side filtering)
   * @param searchTerm - The term to search for in first name or last name
   * @returns Promise with filtered profiles
   */
  searchProfiles: async (searchTerm: string): Promise<ProfilesResponse> => {
    try {
      const allProfilesResult = await profileApi.getAllProfiles();
      
      if (allProfilesResult.success) {
        const filteredProfiles = allProfilesResult.data.filter(profile => {
          const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase()) ||
                 profile.email.toLowerCase().includes(searchTerm.toLowerCase());
        });

        return {
          ...allProfilesResult,
          data: filteredProfiles,
          count: filteredProfiles.length
        };
      }

      return allProfilesResult;
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  },
};

export const getAllProfiles = profileApi.getAllProfiles;
export const getProfile = profileApi.getProfileById;
export const getPlayerAverages = profileApi.getPlayerAverages;
export const getProfileWithAverages = profileApi.getProfileWithAverages;
export const searchProfiles = profileApi.searchProfiles;