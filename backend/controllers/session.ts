import type { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
}

type Profile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export const getSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const sessionsPath = path.join(__dirname, '..', 'toca-interview-sample-data', 'trainingSessions.json');
        const sessionsData = fs.readFileSync(sessionsPath, 'utf8');
        const sessions: session[] = JSON.parse(sessionsData);

        const session = sessions.find(s => s.id === id);
        
        if (!session) {
            res.status(404).json({ success: false, message: 'Session not found' });
            return;
        }

        res.status(200).json({ success: true, data: session });
    } catch (error) {
        console.error('Error reading session:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to retrieve session',
        });
    }
};

export const getPreviousSessionsForPlayer = async (req: Request, res: Response): Promise<void> => {
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
    const sessions: session[] = JSON.parse(sessionsData);
    
    // Get all sessions for this player, sorted by most recent first
    const playerSessions = sessions
      .filter(s => s.playerId === playerId)
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      
    res.status(200).json({
      success: true,
      count: playerSessions.length,
      data: playerSessions
    });
      
  } catch (error) {
    console.error('Error retrieving player sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve player sessions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};