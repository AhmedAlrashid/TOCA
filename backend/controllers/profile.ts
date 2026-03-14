import type { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Profile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  centerName: string;
  createdAt: string;
};

type session = {
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
};

export const getAllProfiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const profilesPath = path.join(__dirname, '..', 'toca-interview-sample-data', 'profiles.json');
    const profilesData = fs.readFileSync(profilesPath, 'utf8');
    const profiles: Profile[] = JSON.parse(profilesData);

    // Return all profiles as JSON rows
    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles
    });
  } catch (error) {
    console.error('Error reading profiles:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profiles',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const profileId = req.params.id;
    const profilesPath = path.join(__dirname, '..', 'toca-interview-sample-data', 'profiles.json');
    const profilesData = fs.readFileSync(profilesPath, 'utf8');
    const profiles: Profile[] = JSON.parse(profilesData);

    const profile = profiles.find(p => p.id === profileId);

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error reading profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

const calculatePlayerAverages = (sessions: session[]) => {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      avgNumberOfBalls: 0,
      avgBestStreak: 0,
      avgNumberOfGoals: 0,
      avgScore: 0,
      avgSpeedOfPlay: 0,
      avgNumberOfExercises: 0
    };
  }

  const totals = sessions.reduce((acc, session) => ({
    numberOfBalls: acc.numberOfBalls + session.numberOfBalls,
    bestStreak: acc.bestStreak + session.bestStreak,
    numberOfGoals: acc.numberOfGoals + session.numberOfGoals,
    score: acc.score + session.score,
    avgSpeedOfPlay: acc.avgSpeedOfPlay + session.avgSpeedOfPlay,
    numberOfExercises: acc.numberOfExercises + session.numberOfExercises
  }), {
    numberOfBalls: 0,
    bestStreak: 0,
    numberOfGoals: 0,
    score: 0,
    avgSpeedOfPlay: 0,
    numberOfExercises: 0
  });

  const sessionCount = sessions.length;

  return {
    totalSessions: sessionCount,
    avgNumberOfBalls: Math.round((totals.numberOfBalls / sessionCount) * 100) / 100,
    avgBestStreak: Math.round((totals.bestStreak / sessionCount) * 100) / 100,
    avgNumberOfGoals: Math.round((totals.numberOfGoals / sessionCount) * 100) / 100,
    avgScore: Math.round((totals.score / sessionCount) * 100) / 100,
    avgSpeedOfPlay: Math.round((totals.avgSpeedOfPlay / sessionCount) * 100) / 100,
    avgNumberOfExercises: Math.round((totals.numberOfExercises / sessionCount) * 100) / 100
  };
};

// Get player performance averages
export const getPlayerAverages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { playerId } = req.params;
    
    if (!playerId) {
      res.status(400).json({
        success: false,
        message: 'Player ID is required'
      });
      return;
    }

    const sessionsPath = path.join(__dirname, '..', 'toca-interview-sample-data', 'trainingSessions.json');
    const sessionsData = fs.readFileSync(sessionsPath, 'utf8');
    const allSessions: session[] = JSON.parse(sessionsData);

    // Filter sessions for this player
    const playerSessions = allSessions.filter(s => s.playerId === playerId);

    if (playerSessions.length === 0) {
      res.status(404).json({
        success: false,
        message: 'No sessions found for this player'
      });
      return;
    }

    // Calculate averages using helper function
    const averages = calculatePlayerAverages(playerSessions);

    res.status(200).json({
      success: true,
      data: {
        playerId,
        ...averages
      }
    });

  } catch (error) {
    console.error('Error calculating player averages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate player averages',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};