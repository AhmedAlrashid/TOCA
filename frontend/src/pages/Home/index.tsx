import React, { useState, useEffect } from 'react';
import TrainerSession from '../../components/TrainerSession';
import { getCoachAppointments, type AppointmentsByDate } from '../../api/appointments';
import { useAuth } from '../../context/AuthContext';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [appointmentsByDate, setAppointmentsByDate] = useState<AppointmentsByDate>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setError('Please log in to view appointments');
      return;
    }

    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getCoachAppointments(currentUser);
        if (result.success && result.data) {
          setAppointmentsByDate(result.data);
        } else {
          setError('Failed to fetch appointments');
        }
      } catch (err) {
        setError('Error fetching appointments');
        console.error('Appointments fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser]);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  if (!currentUser) {
    return (
      <div style={{
        flex: 1,
        padding: '40px',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#6c757d' }}>
          <h2>Please log in to view appointments</h2>
          <p>You need to be logged in to see your training schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      padding: '40px',
      backgroundColor: 'white',
      overflowY: 'auto',
      height: '100vh'
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 700, 
        color: '#212529',
        marginBottom: '10px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        Dashboard
      </h1>
      
      <p style={{
        fontSize: '16px',
        color: '#6c757d',
        marginBottom: '30px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        Welcome back, {currentUser}
      </p>

      {loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#666'
        }}>
          Loading appointments...
        </div>
      )}

      {error && (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          {Object.keys(appointmentsByDate).length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#6c757d',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginBottom: '10px' }}>No appointments found</h3>
              <p>You don't have any appointments scheduled.</p>
            </div>
          ) : (
            Object.entries(appointmentsByDate)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, appointments]) => (
                <div key={date} style={{ marginBottom: '40px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#212529',
                    marginBottom: '20px',
                    fontFamily: "'DM Sans', sans-serif"
                  }}>
                    {formatDateHeader(date)}
                  </h2>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '20px',
                    alignItems: 'flex-start'
                  }}>
                    {appointments.map((appointment) => (
                      <TrainerSession
                        key={appointment.appointmentId}
                        trainerName={currentUser}
                        startTime={appointment.appointmentTime}
                        endTime={appointment.endTime}
                        status="confirmed"
                        showPastSessions={true}
                        pastSessions={appointment.sessionHistory}
                        playerName={appointment.playerName}
                      />
                    ))}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;