import React from 'react';
import TrainerSession from '../../components/TrainerSession';

const Home: React.FC = () => {
  return (
    <div style={{
      flex: 1,
      padding: '40px',
      backgroundColor: 'white',
      overflowY: 'auto'
    }}>
      <h1 style={{ 
        fontSize: '28px', 
        fontWeight: 700, 
        color: '#212529',
        marginBottom: '30px',
        fontFamily: "'DM Sans', sans-serif"
      }}>
        Dashboard
      </h1>
      
      <TrainerSession
        trainerName="Trainer Lisa"
        startTime="2026-03-12T12:00:00Z"
        endTime="2026-03-12T13:00:00Z"
        status="confirmed"
        showPastSessions={true}
        pastSessions={[
          {
            id: "008bfbdd-7914-4488-bf3a-915d998119f1",
            trainerName: "Trainer Lisa",
            date: "2025-12-30T11:00:00Z",
            startTime: "2025-12-30T11:00:00Z",
            endTime: "2025-12-30T12:00:00Z"
          },
          {
            id: "0560bf11-1253-412e-bde2-1004aae842f2",
            trainerName: "Coach Mike",
            date: "2025-12-24T06:00:00Z",
            startTime: "2025-12-24T06:00:00Z",
            endTime: "2025-12-24T07:00:00Z"
          },
          {
            id: "783adad2-e377-40bb-bd81-50326cec3d7a",
            trainerName: "Trainer Sarah",
            date: "2025-12-20T14:00:00Z",
            startTime: "2025-12-20T14:00:00Z",
            endTime: "2025-12-20T15:00:00Z"
          },
          {
            id: "4b8c1d5e-9f2a-45b6-a1c8-7e3f9d2b5a8c",
            trainerName: "Coach Alex",
            date: "2025-12-18T09:00:00Z",
            startTime: "2025-12-18T09:00:00Z",
            endTime: "2025-12-18T10:00:00Z"
          },
          {
            id: "7a9b2c4d-1e6f-4g8h-9i0j-5k7l3m9n1o2p",
            trainerName: "Trainer Lisa", 
            date: "2025-12-15T16:30:00Z",
            startTime: "2025-12-15T16:30:00Z",
            endTime: "2025-12-15T17:30:00Z"
          },
          {
            id: "8c1d4e7f-2g5h-4i8j-9k1l-6m9n3o2p5q8r",
            trainerName: "Coach Emma",
            date: "2025-12-12T11:15:00Z",
            startTime: "2025-12-12T11:15:00Z", 
            endTime: "2025-12-12T12:15:00Z"
          }
        ]}
      />
    </div>
  );
};

export default Home;