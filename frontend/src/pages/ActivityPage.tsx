import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityPage: React.FC = () => {
  const { colors } = useTheme();
  const [analytics, setAnalytics] = useState<any>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      API.get('/analytics/dashboard'),
      API.get('/analytics/courses'),
    ]).then(([a, c]) => {
      setAnalytics(a.data);
      setCourseAnalytics(c.data);
    }).catch(console.error);
  }, []);

  if (!analytics) return <div style={{ color: colors.text, padding: 32 }}>جاري التحميل...</div>;

  // Top rated courses
  const topCourses = [...courseAnalytics]
    .filter(c => c.averageRating)
    .sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating))
    .slice(0, 5);

  // Evaluation trend (mock monthly data based on total)
  const trendData = [
    { month: 'أكتوبر', evals: Math.floor(analytics.totalEvaluations * 0.1) },
    { month: 'نوفمبر', evals: Math.floor(analytics.totalEvaluations * 0.25) },
    { month: 'ديسمبر', evals: Math.floor(analytics.totalEvaluations * 0.5) },
    { month: 'يناير', evals: Math.floor(analytics.totalEvaluations * 0.75) },
    { month: 'فبراير', evals: analytics.totalEvaluations },
  ];

  return (
    <div style={{ direction: 'rtl' }}>
      <h2 style={{ color: colors.text, fontSize: 22, marginBottom: 24 }}>📊 إحصائيات الاستخدام</h2>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '👥', label: 'إجمالي المستخدمين', value: analytics.totalStudents, sub: 'طالب مسجل', color: colors.accent },
          { icon: '📝', label: 'معدل التقييم', value: analytics.totalCourses > 0 ? `${Math.round((analytics.totalEvaluations / analytics.totalStudents) * 100)}%` : '0%', sub: 'نسبة المشاركة', color: '#f59e0b' },
          { icon: '⭐', label: 'أعلى تقييم', value: topCourses[0]?.averageRating || 'N/A', sub: topCourses[0]?.courseCode || '-', color: '#10b981' },
        ].map((item, i) => (
          <div key={i} style={{ ...cardStyle(colors), textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.value}</div>
            <div style={{ color: colors.text, fontWeight: 600, marginTop: 4 }}>{item.label}</div>
            <div style={{ color: colors.textMuted, fontSize: 12, marginTop: 2 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div style={{ ...cardStyle(colors), marginBottom: 24 }}>
        <h3 style={{ color: colors.text, marginBottom: 16 }}>📈 منحنى التقييمات عبر الوقت</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
            <XAxis dataKey="month" stroke={colors.textMuted} />
            <YAxis stroke={colors.textMuted} />
            <Tooltip />
            <Line type="monotone" dataKey="evals" stroke={colors.accent} strokeWidth={3} dot={{ fill: colors.accent, r: 5 }} name="التقييمات" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Courses */}
      <div style={cardStyle(colors)}>
        <h3 style={{ color: colors.text, marginBottom: 16 }}>🏆 أعلى المقررات تقييماً</h3>
        {topCourses.length === 0 ? (
          <p style={{ color: colors.textMuted, textAlign: 'center', padding: 24 }}>لا توجد بيانات كافية</p>
        ) : (
          topCourses.map((c, i) => (
            <div key={c.courseId} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: i < topCourses.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: i === 0 ? '#fbbf24' : i === 1 ? '#9ca3af' : i === 2 ? '#d97706' : colors.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: i < 3 ? '#fff' : colors.accent, fontSize: 16 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: colors.text, fontWeight: 600 }}>{c.courseName}</div>
                <div style={{ color: colors.textMuted, fontSize: 13 }}>{c.courseCode} | {c.semester}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: parseFloat(c.averageRating) >= 4 ? '#10b981' : '#f59e0b' }}>{c.averageRating}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>من 5</div>
              </div>
              <div>
                <div style={{ width: 80, height: 8, background: colors.surface, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${(parseFloat(c.averageRating) / 5) * 100}%`, height: '100%', background: parseFloat(c.averageRating) >= 4 ? '#10b981' : '#f59e0b', borderRadius: 4 }} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const cardStyle = (colors: any): React.CSSProperties => ({
  background: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: 16,
  padding: 24,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
});

export default ActivityPage;
