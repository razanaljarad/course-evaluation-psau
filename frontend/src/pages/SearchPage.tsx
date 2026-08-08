import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

const SearchPage: React.FC = () => {
  const { colors } = useTheme();
  const [query, setQuery] = useState('');
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [courseStats, setCourseStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    API.get('/courses').then(res => {
      setAllCourses(res.data);
      setFiltered(res.data);
    });
  }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setFiltered(allCourses); return; }
    setFiltered(allCourses.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.semester?.name?.toLowerCase().includes(q)
    ));
  }, [query, allCourses]);

  const handleSelectCourse = async (course: any) => {
    setSelected(course);
    setLoadingStats(true);
    try {
      const res = await API.get(`/evaluations/course/${course.id}`);
      setCourseStats(res.data);
    } catch {
      setCourseStats(null);
    } finally {
      setLoadingStats(false);
    }
  };

  const getRatingColor = (avg: number) => {
    if (avg >= 4) return '#16a34a';
    if (avg >= 3) return '#d97706';
    return '#dc2626';
  };

  const getRatingLabel = (avg: number) => {
    if (avg >= 4.5) return 'ممتاز جداً';
    if (avg >= 4) return 'ممتاز';
    if (avg >= 3) return 'جيد';
    if (avg >= 2) return 'مقبول';
    return 'ضعيف';
  };

  return (
    <div style={{ direction: 'rtl' }}>
      <h2 style={{ color: colors.text, marginBottom: 20, fontSize: 22 }}>🔍 البحث عن المقررات</h2>

      {/* Search Box */}
      <div style={{ ...styles.searchBox, background: colors.card, border: `1px solid ${colors.border}` }}>
        <span style={{ fontSize: 20 }}>🔍</span>
        <input
          style={{ ...styles.searchInput, background: 'transparent', color: colors.text }}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ابحث باسم المقرر أو رمزه أو الفصل الدراسي..."
        />
        {query && (
          <button style={styles.clearBtn} onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      <div style={styles.layout}>
        {/* Course List */}
        <div style={styles.listCol}>
          <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 12 }}>
            {filtered.length} مقرر
          </p>
          {filtered.length === 0 ? (
            <div style={{ ...styles.emptyBox, color: colors.textMuted }}>لا توجد نتائج</div>
          ) : (
            filtered.map(course => (
              <div
                key={course.id}
                style={{
                  ...styles.courseCard,
                  background: selected?.id === course.id ? '#1a3c6e' : colors.card,
                  color: selected?.id === course.id ? '#fff' : colors.text,
                  border: `1px solid ${selected?.id === course.id ? '#1a3c6e' : colors.border}`,
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectCourse(course)}
              >
                <div style={styles.courseCardTop}>
                  <span style={{
                    ...styles.codeTag,
                    background: selected?.id === course.id ? 'rgba(255,255,255,0.2)' : '#e8f0fe',
                    color: selected?.id === course.id ? '#fff' : '#1a3c6e',
                  }}>
                    {course.code}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 6 }}>{course.name}</div>
                <div style={{ fontSize: 12, marginTop: 4, opacity: 0.75 }}>{course.semester?.name}</div>
              </div>
            ))
          )}
        </div>

        {/* Course Details */}
        <div style={styles.detailCol}>
          {!selected ? (
            <div style={{ ...styles.emptyDetail, color: colors.textMuted, background: colors.card, border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: 48 }}>📚</div>
              <p>اختر مقرراً من القائمة لعرض تقييماته</p>
            </div>
          ) : loadingStats ? (
            <div style={{ ...styles.emptyDetail, color: colors.textMuted, background: colors.card, border: `1px solid ${colors.border}` }}>
              <p>جاري تحميل التقييمات...</p>
            </div>
          ) : (
            <div style={{ ...styles.detailCard, background: colors.card, border: `1px solid ${colors.border}` }}>
              <h3 style={{ color: colors.text, marginBottom: 4 }}>{selected.name}</h3>
              <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 16 }}>
                {selected.code} | {selected.semester?.name}
              </p>

              {!courseStats || courseStats.totalEvaluations === 0 ? (
                <div style={{ ...styles.noEvals, color: colors.textMuted }}>
                  لا توجد تقييمات لهذا المقرر بعد
                </div>
              ) : (
                <>
                  <div style={styles.statsRow}>
                    <div style={{ ...styles.statBadge, background: '#e8f0fe', color: '#1a3c6e' }}>
                      <span style={{ fontSize: 20, fontWeight: 700 }}>{courseStats.totalEvaluations}</span>
                      <span style={{ fontSize: 12 }}>تقييم</span>
                    </div>
                  </div>

                  <div style={styles.questionsList}>
                    {courseStats.stats?.map((s: any) => (
                      <div key={s.questionId} style={{ ...styles.questionItem, borderBottom: `1px solid ${colors.border}` }}>
                        <div style={{ color: colors.text, fontSize: 14, flex: 1 }}>{s.questionText}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ ...styles.ratingBar, background: colors.surface }}>
                            <div style={{
                              ...styles.ratingFill,
                              width: `${(parseFloat(s.average) / 5) * 100}%`,
                              background: getRatingColor(parseFloat(s.average)),
                            }} />
                          </div>
                          <span style={{ color: getRatingColor(parseFloat(s.average)), fontWeight: 700, fontSize: 14, minWidth: 32 }}>
                            {s.average}
                          </span>
                          <span style={{ fontSize: 11, color: colors.textMuted, minWidth: 60 }}>
                            {getRatingLabel(parseFloat(s.average))}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  searchBox: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderRadius: 12, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  searchInput: { flex: 1, border: 'none', outline: 'none', fontSize: 15 },
  clearBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#888' },
  layout: { display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 },
  listCol: { display: 'flex', flexDirection: 'column' },
  detailCol: {},
  courseCard: { padding: '14px 16px', borderRadius: 12, marginBottom: 8, transition: 'all 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  courseCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  codeTag: { padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 },
  emptyBox: { textAlign: 'center', padding: 32, fontSize: 14 },
  emptyDetail: { borderRadius: 16, padding: 48, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, fontSize: 15 },
  detailCard: { borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  statsRow: { display: 'flex', gap: 12, marginBottom: 20 },
  statBadge: { padding: '12px 20px', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  noEvals: { textAlign: 'center', padding: 32, fontSize: 14 },
  questionsList: { display: 'flex', flexDirection: 'column', gap: 0 },
  questionItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', gap: 12 },
  ratingBar: { width: 100, height: 8, borderRadius: 4, overflow: 'hidden' },
  ratingFill: { height: '100%', borderRadius: 4, transition: 'width 0.4s' },
};

export default SearchPage;
