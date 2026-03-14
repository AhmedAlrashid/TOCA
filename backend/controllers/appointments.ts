import type { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Appointment = {
    id: string;
    playerId: string;
    trainerName: string;
    startTime: string;
    endTime: string;
}

type Profile = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

type Session = {
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

// Get all appointments for a specific coach, grouped by date
export const getAppointmentsForCoach = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointmentsPath = path.join(__dirname, '..', 'toca-interview-sample-data', 'appointments.json');
    const profilesPath = path.join(__dirname, '..', 'toca-interview-sample-data', 'profiles.json');
    const sessionsPath = path.join(__dirname, '..', 'toca-interview-sample-data', 'trainingSessions.json');
    
    const appointmentsData = fs.readFileSync(appointmentsPath, 'utf8');
    const profilesData = fs.readFileSync(profilesPath, 'utf8');
    const sessionsData = fs.readFileSync(sessionsPath, 'utf8');
    
    const appointments: Appointment[] = JSON.parse(appointmentsData);
    const profiles: Profile[] = JSON.parse(profilesData);
    const sessions: Session[] = JSON.parse(sessionsData);
    const { coachName } = req.params;
    
    if (!coachName) {
      res.status(400).json({
        success: false,
        message: 'Coach name is required'
      });
      return;
    }
    
    // Filter coach's appointments
    const coachAppointments = appointments.filter(a => a.trainerName === coachName);
    
    // Group by date
    const appointmentsByDate = coachAppointments.reduce((acc, appointment) => {
      const player = profiles.find((p: Profile) => p.id === appointment.playerId);
      if (!player) return acc;
      
      // Get date string (YYYY-MM-DD)
      const appointmentDate = new Date(appointment.startTime).toISOString().split('T')[0];
      
      if (!appointmentDate) return acc; // Safety check
      
      // Get all session history for this player
      const playerSessions = sessions.filter(s => 
        s.playerId === appointment.playerId
      ).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      
      if (!acc[appointmentDate]) {
        acc[appointmentDate] = [];
      }
      
      acc[appointmentDate].push({
        appointmentId: appointment.id,
        playerId: appointment.playerId,
        playerName: `${player.firstName} ${player.lastName}`,
        appointmentTime: appointment.startTime,
        endTime: appointment.endTime,
        sessionHistory: playerSessions
      });
      
      return acc;
    }, {} as Record<string, any[]>);

    // Sort appointments within each date by time
    Object.keys(appointmentsByDate).forEach(date => {
      const dateAppointments = appointmentsByDate[date];
      if (dateAppointments) {
        dateAppointments.sort((a, b) => 
          new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime()
        );
      }
    });

    res.status(200).json({
      success: true,
      data: appointmentsByDate
    });
  } catch (error) {
    console.error('Error reading appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments',
    });
  }
};