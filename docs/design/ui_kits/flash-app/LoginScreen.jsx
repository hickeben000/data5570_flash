// Flash — LoginScreen
function LoginScreen({ onLogin, onGoRegister }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleLogin = () => {
    if (!username || !password) { setError('Please enter your username and password.'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin && onLogin(); }, 900);
  };

  return (
    <div style={loginStyles.container}>
      {/* Blue gradient hero with transparent logo */}
      <div style={loginStyles.hero}>
        <img src="../../assets/flash-logo.png" alt="Flash" style={{ height: 180, objectFit: 'contain' }} />
        <p style={loginStyles.subheading}>Study smarter, not harder</p>
      </div>

      {/* Form panel */}
      <div style={loginStyles.form}>
        {error && <div style={loginStyles.error}>{error}</div>}
        <input
          style={loginStyles.input}
          placeholder="Username"
          value={username}
          onChange={e => { setUsername(e.target.value); setError(''); }}
          autoComplete="username"
        />
        <input
          style={loginStyles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError(''); }}
        />
        <button style={loginStyles.button} onClick={handleLogin} disabled={loading}>
          {loading ? <span style={loginStyles.spinner}></span> : 'Log In'}
        </button>
        <button style={loginStyles.link} onClick={onGoRegister}>
          Don't have an account? Register
        </button>
      </div>
    </div>
  );
}

const loginStyles = {
  container: {
    flex: 1, display: 'flex', flexDirection: 'column',
    background: '#f5f7fb', minHeight: '100%', boxSizing: 'border-box',
  },
  hero: {
    background: '#ffffff',
    padding: '40px 24px 28px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
  },
  subheading: {
    fontSize: 15, textAlign: 'center', color: '#4361ee',
    margin: 0, fontFamily: 'Nunito, sans-serif', fontWeight: 700,
  },
  form: {
    flex: 1, padding: '28px 24px 32px', display: 'flex', flexDirection: 'column',
  },
  input: {
    background: '#fff', borderRadius: 12, padding: '14px 16px', fontSize: 16,
    marginBottom: 14, border: '1px solid #dfe4f1', width: '100%', boxSizing: 'border-box',
    fontFamily: 'Nunito, sans-serif', color: '#1a1a2e', outline: 'none',
  },
  button: {
    background: '#4361ee', borderRadius: 12, padding: '15px 0', fontSize: 16, fontWeight: 700,
    color: '#fff', border: 'none', width: '100%', cursor: 'pointer', marginTop: 4, marginBottom: 14,
    fontFamily: 'Nunito, sans-serif',
  },
  link: {
    background: 'none', border: 'none', color: '#4361ee', fontSize: 14, cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif', textAlign: 'center', width: '100%', padding: 0,
  },
  error: {
    color: '#c0392b', textAlign: 'center', marginBottom: 12, fontSize: 14,
    background: '#fdecea', borderRadius: 8, padding: '10px 14px',
  },
  spinner: {
    display: 'inline-block', width: 18, height: 18,
    border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.7s linear infinite',
  },
};

Object.assign(window, { LoginScreen });
