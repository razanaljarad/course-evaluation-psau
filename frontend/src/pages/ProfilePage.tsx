import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();

  const roleLabel = user?.role === 'STUDENT' ? 'طالب' : user?.role === 'ADMIN' ? 'مسؤول' : 'مدرس';

  return (
    <div style={{ direction: 'rtl' }}>
      <h2 style={{ color: colors.text, marginBottom: 20, fontSize: 22 }}>👤 الحساب الشخصي</h2>
      <div style={{ ...styles.card, background: colors.card, border: `1px solid ${colors.border}` }}>
        <div style={styles.avatarCircle}>{user?.name?.charAt(0)}</div>
        <h2 style={{ ...styles.name, color: colors.text }}>{user?.name}</h2>
        <span style={styles.roleBadge}>{roleLabel}</span>

        <div style={{ ...styles.infoGrid, borderTop: `1px solid ${colors.border}` }}>
          <div style={styles.infoItem}>
            <span style={{ color: colors.textMuted, fontSize: 13 }}>البريد الإلكتروني</span>
            <span style={{ color: colors.text, fontWeight: 600 }}>{user?.email}</span>
          </div>
          {(user as any)?.studentId && (
            <div style={styles.infoItem}>
              <span style={{ color: colors.textMuted, fontSize: 13 }}>الرقم الجامعي</span>
              <span style={{ color: colors.text, fontWeight: 600 }}>{(user as any).studentId}</span>
            </div>
          )}
          <div style={styles.infoItem}>
            <span style={{ color: colors.textMuted, fontSize: 13 }}>الدور</span>
            <span style={{ color: colors.text, fontWeight: 600 }}>{roleLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  card: { borderRadius: 16, padding: 32, maxWidth: 480, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  avatarCircle: { width: 80, height: 80, borderRadius: '50%', background: '#1a3c6e', color: '#fff', fontSize: 36, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  name: { margin: '0 0 8px', fontSize: 22, fontWeight: 700 },
  roleBadge: { background: '#e8f0fe', color: '#1a3c6e', padding: '4px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600 },
  infoGrid: { marginTop: 24, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'right' },
  infoItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
};

export default ProfilePage;
