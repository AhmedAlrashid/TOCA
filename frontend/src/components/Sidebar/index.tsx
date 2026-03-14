import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NAV from "./nav";
import styles from "../../styles/sidebar";

type NavLinkType = {
  href: string;
  label: string;
};

function NavLink({ link, active }: { link: NavLinkType; active: boolean }) {
  const [hovered, setHovered] = useState(false);

  const style = {
    ...styles.link(active),
    background: active ? "#ebebeb" : hovered ? "#f3f3f3" : "transparent",
  };

  return (
    <Link
      to={link.href}
      style={{
        ...style,
        textDecoration: 'none',
        color: 'inherit'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={active ? "page" : undefined}
    >
      <span style={{ flex: 1 }}>{link.label}</span>
    </Link>
  );
}

export default function Sidebar({
  sections = NAV,
  header = null,
}) {
  const { pathname } = useLocation();
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <aside style={styles.sidebar}>
      <div>
        <div style={styles.header}>
          {header ?? (
            <img 
              src="/toca soccer logo.png" 
              alt="TOCA Logo" 
              style={{ 
                height: '40px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          )}
        </div>

        <nav style={styles.nav}>
          {sections.map((sec, i) => (
            <div key={i}>
              {sec.title && <div style={styles.sectionTitle}>{sec.title}</div>}
              {sec.links.map((link) => (
                <NavLink
                  key={link.href}
                  link={link}
                  active={pathname === link.href}
                />
              ))}
            </div>
          ))}
        </nav>
      </div>

      {currentUser && (
        <div style={styles.footer}>
          <div style={styles.avatar}>
            {currentUser?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser}
            </div>
            <button
              onClick={handleLogout}
              style={{ 
                fontSize: 11, 
                color: "#dc3545", 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline'
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = "#b02a37"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = "#dc3545"}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
