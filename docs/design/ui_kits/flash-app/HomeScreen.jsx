// Flash — HomeScreen
function HomeScreen({ onOpenCourse }) {
  const [courses, setCourses] = React.useState([
    { id: 1, name: 'Biology 101', created_at: '2025-04-12' },
    { id: 2, name: 'World History', created_at: '2025-04-15' },
  ]);
  const [courseName, setCourseName] = React.useState('');

  const handleCreate = () => {
    const name = courseName.trim();
    if (!name) return;
    setCourses(prev => [...prev, { id: Date.now(), name, created_at: new Date().toISOString().split('T')[0] }]);
    setCourseName('');
  };

  return (
    <div style={homeStyles.container}>
      <div style={homeStyles.header}>
        <div>
          <div style={homeStyles.title}>My Courses</div>
          <div style={homeStyles.subtitle}>Create a course, add study materials, and generate flashcards or quizzes.</div>
        </div>
        <div style={homeStyles.avatarBtn}>JD</div>
      </div>

      <div style={homeStyles.createCard}>
        <div style={homeStyles.sectionTitle}>Create a course</div>
        <input
          style={homeStyles.input}
          placeholder="Example: Biology 101"
          value={courseName}
          onChange={e => setCourseName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <button style={homeStyles.button} onClick={handleCreate}>Add Course</button>
      </div>

      <div style={homeStyles.listLabel}>Your Courses</div>
      {courses.length === 0
        ? <div style={homeStyles.empty}>No courses yet. Create one above to get started.</div>
        : courses.map(c => (
          <div key={c.id} style={homeStyles.courseCard} onClick={() => onOpenCourse && onOpenCourse(c)}>
            <div style={homeStyles.courseIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={homeStyles.courseName}>{c.name}</div>
              <div style={homeStyles.courseDate}>Created {new Date(c.created_at).toLocaleDateString()}</div>
            </div>
            <div style={homeStyles.chevron}>›</div>
          </div>
        ))
      }
    </div>
  );
}

const homeStyles = {
  container: { flex: 1, padding: '20px 20px', background: '#f5f7fb', overflowY: 'auto', minHeight: '100%', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  title: { fontSize: 30, fontWeight: 800, color: '#1a1a2e' },
  subtitle: { fontSize: 14, color: '#6b7280', marginTop: 4, lineHeight: 1.5, maxWidth: 260 },
  avatarBtn: { width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#2B7FFF,#1560F0)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 },
  createCard: { background: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: 10 },
  input: { background: '#f8f9fd', borderRadius: 10, padding: '12px 14px', border: '1px solid #dfe4f1', width: '100%', boxSizing: 'border-box', fontSize: 14, fontFamily: 'Nunito, sans-serif', color: '#1a1a2e', outline: 'none' },
  button: { marginTop: 10, width: '100%', background: '#4361ee', color: '#fff', border: 'none', borderRadius: 10, padding: '13px 0', fontWeight: 700, fontSize: 14, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  listLabel: { fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 },
  courseCard: { background: '#fff', borderRadius: 14, padding: '14px 16px', marginBottom: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' },
  courseIcon: { width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#2B7FFF,#1560F0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  courseName: { fontSize: 15, fontWeight: 700, color: '#1a1a2e' },
  courseDate: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  chevron: { color: '#9ca3af', fontSize: 22, lineHeight: 1 },
  empty: { textAlign: 'center', color: '#9ca3af', fontSize: 14, marginTop: 40 },
};

Object.assign(window, { HomeScreen });
