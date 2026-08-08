import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import PSAULogo from '../components/PSAULogo';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', direction: 'rtl', background: colors.bg }}>
      {/* Panel يسار - ديكور */}
      <div style={{ flex: 1, background: colors.navbarGradient, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, minWidth: 0 }}>
        <PSAULogo size={100} />
        <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginTop: 24, textAlign: 'center', lineHeight: 1.4 }}>
          جامعة الأمير سطام<br />بن عبدالعزيز
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, marginTop: 12, textAlign: 'center' }}>
          موقع تقييم المقررات الدراسية
        </p>
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 280 }}>
          {[
            { icon: '✅', text: 'تقييم مجهول الهوية وآمن' },
            { icon: '📊', text: 'تحليلات ولوحة تحكم متقدمة' },
            { icon: '🏅', text: 'أوسمة وخصومات للطلاب المميزين' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Panel يمين - نموذج */}
      <div style={{ width: 420, background: colors.card, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px', boxShadow: '-4px 0 32px rgba(0,0,0,0.1)', flexShrink: 0 }}>
        <h2 style={{ color: colors.text, fontSize: 24, fontWeight: 800, marginBottom: 6 }}>تسجيل الدخول</h2>
        <p style={{ color: colors.textMuted, fontSize: 14, marginBottom: 32 }}>أدخل بياناتك للمتابعة</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>البريد الإلكتروني</label>
            <input
              style={{ width: '100%', padding: '12px 14px', border: `1px solid ${colors.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: colors.input, color: colors.text, boxSizing: 'border-box' }}
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@university.edu" required
            />
          </div>

          <div>
            <label style={{ color: colors.text, fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 8 }}>كلمة المرور</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{ width: '100%', padding: '12px 14px', paddingLeft: 44, border: `1px solid ${colors.border}`, borderRadius: 10, fontSize: 14, outline: 'none', background: colors.input, color: colors.text, boxSizing: 'border-box' }}
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted, fontSize: 16 }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: colors.danger, color: '#991b1b', padding: '11px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600 }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ background: colors.navbarGradient, color: '#fff', border: 'none', borderRadius: 12, padding: '13px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? '⏳ جاري تسجيل الدخول...' : 'تسجيل الدخول ←'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, color: colors.textMuted, fontSize: 14 }}>
          ليس لديك حساب؟{' '}
          <Link to="/register" style={{ color: colors.accent, fontWeight: 700, textDecoration: 'none' }}>إنشاء حساب جديد</Link>
        </div>

        <div style={{ marginTop: 32, padding: 16, background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}` }}>
          <p style={{ color: colors.textMuted, fontSize: 12, fontWeight: 700, marginBottom: 8 }}>حسابات تجريبية:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { label: 'مسؤول', email: 'admin@university.edu', pass: 'admin123' },
              { label: 'طالب', email: 'student1@university.edu', pass: 'student123' },
            ].map((a, i) => (
              <button key={i} onClick={() => { setEmail(a.email); setPassword(a.pass); }}
                style={{ background: 'none', border: `1px solid ${colors.border}`, borderRadius: 8, padding: '6px 10px', cursor: 'pointer', color: colors.text, fontSize: 12, textAlign: 'right', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: colors.accent, fontWeight: 700 }}>{a.label}</span>
                <span style={{ color: colors.textMuted }}>{a.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
