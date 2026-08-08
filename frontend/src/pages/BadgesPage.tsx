import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const BadgesPage: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/evaluations/my'),
      API.get('/analytics/leaderboard'),
    ]).then(([evalsRes, lbRes]) => {
      setEvaluations(evalsRes.data);
      setLeaderboard(lbRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const count = evaluations.length;
  const myRank = leaderboard.findIndex(l => l.studentId === (user as any)?.id) + 1;
  const topStudent = leaderboard[0];
  const isTopEvaluator = myRank === 1 && count > 0;
  const totalStudents = leaderboard.length;

  const fixedBadges = [
    { icon: '🥉', title: 'مقيّم مبتدئ', desc: 'أكمل تقييم مقرر واحد', req: 1, discount: '5%', reward: 'خصم 5% في مطعم الجامعة', color: '#d97706', bg: '#fef9c3' },
    { icon: '🥈', title: 'مقيّم نشيط', desc: 'أكمل تقييم 3 مقررات', req: 3, discount: '10%', reward: 'خصم 10% في مطعم الجامعة', color: '#64748b', bg: '#f1f5f9' },
    { icon: '🥇', title: 'مقيّم متميز', desc: 'أكمل تقييم 5 مقررات أو أكثر', req: 5, discount: '15%', reward: 'خصم 15% في مطعم الجامعة', color: '#f59e0b', bg: '#fef3c7' },
    { icon: '🏆', title: 'بطل التقييم', desc: 'أكمل تقييم جميع مقرراتك المسجلة', req: 999, discount: '20%', reward: 'خصم 20% + وجبة مجانية', color: '#7c3aed', bg: '#ede9fe', special: true },
  ];

  const activeBadge = [...fixedBadges].reverse().find(b => count >= b.req);
  const nextBadge = fixedBadges.find(b => count < b.req);

  if (loading) return <div style={{ color: colors.text, padding: 32 }}>جاري التحميل...</div>;

  return (
    <div style={{ direction: 'rtl' }}>
      <h2 style={{ color: colors.text, fontSize: 22, fontWeight: 800, marginBottom: 24 }}>🏅 أوسمتي ومكافآتي</h2>

      {/* وسام الأكثر تقييماً */}
      {isTopEvaluator && (
        <div style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', borderRadius: 16, padding: 24, marginBottom: 24, color: '#fff', display: 'flex', alignItems: 'center', gap: 20, boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}>
          <div style={{ fontSize: 64 }}>👑</div>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>الأكثر تقييماً بين الطلاب!</h3>
            <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 10 }}>
              أنت في المرتبة الأولى بـ <strong>{count}</strong> تقييم من أصل {totalStudents} طالب
            </p>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
              🎁 خصم حصري 25% في مطعم الجامعة
            </span>
          </div>
        </div>
      )}

      {/* ترتيبي */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: myRank === 1 ? '#fbbf24' : myRank === 2 ? '#9ca3af' : myRank === 3 ? '#d97706' : colors.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: myRank <= 3 ? '#fff' : colors.accent, flexShrink: 0 }}>
          {myRank > 0 ? `#${myRank}` : '—'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: colors.text, fontWeight: 700, fontSize: 16 }}>ترتيبك بين الطلاب</div>
          <div style={{ color: colors.textMuted, fontSize: 13, marginTop: 2 }}>
            {myRank > 0 ? `أنت في المرتبة ${myRank} من ${totalStudents} طالب بـ ${count} تقييم` : 'لم تقدّم أي تقييم بعد'}
          </div>
        </div>
        {myRank === 1 && count > 0 && <span style={{ fontSize: 28 }}>👑</span>}
        {myRank === 2 && <span style={{ fontSize: 28 }}>🥈</span>}
        {myRank === 3 && <span style={{ fontSize: 28 }}>🥉</span>}
      </div>

      {/* الحالة الحالية */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, marginBottom: 24, textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 60, marginBottom: 8 }}>{activeBadge?.icon || '🎯'}</div>
        <h3 style={{ color: colors.text, fontSize: 19, fontWeight: 700, marginBottom: 4 }}>{activeBadge ? activeBadge.title : 'ابدأ التقييم!'}</h3>
        <p style={{ color: colors.textMuted, marginBottom: 16 }}>أكملت <strong style={{ color: colors.accent }}>{count}</strong> تقييم</p>
        {activeBadge && (
          <div style={{ display: 'inline-block', background: activeBadge.bg, color: activeBadge.color, padding: '10px 24px', borderRadius: 24, fontWeight: 700, fontSize: 14, marginBottom: 16 }}>
            🎁 {activeBadge.reward}
          </div>
        )}
        {nextBadge && (
          <div>
            <div style={{ color: colors.textMuted, fontSize: 13, marginBottom: 8 }}>
              تحتاج <strong style={{ color: colors.text }}>{nextBadge.req - count}</strong> تقييم للحصول على "{nextBadge.title}"
            </div>
            <div style={{ width: '100%', height: 10, background: colors.surface, borderRadius: 5, overflow: 'hidden', border: `1px solid ${colors.border}` }}>
              <div style={{ height: '100%', width: `${Math.min((count / nextBadge.req) * 100, 100)}%`, background: `linear-gradient(90deg, ${colors.accent}, #10b981)`, borderRadius: 5 }} />
            </div>
          </div>
        )}
      </div>

      {/* الأوسمة الثابتة */}
      <h3 style={{ color: colors.text, marginBottom: 16, fontSize: 17, fontWeight: 700 }}>جميع الأوسمة</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14, marginBottom: 28 }}>
        {fixedBadges.map(badge => {
          const earned = count >= badge.req;
          return (
            <div key={badge.title} style={{ background: colors.card, border: earned ? `2px solid ${badge.color}` : `1px solid ${colors.border}`, borderRadius: 14, padding: 20, opacity: earned ? 1 : 0.5, position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              {earned && <div style={{ position: 'absolute', top: 10, left: 10, background: '#10b981', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>✓ محقق</div>}
              <div style={{ textAlign: 'center', fontSize: 42, marginBottom: 10 }}>{badge.icon}</div>
              <h4 style={{ color: earned ? badge.color : colors.textMuted, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{badge.title}</h4>
              <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 10 }}>{badge.desc}</p>
              <div style={{ background: badge.bg, borderRadius: 8, padding: '7px 12px' }}>
                <span style={{ color: badge.color, fontSize: 12, fontWeight: 600 }}>🎁 {badge.reward}</span>
              </div>
            </div>
          );
        })}
        {/* وسام الأكثر تقييماً */}
        <div style={{ background: colors.card, border: isTopEvaluator ? `2px solid #7c3aed` : `1px solid ${colors.border}`, borderRadius: 14, padding: 20, opacity: isTopEvaluator ? 1 : 0.5, position: 'relative', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          {isTopEvaluator && <div style={{ position: 'absolute', top: 10, left: 10, background: '#7c3aed', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>✓ محقق</div>}
          <div style={{ textAlign: 'center', fontSize: 42, marginBottom: 10 }}>👑</div>
          <h4 style={{ color: isTopEvaluator ? '#7c3aed' : colors.textMuted, fontSize: 15, fontWeight: 700, marginBottom: 4 }}>الأكثر تقييماً</h4>
          <p style={{ color: colors.textMuted, fontSize: 12, marginBottom: 10 }}>كن الأول في عدد التقييمات بين جميع الطلاب</p>
          <div style={{ background: '#ede9fe', borderRadius: 8, padding: '7px 12px' }}>
            <span style={{ color: '#7c3aed', fontSize: 12, fontWeight: 600 }}>🎁 خصم حصري 25%</span>
          </div>
        </div>
      </div>

      {/* لوحة المتصدرين */}
      <h3 style={{ color: colors.text, marginBottom: 16, fontSize: 17, fontWeight: 700 }}>🏆 لوحة المتصدرين</h3>
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        {leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: colors.textMuted }}>لا توجد بيانات بعد</div>
        ) : leaderboard.slice(0, 5).map((item, i) => {
          const isMe = item.studentId === (user as any)?.id;
          return (
            <div key={item.studentId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < 4 ? `1px solid ${colors.border}` : 'none', background: isMe ? colors.accentLight : 'transparent' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : colors.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, color: i < 3 ? '#fff' : colors.textMuted, flexShrink: 0 }}>
                {i === 0 ? '👑' : i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: colors.text, fontWeight: isMe ? 700 : 500, fontSize: 14 }}>
                  {isMe ? '⭐ أنت — ' : ''}{item.name}
                </div>
                <div style={{ color: colors.textMuted, fontSize: 12 }}>{item.universityId}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: colors.accent }}>{item.evaluationCount}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>تقييم</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: colors.accentLight, border: `1px solid ${colors.accent}`, borderRadius: 12, padding: '14px 18px', marginTop: 20 }}>
        <p style={{ color: colors.text, fontSize: 14, lineHeight: 1.8 }}>
          💡 <strong>كيف تحصل على الخصم؟</strong> أرِ هذه الصفحة لموظف مطعم الجامعة ليتحقق من وسامك ويطبق الخصم.
        </p>
      </div>
    </div>
  );
};

export default BadgesPage;
