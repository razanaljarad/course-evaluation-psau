import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  const { colors } = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/contact', { subject, message });
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose(); }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, background: colors.card, border: `1px solid ${colors.border}` }}>
        {/* Header */}
        <div style={{ ...styles.header, borderBottom: `1px solid ${colors.border}` }}>
          <h3 style={{ ...styles.title, color: colors.text }}>✉️ التواصل مع الإدارة</h3>
          <button style={{ ...styles.closeBtn, color: colors.textMuted }} onClick={onClose}>✕</button>
        </div>

        <p style={{ ...styles.desc, color: colors.textMuted }}>
          يمكنك إرسال أي استفسار أو ملاحظة للإدارة الأكاديمية، وسيتم الرد عليك في أقرب وقت.
        </p>

        {success ? (
          <div style={styles.successMsg}>✅ تم إرسال رسالتك بنجاح!</div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={{ ...styles.label, color: colors.text }}>الموضوع</label>
              <input
                style={{ ...styles.input, background: colors.input, color: colors.text, border: `1px solid ${colors.border}` }}
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="مثال: استفسار عن نتيجة التقييم"
                required
              />
            </div>
            <div style={styles.field}>
              <label style={{ ...styles.label, color: colors.text }}>الرسالة</label>
              <textarea
                style={{ ...styles.textarea, background: colors.input, color: colors.text, border: `1px solid ${colors.border}` }}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                rows={5}
                required
              />
            </div>
            {error && <div style={styles.errorMsg}>{error}</div>}
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'جاري الإرسال...' : '📨 إرسال الرسالة'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { width: 480, borderRadius: 16, padding: 28, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', direction: 'rtl' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, marginBottom: 12 },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  closeBtn: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' },
  desc: { fontSize: 14, lineHeight: 1.6, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none' },
  textarea: { padding: '10px 14px', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical' },
  submitBtn: { background: '#1a3c6e', color: '#fff', border: 'none', borderRadius: 10, padding: '12px', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4 },
  errorMsg: { background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 8, fontSize: 14 },
  successMsg: { background: '#d1fae5', color: '#065f46', padding: '16px', borderRadius: 10, textAlign: 'center', fontSize: 16, fontWeight: 600 },
};

export default ContactModal;
