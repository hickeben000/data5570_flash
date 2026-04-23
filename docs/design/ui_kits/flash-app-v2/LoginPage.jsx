// Flash — Login & Register Pages

function LoginPage({ onLogin, onGoRegister, isMobile }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handle = () => {
    if (!username || !password) { setError('Please fill in all fields.'); return; }
    setError(''); setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 900);
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* Left panel — white with big centered logo */}
      {!isMobile && (
        <div style={authSt.leftPanel}>
          <img src="../../assets/flash-logo.png" alt="Flash" style={{ height: 160, objectFit: 'contain', marginBottom: 36 }} />
          <div style={authSt.heroText}>Learn in a flash.</div>
          <div style={authSt.heroSub}>Upload your notes, textbooks, or assignments — and get personalized flashcards and quizzes in seconds.</div>
          <div style={authSt.features}>
            {['AI-generated flashcards', 'Auto-graded quizzes', 'Instant feedback', 'Any subject, any level'].map(f => (
              <div key={f} style={authSt.featureRow}>
                <div style={authSt.featureDot}></div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Right panel — blue gradient bg with white form card */}
      <div style={authSt.rightPanel}>
        {isMobile && <img src="../../assets/flash-logo.png" alt="Flash" style={{ height: 100, objectFit: 'contain', marginBottom: 24 }} />}
        <div style={authSt.formCard}>
          <div style={authSt.formTitle}>Welcome back</div>
          <div style={authSt.formSub}>Sign in to continue studying</div>
          {error && <div style={authSt.error}>{error}</div>}
          <label style={authSt.label}>Username</label>
          <input style={authSt.input} placeholder="your_username" value={username} onChange={e => { setUsername(e.target.value); setError(''); }} />
          <label style={authSt.label}>Password</label>
          <input style={authSt.input} type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} />
          <button style={{ ...authSt.btn, opacity: loading ? 0.75 : 1 }} onClick={handle} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <div style={authSt.switchRow}>
            Don't have an account?{' '}
            <button style={authSt.linkBtn} onClick={onGoRegister}>Create one</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ onRegister, onGoLogin, isMobile }) {
  const [u, setU] = React.useState('');
  const [p, setP] = React.useState('');
  const handle = () => { if (u && p) onRegister(); };
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {!isMobile && (
        <div style={authSt.leftPanel}>
          <img src="../../assets/flash-logo.png" alt="Flash" style={{ height: 160, objectFit: 'contain', marginBottom: 36 }} />
          <div style={authSt.heroText}>Start studying smarter today.</div>
          <div style={authSt.heroSub}>Create your free account and transform how you learn.</div>
        </div>
      )}
      <div style={authSt.rightPanel}>
        {isMobile && <img src="../../assets/flash-logo.png" alt="Flash" style={{ height: 100, objectFit: 'contain', marginBottom: 24 }} />}
        <div style={authSt.formCard}>
          <div style={authSt.formTitle}>Create account</div>
          <div style={authSt.formSub}>Join Flash and learn in a flash</div>
          <label style={authSt.label}>Username</label>
          <input style={authSt.input} placeholder="choose_a_username" value={u} onChange={e => setU(e.target.value)} />
          <label style={authSt.label}>Password</label>
          <input style={authSt.input} type="password" placeholder="••••••••" value={p} onChange={e => setP(e.target.value)} />
          <button style={authSt.btn} onClick={handle}>Create Account</button>
          <div style={authSt.switchRow}>
            Already have an account?{' '}
            <button style={authSt.linkBtn} onClick={onGoLogin}>Sign in</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const authSt = {
  /* Left — white, logo centered */
  leftPanel: {
    width: '45%', background: '#ffffff', flexShrink: 0,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 56px',
  },
  heroText: { fontSize: 34, fontWeight: 900, color: '#2B7FFF', lineHeight: 1.2, marginBottom: 14, textAlign: 'center' },
  heroSub: { fontSize: 15, color: '#4361ee', lineHeight: 1.7, marginBottom: 36, textAlign: 'center', maxWidth: 320 },
  features: { display: 'flex', flexDirection: 'column', gap: 14, width: '100%', maxWidth: 300 },
  featureRow: { display: 'flex', alignItems: 'center', gap: 12, color: '#4361ee', fontSize: 15, fontWeight: 600 },
  featureDot: { width: 8, height: 8, borderRadius: '50%', background: '#4361ee', flexShrink: 0 },

  /* Right — blue gradient bg, white form card */
  rightPanel: {
    flex: 1, background: 'linear-gradient(150deg, #1a56db 0%, #1560F0 40%, #2B7FFF 100%)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px',
  },
  formCard: { background: '#fff', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.2)' },
  formTitle: { fontSize: 26, fontWeight: 800, color: '#0f172a', marginBottom: 6 },
  formSub: { fontSize: 14, color: '#64748b', marginBottom: 28 },
  label: { display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 },
  input: { display: 'block', width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '12px 14px', fontSize: 15, fontFamily: 'Nunito, sans-serif', color: '#0f172a', outline: 'none', marginBottom: 18, boxSizing: 'border-box' },
  btn: { display: 'block', width: '100%', background: 'linear-gradient(135deg,#4361ee,#2B7FFF)', color: '#fff', border: 'none', borderRadius: 12, padding: '14px 0', fontWeight: 800, fontSize: 16, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', marginTop: 4, marginBottom: 20, boxShadow: '0 4px 14px rgba(67,97,238,0.35)' },
  switchRow: { textAlign: 'center', fontSize: 14, color: '#64748b' },
  linkBtn: { background: 'none', border: 'none', color: '#4361ee', fontWeight: 700, fontSize: 14, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', padding: 0 },
  error: { background: '#fef2f2', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16, fontWeight: 600 },
};

Object.assign(window, { LoginPage, RegisterPage });
