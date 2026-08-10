import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

const CoursesManagePage: React.FC = () => {
  const { colors } = useTheme();
  const [courses, setCourses] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', name: '', description: '', instructorId: 1, semesterId: 1 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    try {
      const [cRes, sRes] = await Promise.all([API.get('/courses'), API.get('/semesters')]);
      setCourses(cRes.data);
      setSemesters(sRes.data);
    } catch (err: any) {
      setMsg('❌ ' + (err.response?.data?.message || 'حدث خطأ أثناء التحميل'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/courses', form);
      setMsg('✅ تم إضافة المقرر بنجاح');
      setShowForm(false);
      setForm({ code: '', name: '', description: '', instructorId: 1, semesterId: semesters[0]?.id || 1 });
      fetchData();
    } catch (err: any) {
      setMsg('❌ ' + (err.response?.data?.message || 'حدث خطأ'));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`هل تريد حذف مقرر "${name}"؟`)) return;
    try {
      await API.delete(`/courses/${id}`);
      setMsg('✅ تم حذف المقرر');
      fetchData();
    } catch (err: any) {
      setMsg('❌ ' + (err.response?.data?.message || 'لا يمكن الحذف'));
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const inputStyle = {
    padding: '10px 14px', borderRadius: 8, border: `1px solid ${colors.border}`,
    background: colors.input, color: colors.text, fontSize: 14, width: '100%', outline: 'none',
  };

  if (loading) return <div style={{ color: colors.text, padding: 32 }}>جاري التحميل...</div>;

  return (
    <div style={{ direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ color: colors.text, fontSize: 22 }}>📚 إدارة المقررات الدراسية</h2>
        <button
          style={{ background: colors.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ إلغاء' : '+ إضافة مقرر'}
        </button>
      </div>

      {msg && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: msg.includes('✅') ? colors.success : colors.danger, color: msg.includes('✅') ? '#065f46' : '#991b1b', fontWeight: 600 }}>
          {msg}
        </div>
      )}

      {showForm && (
        <div style={{ ...cardStyle(colors), marginBottom: 24 }}>
          <h3 style={{ color: colors.text, marginBottom: 20 }}>إضافة مقرر جديد</h3>
          <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 6 }}>رمز المقرر *</label>
              <input style={inputStyle} value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="مثال: CS101" required />
            </div>
            <div>
              <label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 6 }}>اسم المقرر *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="مثال: مقدمة في علوم الحاسب" required />
            </div>
            <div>
              <label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 6 }}>الفصل الدراسي *</label>
              <select style={inputStyle} value={form.semesterId} onChange={e => setForm(p => ({ ...p, semesterId: parseInt(e.target.value) }))}>
                {semesters.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: colors.textMuted, fontSize: 13, display: 'block', marginBottom: 6 }}>الوصف</label>
              <input style={inputStyle} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="وصف مختصر للمقرر (اختياري)" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" style={{ background: colors.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', cursor: 'pointer', fontWeight: 700, fontSize: 15 }} disabled={saving}>
                {saving ? 'جاري الحفظ...' : '💾 حفظ المقرر'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ ...cardStyle(colors) }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: colors.surface }}>
              {['الرمز', 'اسم المقرر', 'الفصل', 'الإجراءات'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: colors.textMuted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {courses.map((c: any) => (
              <tr key={c.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: colors.accentLight, color: colors.accent, padding: '4px 10px', borderRadius: 6, fontSize: 13, fontWeight: 700 }}>{c.code}</span>
                </td>
                <td style={{ padding: '14px 16px', color: colors.text, fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '14px 16px', color: colors.textMuted, fontSize: 13 }}>{c.semester?.name}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    style={{ background: colors.danger, color: '#991b1b', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                  >
                    🗑️ حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>لا توجد مقررات</div>
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

export default CoursesManagePage;
