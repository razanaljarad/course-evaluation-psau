import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import EvaluationForm from '../components/EvaluationForm';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchPage from './SearchPage';
import ProfilePage from './ProfilePage';
import ContactPage from './ContactPage';
import BadgesPage from './BadgesPage';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [courses, setCourses] = useState<any[]>([]);
  const [myEvaluations, setMyEvaluations] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [allCourses, setAllCourses] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const [coursesRes, evalsRes, allCoursesRes] = await Promise.all([
        API.get('/courses/my'),
        API.get('/evaluations/my'),
        API.get('/courses'),
      ]);
      setCourses(coursesRes.data);
      setMyEvaluations(evalsRes.data);
      setAllCourses(allCoursesRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const isEvaluated = (courseId: number) =>
    myEvaluations.some(e => e.courseId === courseId);

  const handleEvaluationDone = () => {
    setSelectedCourse(null);
    fetchData();
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: colors.bg }}>
      <span style={{ color: colors.text, fontSize: 18 }}>جاري التحميل...</span>
    </div>
  );

  const renderContent = () => {
    if (selectedCourse) {
      return (
        <EvaluationForm
          course={selectedCourse}
          onDone={handleEvaluationDone}
          onCancel={() => setSelectedCourse(null)}
        />
      );
    }

    switch (currentPage) {
      case 'search':
        return <SearchPage />;
      case 'profile':
        return <ProfilePage />;
      case 'contact':
        return <ContactPage />;
      case 'badges':
        return <BadgesPage />;
      case 'courses':
        return (
          <div style={{ direction: 'rtl' }}>
            <h2 style={{ color: colors.text, marginBottom: 20, fontSize: 22 }}>📚 جميع المقررات الدراسية</h2>
            <div style={styles.grid}>
              {allCourses.map(course => (
                <div key={course.id} style={{ ...styles.card, background: colors.card, border: `1px solid ${colors.border}` }}>
                  <div style={styles.cardHeader}>
                    <span style={styles.courseCode}>{course.code}</span>
                  </div>
                  <h3 style={{ ...styles.courseName, color: colors.text }}>{course.name}</h3>
                  <p style={{ ...styles.courseSemester, color: colors.textMuted }}>{course.semester?.name}</p>
                  {course.description && (
                    <p style={{ fontSize: 13, color: colors.textMuted, marginTop: 8 }}>{course.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div style={{ direction: 'rtl' }}>
            <h1 style={{ ...styles.pageTitle, color: colors.text }}>مقرراتي الدراسية</h1>
            <div style={styles.statsRow}>
              <div style={{ ...styles.statBox, background: colors.card, border: `1px solid ${colors.border}` }}>
                <div style={{ ...styles.statNum, color: '#1a3c6e' }}>{courses.length}</div>
                <div style={{ ...styles.statLbl, color: colors.textMuted }}>المقررات المسجلة</div>
              </div>
              <div style={{ ...styles.statBox, background: colors.card, border: `1px solid ${colors.border}` }}>
                <div style={{ ...styles.statNum, color: '#16a34a' }}>{myEvaluations.length}</div>
                <div style={{ ...styles.statLbl, color: colors.textMuted }}>تقييمات مكتملة</div>
              </div>
              <div style={{ ...styles.statBox, background: colors.card, border: `1px solid ${colors.border}` }}>
                <div style={{ ...styles.statNum, color: '#d97706' }}>{Math.max(0, courses.length - myEvaluations.length)}</div>
                <div style={{ ...styles.statLbl, color: colors.textMuted }}>تقييمات متبقية</div>
              </div>
            </div>

            <div style={styles.grid}>
              {courses.map(course => {
                const evaluated = isEvaluated(course.id);
                return (
                  <div key={course.id} style={{ ...styles.card, background: colors.card, border: `1px solid ${colors.border}` }}>
                    <div style={styles.cardHeader}>
                      <span style={styles.courseCode}>{course.code}</span>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: evaluated ? '#d1fae5' : '#fef9c3',
                        color: evaluated ? '#065f46' : '#854d0e',
                      }}>
                        {evaluated ? '✓ تم التقييم' : '⏳ لم يُقيَّم'}
                      </span>
                    </div>
                    <h3 style={{ ...styles.courseName, color: colors.text }}>{course.name}</h3>
                    <p style={{ ...styles.courseSemester, color: colors.textMuted }}>{course.semester?.name}</p>
                    {!evaluated && (
                      <button style={styles.evalBtn} onClick={() => setSelectedCourse(course)}>
                        تقييم المقرر
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.bg }}>
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(page) => { setCurrentPage(page); setSelectedCourse(null); }}
        currentPage={currentPage}
      />
      <div style={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  content: { padding: '28px 32px' },
  pageTitle: { fontSize: 26, marginBottom: 20 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24, maxWidth: 500 },
  statBox: { borderRadius: 12, padding: 20, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statNum: { fontSize: 28, fontWeight: 700 },
  statLbl: { fontSize: 13, marginTop: 4 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  courseCode: { background: '#e8f0fe', color: '#1a3c6e', padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 600 },
  courseName: { fontSize: 16, fontWeight: 700, margin: '0 0 8px 0' },
  courseSemester: { fontSize: 13, margin: '0 0 16px 0' },
  evalBtn: { width: '100%', background: '#1a3c6e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px', fontSize: 14, cursor: 'pointer', fontWeight: 600 },
};

export default StudentDashboard;
