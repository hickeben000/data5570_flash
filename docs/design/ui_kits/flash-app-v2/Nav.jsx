// Flash — Shared Nav (Sidebar for web, Bottom tabs for mobile)

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Courses', icon: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>` },
  { id: 'settings', label: 'Settings', icon: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>` },
];

function Sidebar({ active, onNav, onLogout, isMobile }) {
  if (isMobile) return null;
  return (
    <div style={sidebarSt.sidebar}>
      <div style={sidebarSt.logoArea}>
        <img src="../../assets/flash-logo.png" alt="Flash" style={{ height: 36, objectFit: 'contain' }} />
      </div>
      <nav style={sidebarSt.nav}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} style={{ ...sidebarSt.navItem, ...(active === item.id ? sidebarSt.navItemActive : {}) }} onClick={() => onNav(item.id)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active === item.id ? '#4361ee' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: item.icon }} />
            <span style={{ color: active === item.id ? '#4361ee' : '#64748b', fontWeight: active === item.id ? 700 : 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>
      <div style={sidebarSt.bottom}>
        <div style={sidebarSt.userRow}>
          <div style={sidebarSt.avatar}>JD</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Jane Doe</div>
            <div style={{ fontSize: 11, color: '#94a3b8' }}>jane@example.com</div>
          </div>
        </div>
        <button style={sidebarSt.logoutBtn} onClick={onLogout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log out
        </button>
      </div>
    </div>
  );
}

function BottomTabs({ active, onNav }) {
  return (
    <div style={sidebarSt.bottomTabs}>
      {NAV_ITEMS.map(item => (
        <button key={item.id} style={sidebarSt.tabBtn} onClick={() => onNav(item.id)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active === item.id ? '#4361ee' : '#94a3b8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: item.icon }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: active === item.id ? '#4361ee' : '#94a3b8', marginTop: 2 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

const sidebarSt = {
  sidebar: { width: 220, background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100%' },
  logoArea: { display: 'none' },
  nav: { flex: 1, padding: '20px 10px 12px', display: 'flex', flexDirection: 'column', gap: 2 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', fontFamily: 'Nunito, sans-serif', fontSize: 14, transition: 'background 0.15s' },
  navItemActive: { background: '#eef1ff' },
  bottom: { padding: '16px', borderTop: '1px solid #f1f5f9' },
  userRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2B7FFF,#1560F0)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, fontFamily: 'Nunito, sans-serif', fontWeight: 600, cursor: 'pointer', padding: '6px 0' },
  bottomTabs: { display: 'flex', background: '#fff', borderTop: '1px solid #e2e8f0', padding: '8px 0 4px' },
  tabBtn: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' },
};

Object.assign(window, { Sidebar, BottomTabs });
