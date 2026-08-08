import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import PSAULogo from './PSAULogo';

interface NavbarProps {
  onOpenSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <nav style={{ ...styles.navbar, background: colors.navbarGradient }}>
      {/* Left: Hamburger */}
      <button style={styles.hamburger} onClick={onOpenSidebar} title="القائمة">
        <div style={styles.hamburgerLines}>
          <span style={styles.line} />
          <span style={styles.line} />
          <span style={styles.line} />
        </div>
      </button>

      {/* Center: Logo + Title */}
      <div style={styles.centerSection}>
        <PSAULogo size={42} />
        <div style={styles.titleBlock}>
          <div style={styles.uniName}>جامعة الأمير سطام بن عبدالعزيز</div>
          <div style={styles.siteName}>موقع تقييم المقررات</div>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={styles.navRight}>
        <span style={styles.navUser}>{user?.name}</span>
        <button
          style={styles.themeBtn}
          onClick={toggleTheme}
          title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <button style={styles.logoutBtn} onClick={logout}>
          خروج
        </button>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    color: '#fff',
    padding: '10px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
    minHeight: 64,
  },
  hamburger: {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: '8px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hamburgerLines: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    width: 20,
  },
  line: {
    display: 'block',
    height: 2,
    background: '#fff',
    borderRadius: 2,
    width: '100%',
  },
  centerSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  titleBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  uniName: {
    fontSize: 11,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.3,
  },
  siteName: {
    fontSize: 17,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: 0.5,
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  navUser: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: 500,
  },
  themeBtn: {
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: 16,
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 8,
    padding: '7px 16px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
};

export default Navbar;
