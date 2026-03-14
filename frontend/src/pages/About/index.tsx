import React from 'react';
import AboutSection from './AboutSection';

const About: React.FC = () => {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '100px',
      padding: '80px 60px',
      backgroundColor: 'white',
      overflowY: 'auto',
    }}>
      <AboutSection
        label="About TOCA Football"
        heading="The next generation of soccer training"
        body="TOCA Football provides a one-of-a-kind, tech-enhanced soccer experience for players of all ages and skill levels — from their very first touch to the next level."
        imageSrc="/67bcbf5f852a541f7c44a54d_c8663270e6834e531f039523d2de27e7_toca-soccer-training-practice.avif"
        imageAlt="TOCA soccer training practice"
        accentColor="#2e7d32"
      />

      <AboutSection
        label="Classes for everyone"
        heading="Structured programs built for every level"
        body="Whether you're just starting out or pushing toward elite performance, TOCA's structured soccer classes provide expert coaching, real-time feedback, and data-driven progression."
        imageSrc="/6949ae4612c134c9554a7bb6_toca-soccer-classes.avif"
        imageAlt="TOCA soccer classes"
        reverse
        accentColor="#1565c0"
      />

      <AboutSection
        label="Adult pickup"
        heading="Play with a community that loves the game"
        body="Join our adult pickup sessions and experience competitive, fun soccer in a welcoming environment. No commitment required — just show up and play."
        imageSrc="/6949af706f8747f15f741458_toca-soccer-adult-pickup.avif"
        imageAlt="TOCA adult pickup soccer"
        accentColor="#6a1b9a"
      />
    </div>
  );
};

export default About;