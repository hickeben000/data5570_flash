// Flash — FlashcardScreen
function FlashcardScreen({ course, onBack }) {
  const cards = [
    { id: 1, front: 'What is the powerhouse of the cell?', back: 'The mitochondria.' },
    { id: 2, front: 'What process converts glucose to pyruvate?', back: 'Glycolysis.' },
    { id: 3, front: 'What is the primary function of ribosomes?', back: 'Protein synthesis.' },
    { id: 4, front: 'What is osmosis?', back: 'Movement of water across a semi-permeable membrane from low to high solute concentration.' },
    { id: 5, front: 'Define homeostasis.', back: 'The ability of an organism to maintain a stable internal environment.' },
  ];
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [statuses, setStatuses] = React.useState({});

  const card = cards[index];
  const goNext = () => { setFlipped(false); setIndex(i => (i + 1) % cards.length); };
  const goPrev = () => { setFlipped(false); setIndex(i => (i - 1 + cards.length) % cards.length); };
  const mark = status => { setStatuses(s => ({ ...s, [card.id]: status })); goNext(); };

  const knownCount = Object.values(statuses).filter(s => s === 'known').length;

  return (
    <div style={fcStyles.container}>
      <div style={fcStyles.topRow}>
        <button style={fcStyles.backBtn} onClick={onBack}>← Back</button>
        <span style={fcStyles.counter}>{index + 1} / {cards.length}</span>
      </div>
      <div style={fcStyles.heading}>{course ? course.name : 'Flashcards'} · Review</div>

      {knownCount > 0 && (
        <div style={fcStyles.progressBar}>
          <div style={{ ...fcStyles.progressFill, width: `${(knownCount / cards.length) * 100}%` }}></div>
        </div>
      )}

      <div style={{ ...fcStyles.card, cursor: 'pointer' }} onClick={() => setFlipped(f => !f)}>
        <div style={fcStyles.cardLabel}>{flipped ? 'Answer' : 'Question'}</div>
        <div style={fcStyles.cardText}>{flipped ? card.back : card.front}</div>
        <div style={fcStyles.tapHint}>Tap to flip</div>
      </div>

      <div style={fcStyles.navRow}>
        <button style={fcStyles.navBtn} onClick={goPrev}>Previous</button>
        <button style={fcStyles.navBtn} onClick={goNext}>Next</button>
      </div>
      <div style={fcStyles.statusRow}>
        <button style={{ ...fcStyles.statusBtn, background: '#27ae60' }} onClick={() => mark('known')}>Known ✓</button>
        <button style={{ ...fcStyles.statusBtn, background: '#d97706' }} onClick={() => mark('review')}>Review ↩</button>
      </div>
    </div>
  );
}

const fcStyles = {
  container: { flex: 1, background: '#f5f7fb', padding: '20px', display: 'flex', flexDirection: 'column', minHeight: '100%', boxSizing: 'border-box' },
  topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  backBtn: { background: 'none', border: 'none', color: '#4361ee', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: 'Nunito, sans-serif', padding: 0 },
  counter: { fontSize: 13, fontWeight: 600, color: '#6b7280' },
  heading: { fontSize: 18, fontWeight: 800, color: '#1a1a2e', textAlign: 'center', marginBottom: 12 },
  progressBar: { height: 4, background: '#e5e7eb', borderRadius: 9999, marginBottom: 14, overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#2B7FFF,#27ae60)', borderRadius: 9999, transition: 'width 0.4s' },
  card: { flex: 1, background: '#fff', borderRadius: 18, padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', position: 'relative', minHeight: 180 },
  cardLabel: { fontSize: 12, fontWeight: 700, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 },
  cardText: { fontSize: 20, fontWeight: 700, color: '#1a1a2e', textAlign: 'center', lineHeight: 1.4 },
  tapHint: { position: 'absolute', bottom: 16, fontSize: 12, color: '#9ca3af' },
  navRow: { display: 'flex', gap: 10, marginTop: 16 },
  navBtn: { flex: 1, background: '#e5e7eb', border: 'none', borderRadius: 12, padding: '13px 0', fontWeight: 700, color: '#374151', fontSize: 14, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  statusRow: { display: 'flex', gap: 10, marginTop: 10 },
  statusBtn: { flex: 1, border: 'none', borderRadius: 12, padding: '14px 0', color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
};

Object.assign(window, { FlashcardScreen });
