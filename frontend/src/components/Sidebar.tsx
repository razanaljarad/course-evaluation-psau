import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ContactModal from './ContactModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onNavigate, currentPage }) => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [showContact, setShowContact] = useState(false);

  if (!isOpen) return null;

  const studentMenu = [
    { id: 'dashboard', icon: '🏠', label: 'الرئيسية' },
    { id: 'search', icon: '🔍', label: 'البحث عن المقررات' },
    { id: 'courses', icon: '📚', label: 'جميع المقررات' },
    { id: 'badges', icon: '🏅', label: 'أوسمتي ومكافآتي' },
    { id: 'contact', icon: '💬', label: 'التواصل مع الإدارة' },
    { id: 'profile', icon: '👤', label: 'الحساب الشخصي' },
  ];

  const adminMenu = [
    { id: 'dashboard', icon: '📊', label: 'لوحة التحكم' },
    { id: 'courses-manage', icon: '📚', label: 'إدارة المقررات' },
    { id: 'inbox', icon: '✉️', label: 'صندوق البريد' },
    { id: 'activity', icon: '📈', label: 'إحصائيات الاستخدام' },
    { id: 'contact-admin', icon: '💬', label: 'التواصل مع الإدارة', adminOnly: false },
    { id: 'profile', icon: '👤', label: 'الحساب الشخصي' },
  ];

  const menuItems = user?.role === 'ADMIN' || user?.role === 'INSTRUCTOR' ? adminMenu : studentMenu;
  const roleLabel = user?.role === 'ADMIN' ? 'مسؤول النظام' : user?.role === 'INSTRUCTOR' ? 'عضو هيئة التدريس' : 'طالب';

  return (
    <>
      <div style={styles.overlay} onClick={onClose} />
      <div style={{ ...styles.sidebar, background: colors.card, borderLeft: `1px solid ${colors.border}` }}>
        {/* Header */}
        <div style={{ ...styles.sidebarHeader, borderBottom: `1px solid ${colors.border}`, background: colors.navbarGradient }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>القائمة الرئيسية</span>
          <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 6, color: '#fff', width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>✕</button>
        </div>

        {/* User Card */}
        <div style={{ margin: '16px 14px', padding: '14px', borderRadius: 14, background: colors.accentLight, border: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: colors.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, flexShrink: 0 }}>
            {user?.name?.charAt(0)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, color: colors.text, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: colors.accent, marginTop: 2, fontWeight: 600 }}>{roleLabel}</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ padding: '4px 10px', flex: 1, overflowY: 'auto' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14,
                textAlign: 'right', fontWeight: currentPage === item.id ? 700 : 500,
                width: '100%', marginBottom: 4,
                background: currentPage === item.id ? colors.accent : 'transparent',
                color: currentPage === item.id ? '#fff' : colors.text,
              }}
              onClick={() => { onNavigate(item.id); onClose(); }}
            >
              <span style={{ fontSize: 18, minWidth: 24 }}>{item.icon}</span>
              <span>{item.label}</span>
              {currentPage === item.id && <span style={{ marginRight: 'auto', fontSize: 10 }}>●</span>}
            </button>
          ))}

        </div>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: colors.textMuted }}>جامعة الأمير سطام بن عبدالعزيز</div>
          <div style={{ fontSize: 11, color: colors.textMuted }}>موقع تقييم المقررات © 2025</div>
        </div>
      </div>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(2px)' },
  sidebar: { position: 'fixed', top: 0, right: 0, width: 290, height: '100vh', zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-4px 0 24px rgba(0,0,0,0.12)' },
  sidebarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px' },
};

export default Sidebar;
