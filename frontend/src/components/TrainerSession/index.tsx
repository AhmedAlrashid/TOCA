import React from 'react';
import { usePopover, type TrainingSession } from '../core/Popover';

type TrainerSessionProps = {
  trainerName: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  showPastSessions?: boolean;
  pastSessions?: Array<{
    id: string;
    trainerName: string;
    date: string;
    startTime: string;
    endTime: string;
  }>;
};

const TrainerSession: React.FC<TrainerSessionProps> = ({ 
  trainerName, 
  startTime, 
  endTime, 
  status,
  showPastSessions = false,
  pastSessions = []
}) => {
  const { openSessionPopover } = usePopover();

  // Sample training sessions data - in a real app, this would come from your API
  const sampleTrainingSessions: TrainingSession[] = [
    {
      id: "008bfbdd-7914-4488-bf3a-915d998119f1",
      playerId: "47cb55dd-134d-459b-8892-bbba4f512399",
      trainerName: "Trainer Lisa",
      startTime: "2025-12-30T11:00:00Z",
      endTime: "2025-12-30T12:00:00Z",
      numberOfBalls: 153,
      bestStreak: 42,
      numberOfGoals: 60,
      score: 73.4,
      avgSpeedOfPlay: 3.68,
      numberOfExercises: 8
    },
    {
      id: "0560bf11-1253-412e-bde2-1004aae842f2",
      playerId: "47cb55dd-134d-459b-8892-bbba4f512399",
      trainerName: "Coach Mike",
      startTime: "2025-12-24T06:00:00Z",
      endTime: "2025-12-24T07:00:00Z",
      numberOfBalls: 121,
      bestStreak: 27,
      numberOfGoals: 40,
      score: 95.5,
      avgSpeedOfPlay: 5.06,
      numberOfExercises: 8
    },
    {
      id: "783adad2-e377-40bb-bd81-50326cec3d7a",
      playerId: "47cb55dd-134d-459b-8892-bbba4f512399",
      trainerName: "Coach David",
      startTime: "2026-01-05T04:00:00Z",
      endTime: "2026-01-05T05:00:00Z",
      numberOfBalls: 137,
      bestStreak: 16,
      numberOfGoals: 47,
      score: 93.9,
      avgSpeedOfPlay: 3.91,
      numberOfExercises: 11
    },
  ];

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#28a745';
      case 'pending': return '#ffc107';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const handleViewSession = (sessionId: string) => {
    const session = sampleTrainingSessions.find(s => s.id === sessionId);
    if (session) {
      openSessionPopover(session);
    }
  };

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      border: '1px solid #e9ecef',
      borderRadius: '12px',
      padding: '24px',
      width: '100%',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Current Session */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '15px',
        marginBottom: showPastSessions ? '24px' : '0'
      }}>
        {/* Avatar */}
        <div style={{
          width: '50px',
          height: '50px',
          backgroundColor: '#82d982',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          flexShrink: 0
        }}>
          👕
        </div>

        {/* Session Info */}
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            margin: '0 0 5px 0', 
            fontSize: '18px', 
            fontWeight: 600,
            color: '#212529'
          }}>
            {trainerName}
          </h3>
          
          <div style={{ 
            fontSize: '14px', 
            color: '#6c757d',
            marginBottom: '8px'
          }}>
            {formatTime(startTime)} - {formatTime(endTime)}
          </div>
          
          <span style={{
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: 'white',
            backgroundColor: getStatusColor(status),
            textTransform: 'capitalize'
          }}>
            {status}
          </span>
        </div>
      </div>

      {/* Past Sessions */}
      {showPastSessions && pastSessions.length > 0 && (
        <div>
          <div style={{
            fontSize: '14px',
            color: '#6c757d',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Past sessions with {trainerName.replace('Trainer ', '')}</span>
            <span style={{ fontSize: '12px' }}>▼</span>
          </div>

          {/* Horizontal Scroll Container */}
          <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '10px'
          }}>
            {pastSessions.map((session) => (
              <div key={session.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 15px',
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                minWidth: '280px',
                flexShrink: 0
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#212529' }}>
                    {session.trainerName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>
                    {formatDate(session.date)} · {formatTime(session.startTime)}-{formatTime(session.endTime)}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleViewSession(session.id)}
                  style={{
                    backgroundColor: '#495057',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginLeft: '15px'
                  }}
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerSession;