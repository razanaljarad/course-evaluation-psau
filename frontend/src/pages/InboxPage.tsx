import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

const InboxPage: React.FC = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const res = await API.get('/contact');
      setMessages(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء تحميل الرسائل');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !selected) return;
    setSending(true);
    try {
      await API.put(`/contact/${selected.id}/reply`, { reply });
      setMsg('✅ تم إرسال الرد بنجاح');
      setReply('');
      fetchMessages();
      setSelected((prev: any) => ({ ...prev, reply, isRead: true }));
    } catch {
      setMsg('❌ حدث خطأ أثناء الإرسال');
    } finally {
      setSending(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (loading) return (
    <div style={{ direction: 'rtl', color: colors.text, padding: 48, textAlign: 'center', fontSize: 16 }}>
      ⏳ جاري تحميل الرسائل...
    </div>
  );

  if (error) return (
    <div style={{ direction: 'rtl', padding: 48, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
      <div style={{ color: '#ef4444', fontSize: 16, fontWeight: 600 }}>{error}</div>
    </div>
  );

  return (
    <div style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <h2 style={{ color: colors.text, fontSize: 22, fontWeight: 800 }}>✉️ صندوق البريد</h2>
        {unreadCount > 0 && (
          <span style={{ background: '#ef4444', color: '#fff', borderRadius: 20, padding: '3px 12px', fontSize: 13, fontWeight: 700 }}>
            {unreadCount} جديد
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* قائمة الرسائل */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '70vh', overflowY: 'auto' }}>
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
              <div>لا توجد رسائل</div>
            </div>
          ) : messages.map(m => (
            <div
              key={m.id}
              onClick={() => setSelected(m)}
              style={{
                padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                background: selected?.id === m.id ? colors.accent : colors.card,
                border: `1px solid ${selected?.id === m.id ? colors.accent : colors.border}`,
                color: selected?.id === m.id ? '#fff' : colors.text,
                boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{m.student?.name}</span>
                {!m.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'block', flexShrink: 0 }} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginBottom: 4 }}>{m.subject}</div>
              <div style={{ fontSize: 11, opacity: 0.65 }}>
                {new Date(m.createdAt).toLocaleDateString('ar-SA')}
                {m.reply && <span style={{ marginRight: 8, color: selected?.id === m.id ? 'rgba(255,255,255,0.8)' : colors.accent }}> · تم الرد</span>}
              </div>
            </div>
          ))}
        </div>

        {/* تفاصيل الرسالة */}
        {!selected ? (
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textMuted, flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 52 }}>✉️</div>
            <p style={{ fontSize: 15 }}>اختر رسالة من القائمة لعرضها</p>
          </div>
        ) : (
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', maxHeight: '75vh', overflowY: 'auto' }}>
            {/* رأس الرسالة */}
            <div style={{ borderBottom: `1px solid ${colors.border}`, paddingBottom: 16, marginBottom: 16 }}>
              <h3 style={{ color: colors.text, marginBottom: 8, fontSize: 17 }}>{selected.subject}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13, color: colors.textMuted }}>
                <span>👤 <strong style={{ color: colors.text }}>{selected.student?.name}</strong></span>
                <span>🎓 {selected.student?.studentId}</span>
                <span>📧 {selected.student?.email}</span>
                <span>🕐 {new Date(selected.createdAt).toLocaleString('ar-SA')}</span>
              </div>
            </div>

            {/* نص الرسالة */}
            <div style={{ background: colors.surface, borderRadius: 12, padding: 18, marginBottom: 20, color: colors.text, lineHeight: 1.9, fontSize: 15, border: `1px solid ${colors.border}` }}>
              {selected.message}
            </div>

            {/* الرد السابق */}
            {selected.reply && (
              <div style={{ background: colors.accentLight, borderRadius: 12, padding: 16, marginBottom: 20, border: `1px solid ${colors.accent}` }}>
                <div style={{ fontSize: 12, color: colors.accent, fontWeight: 700, marginBottom: 8 }}>
                  ✅ ردك السابق — {selected.repliedAt ? new Date(selected.repliedAt).toLocaleString('ar-SA') : ''}
                </div>
                <div style={{ color: colors.text, lineHeight: 1.8 }}>{selected.reply}</div>
              </div>
            )}

            {/* نموذج الرد */}
            <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 16 }}>
              <h4 style={{ color: colors.text, marginBottom: 12, fontSize: 14, fontWeight: 700 }}>
                {selected.reply ? '✏️ تعديل الرد' : '💬 كتابة رد'}
              </h4>
              {msg && (
                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, background: msg.includes('✅') ? colors.success : colors.danger, color: msg.includes('✅') ? '#065f46' : '#991b1b', fontWeight: 600, fontSize: 14 }}>
                  {msg}
                </div>
              )}
              <form onSubmit={handleReply}>
                <textarea
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.input, color: colors.text, fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  rows={4}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  required
                />
                <button type="submit"
                  style={{ marginTop: 12, background: colors.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 28px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
                  disabled={sending}
                >
                  {sending ? '⏳ جاري الإرسال...' : '📨 إرسال الرد'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPage;
