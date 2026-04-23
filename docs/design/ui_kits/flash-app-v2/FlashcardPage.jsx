// Flash — Flashcard Page with 3D flip animation

const FC_CARDS = [
  { id: 1, front: 'What is the powerhouse of the cell?', back: 'The mitochondria — organelles that generate ATP through cellular respiration.' },
  { id: 2, front: 'What process converts glucose into pyruvate?', back: 'Glycolysis — occurs in the cytoplasm and produces 2 ATP and 2 NADH per glucose molecule.' },
  { id: 3, front: 'Define osmosis.', back: 'The passive movement of water across a semi-permeable membrane from an area of low solute concentration to high solute concentration.' },
  { id: 4, front: 'What is the function of ribosomes?', back: 'Ribosomes synthesize proteins by translating messenger RNA (mRNA) sequences into amino acid chains.' },
  { id: 5, front: 'What are the four bases in DNA?', back: 'Adenine (A), Thymine (T), Guanine (G), and Cytosine (C). A pairs with T; G pairs with C.' },
];

function FlashcardPage({ course, onBack }) {
  const [index, setIndex] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const [statuses, setStatuses] = React.useState({});
  const [transitioning, setTransitioning] = React.useState(false);

  const card = FC_CARDS[index];
  const knownCount = Object.values(statuses).filter(s => s === 'known').length;
  const progress = ((index) / FC_CARDS.length) * 100;

  const navigate = (dir) => {
    if (transitioning) return;
    setTransitioning(true);
    setFlipped(false);
    setTimeout(() => {
      setIndex(i => (i + dir + FC_CARDS.length) % FC_CARDS.length);
      setTransitioning(false);
    }, 200);
  };

  const mark = (status) => {
    setStatuses(s => ({ ...s, [card.id]: status }));
    navigate(1);
  };

  const allDone = Object.keys(statuses).length === FC_CARDS.length;

  return (
    <div style={fcpSt.page}>
      {/* Top bar */}
      <div style={fcpSt.topBar}>
        <button style={fcpSt.backBtn} onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Back
        </button>
        <div style={fcpSt.topMeta}>
          <span style={fcpSt.deckTitle}>{course?.name || 'Biology 101'}</span>
          <span style={fcpSt.counter}>{index + 1} <span style={{ color: '#94a3b8' }}>/ {FC_CARDS.length}</span></span>
        </div>
        <div style={fcpSt.topStats}>
          <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 13 }}>✓ {knownCount} known</span>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 13 }}>↩ {Object.values(statuses).filter(s => s === 'review').length} review</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={fcpSt.progressTrack}>
        <div style={{ ...fcpSt.progressFill, width: `${progress}%` }}></div>
      </div>

      {/* Card area */}
      <div style={fcpSt.cardArea}>
        {allDone ? (
          <div style={fcpSt.doneCard}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Deck Complete!</div>
            <div style={{ fontSize: 15, color: '#64748b', marginBottom: 28 }}>{knownCount} of {FC_CARDS.length} cards marked as known.</div>
            <button style={fcpSt.restartBtn} onClick={() => { setStatuses({}); setIndex(0); setFlipped(false); }}>Restart Deck</button>
            <button style={{ ...fcpSt.restartBtn, background: '#f1f5f9', color: '#374151', marginTop: 10 }} onClick={onBack}>Back to Course</button>
          </div>
        ) : (
          <div style={{ ...fcpSt.cardWrap, opacity: transitioning ? 0 : 1, transition: 'opacity 0.2s' }}>
            {/* The 3D flip card */}
            <div style={fcpSt.perspective} onClick={() => !transitioning && setFlipped(f => !f)}>
              <div style={{ ...fcpSt.cardInner, transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {/* Front */}
                <div style={fcpSt.cardFace}>
                  <div style={fcpSt.cardEyebrow}>Question</div>
                  <div style={fcpSt.cardText}>{card.front}</div>
                  <div style={fcpSt.tapHint}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11.5V14a6 6 0 0 0 12 0v-2.5"/><path d="M19 11.5V7a2 2 0 0 0-4 0v4.5"/><path d="M15 11.5V5a2 2 0 0 0-4 0v6.5"/><path d="M11 11.5V7a2 2 0 0 0-4 0v6.5a6 6 0 0 0 12 0"/></svg>
                    Click to reveal answer
                  </div>
                </div>
                {/* Back */}
                <div style={{ ...fcpSt.cardFace, ...fcpSt.cardBack }}>
                  <div style={{ ...fcpSt.cardEyebrow, color: '#22c55e' }}>Answer</div>
                  <div style={fcpSt.cardText}>{card.back}</div>
                  <div style={fcpSt.tapHint}>Click to flip back</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={fcpSt.navRow}>
              <button style={fcpSt.navBtn} onClick={() => navigate(-1)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Previous
              </button>
              <div style={fcpSt.dotRow}>
                {FC_CARDS.map((_, i) => (
                  <div key={i} style={{ ...fcpSt.dot, background: i === index ? '#4361ee' : i < index ? '#bfdbfe' : '#e2e8f0', transform: i === index ? 'scale(1.3)' : 'scale(1)' }}></div>
                ))}
              </div>
              <button style={fcpSt.navBtn} onClick={() => navigate(1)}>
                Next
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* Action buttons */}
            {flipped && (
              <div style={fcpSt.actionRow}>
                <button style={fcpSt.reviewBtn} onClick={() => mark('review')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.61"/></svg>
                  Still Learning
                </button>
                <button style={fcpSt.knownBtn} onClick={() => mark('known')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Got It
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const fcpSt = {
  page: { flex: 1, display: 'flex', flexDirection: 'column', background: '#f0f4ff', overflow: 'hidden' },
  topBar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', background: '#fff', borderBottom: '1px solid #e2e8f0', flexShrink: 0 },
  backBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#4361ee', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', padding: 0 },
  topMeta: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  deckTitle: { fontSize: 15, fontWeight: 800, color: '#0f172a' },
  counter: { fontSize: 22, fontWeight: 900, color: '#4361ee' },
  topStats: { display: 'flex', gap: 16 },
  progressTrack: { height: 4, background: '#e2e8f0', flexShrink: 0 },
  progressFill: { height: '100%', background: 'linear-gradient(90deg,#4361ee,#2B7FFF)', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)', borderRadius: '0 9999px 9999px 0' },
  cardArea: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', overflow: 'hidden' },
  cardWrap: { width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 },
  perspective: { width: '100%', perspective: '1200px', cursor: 'pointer', userSelect: 'none' },
  cardInner: { position: 'relative', width: '100%', height: 320, transformStyle: 'preserve-3d', transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)' },
  cardFace: { position: 'absolute', inset: 0, background: '#fff', borderRadius: 24, padding: '40px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden', boxShadow: '0 8px 40px rgba(67,97,238,0.14), 0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' },
  cardBack: { transform: 'rotateY(180deg)', background: 'linear-gradient(150deg,#f0f4ff 0%,#fff 100%)' },
  cardEyebrow: { fontSize: 11, fontWeight: 700, color: '#4361ee', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 },
  cardText: { fontSize: 22, fontWeight: 700, color: '#0f172a', textAlign: 'center', lineHeight: 1.5, flex: 1, display: 'flex', alignItems: 'center' },
  tapHint: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', marginTop: 20 },
  navRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  navBtn: { display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '10px 20px', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', color: '#374151', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  dotRow: { display: 'flex', gap: 6, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: '50%', transition: 'all 0.2s' },
  actionRow: { display: 'flex', gap: 14, width: '100%', animation: 'fadeSlideUp 0.25s ease' },
  reviewBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', border: '2px solid #f59e0b', color: '#d97706', borderRadius: 14, padding: '15px 0', fontWeight: 800, fontSize: 15, fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  knownBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff', border: 'none', borderRadius: 14, padding: '15px 0', fontWeight: 800, fontSize: 15, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,197,94,0.3)' },
  doneCard: { background: '#fff', borderRadius: 24, padding: '48px 40px', textAlign: 'center', maxWidth: 400, boxShadow: '0 8px 40px rgba(67,97,238,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  restartBtn: { width: '100%', background: 'linear-gradient(135deg,#4361ee,#2B7FFF)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 0', fontWeight: 800, fontSize: 15, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', boxShadow: '0 4px 14px rgba(67,97,238,0.3)' },
};

Object.assign(window, { FlashcardPage });
