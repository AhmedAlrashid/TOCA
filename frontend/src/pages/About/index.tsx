import React from 'react';

const About: React.FC = () => {
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
        About TOCA
      </h1>
      
      <div style={{
        maxWidth: '800px',
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#495057'
      }}>
        <p>
          TOCA Soccer is a technology-driven soccer training platform that combines 
          innovative training methods with data analytics to help players improve their skills.
        </p>
      </div>
    </div>
  );
};

export default About;