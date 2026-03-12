import React from 'react';

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
                
                <button style={{
                  backgroundColor: '#495057',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '6px 16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginLeft: '15px'
                }}>
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