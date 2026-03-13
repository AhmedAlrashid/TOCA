import React, { useState, useEffect } from "react";

// Types for training session data  
type TrainingSession = {
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
};

// Types for player profile data
type PlayerProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  dob: string;
  centerName: string;
  createdAt: string;
};

// Session popover props
type SessionPopoverProps = {
  session: TrainingSession;
  onClose: () => void;
};

// Player popover props
type PlayerPopoverProps = {
  player: PlayerProfile;
  sessions: TrainingSession[];
  onSessionClick?: (sessionId: string) => void;
  onClose: () => void;
};

// Utility functions
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function formatDuration(start: string, end: string) {
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  return `${mins} min`;
}

function calculateAge(dob: string) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Statistical components
const StatCard = ({ label, value, unit, accent }: { label: string; value: string | number; unit?: string; accent?: string }) => (
  <div style={{
    background: "#f8f9fb",
    borderRadius: 12,
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  }}>
    <span style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
    <span style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: accent || "#1a1d23" }}>
      {value}<span style={{ fontSize: 13, fontWeight: 500, color: "#9aa0ad", marginLeft: 3 }}>{unit}</span>
    </span>
  </div>
);

const Badge = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <span style={{
    background: color || "#e8f5e9",
    color: color ? "#fff" : "#2e7d32",
    borderRadius: 20,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
    fontFamily: "'DM Sans', sans-serif",
  }}>{children}</span>
);

