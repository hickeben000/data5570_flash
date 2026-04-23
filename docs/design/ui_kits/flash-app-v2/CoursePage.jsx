// Flash — Course Detail Page (web: 2-col, mobile: vertical)

function CoursePage({ course, onBack, onFlashcards, onQuiz, isMobile }) {
  const docs = [
    { id: 1, name: 'Chapter 5 — Cell Biology.pdf', size: '2.4 MB', date: 'Apr 15' },
    { id: 2, name: 'Midterm Review Notes.txt', size: '48 KB', date: 'Apr 18' },
    { id: 3, name: 'Lab Report Week 3.docx', size: '1.1 MB', date: 'Apr 20' },
  ];

  if (isMobile) {
    return (
      <div style={cpSt.mobilePage}>
        {/* Mobile header — compact gradient bar */}
        <div style={{ ...cpSt.mobileHeader, background: course?.color || 'linear-gradient(135deg,#2B7FFF,#1560F0)' }}>
          <div style={cpSt.mobileTopRow}>
            <button style={cpSt.mobileBackBtn} onClick={onBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div style={cpSt.mobileHeaderInfo}>
              <span style={cpSt.mobileEmoji}>{course?.emoji || '📚'}</span>
              <div>
                <div style={cpSt.mobileCourseTitle}>{course?.name || 'Biology 101'}</div>
                <div style={cpSt.mobileMeta}>{docs.length} documents · {course?.cards || 0} flashcards</div>
              </div>
            </div>
          </div>
          {/* Action buttons */}
          <div style={cpSt.mobileActionRow}>
            <button style={cpSt.mobilePrimaryBtn} onClick={onFlashcards}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Study Flashcards
            </button>
            <button style={cpSt.mobileSecondaryBtn} onClick={onQuiz}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Take Quiz
            </button>
          </div>
        </div>

        {/* Mobile body — vertical stack */}
        <div style={cpSt.mobileBody}>

          {/* Generate card */}
          <div style={{ ...cpSt.mobileCard, background: 'linear-gradient(135deg,#1a56db,#2B7FFF)', border: 'none' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 6 }}>Generate Study Tools</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.82)', marginBottom: 16, lineHeight: 1.6 }}>Flash uses AI to turn your materials into flashcards and quizzes automatically.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button style={cpSt.mobileGenBtn} onClick={onFlashcards}>Generate Flashcards</button>
              <button style={{ ...cpSt.mobileGenBtn, background: 'rgba(255,255,255,0.15)' }} onClick={onQuiz}>Generate Quiz</button>
            </div>
          </div>

          {/* Study Progress */}
          <div style={cpSt.mobileCard}>
            <div style={cpSt.mobileCardTitle}>Study Progress</div>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['Flashcards Known', 68], ['Quiz Average', 87], ['Material Coverage', 45]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#4361ee' }}>{val}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: `${val}%`, height: '100%', background: 'linear-gradient(90deg,#4361ee,#2B7FFF)', borderRadius: 9999 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Materials */}
          <div style={cpSt.mobileCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={cpSt.mobileCardTitle}>Study Materials</div>
              <button style={cpSt.mobileUploadBtn}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                Upload
              </button>
            </div>
            {docs.map(d => (
              <div key={d.id} style={cpSt.mobileDocRow}>
                <div style={cpSt.mobileDocIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{d.size} · {d.date}</div>
                </div>
              </div>
            ))}
            <button style={cpSt.mobileAddDocBtn}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Document
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── WEB LAYOUT (unchanged) ──────────────────────────────
  return (
    <div style={cpSt.page}>
      <div style={{ ...cpSt.header, background: course?.color || 'linear-gradient(135deg,#2B7FFF,#1560F0)' }}>
        <button style={cpSt.backBtn} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Courses
        </button>
        <div style={cpSt.headerContent}>
          <div style={cpSt.courseEmoji}>{course?.emoji || '📚'}</div>
          <div>
            <div style={cpSt.courseName}>{course?.name || 'Biology 101'}</div>
            <div style={cpSt.courseMeta}>{docs.length} documents · {course?.cards || 0} flashcards</div>
          </div>
        </div>
        <div style={cpSt.actionBtns}>
          <button style={cpSt.primaryActionBtn} onClick={onFlashcards}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            Study Flashcards
          </button>
          <button style={cpSt.secondaryActionBtn} onClick={onQuiz}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Take Quiz
          </button>
        </div>
      </div>
      <div style={cpSt.body}>
        <div style={cpSt.col}>
          <div style={cpSt.card}>
            <div style={cpSt.cardHeader}>
              <div style={cpSt.cardTitle}>Study Materials</div>
              <button style={cpSt.uploadBtn}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
                Upload
              </button>
            </div>
            {docs.map(d => (
              <div key={d.id} style={cpSt.docRow}>
                <div style={cpSt.docIcon}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <div style={{ flex: 1 }}>
                  <div style={cpSt.docName}>{d.name}</div>
                  <div style={cpSt.docMeta}>{d.size} · Uploaded {d.date}</div>
                </div>
              </div>
            ))}
            <button style={cpSt.addDocBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Document
            </button>
          </div>
        </div>
        <div style={cpSt.col}>
          <div style={{ ...cpSt.card, background: 'linear-gradient(135deg,#1a56db,#2B7FFF)', border: 'none' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Generate Study Tools</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 20, lineHeight: 1.6 }}>Flash uses AI to turn your uploaded materials into flashcards and quizzes automatically.</div>
            <button style={cpSt.genBtn} onClick={onFlashcards}>Generate Flashcards</button>
            <button style={{ ...cpSt.genBtn, background: 'rgba(255,255,255,0.15)', marginTop: 8 }} onClick={onQuiz}>Generate Quiz</button>
          </div>
          <div style={cpSt.card}>
            <div style={cpSt.cardTitle}>Study Progress</div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Flashcards Known', 68], ['Quiz Average', 87], ['Material Coverage', 45]].map(([label, val]) => (
                <div key={label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#4361ee' }}>{val}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: `${val}%`, height: '100%', background: 'linear-gradient(90deg,#4361ee,#2B7FFF)', borderRadius: 9999 }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cpSt = {
  // ── Mobile styles ──
  mobilePage: { flex: 1, background: '#f0f4ff', display: 'flex', flexDirection: 'column', minHeight: '100%' },
  mobileHeader: { padding: '16px 16px 18px', flexShrink: 0 },
  mobileTopRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  mobileBackBtn: { width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.22)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', flexShrink: 0, backdropFilter: 'blur(4px)' },
  mobileHeaderInfo: { display: 'flex', alignItems: 'center', gap: 10, flex: 1 },
  mobileEmoji: { fontSize: 28, lineHeight: 1 },
  mobileCourseTitle: { fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.2 },
  mobileMeta: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  mobileActionRow: { display: 'flex', gap: 10 },
  mobilePrimaryBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#fff', color: '#4361ee', border: 'none', borderRadius: 11, padding: '11px 0', fontSize: 13, fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  mobileSecondaryBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 11, padding: '11px 0', fontSize: 13, fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  mobileBody: { padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 },
  mobileCard: { background: '#fff', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(15,23,42,0.06)', border: '1px solid #e2e8f0' },
  mobileCardTitle: { fontSize: 14, fontWeight: 800, color: '#0f172a' },
  mobileGenBtn: { flex: 1, background: 'rgba(255,255,255,0.22)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 9, padding: '10px 0', fontWeight: 700, fontSize: 12, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  mobileUploadBtn: { display: 'flex', alignItems: 'center', gap: 5, background: '#f0f4ff', color: '#4361ee', border: 'none', borderRadius: 8, padding: '6px 11px', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  mobileDocRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9' },
  mobileDocIcon: { width: 32, height: 32, borderRadius: 8, background: '#eef1ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  mobileAddDocBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'none', border: '1.5px dashed #cbd5e1', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 700, color: '#4361ee', fontFamily: 'Nunito, sans-serif', cursor: 'pointer', width: '100%', marginTop: 10 },

  // ── Web styles ──
  page: { flex: 1, overflowY: 'auto', background: '#f0f4ff', display: 'flex', flexDirection: 'column' },
  header: { padding: '28px 40px 36px', flexShrink: 0 },
  backBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 8, padding: '7px 13px', fontSize: 13, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', marginBottom: 20, backdropFilter: 'blur(4px)' },
  headerContent: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 },
  courseEmoji: { fontSize: 44, lineHeight: 1 },
  courseName: { fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.15 },
  courseMeta: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  actionBtns: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  primaryActionBtn: { display: 'flex', alignItems: 'center', gap: 7, background: '#fff', color: '#4361ee', border: 'none', borderRadius: 11, padding: '12px 22px', fontSize: 14, fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  secondaryActionBtn: { display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: 11, padding: '12px 22px', fontSize: 14, fontWeight: 800, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', backdropFilter: 'blur(4px)' },
  body: { display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, padding: '28px 40px', flex: 1 },
  col: { display: 'flex', flexDirection: 'column', gap: 20 },
  card: { background: '#fff', borderRadius: 18, padding: '22px 24px', boxShadow: '0 2px 12px rgba(15,23,42,0.06)', border: '1px solid #e2e8f0' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: 800, color: '#0f172a' },
  uploadBtn: { display: 'flex', alignItems: 'center', gap: 5, background: '#f0f4ff', color: '#4361ee', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  docRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid #f1f5f9' },
  docIcon: { width: 36, height: 36, borderRadius: 9, background: '#eef1ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  docName: { fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 },
  docMeta: { fontSize: 11, color: '#94a3b8' },
  addDocBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1.5px dashed #cbd5e1', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 700, color: '#4361ee', fontFamily: 'Nunito, sans-serif', cursor: 'pointer', width: '100%', justifyContent: 'center', marginTop: 12 },
  genBtn: { display: 'block', width: '100%', background: 'rgba(255,255,255,0.22)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 10, padding: '12px 0', fontWeight: 700, fontSize: 14, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', backdropFilter: 'blur(4px)' },
};

Object.assign(window, { CoursePage });
