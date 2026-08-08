import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

interface Props {
  course: any;
  onDone: () => void;
  onCancel: () => void;
}

const EvaluationForm: React.FC<Props> = ({ course, onDone, onCancel }) => {
  const { colors } = useTheme();
  const [questions, setQuestions] = useState<any[]>([]);
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/questions').then(res => {
      setQuestions(res.data);
      const initial: { [key: number]: number } = {};
      res.data.forEach((q: any) => { initial[q.id] = 3; });
      setRatings(initial);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const answers = Object.entries(ratings).map(([questionId, rating]) => ({
        questionId: parseInt(questionId),
        rating,
      }));
      await API.post('/evaluations', {
        courseId: course.id,
        semesterId: course.semesterId,
        answers,
        comment: comment.trim() || undefined,
      });
      onDone();
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء الإرسال');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = Array.from(new Set(questions.map((q: any) => q.category)));

  const ratingLabels: { [key: number]: string } = { 1: 'ضعيف جداً', 2: 'ضعيف', 3: 'متوسط', 4: 'جيد', 5: 'ممتاز' };

  return (
    <div style={{ direction: 'rtl' }}>
      <div style={styles.header}>
        <button style={{ ...styles.backBtn, color: colors.text, border: `1px solid ${colors.border}` }} onClick={onCancel}>
          ← رجوع
        </button>
        <div>
          <h2 style={{ ...styles.title, color: colors.text }}>تقييم مقرر: {course.name}</h2>
          <p style={{ ...styles.subtitle, color: colors.textMuted }}>رمز المقرر: {course.code} | {course.semester?.name}</p>
        </div>
      </div>

      <div style={{ ...styles.notice }}>
        🔒 تقييمك مجهول الهوية تماماً ولن يُكشف عن هويتك لأي أحد
      </div>

      <form onSubmit={handleSubmit}>
        {categories.map(cat => (
          <div key={cat} style={{ ...styles.section, background: colors.card, border: `1px solid ${colors.border}` }}>
            <h3 style={{ ...styles.catTitle, color: '#1a3c6e', borderBottom: `2px solid #e8f0fe` }}>{cat}</h3>
            {questions.filter(q => q.category === cat).map(q => (
              <div key={q.id} style={{ ...styles.questionRow, borderBottom: `1px solid ${colors.border}` }}>
                <p style={{ ...styles.questionText, color: colors.text }}>{q.order}. {q.text}</p>
                <div style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map(val => (
                    <label key={val} style={styles.ratingLabel}>
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={val}
                        checked={ratings[q.id] === val}
                        onChange={() => setRatings(prev => ({ ...prev, [q.id]: val }))}
                        style={{ display: 'none' }}
                      />
                      <span style={{
                        ...styles.ratingBtn,
                        background: ratings[q.id] === val ? '#1a3c6e' : colors.surface,
                        color: ratings[q.id] === val ? '#fff' : colors.text,
                        border: `1px solid ${ratings[q.id] === val ? '#1a3c6e' : colors.border}`,
                      }}>
                        {val}
                      </span>
                    </label>
                  ))}
                  <span style={{ ...styles.ratingHint, color: colors.textMuted }}>
                    {ratingLabels[ratings[q.id]]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* خانة الرأي النصي */}
        <div style={{ ...styles.section, background: colors.card, border: `1px solid ${colors.border}` }}>
          <h3 style={{ ...styles.catTitle, color: '#1a3c6e', borderBottom: `2px solid #e8f0fe` }}>
            💬 رأيك واقتراحاتك
          </h3>
          <p style={{ color: colors.textMuted, fontSize: 13, marginBottom: 12 }}>
            شاركنا رأيك بشكل تفصيلي — اقتراحاتك تساعد في تحسين جودة التعليم (اختياري)
          </p>
          <textarea
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: `1px solid ${colors.border}`,
              background: colors.input,
              color: colors.text,
              fontSize: 14,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="مثال: المقرر كان مفيداً لكن أتمنى إضافة المزيد من التطبيق العملي..."
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" style={styles.submitBtn} disabled={submitting}>
          {submitting ? 'جاري الإرسال...' : '✅ إرسال التقييم'}
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 },
  backBtn: { background: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' },
  title: { fontSize: 22, margin: 0 },
  subtitle: { fontSize: 14, marginTop: 4 },
  notice: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#1e40af', marginBottom: 20 },
  section: { borderRadius: 12, padding: 24, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  catTitle: { fontSize: 16, fontWeight: 700, marginBottom: 16, paddingBottom: 8 },
  questionRow: { paddingBottom: 16, marginBottom: 16 },
  questionText: { fontSize: 14, marginBottom: 10 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  ratingLabel: { cursor: 'pointer' },
  ratingBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  ratingHint: { fontSize: 12, marginRight: 8 },
  error: { background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 8, marginBottom: 16 },
  submitBtn: { width: '100%', background: '#1a3c6e', color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
};

export default EvaluationForm;
