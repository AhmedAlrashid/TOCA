import React from 'react';

const Profiles: React.FC = () => {
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
        Profiles
      </h1>
      
      <div style={{
        display: 'grid',
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
      }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#212529' }}>Player Profiles</h3>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>
            Manage and view player information, stats, and training progress.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profiles;