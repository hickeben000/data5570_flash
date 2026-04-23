// Flash — Settings Page

function SettingsPage({ onLogout }) {
  const [apiKey, setApiKey] = React.useState('sk-••••••••••••••••••••••••••');
  const [saved, setSaved] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const saveKey = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width: 44, height: 24, borderRadius: 12, background: on ? '#4361ee' : '#e2e8f0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }}></div>
    </div>
  );

  return (
    <div style={stSt.page}>
      {/* Profile hero */}
      <div style={stSt.hero}>
        <div style={stSt.avatar}>JD</div>
        <div>
          <div style={stSt.userName}>Jane Doe</div>
          <div style={stSt.userEmail}>jane@example.com</div>
        </div>
        <button style={stSt.editBtn}>Edit Profile</button>
      </div>

      <div style={stSt.body}>
        {/* API Key */}
        <div style={stSt.section}>
          <div style={stSt.sectionTitle}>OpenAI API Key</div>
          <div style={stSt.sectionDesc}>Your key is stored on-device only and never sent to our servers. Required to generate flashcards and quizzes.</div>
          <div style={stSt.apiKeyRow}>
            <input
              style={stSt.apiInput}
              type="password"
              value={apiKey}
              onChange={e => { setApiKey(e.target.value); setSaved(false); }}
              placeholder="sk-..."
            />
            <button style={{ ...stSt.saveBtn, background: saved ? '#22c55e' : '#4361ee' }} onClick={saveKey}>
              {saved ? '✓ Saved' : 'Save Key'}
            </button>
          </div>
          <div style={stSt.keyHint}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Get your key at platform.openai.com
          </div>
        </div>

        {/* Preferences */}
        <div style={stSt.section}>
          <div style={stSt.sectionTitle}>Preferences</div>
          <div style={stSt.prefCard}>
            {[
              ['Study Reminders', 'Daily notifications to keep you on track', notifications, () => setNotifications(n => !n)],
              ['Dark Mode', 'Coming soon', darkMode, () => setDarkMode(d => !d)],
            ].map(([label, desc, on, toggle]) => (
              <div key={label} style={stSt.prefRow}>
                <div>
                  <div style={stSt.prefLabel}>{label}</div>
                  <div style={stSt.prefDesc}>{desc}</div>
                </div>
                <Toggle on={on} onToggle={toggle} />
              </div>
            ))}
          </div>
        </div>

        {/* Account */}
        <div style={stSt.section}>
          <div style={stSt.sectionTitle}>Account</div>
          <div style={stSt.prefCard}>
            {[['Version', '1.0.0'], ['Build', 'data5570_flash@main'], ['Backend', 'Django REST API']].map(([k, v]) => (
              <div key={k} style={stSt.infoRow}>
                <span style={stSt.infoKey}>{k}</span>
                <span style={stSt.infoVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <button style={stSt.logoutBtn} onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  );
}

const stSt = {
  page: { flex: 1, overflowY: 'auto', background: '#f0f4ff' },
  hero: { background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '28px 40px', display: 'flex', alignItems: 'center', gap: 18 },
  avatar: { width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg,#2B7FFF,#1560F0)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, flexShrink: 0 },
  userName: { fontSize: 20, fontWeight: 800, color: '#0f172a' },
  userEmail: { fontSize: 13, color: '#64748b', marginTop: 2 },
  editBtn: { marginLeft: 'auto', background: '#f1f5f9', border: 'none', borderRadius: 10, padding: '8px 18px', fontSize: 13, fontWeight: 700, color: '#374151', fontFamily: 'Nunito, sans-serif', cursor: 'pointer' },
  body: { padding: '28px 40px', maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 28 },
  section: { display: 'flex', flexDirection: 'column', gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 800, color: '#0f172a' },
  sectionDesc: { fontSize: 13, color: '#64748b', lineHeight: 1.6 },
  apiKeyRow: { display: 'flex', gap: 10 },
  apiInput: { flex: 1, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 11, padding: '12px 16px', fontSize: 15, fontFamily: 'Nunito, sans-serif', color: '#0f172a', outline: 'none', boxSizing: 'border-box' },
  saveBtn: { color: '#fff', border: 'none', borderRadius: 11, padding: '12px 22px', fontSize: 14, fontWeight: 700, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 },
  keyHint: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' },
  prefCard: { background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' },
  prefRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' },
  prefLabel: { fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 },
  prefDesc: { fontSize: 12, color: '#94a3b8' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px', borderBottom: '1px solid #f1f5f9' },
  infoKey: { fontSize: 14, fontWeight: 600, color: '#374151' },
  infoVal: { fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 8, background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 12, padding: '13px 22px', fontWeight: 700, fontSize: 14, fontFamily: 'Nunito, sans-serif', cursor: 'pointer', alignSelf: 'flex-start' },
};

Object.assign(window, { SettingsPage });
