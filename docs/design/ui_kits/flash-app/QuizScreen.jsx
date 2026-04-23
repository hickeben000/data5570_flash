// Flash — QuizScreen + QuizResultsScreen
function QuizScreen({ course, onBack, onFinish }) {
  const questions = [
    { id: 1, type: 'mc', text: 'Which organelle is responsible for producing ATP?', choices: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'], answer: 1 },
    { id: 2, type: 'mc', text: 'What process converts glucose to pyruvate?', choices: ['Photosynthesis', 'Fermentation', 'Glycolysis', 'Oxidation'], answer: 2 },
    { id: 3, type: 'mc', text: 'DNA replication occurs during which phase of the cell cycle?', choices: ['G1', 'S phase', 'G2', 'M phase'], answer: 1 },
    { id: 4, type: 'free', text: 'Describe the role of enzymes in biochemical reactions.' },
  ];
  const [answers, setAnswers] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const setAnswer = (qid, val) => setAnswers(a => ({ ...a, [qid]: val }));
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onFinish && onFinish(answers, questions); }, 1000);
  };

  return (
    <div style={qStyles.container}>
      <div style={qStyles.topRow}>
        <button style={qStyles.backBtn} onClick={onBack}>← Back</button>
        <span style={qStyles.badge}>Easy</span>
      </div>
      <div style={qStyles.heading}>Quiz · {course ? course.name : 'Biology 101'}</div>

      {questions.map((q, i) => (
        <div key={q.id} style={qStyles.qBlock}>
          <div style={qStyles.qNum}>Question {i + 1}</div>
          <div style={qStyles.qText}>{q.text}</div>
          {q.type === 'mc'
            ? q.choices.map((ch, ci) => (
              <button
                key={ci}
                style={{ ...qStyles.choice, ...(answers[q.id] === ci ? qStyles.choiceSelected : {}) }}
                onClick={() => setAnswer(q.id, ci)}
              >{ch}</button>
            ))
            : <textarea
                style={qStyles.textarea}
                placeholder="Type your answer..."
                value={answers[q.id] || ''}
                onChange={e => setAnswer(q.id, e.target.value)}
                rows={3}
              />
          }
        </div>
      ))}

      <button style={{ ...qStyles.submitBtn, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
        {loading ? 'Submitting…' : 'Submit Quiz'}
      </button>
    </div>
  );
}

function QuizResultsScreen({ answers, questions, onBack, onRetry }) {
  const mcQuestions = questions ? questions.filter(q => q.type === 'mc') : [];
  const correct = mcQuestions.filter(q => answers[q.id] === q.answer).length;
  const pct = mcQuestions.length ? Math.round((correct / mcQuestions.length) * 100) : 0;

  return (
    <div style={qrStyles.container}>
      <div style={qrStyles.hero}>
        <div style={qrStyles.trophy}>🏆</div>
        <div style={qrStyles.score}>{pct}%</div>
        <div style={qrStyles.scoreLabel}>{correct} of {mcQuestions.length} correct</div>
        <div style={qrStyles.feedback}>{pct >= 80 ? 'Great job! Keep it up.' : pct >= 50 ? 'Good effort — review the missed ones.' : 'Keep studying, you\'ve got this!'}</div>
      </div>
      {mcQuestions.map((q, i) => {
        const isCorrect = answers[q.id] === q.answer;
        return (
          <div key={q.id} style={{ ...qrStyles.resultBlock, borderLeft: `3px solid ${isCorrect ? '#27ae60' : '#c0392b'}` }}>
            <div style={qrStyles.qNum}>Q{i + 1}</div>
            <div style={qrStyles.qText}>{q.text}</div>
            <div style={{ ...qrStyles.answer, color: isCorrect ? '#27ae60' : '#c0392b' }}>
              {isCorrect ? '✓ ' : '✗ '}{q.choices[answers[q.id] ?? -1] || '—'}{!isCorrect && <span style={{ color: '#27ae60' }}> · Correct: {q.choices[q.answer]}</span>}
            </div>
          </div>
        );
      })}
      <div style={qrStyles.actions}>
        <button style={qrStyles.retryBtn} onClick={onRetry}>Retry Quiz</button>
        <button style={qrStyles.backBtn} onClick={onBack}>Back to Course</button>
      </div>
    </div>
  );
}

const qStyles = {
  container: { background: '#f5f7fb', padding: '20px', overflowY: 'auto', minHeight: '100%', boxSizing: 'border-box' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  backBtn: { background: 'none', border: 'none', color: '#4361ee', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', padding: 0 },
  badge: { background: '#eef1ff', color: '#4361ee', borderRadius: 9999, padding: '4px 12px', fontSize: 12, fontWeight: 700 },
  heading: { fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 },
  qBlock: { background: '#fff', borderRadius: 14, padding: 16, marginBottom: 12, boxShadow: '0 1px 5px rgba(0,0,0,0.07)' },
  qNum: { fontSize: 11, fontWeight: 700, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 },
  qText: { fontSize: 15, color: '#1a1a2e', marginBottom: 12, lineHeight: 1.5 },
  choice: { display: 'block', width: '100%', textAlign: 'left', padding: '11px 13px', borderRadius: 10, border: '1px solid #dfe4f1', background: '#fff', marginBottom: 8, fontSize: 14, fontFamily: 'Nunito, sans-serif', color: '#374151', cursor: 'pointer' },
  choiceSelected: { borderColor: '#4361ee', background: '#eef1ff', color: '#4361ee', fontWeight: 600 },
  textarea: { width: '100%', background: '#f8f9fd', borderRadius: 10, padding: '12px', border: '1px solid #dfe4f1', fontSize: 14, fontFamily: 'Nunito, sans-serif', color: '#1a1a2e', resize: 'vertical', boxSizing: 'border-box', outline: 'none' },
  submitBtn: { width: '100%', background: '#4361ee', color: '#fff', border: 'none', borderRadius: 12, padding: '15px 0', fontWeight: 700, fontSize: 16, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', marginTop: 4, marginBottom: 32 },
};

const qrStyles = {
  container: { background: '#f5f7fb', padding: '20px', overflowY: 'auto', minHeight: '100%', boxSizing: 'border-box' },
  hero: { background: 'linear-gradient(135deg,#2B7FFF,#1560F0)', borderRadius: 18, padding: '28px 20px', textAlign: 'center', marginBottom: 20, color: '#fff' },
  trophy: { fontSize: 40, marginBottom: 6 },
  score: { fontSize: 52, fontWeight: 800, lineHeight: 1 },
  scoreLabel: { fontSize: 16, fontWeight: 600, marginTop: 4, opacity: 0.9 },
  feedback: { fontSize: 14, marginTop: 10, opacity: 0.85 },
  resultBlock: { background: '#fff', borderRadius: 12, padding: '12px 14px', marginBottom: 10, boxShadow: '0 1px 5px rgba(0,0,0,0.06)' },
  qNum: { fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 },
  qText: { fontSize: 14, color: '#1a1a2e', marginBottom: 6 },
  answer: { fontSize: 13, fontWeight: 700 },
  actions: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10, paddingBottom: 32 },
  retryBtn: { background: '#4361ee', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 0', fontWeight: 700, fontSize: 15, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  backBtn: { background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 12, padding: '14px 0', fontWeight: 700, fontSize: 15, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
};

Object.assign(window, { QuizScreen, QuizResultsScreen });
