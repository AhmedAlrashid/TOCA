import React, { useState } from "react";
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
    <a
      href={link.href}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-current={active ? "page" : undefined}
    >
      <span style={{ flex: 1 }}>{link.label}</span>
    </a>
  );
}

export default function Sidebar({
  sections = NAV,
  currentPath = "/",
  user = { name: "Ahmed K.", email: "ahmed@toca.com" },
  header = null,  onNavigate,
}: {
  sections?: typeof NAV;
  currentPath?: string;
  user?: { name: string; email: string } | null;
  header?: React.ReactNode;
  onNavigate?: (path: string) => void;}) {
  return (
    <aside style={styles.sidebar}>
      {/* Header */}
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

        {/* Nav */}
        <nav style={styles.nav}>
          {sections.map((sec, i) => (
            <div key={i}>
              {sec.title && <div style={styles.sectionTitle}>{sec.title}</div>}
              {sec.links.map((link) => (
                <NavLink
                  key={link.href}
                  link={link}
                  active={currentPath === link.href}
                />
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      {user && (
        <div style={styles.footer}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.email}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