const ComparisonBar = ({ label, value, playerAvg, unit }: { label: string; value: number; playerAvg: number; unit?: string }) => {
  const percentage = playerAvg > 0 ? Math.min(100, Math.max(0, (value / playerAvg) * 100)) : 0;
  const isAboveAvg = value > playerAvg;
  
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <div style={{ width: "25%", fontSize: 12, color: "#6c757d", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ width: "45%", height: 8, background: "#f0f0f0", borderRadius: 4, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%",
          width: `${percentage}%`,
          background: isAboveAvg ? "#1976d2" : "#9e9e9e",
          transition: "width 0.3s ease"
        }} />
      </div>
      <div style={{ width: "25%", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
        <span style={{ fontWeight: 600, color: "#1a1d23" }}>{value}{unit || ""}</span>
        <span style={{ color: "#9aa0ad" }}>{playerAvg.toFixed(1)}{unit || ""}</span>
      </div>
    </div>
  );
};

// Session Popover Component
function SessionPopover({ session, onClose }: SessionPopoverProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid #eef0f4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>SESSION DETAILS</p>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23", marginBottom: 12 }}>Training session</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#6c757d", fontFamily: "'DM Sans', sans-serif" }}>
              <span>{formatDate(session.startTime)} • {formatTime(session.startTime)} - {formatTime(session.endTime)}</span>
              <Badge color="#4caf50">Completed</Badge>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9aa0ad", fontSize: 20, padding: 4, lineHeight: 1 }}>✕</button>
        </div>
      </div>

      {/* Overall Score Section */}
      <div style={{ padding: "32px", borderBottom: "1px solid #eef0f4" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>OVERALL SCORE</p>
            <p style={{ margin: 0, fontSize: 64, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "#4caf50", lineHeight: 1 }}>{session.score}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>TRAINER</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "#1a1d23" }}>{session.trainerName}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ padding: "32px", flex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: 48 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>GOALS</p>
            <p style={{ margin: 0, fontSize: 48, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>{session.numberOfGoals}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>BEST STREAK</p>
            <p style={{ margin: 0, fontSize: 48, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
              {session.bestStreak}<span style={{ fontSize: 16, color: "#9aa0ad", marginLeft: 6 }}>hits</span>
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>BALLS USED</p>
            <p style={{ margin: 0, fontSize: 48, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>{session.numberOfBalls}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>EXERCISES</p>
            <p style={{ margin: 0, fontSize: 48, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>{session.numberOfExercises}</p>
          </div>
        </div>

        {/* Speed of Play - Full Width */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ margin: 0, fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>AVG SPEED OF PLAY</p>
          <p style={{ margin: 0, fontSize: 48, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
            {session.avgSpeedOfPlay}<span style={{ fontSize: 16, color: "#9aa0ad", marginLeft: 6 }}>m/s</span>
          </p>
        </div>

        {/* VS Player Average - Mock data for now */}
        <div>
          <h3 style={{ margin: "0 0 20px", fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", textTransform: "uppercase" }}>VS. PLAYER AVERAGE</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ComparisonBar label="Goals" value={session.numberOfGoals} playerAvg={34.2} />
            <ComparisonBar label="Streak" value={session.bestStreak} playerAvg={21} />
            <ComparisonBar label="Speed" value={session.avgSpeedOfPlay} playerAvg={4.4} unit="m/s" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Player Popover Component  
function PlayerPopover({ player, sessions, onSessionClick, onClose }: PlayerPopoverProps) {
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  
  // Calculate player stats
  const playerSessions = sessions.filter(s => s.playerId === player.id);
  const avgScore = playerSessions.length > 0 ? playerSessions.reduce((acc, s) => acc + s.score, 0) / playerSessions.length : 0;
  const avgGoals = playerSessions.length > 0 ? playerSessions.reduce((acc, s) => acc + s.numberOfGoals, 0) / playerSessions.length : 0;
  const avgBalls = playerSessions.length > 0 ? playerSessions.reduce((acc, s) => acc + s.numberOfBalls, 0) / playerSessions.length : 0;
  const avgStreak = playerSessions.length > 0 ? playerSessions.reduce((acc, s) => acc + s.bestStreak, 0) / playerSessions.length : 0;
  const avgSpeed = playerSessions.length > 0 ? playerSessions.reduce((acc, s) => acc + s.avgSpeedOfPlay, 0) / playerSessions.length : 0;
  const lastSession = playerSessions.length > 0 ? playerSessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())[0] : null;

  // Auto-select the first (most recent) session when component mounts
  useEffect(() => {
    if (playerSessions.length > 0 && !selectedSession) {
      const sortedSessions = playerSessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setSelectedSession(sortedSessions[0]);
    }
  }, [playerSessions, selectedSession]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "#4caf50";
    if (score >= 80) return "#ff9800"; 
    return "#f44336";
  };

  return (
    <div style={{ display: "flex", height: "100%", background: "#fff" }}>
      {/* Left Panel - Player Profile */}
      <div style={{ width: "50%", borderRight: "1px solid #eef0f4", display: "flex", flexDirection: "column" }}>
        {/* Close button */}
        <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ 
            background: "none", border: "none", cursor: "pointer", color: "#9aa0ad", fontSize: 20, padding: 4, lineHeight: 1 
          }}>✕</button>
        </div>

        {/* Player Info */}
        <div style={{ padding: "0 32px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "#e3f2fd", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 700, color: "#1976d2", fontFamily: "'Sora', sans-serif",
            }}>{player.firstName[0]}{player.lastName[0]}</div>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
                {player.firstName} {player.lastName}
              </h2>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4, fontSize: 14, color: "#6c757d", fontFamily: "'DM Sans', sans-serif" }}>
                <span>{player.gender === "Male" ? "Forward" : "Midfielder"}</span>
                <span>Age {calculateAge(player.dob)}</span>
                <span>{playerSessions.length} sessions</span>
              </div>
            </div>
          </div>

          {/* Career Averages */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>AVG SCORE</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>{avgScore.toFixed(1)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>AVG GOALS</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>{avgGoals.toFixed(1)}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>AVG STREAK</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
                {avgStreak.toFixed(0)}<span style={{ fontSize: 12, color: "#9aa0ad", marginLeft: 4 }}>hits</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>AVG SPEED</div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
                {avgSpeed.toFixed(1)}<span style={{ fontSize: 12, color: "#9aa0ad", marginLeft: 4 }}>m/s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session History */}
        <div style={{ padding: "0 32px", flex: 1, overflowY: "auto" }}>
          <h3 style={{ 
            margin: "0 0 16px", fontSize: 12, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", 
            textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 
          }}>Session History</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {playerSessions
              .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
              .map((session) => (
              <div key={session.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 0", cursor: "pointer",
                borderBottom: selectedSession?.id === session.id ? "2px solid #1976d2" : "none"
              }}
              onClick={() => setSelectedSession(session)}>
                <div>
                  <div style={{ 
                    fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", 
                    color: "#1a1d23", marginBottom: 2,
                    display: "flex", alignItems: "center", gap: 8
                  }}>
                    <span style={{ 
                      width: 6, height: 6, borderRadius: "50%", 
                      background: getScoreColor(session.score), 
                      display: "inline-block" 
                    }}></span>
                    {formatDate(session.startTime)}
                  </div>
                  <div style={{ fontSize: 12, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif" }}>
                    {session.trainerName} • {formatTime(session.startTime)} - {formatTime(session.endTime)}
                  </div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: getScoreColor(session.score), fontFamily: "'Sora', sans-serif" }}>
                  {session.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Session Details */}
      <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
        {selectedSession ? (
          <>
            {/* Session Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #eef0f4" }}>
              <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                SESSION DETAILS
              </div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23", marginBottom: 8 }}>
                Training session
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 14, color: "#6c757d", fontFamily: "'DM Sans', sans-serif" }}>
                <span>{formatDate(selectedSession.startTime)} • {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}</span>
                <Badge color="#4caf50">Completed</Badge>
              </div>
            </div>

            {/* Overall Score */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid #eef0f4" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    OVERALL SCORE
                  </div>
                  <div style={{ fontSize: 48, fontWeight: 800, fontFamily: "'Sora', sans-serif", color: "#4caf50", lineHeight: 1 }}>
                    {selectedSession.score}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                    TRAINER
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", color: "#1a1d23" }}>
                    {selectedSession.trainerName}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px", flex: 1 }}>
              <div>
                <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  GOALS
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
                  {selectedSession.numberOfGoals}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  BEST STREAK
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
                  {selectedSession.bestStreak}<span style={{ fontSize: 14, color: "#9aa0ad", marginLeft: 4 }}>hits</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  BALLS USED
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
                  {selectedSession.numberOfBalls}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  EXERCISES
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
                  {selectedSession.numberOfExercises}
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                  AVG SPEED OF PLAY
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'Sora', sans-serif", color: "#1a1d23" }}>
                  {selectedSession.avgSpeedOfPlay}<span style={{ fontSize: 14, color: "#9aa0ad", marginLeft: 4 }}>m/s</span>
                </div>
              </div>
            </div>

            {/* VS Player Average */}
            <div style={{ padding: "24px 32px", borderTop: "1px solid #eef0f4" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 11, color: "#9aa0ad", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                VS. PLAYER AVERAGE
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <ComparisonBar label="Goals" value={selectedSession.numberOfGoals} playerAvg={avgGoals} />
                <ComparisonBar label="Streak" value={selectedSession.bestStreak} playerAvg={avgStreak} />
                <ComparisonBar label="Speed" value={selectedSession.avgSpeedOfPlay} playerAvg={avgSpeed} unit="m/s" />
              </div>
            </div>
          </>
        ) : (
          <div style={{ 
            display: "flex", alignItems: "center", justifyContent: "center", 
            flex: 1, color: "#9aa0ad", fontSize: 14, fontFamily: "'DM Sans', sans-serif" 
          }}>
            Select a session to view details
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable popover shell
function Popover({ children, visible, width = "70vw" }: { children: React.ReactNode; visible: boolean; width?: string }) {
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0,
      width: width,
      background: "#fff",
      boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
      transform: visible ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      zIndex: 1000,
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}>
      {children}
    </div>
  );
}

// Overlay backdrop
function Backdrop({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.25)",
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "auto" : "none",
      transition: "opacity 0.3s",
      zIndex: 999,
    }} />
  );
}

// Main export component with popover management
type PopoverManagerProps = {
  children: React.ReactNode;
};

export function PopoverManager({ children }: PopoverManagerProps) {
  const [popoverState, setPopoverState] = useState<{
    type: 'session' | 'player' | null;
    data: any;
    sessions?: TrainingSession[];
  }>({ type: null, data: null });

  const closePopover = () => setPopoverState({ type: null, data: null });
  
  const openSessionPopover = (session: TrainingSession) => {
    setPopoverState({ type: 'session', data: session });
  };
  
  const openPlayerPopover = (player: PlayerProfile, sessions: TrainingSession[]) => {
    setPopoverState({ type: 'player', data: player, sessions });
  };

  // Provide context to children
  const contextValue = {
    openSessionPopover,
    openPlayerPopover,
  };

  return (
    <div>
      {/* Render children with context */}
      <PopoverContext.Provider value={contextValue}>
        {children}
      </PopoverContext.Provider>

      {/* Backdrop */}
      <Backdrop visible={popoverState.type !== null} onClick={closePopover} />

      {/* Session Popover */}
      <Popover visible={popoverState.type === 'session'} width="400px">
        {popoverState.type === 'session' && popoverState.data && (
          <SessionPopover session={popoverState.data} onClose={closePopover} />
        )}
      </Popover>

      {/* Player Popover */}
      <Popover visible={popoverState.type === 'player'} width="70vw">
        {popoverState.type === 'player' && popoverState.data && popoverState.sessions && (
          <PlayerPopover 
            player={popoverState.data} 
            sessions={popoverState.sessions}
            onClose={closePopover} 
          />
        )}
      </Popover>
    </div>
  );
}

// Context for accessing popover functions
const PopoverContext = React.createContext<{
  openSessionPopover: (session: TrainingSession) => void;
  openPlayerPopover: (player: PlayerProfile, sessions: TrainingSession[]) => void;
} | null>(null);

export function usePopover() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error('usePopover must be used within a PopoverManager');
  }
  return context;
}

// Export types for use in other files
export type { TrainingSession, PlayerProfile };