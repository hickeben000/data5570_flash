// Flash — Dashboard (Course Grid + Stats)

const SAMPLE_COURSES = [
  { id: 1, name: 'Biology 101', docs: 3, color: 'linear-gradient(135deg,#2B7FFF,#1560F0)', emoji: '🧬', lastStudied: '2 hours ago', cards: 24 },
  { id: 2, name: 'World History', docs: 2, color: 'linear-gradient(135deg,#7c3aed,#4f46e5)', emoji: '🌍', lastStudied: 'Yesterday', cards: 18 },
  { id: 3, name: 'Calculus II', docs: 4, color: 'linear-gradient(135deg,#0891b2,#0e7490)', emoji: '∑', lastStudied: '3 days ago', cards: 32 },
  { id: 4, name: 'Intro to Psychology', docs: 1, color: 'linear-gradient(135deg,#db2777,#be185d)', emoji: '🧠', lastStudied: 'Last week', cards: 15 },
];

function DashboardPage({ onOpenCourse, isMobile }) {
  const [courses, setCourses] = React.useState(SAMPLE_COURSES);
  const [newName, setNewName] = React.useState('');
  const [adding, setAdding] = React.useState(false);

  const gradients = [
    'linear-gradient(135deg,#2B7FFF,#1560F0)',
    'linear-gradient(135deg,#7c3aed,#4f46e5)',
    'linear-gradient(135deg,#0891b2,#0e7490)',
    'linear-gradient(135deg,#db2777,#be185d)',
    'linear-gradient(135deg,#d97706,#b45309)',
  ];

  const handleAdd = () => {
    if (!newName.trim()) return;
    setCourses(prev => [...prev, { id: Date.now(), name: newName.trim(), docs: 0, color: gradients[prev.length % gradients.length], emoji: '📚', lastStudied: 'Just created', cards: 0 }]);
    setNewName(''); setAdding(false);
  };

  const totalCards = courses.reduce((a, c) => a + c.cards, 0);

  return (
    <div style={dashSt.page}>
      {/* Hero banner */}
      <div style={{ ...dashSt.hero, padding: isMobile ? '24px 16px' : '36px 40px', flexDirection: isMobile ? 'column' : 'row', justifyContent: isMobile ? 'flex-start' : 'space-between', alignItems: isMobile ? 'stretch' : 'center' }}>
        <div>
          <div style={dashSt.heroGreeting}>Good morning, Jane 👋</div>
          <div style={dashSt.heroSub}>What will you work on today?</div>
        </div>
        <div style={dashSt.statsRow}>
          <div style={dashSt.stat}><div style={dashSt.statNum}>{courses.length}</div><div style={dashSt.statLabel}>Courses</div></div>
          <div style={dashSt.statDivider}></div>
          <div style={dashSt.stat}><div style={dashSt.statNum}>{totalCards}</div><div style={dashSt.statLabel}>Flashcards</div></div>
          <div style={dashSt.statDivider}></div>
          <div style={dashSt.stat}><div style={dashSt.statNum}>87%</div><div style={dashSt.statLabel}>Avg. Score</div></div>
        </div>
      </div>

      {/* Courses section */}
      <div style={{ ...dashSt.section, padding: isMobile ? '20px 16px' : '32px 40px' }}>
        <div style={dashSt.sectionHeader}>
          <div style={dashSt.sectionTitle}>My Courses</div>
          <button style={dashSt.addBtn} onClick={() => setAdding(a => !a)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Course
          </button>
        </div>

        {adding && (
          <div style={dashSt.addCard}>
            <input
              style={dashSt.addInput}
              placeholder="Course name, e.g. Chemistry 202"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={dashSt.addConfirm} onClick={handleAdd}>Add Course</button>
              <button style={dashSt.addCancel} onClick={() => setAdding(false)}>Cancel</button>
            </div>
          </div>
        )}

        <div style={{ ...dashSt.grid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {courses.map(c => (
            <div key={c.id} style={dashSt.courseCard} onClick={() => onOpenCourse(c)}>
              <div style={{ ...dashSt.courseCardTop, background: c.color }}>
                <span style={dashSt.courseEmoji}>{c.emoji}</span>
                <div style={dashSt.courseDocsChip}>{c.docs} doc{c.docs !== 1 ? 's' : ''}</div>
              </div>
              <div style={dashSt.courseCardBody}>
                <div style={dashSt.courseName}>{c.name}</div>
                <div style={dashSt.courseMeta}>{c.cards} cards · {c.lastStudied}</div>
                <div style={dashSt.courseActions}>
                  <div style={dashSt.actionChip}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    Flashcards
                  </div>
                  <div style={{ ...dashSt.actionChip, background: '#f0f4ff', color: '#4361ee' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Quiz
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const dashSt = {
  page: { flex: 1, overflowY: 'auto', background: '#f0f4ff' },
  hero: { background: 'linear-gradient(135deg,#1a56db 0%,#1560F0 50%,#2B7FFF 100%)', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 20, flexWrap: 'wrap' },
  heroGreeting: { fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.8)' },
  statsRow: { display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '14px 20px', backdropFilter: 'blur(8px)', alignSelf: 'stretch', justifyContent: 'center' },
  stat: { textAlign: 'center', padding: '0 20px' },
  statNum: { fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' },
  statDivider: { width: 1, height: 36, background: 'rgba(255,255,255,0.25)' },
  section: { padding: '24px 20px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 800, color: '#0f172a' },
  addBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#4361ee', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  addCard: { background: '#fff', borderRadius: 14, padding: 20, marginBottom: 20, boxShadow: '0 2px 12px rgba(67,97,238,0.1)', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 },
  addInput: { background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'Nunito, sans-serif', color: '#0f172a', outline: 'none', width: '100%', boxSizing: 'border-box' },
  addConfirm: { background: '#4361ee', color: '#fff', border: 'none', borderRadius: 9, padding: '10px 18px', fontWeight: 700, fontSize: 13, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  addCancel: { background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: 9, padding: '10px 18px', fontWeight: 700, fontSize: 13, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  grid: { display: 'grid', gap: 20 },
  courseCard: { background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 12px rgba(15,23,42,0.07)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' },
  courseCardTop: { height: 100, position: 'relative', display: 'flex', alignItems: 'center', padding: '0 20px' },
  courseEmoji: { fontSize: 40, lineHeight: 1 },
  courseDocsChip: { position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.25)', borderRadius: 9999, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff', backdropFilter: 'blur(4px)' },
  courseCardBody: { padding: '16px 20px 18px' },
  courseName: { fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 4 },
  courseMeta: { fontSize: 12, color: '#94a3b8', marginBottom: 14 },
  courseActions: { display: 'flex', gap: 8 },
  actionChip: { display: 'flex', alignItems: 'center', gap: 5, background: '#eef1ff', color: '#4361ee', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700 },
};

Object.assign(window, { DashboardPage });
