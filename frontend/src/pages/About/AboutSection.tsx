import React from 'react';

type AboutSectionProps = {
  label: string;
  heading: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
  accentColor?: string;
};

const AboutSection: React.FC<AboutSectionProps> = ({
  label,
  heading,
  body,
  imageSrc,
  imageAlt,
  reverse = false,
  accentColor = '#2e7d32',
}) => {
  const text = (
    <div style={{ flex: '0 0 380px' }}>
      <p style={{
        margin: '0 0 16px',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: accentColor,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </p>
      <h2 style={{
        margin: '0 0 24px',
        fontSize: 42,
        fontWeight: 800,
        lineHeight: 1.1,
        color: '#0d0d0d',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {heading}
      </h2>
      <p style={{
        margin: 0,
        fontSize: 15,
        lineHeight: 1.7,
        color: '#555',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {body}
      </p>
    </div>
  );

  const image = (
    <div style={{ flex: 1, height: 340, borderRadius: 20, overflow: 'hidden' }}>
      <img
        src={imageSrc}
        alt={imageAlt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '80px',
      maxWidth: '1000px',
      width: '100%',
      flexDirection: reverse ? 'row-reverse' : 'row',
    }}>
      {text}
      {image}
    </div>
  );
};

export default AboutSection;
