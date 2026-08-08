import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CoursesManagePage from './CoursesManagePage';
import InboxPage from './InboxPage';
import ActivityPage from './ActivityPage';
import ProfilePage from './ProfilePage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#2d7a6b', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444'];

const AdminDashboard: React.FC = () => {
  const { colors } = useTheme();
  const [stats, setStats] = useState<any>(null);
  const [courseAnalytics, setCourseAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    Promise.all([
      API.get('/analytics/dashboard'),
      API.get('/analytics/courses'),
    ]).then(([statsRes, coursesRes]) => {
      setStats(statsRes.data);
      setCourseAnalytics(coursesRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: colors.bg }}>
      <span style={{ color: colors.text, fontSize: 18 }}>جاري التحميل...</span>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'courses-manage': return <CoursesManagePage />;
      case 'inbox': return <InboxPage />;
      case 'activity': return <ActivityPage />;
      case 'profile': return <ProfilePage />;
      default: return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div style={{ direction: 'rtl' }}>
      <h1 style={{ fontSize: 24, color: colors.text, marginBottom: 24, fontWeight: 800 }}>لوحة التحكم</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '👥', num: stats?.totalStudents, label: 'إجمالي الطلاب', color: colors.accent },
          { icon: '📚', num: stats?.totalCourses, label: 'المقررات الدراسية', color: '#0ea5e9' },
          { icon: '✅', num: stats?.totalEvaluations, label: 'التقييمات المكتملة', color: '#10b981' },
          { icon: '📅', num: stats?.activeSemester?.name || 'غير محدد', label: 'الفصل الحالي', color: '#f59e0b', small: true },
        ].map((item, i) => (
          <div key={i} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
            <div style={{ fontSize: item.small ? 15 : 30, fontWeight: 800, color: item.color }}>{item.num}</div>
            <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 4, fontWeight: 500 }}>{item.label}</div>
            <div style={{ position: 'absolute', bottom: -8, left: -8, width: 60, height: 60, borderRadius: '50%', background: item.color, opacity: 0.08 }} />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: colors.text, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>متوسط التقييم لكل مقرر</h3>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={courseAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis dataKey="courseCode" stroke={colors.textMuted} fontSize={12} />
              <YAxis domain={[0, 5]} stroke={colors.textMuted} fontSize={12} />
              <Tooltip formatter={(val: any) => [`${val}/5`, 'المتوسط']} />
              <Bar dataKey="averageRating" fill={colors.accent} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ color: colors.text, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>التقييم حسب المحور</h3>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={stats?.categoryAverages || []} dataKey="average" nameKey="category" cx="50%" cy="50%" outerRadius={80}
                label={({ category, average }: any) => `${category}: ${average}`}>
                {(stats?.categoryAverages || []).map((_: any, index: number) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h3 style={{ color: colors.text, fontSize: 15, fontWeight: 700, marginBottom: 16 }}>تفاصيل تقييم المقررات</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.surface }}>
              {['رمز المقرر', 'اسم المقرر', 'الفصل', 'عدد التقييمات', 'متوسط التقييم', 'التقدير'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: colors.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courseAnalytics.map((course: any) => (
              <tr key={course.courseId} style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: colors.accentLight, color: colors.accent, padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>{course.courseCode}</span>
                </td>
                <td style={{ padding: '14px 16px', color: colors.text, fontWeight: 500 }}>{course.courseName}</td>
                <td style={{ padding: '14px 16px', color: colors.textMuted, fontSize: 13 }}>{course.semester}</td>
                <td style={{ padding: '14px 16px', color: colors.text }}>{course.totalEvaluations}</td>
                <td style={{ padding: '14px 16px', color: colors.text, fontWeight: 700 }}>{course.averageRating || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  {course.averageRating ? (
                    <span style={{
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: parseFloat(course.averageRating) >= 4 ? colors.success : parseFloat(course.averageRating) >= 3 ? colors.warning : colors.danger,
                      color: parseFloat(course.averageRating) >= 4 ? '#065f46' : parseFloat(course.averageRating) >= 3 ? '#854d0e' : '#991b1b',
                    }}>
                      {parseFloat(course.averageRating) >= 4 ? 'ممتاز' : parseFloat(course.averageRating) >= 3 ? 'جيد' : 'يحتاج تحسين'}
                    </span>
                  ) : <span style={{ color: colors.textMuted }}>—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      <div style={{ padding: '28px 32px' }}>
        {renderPage()}
      </div>
    </div>
  );
};

export default AdminDashboard;
