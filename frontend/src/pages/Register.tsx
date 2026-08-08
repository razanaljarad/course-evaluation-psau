import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import PSAULogo from '../components/PSAULogo';
import API from '../api/axios';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', studentId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقتين');
      return;
    }
    if (form.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    setLoading(true);
    try {
      await API.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        role: 'STUDENT',
        studentId: form.studentId || undefined,
      });
      // تسجيل دخول تلقائي بعد التسجيل
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px', border: `1px solid ${colors.border}`,
    borderRadius: 10, fontSize: 14, outline: 'none', background: colors.input,
    color: colors.text, boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.navbarGradient, direction: 'rtl', padding: 20 }}>
      <div style={{ background: colors.card, borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 460, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', background: colors.navbarGradient, borderRadius: '50%', padding: 14, marginBottom: 14 }}>
            <PSAULogo size={44} />
          </div>
          <div style={{ color: colors.textMuted, fontSize: 12, marginBottom: 4 }}>جامعة الأمير سطام بن عبدالعزيز</div>
          <h1 style={{ color: colors.text, fontSize: 22, fontWeight: 800, margin: 0 }}>إنشاء حساب جديد</h1>
          <p style={{ color: colors.textMuted, fontSize: 13, marginTop: 6 }}>موقع تقييم المقررات الدراسية</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 7 }}>الاسم الكامل *</label>
            <input style={inputStyle} type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: محمد علي السالم" required />
          </div>

          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 7 }}>البريد الإلكتروني *</label>
            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="example@university.edu" required />
          </div>

          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 7 }}>الرقم الجامعي</label>
            <input style={inputStyle} type="text" value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} placeholder="مثال: S20210001 (اختياري)" />
          </div>

          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 7 }}>كلمة المرور *</label>
            <input style={inputStyle} type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="6 أحرف على الأقل" required />
          </div>

          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 7 }}>تأكيد كلمة المرور *</label>
            <input style={inputStyle} type="password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="أعد كتابة كلمة المرور" required />
          </div>

          {error && (
            <div style={{ background: colors.danger, color: '#991b1b', padding: '11px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ background: colors.navbarGradient, color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 4 }}>
            {loading ? '⏳ جاري إنشاء الحساب...' : '✅ إنشاء الحساب'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 22, color: colors.textMuted, fontSize: 14 }}>
          لديك حساب بالفعل؟{' '}
          <Link to="/login" style={{ color: colors.accent, fontWeight: 700, textDecoration: 'none' }}>تسجيل الدخول</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
