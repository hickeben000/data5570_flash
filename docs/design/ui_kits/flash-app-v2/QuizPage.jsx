// Flash — Quiz Page + Results Page

const QUIZ_QS = [
  { id: 1, type: 'mc', text: 'Which organelle is responsible for producing ATP through cellular respiration?', choices: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'], answer: 1 },
  { id: 2, type: 'mc', text: 'What process converts glucose to pyruvate in the cytoplasm?', choices: ['Photosynthesis', 'Fermentation', 'Glycolysis', 'Oxidative phosphorylation'], answer: 2 },
  { id: 3, type: 'mc', text: 'During which phase of the cell cycle does DNA replication occur?', choices: ['G1 phase', 'S phase', 'G2 phase', 'M phase'], answer: 1 },
  { id: 4, type: 'mc', text: 'What is the primary product of the light-dependent reactions in photosynthesis?', choices: ['Glucose', 'Carbon dioxide', 'ATP and NADPH', 'Pyruvate'], answer: 2 },
  { id: 5, type: 'free', text: 'Explain the role of enzymes in biochemical reactions and describe how temperature affects enzyme activity.' },
];

function QuizPage({ course, onBack, onFinish }) {
  const [answers, setAnswers] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [activeQ, setActiveQ] = React.useState(0);

  const setAnswer = (qid, val) => setAnswers(a => ({ ...a, [qid]: val }));
  const answered = Object.keys(answers).length;
  const progress = (answered / QUIZ_QS.length) * 100;

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onFinish(answers, QUIZ_QS); }, 1000);
  };

  return (
    <div style={qpSt.page}>
      {/* Header */}
      <div style={qpSt.header}>
        <div style={qpSt.headerLeft}>
          <button style={qpSt.backBtn} onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div>
            <div style={qpSt.quizTitle}>Quiz — {course?.name || 'Biology 101'}</div>
            <div style={qpSt.quizMeta}>{answered} of {QUIZ_QS.length} answered</div>
          </div>
        </div>
        <div style={qpSt.diffBadge}>Easy</div>
      </div>

      {/* Progress */}
      <div style={qpSt.progressTrack}><div style={{ ...qpSt.progressFill, width: `${progress}%` }}></div></div>

      <div style={qpSt.body}>
        {/* Question list sidebar */}
        <div style={qpSt.sidebar}>
          <div style={qpSt.sidebarTitle}>Questions</div>
          {QUIZ_QS.map((q, i) => (
            <button key={q.id} style={{ ...qpSt.qPill, ...(activeQ === i ? qpSt.qPillActive : {}), ...(answers[q.id] !== undefined ? qpSt.qPillDone : {}) }} onClick={() => setActiveQ(i)}>
              <div style={{ ...qpSt.qPillNum, background: activeQ === i ? '#4361ee' : answers[q.id] !== undefined ? '#22c55e' : '#e2e8f0', color: activeQ === i || answers[q.id] !== undefined ? '#fff' : '#94a3b8' }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: activeQ === i ? '#4361ee' : '#64748b', fontWeight: activeQ === i ? 700 : 500, flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {q.text.slice(0, 32)}…
              </span>
            </button>
          ))}
          <button style={qpSt.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting…' : 'Submit Quiz'}
          </button>
        </div>

        {/* Active question */}
        <div style={qpSt.main}>
          {QUIZ_QS.map((q, i) => (
            <div key={q.id} style={{ display: i === activeQ ? 'block' : 'none' }}>
              <div style={qpSt.qCard}>
                <div style={qpSt.qEyebrow}>Question {i + 1} of {QUIZ_QS.length}</div>
                <div style={qpSt.qText}>{q.text}</div>
                {q.type === 'mc' ? (
                  <div style={qpSt.choices}>
                    {q.choices.map((ch, ci) => {
                      const sel = answers[q.id] === ci;
                      return (
                        <button key={ci} style={{ ...qpSt.choice, ...(sel ? qpSt.choiceSel : {}) }} onClick={() => { setAnswer(q.id, ci); if (i < QUIZ_QS.length - 1) setTimeout(() => setActiveQ(i + 1), 300); }}>
                          <div style={{ ...qpSt.choiceLetter, ...(sel ? qpSt.choiceLetterSel : {}) }}>{String.fromCharCode(65 + ci)}</div>
                          <span>{ch}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea style={qpSt.textarea} placeholder="Write your answer here…" value={answers[q.id] || ''} onChange={e => setAnswer(q.id, e.target.value)} rows={6} />
                )}
                <div style={qpSt.qNav}>
                  {i > 0 && <button style={qpSt.qNavBtn} onClick={() => setActiveQ(i - 1)}>← Previous</button>}
                  {i < QUIZ_QS.length - 1 && <button style={{ ...qpSt.qNavBtn, marginLeft: 'auto', background: '#4361ee', color: '#fff', borderColor: '#4361ee' }} onClick={() => setActiveQ(i + 1)}>Next →</button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizResultsPage({ answers, questions, onBack, onRetry }) {
  const mcQs = (questions || QUIZ_QS).filter(q => q.type === 'mc');
  const correct = mcQs.filter(q => answers?.[q.id] === q.answer).length;
  const pct = mcQs.length ? Math.round((correct / mcQs.length) * 100) : 0;
  const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F';
  const gradeColor = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div style={qrpSt.page}>
      <div style={qrpSt.hero}>
        <div style={qrpSt.gradeCircle}>
          <div style={{ ...qrpSt.grade, color: gradeColor }}>{grade}</div>
          <div style={qrpSt.pct}>{pct}%</div>
        </div>
        <div style={qrpSt.heroText}>
          <div style={qrpSt.heroTitle}>{pct >= 80 ? 'Great work!' : pct >= 60 ? 'Good effort!' : 'Keep studying!'}</div>
          <div style={qrpSt.heroSub}>{correct} of {mcQs.length} multiple choice correct</div>
        </div>
        <div style={qrpSt.statRow}>
          {[['Correct', correct, '#22c55e'], ['Incorrect', mcQs.length - correct, '#ef4444'], ['Score', `${pct}%`, gradeColor]].map(([l, v, c]) => (
            <div key={l} style={qrpSt.stat}><div style={{ ...qrpSt.statVal, color: c }}>{v}</div><div style={qrpSt.statLabel}>{l}</div></div>
          ))}
        </div>
        <div style={qrpSt.actions}>
          <button style={qrpSt.retryBtn} onClick={onRetry}>Retake Quiz</button>
          <button style={qrpSt.backBtn} onClick={onBack}>Back to Course</button>
        </div>
      </div>

      <div style={qrpSt.review}>
        <div style={qrpSt.reviewTitle}>Question Review</div>
        {mcQs.map((q, i) => {
          const isCorrect = answers?.[q.id] === q.answer;
          return (
            <div key={q.id} style={{ ...qrpSt.reviewCard, borderLeft: `4px solid ${isCorrect ? '#22c55e' : '#ef4444'}` }}>
              <div style={qrpSt.reviewQ}>
                <div style={{ ...qrpSt.reviewBadge, background: isCorrect ? '#dcfce7' : '#fee2e2', color: isCorrect ? '#16a34a' : '#dc2626' }}>{isCorrect ? '✓ Correct' : '✗ Incorrect'}</div>
                <div style={qrpSt.reviewQText}>Q{i + 1}: {q.text}</div>
              </div>
              <div style={qrpSt.reviewAnswers}>
                <div style={{ fontSize: 13, color: '#64748b' }}>Your answer: <strong style={{ color: isCorrect ? '#16a34a' : '#dc2626' }}>{q.choices[answers?.[q.id]] || 'No answer'}</strong></div>
                {!isCorrect && <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Correct: <strong style={{ color: '#16a34a' }}>{q.choices[q.answer]}</strong></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const qpSt = {
  page: { flex: 1, display: 'flex', flexDirection: 'column', background: '#f0f4ff', overflow: 'hidden' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' },
  quizTitle: { fontSize: 16, fontWeight: 800, color: '#0f172a' },
  quizMeta: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  diffBadge: { background: '#eef1ff', color: '#4361ee', borderRadius: 9999, padding: '5px 14px', fontSize: 12, fontWeight: 700 },
  progressTrack: { height: 3, background: '#e2e8f0', flexShrink: 0 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#4361ee,#2B7FFF)', transition: 'width 0.4s' },
  body: { flex: 1, display: 'flex', overflow: 'hidden' },
  sidebar: { width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', flexShrink: 0 },
  sidebarTitle: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, paddingLeft: 6 },
  qPill: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10, border: '1.5px solid transparent', background: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', width: '100%', textAlign: 'left' },
  qPillActive: { background: '#eef1ff', borderColor: '#c7d2fe' },
  qPillDone: {},
  qPillNum: { width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, transition: 'all 0.2s' },
  submitBtn: { marginTop: 'auto', background: 'linear-gradient(135deg,#4361ee,#2B7FFF)', color: '#fff', border: 'none', borderRadius: 11, padding: '12px 0', fontWeight: 800, fontSize: 14, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 4px 12px rgba(67,97,238,0.3)', marginTop: 16 },
  main: { flex: 1, overflowY: 'auto', padding: '32px 40px' },
  qCard: { background: '#fff', borderRadius: 20, padding: '32px 36px', boxShadow: '0 2px 16px rgba(15,23,42,0.07)', border: '1px solid #e2e8f0', maxWidth: 680 },
  qEyebrow: { fontSize: 11, fontWeight: 700, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 },
  qText: { fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1.55, marginBottom: 28 },
  choices: { display: 'flex', flexDirection: 'column', gap: 10 },
  choice: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 13, border: '2px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontFamily: 'Nunito, sans-serif', fontSize: 15, color: '#374151', textAlign: 'left', transition: 'all 0.15s' },
  choiceSel: { borderColor: '#4361ee', background: '#eef1ff', color: '#4361ee' },
  choiceLetter: { width: 30, height: 30, borderRadius: '50%', background: '#e2e8f0', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0, transition: 'all 0.15s' },
  choiceLetterSel: { background: '#4361ee', color: '#fff' },
  textarea: { width: '100%', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 13, padding: '16px', fontSize: 15, fontFamily: 'Nunito, sans-serif', color: '#0f172a', resize: 'vertical', boxSizing: 'border-box', outline: 'none', lineHeight: 1.6 },
  qNav: { display: 'flex', marginTop: 24, gap: 10 },
  qNavBtn: { padding: '10px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: 13, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
};

const qrpSt = {
  page: { flex: 1, overflowY: 'auto', background: '#f0f4ff' },
  hero: { background: 'linear-gradient(150deg,#1a56db 0%,#1560F0 50%,#2B7FFF 100%)', padding: '48px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 },
  gradeCircle: { width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '3px solid rgba(255,255,255,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' },
  grade: { fontSize: 36, fontWeight: 900, lineHeight: 1 },
  pct: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 700 },
  heroText: { textAlign: 'center' },
  heroTitle: { fontSize: 28, fontWeight: 900, color: '#fff', marginBottom: 6 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.8)' },
  statRow: { display: 'flex', gap: 32 },
  stat: { textAlign: 'center' },
  statVal: { fontSize: 28, fontWeight: 900, lineHeight: 1 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 },
  actions: { display: 'flex', gap: 12 },
  retryBtn: { background: '#fff', color: '#4361ee', border: 'none', borderRadius: 12, padding: '12px 28px', fontWeight: 800, fontSize: 14, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' },
  backBtn: { background: 'rgba(255,255,255,0.18)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: 12, padding: '12px 28px', fontWeight: 800, fontSize: 14, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  review: { padding: '32px 40px', maxWidth: 760, margin: '0 auto', width: '100%', boxSizing: 'border-box' },
  reviewTitle: { fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 16 },
  reviewCard: { background: '#fff', borderRadius: 14, padding: '18px 20px', marginBottom: 12, boxShadow: '0 1px 8px rgba(15,23,42,0.06)' },
  reviewQ: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  reviewBadge: { borderRadius: 9999, padding: '3px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 },
  reviewQText: { fontSize: 14, fontWeight: 600, color: '#0f172a', lineHeight: 1.5 },
  reviewAnswers: { paddingLeft: 4 },
};

Object.assign(window, { QuizPage, QuizResultsPage });
