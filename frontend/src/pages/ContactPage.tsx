import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

const ContactPage: React.FC = () => {
  const { colors } = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [myMessages, setMyMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchMyMessages = async () => {
    try {
      // نجلب رسائل الطالب من الـ endpoint
      const res = await API.get('/contact/my');
      setMyMessages(res.data);
    } catch {
      // صامت - ربما لا يوجد رسائل
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => { fetchMyMessages(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/contact', { subject, message });
      setSuccess('✅ تم إرسال رسالتك بنجاح! سيتم الرد عليك في أقرب وقت.');
      setSubject('');
      setMessage('');
      fetchMyMessages();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ، حاول مجدداً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ direction: 'rtl', maxWidth: 700 }}>
      <h2 style={{ color: colors.text, fontSize: 22, fontWeight: 800, marginBottom: 24 }}>💬 التواصل مع الإدارة</h2>

      {/* نموذج إرسال رسالة جديدة */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 28 }}>
        <h3 style={{ color: colors.text, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>📝 إرسال رسالة جديدة</h3>
        <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 20, lineHeight: 1.7 }}>
          يمكنك إرسال أي استفسار أو ملاحظة للإدارة الأكاديمية، وسيتم الرد عليك في أقرب وقت ممكن.
        </p>

        {success && (
          <div style={{ background: colors.success, color: '#065f46', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
            {success}
          </div>
        )}
        {error && (
          <div style={{ background: colors.danger, color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontWeight: 600, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>الموضوع *</label>
            <input
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.input, color: colors.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="مثال: استفسار عن نتيجة التقييم"
              required
            />
          </div>
          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>الرسالة *</label>
            <textarea
              style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1px solid ${colors.border}`, background: colors.input, color: colors.text, fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="اكتب رسالتك بالتفصيل هنا..."
              rows={5}
              required
            />
          </div>
          <button
            type="submit"
            style={{ background: colors.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            disabled={loading}
          >
            {loading ? '⏳ جاري الإرسال...' : '📨 إرسال الرسالة'}
          </button>
        </form>
      </div>

      {/* رسائلي السابقة */}
      <div>
        <h3 style={{ color: colors.text, fontSize: 17, fontWeight: 700, marginBottom: 16 }}>📬 رسائلي السابقة</h3>

        {loadingMsgs ? (
          <div style={{ textAlign: 'center', color: colors.textMuted, padding: 24 }}>جاري التحميل...</div>
        ) : myMessages.length === 0 ? (
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 36, textAlign: 'center', color: colors.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
            <p>لا توجد رسائل سابقة</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {myMessages.map(m => (
              <div key={m.id} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                {/* رأس الرسالة */}
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: colors.surface }}>
                  <div>
                    <span style={{ color: colors.text, fontWeight: 700, fontSize: 15 }}>{m.subject}</span>
                    <span style={{ color: colors.textMuted, fontSize: 12, marginRight: 12 }}>
                      {new Date(m.createdAt).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                    background: m.reply ? colors.success : colors.warning,
                    color: m.reply ? '#065f46' : '#854d0e',
                  }}>
                    {m.reply ? '✅ تم الرد' : '⏳ في الانتظار'}
                  </span>
                </div>

                {/* نص الرسالة */}
                <div style={{ padding: '14px 18px', color: colors.text, fontSize: 14, lineHeight: 1.8, borderBottom: m.reply ? `1px solid ${colors.border}` : 'none' }}>
                  {m.message}
                </div>

                {/* رد الإدارة */}
                {m.reply && (
                  <div style={{ padding: '14px 18px', background: colors.accentLight }}>
                    <div style={{ fontSize: 12, color: colors.accent, fontWeight: 700, marginBottom: 6 }}>
                      💬 رد الإدارة — {m.repliedAt ? new Date(m.repliedAt).toLocaleDateString('ar-SA') : ''}
                    </div>
                    <div style={{ color: colors.text, fontSize: 14, lineHeight: 1.8 }}>{m.reply}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
