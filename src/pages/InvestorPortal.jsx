import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

/*
 * ═══════════════════════════════════════════════════════════════
 *  ELEVENTHHOUSE INVESTOR PORTAL + ADMIN DASHBOARD
 *  Supabase-powered · Real-time · Role-based
 * ═══════════════════════════════════════════════════════════════
 */

// ─── CONFIGURATION ──────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_INVESTOR_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_INVESTOR_SUPABASE_ANON_KEY;
const SEND_INVITE_URL = ""; // Supabase Edge Function URL for sending invite emails
const COMPANY_NAME = "EleventhHouse LLC";
const SAFE_TERMS = { valuation_cap: 1500000, discount_rate: 15, mfn: true, pro_rata: false, min_investment: 2500, conversion_trigger: 250000 };
const FOUNDER_AUTH_ID = "6a29ed5a-3ebd-43ac-afe7-f4e04db60c10";

// ─── SUPABASE CLIENT ────────────────────────────────────────
class SupabaseClient {
  constructor(url, key) {
    this.url = url;
    this.key = key;
    this.accessToken = null;
    this.user = null;
  }

  headers() {
    const h = { "apikey": this.key, "Content-Type": "application/json" };
    if (this.accessToken) h["Authorization"] = `Bearer ${this.accessToken}`;
    return h;
  }

  async request(path, opts = {}) {
    const res = await fetch(`${this.url}${path}`, { ...opts, headers: { ...this.headers(), ...opts.headers } });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || err.msg || res.statusText);
    }
    return res.json();
  }

  async signIn(email, password) {
    const data = await this.request("/auth/v1/token?grant_type=password", {
      method: "POST", body: JSON.stringify({ email, password })
    });
    this.accessToken = data.access_token;
    this.user = data.user;
    localStorage.setItem("eh_token", data.access_token);
    localStorage.setItem("eh_refresh", data.refresh_token);
    localStorage.setItem("eh_user", JSON.stringify(data.user));
    return data;
  }

  async signUp(email, password, metadata = {}) {
    const data = await this.request("/auth/v1/signup", {
      method: "POST", body: JSON.stringify({ email, password, data: metadata })
    });
    if (data.access_token) {
      this.accessToken = data.access_token;
      this.user = data.user;
      localStorage.setItem("eh_token", data.access_token);
      localStorage.setItem("eh_user", JSON.stringify(data.user));
    }
    return data;
  }

  async refreshSession() {
    const refreshToken = localStorage.getItem("eh_refresh");
    if (!refreshToken) return null;
    try {
      const data = await this.request("/auth/v1/token?grant_type=refresh_token", {
        method: "POST", body: JSON.stringify({ refresh_token: refreshToken })
      });
      this.accessToken = data.access_token;
      this.user = data.user;
      localStorage.setItem("eh_token", data.access_token);
      localStorage.setItem("eh_refresh", data.refresh_token);
      localStorage.setItem("eh_user", JSON.stringify(data.user));
      return data;
    } catch { return null; }
  }

  signOut() {
    this.accessToken = null;
    this.user = null;
    localStorage.removeItem("eh_token");
    localStorage.removeItem("eh_refresh");
    localStorage.removeItem("eh_user");
  }

  restoreSession() {
    const token = localStorage.getItem("eh_token");
    const user = localStorage.getItem("eh_user");
    if (token && user) {
      this.accessToken = token;
      this.user = JSON.parse(user);
      return true;
    }
    return false;
  }

  async select(table, { columns = "*", filters = {}, order, limit, eq, neq, in: inFilter } = {}) {
    let path = `/rest/v1/${table}?select=${columns}`;
    Object.entries(filters).forEach(([k, v]) => { path += `&${k}=eq.${v}`; });
    if (eq) Object.entries(eq).forEach(([k, v]) => { path += `&${k}=eq.${v}`; });
    if (neq) Object.entries(neq).forEach(([k, v]) => { path += `&${k}=neq.${v}`; });
    if (inFilter) Object.entries(inFilter).forEach(([k, v]) => { path += `&${k}=in.(${v.join(",")})`; });
    if (order) path += `&order=${order}`;
    if (limit) path += `&limit=${limit}`;
    return this.request(path, { headers: { "Prefer": "return=representation" } });
  }

  async insert(table, data) {
    return this.request(`/rest/v1/${table}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Prefer": "return=representation" }
    });
  }

  async update(table, data, filters = {}) {
    let path = `/rest/v1/${table}?`;
    Object.entries(filters).forEach(([k, v]) => { path += `${k}=eq.${v}&`; });
    return this.request(path, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: { "Prefer": "return=representation" }
    });
  }

  async delete(table, filters = {}) {
    let path = `/rest/v1/${table}?`;
    Object.entries(filters).forEach(([k, v]) => { path += `${k}=eq.${v}&`; });
    return this.request(path, { method: "DELETE" });
  }

  async rpc(fn, params = {}) {
    return this.request(`/rest/v1/rpc/${fn}`, {
      method: "POST", body: JSON.stringify(params)
    });
  }

  async uploadFile(bucket, path, file) {
    const res = await fetch(`${this.url}/storage/v1/object/${bucket}/${path}`, {
      method: "POST",
      headers: { "apikey": this.key, "Authorization": `Bearer ${this.accessToken}` },
      body: file
    });
    return res.json();
  }

  getFileUrl(bucket, path) {
    return `${this.url}/storage/v1/object/public/${bucket}/${path}`;
  }

  getSignedUrl(bucket, path) {
    return this.request(`/storage/v1/object/sign/${bucket}/${path}`, {
      method: "POST", body: JSON.stringify({ expiresIn: 3600 })
    });
  }
}

const supabase = new SupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── CONTEXT ────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

// ─── THEME ──────────────────────────────────────────────────
const T = {
  bg: "#060A13", bgCard: "#0C1322", bgHover: "#111B2E", bgSurface: "#141E30",
  border: "#1C2740", borderHi: "#253354", borderAccent: "#1E3A5F",
  text: "#E2E8F0", textSec: "#94A3B8", textDim: "#64748B", textGhost: "#475569",
  accent: "#38BDF8", accentDim: "rgba(56,189,248,0.08)", accentGlow: "rgba(56,189,248,0.2)",
  green: "#10B981", greenDim: "rgba(16,185,129,0.08)",
  amber: "#F59E0B", amberDim: "rgba(245,158,11,0.08)",
  red: "#EF4444", redDim: "rgba(239,68,68,0.08)",
  purple: "#8B5CF6", purpleDim: "rgba(139,92,246,0.08)",
  pink: "#EC4899", pinkDim: "rgba(236,72,153,0.08)",
};

const font = "'DM Sans', system-ui, sans-serif";
const mono = "'JetBrains Mono', 'Space Mono', monospace";
const fontLink = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";

// ─── ICONS ──────────────────────────────────────────────────
const I = {
  logo: <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="7" fill="#0A1628"/><path d="M8 16L16 8L24 16L16 24Z" stroke="#38BDF8" strokeWidth="2" fill="none"/><circle cx="16" cy="16" r="3" fill="#38BDF8"/></svg>,
  grid: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  bar: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
  file: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>,
  pen: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>,
  users: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  send: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>,
  settings: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  clock: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  shield: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  plus: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  check: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>,
  x: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  dl: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>,
  eye: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  mail: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  out: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  arrow: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  upload: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  refresh: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
  dollar: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
};

// ─── SHARED UI ──────────────────────────────────────────────
const Btn = ({ children, variant = "default", size = "md", disabled, onClick, style: sx, ...rest }) => {
  const base = { display: "inline-flex", alignItems: "center", gap: 7, border: "none", borderRadius: 9, fontFamily: font, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.15s", opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap" };
  const sizes = { sm: { padding: "7px 13px", fontSize: 12 }, md: { padding: "10px 18px", fontSize: 13 }, lg: { padding: "13px 24px", fontSize: 14 } };
  const variants = {
    default: { background: T.bgSurface, color: T.textSec, border: `1px solid ${T.border}` },
    primary: { background: `linear-gradient(135deg, ${T.accent}, #2196F3)`, color: "#fff" },
    success: { background: `linear-gradient(135deg, ${T.green}, #059669)`, color: "#fff" },
    danger: { background: T.redDim, color: T.red, border: `1px solid rgba(239,68,68,0.2)` },
    ghost: { background: "transparent", color: T.textDim },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant], ...sx }} {...rest}>{children}</button>;
};

const Badge = ({ children, color = T.accent, bg }) => (
  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 5, background: bg || `${color}14`, color, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{children}</span>
);

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", color: T.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>}
    <input {...props} style={{ width: "100%", padding: "11px 14px", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 9, color: T.text, fontSize: 14, fontFamily: font, outline: "none", boxSizing: "border-box", transition: "border 0.2s", ...props.style }}
      onFocus={e => { e.target.style.borderColor = T.accent; props.onFocus?.(e); }}
      onBlur={e => { e.target.style.borderColor = T.border; props.onBlur?.(e); }}
    />
  </div>
);

const Card = ({ children, style: sx, onClick, hoverable }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hoverable && setHov(true)} onMouseLeave={() => hoverable && setHov(false)}
      style={{ background: hov ? T.bgHover : T.bgCard, border: `1px solid ${hov ? T.borderHi : T.border}`, borderRadius: 12, padding: 24, transition: "all 0.15s", cursor: onClick ? "pointer" : "default", ...sx }}>
      {children}
    </div>
  );
};

const Stat = ({ label, value, sub, icon, color = T.accent }) => (
  <Card style={{ flex: 1, minWidth: 170 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 10, color: T.textDim, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: T.text, fontFamily: mono, letterSpacing: "-0.02em" }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: T.textDim, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
    </div>
  </Card>
);

const Modal = ({ open, onClose, title, children, width = 520 }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}/>
      <div onClick={e => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: width, maxHeight: "90vh", overflowY: "auto", background: T.bgCard, border: `1px solid ${T.borderHi}`, borderRadius: 16, padding: 28, animation: "modalIn 0.2s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textDim, cursor: "pointer", padding: 4 }}>{I.x}</button>
        </div>
        {children}
      </div>
    </div>
  );
};

const EmptyState = ({ icon, title, sub }) => (
  <div style={{ textAlign: "center", padding: "48px 20px" }}>
    <div style={{ color: T.textGhost, marginBottom: 12, opacity: 0.5 }}>{icon}</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: T.textDim, marginBottom: 6 }}>{title}</div>
    <div style={{ fontSize: 13, color: T.textGhost }}>{sub}</div>
  </div>
);

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: T.green, error: T.red, info: T.accent };
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", background: T.bgCard, border: `1px solid ${colors[type]}33`, borderRadius: 10, color: colors[type], fontSize: 13, fontWeight: 500, fontFamily: font, boxShadow: `0 8px 32px rgba(0,0,0,0.4)`, animation: "modalIn 0.2s ease" }}>
      {type === "success" ? I.check : type === "error" ? I.x : I.shield}
      <span style={{ color: T.text }}>{message}</span>
    </div>
  );
};

// ─── DATA HOOKS ─────────────────────────────────────────────
function useSupabase(table, opts = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await supabase.select(table, opts);
      setData(rows || []);
      setError(null);
    } catch (e) {
      setError(e.message);
      setData([]);
    }
    setLoading(false);
  }, [table, JSON.stringify(opts)]);

  useEffect(() => { fetchData(); }, [fetchData]);
  return { data, loading, error, refetch: fetchData };
}

// ─── AUTH SCREEN ────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true); setError("");
    try {
      if (isSignUp) {
        const res = await supabase.signUp(email, password, { first_name: firstName, last_name: lastName });
        if (res.user) {
          await supabase.insert("investors", { auth_user_id: res.user.id, email, full_name: `${firstName} ${lastName}`, status: "active", onboarded_at: new Date().toISOString() });
          await supabase.insert("activity_log", { actor_id: res.user.id, actor_type: "investor", action: "Account created", resource_type: "system" }).catch(() => {});
          onLogin(res.user);
        }
      } else {
        const res = await supabase.signIn(email, password);
        await supabase.insert("activity_log", { actor_id: res.user.id, actor_type: "investor", action: "Signed in", resource_type: "system" }).catch(() => {});
        onLogin(res.user);
      }
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: `radial-gradient(ellipse at 30% 20%, #0D1B2A 0%, ${T.bg} 70%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font, padding: 20 }}>
      <link href={fontLink} rel="stylesheet"/>
      <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>{I.logo}<span style={{ fontSize: 20, fontWeight: 700, color: T.text }}>EleventhHouse</span></div>
          <div style={{ fontSize: 13, color: T.textDim }}>Investor Portal</div>
        </div>
        <Card>
          <h2 style={{ color: T.text, fontSize: 19, fontWeight: 700, margin: "0 0 4px" }}>{isSignUp ? "Create Account" : "Sign In"}</h2>
          <p style={{ color: T.textDim, fontSize: 13, margin: "0 0 20px" }}>{isSignUp ? "Set up your investor account" : "Access your investor dashboard"}</p>
          {error && <div style={{ background: T.redDim, border: `1px solid ${T.red}33`, borderRadius: 8, padding: "9px 13px", marginBottom: 14, color: T.red, fontSize: 12 }}>{error}</div>}
          {isSignUp && (
            <div style={{ display: "flex", gap: 10 }}>
              <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First"/>
              <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last"/>
            </div>
          )}
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/>
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <Btn variant="primary" size="lg" onClick={handleSubmit} disabled={loading} style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
            {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
          </Btn>
          <p style={{ textAlign: "center", color: T.textDim, fontSize: 13, marginTop: 18, marginBottom: 0, cursor: "pointer" }} onClick={() => { setIsSignUp(!isSignUp); setError(""); }}>
            {isSignUp ? "Already have an account? " : "Need an account? "}
            <span style={{ color: T.accent, fontWeight: 600 }}>{isSignUp ? "Sign in" : "Sign up"}</span>
          </p>
        </Card>
        <p style={{ textAlign: "center", color: T.textGhost, fontSize: 11, marginTop: 20 }}>Secured by Supabase · {COMPANY_NAME} © 2026</p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ────────────────────────────────────────────────
function Sidebar({ nav, active, setActive, user, role, onLogout }) {
  return (
    <div style={{ width: 224, minHeight: "100vh", background: T.bgCard, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "18px 18px 16px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          {I.logo}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>EleventhHouse</div>
            <div style={{ fontSize: 10, color: role === "admin" ? T.amber : T.accent, fontWeight: 700, letterSpacing: "0.04em" }}>{role === "admin" ? "ADMIN PANEL" : "INVESTOR"}</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 10px" }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)}
            style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 11px", marginBottom: 2, border: "none", borderRadius: 8, background: active === item.id ? T.accentDim : "transparent", color: active === item.id ? T.accent : T.textDim, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.12s", textAlign: "left", fontFamily: font }}>
            {item.icon}{item.label}
            {item.badge ? <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 6, background: T.amberDim, color: T.amber }}>{item.badge}</span> : null}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ padding: "8px 11px", marginBottom: 6 }}>
          <div style={{ fontSize: 13, color: T.text, fontWeight: 600 }}>{user?.user_metadata?.full_name || user?.email?.split("@")[0]}</div>
          <div style={{ fontSize: 11, color: T.textGhost, marginTop: 1 }}>{user?.email}</div>
        </div>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 7, width: "100%", padding: "7px 11px", border: "none", borderRadius: 7, background: "transparent", color: T.textGhost, fontSize: 12, cursor: "pointer", fontFamily: font }}>{I.out} Sign Out</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ADMIN VIEWS
// ═══════════════════════════════════════════════════════════

function AdminOverview({ investors, safes, documents, setActive }) {
  const totalRaised = safes.filter(s => s.status === "funded").reduce((a, s) => a + Number(s.investment_amount), 0);
  const pendingSigs = documents.filter(d => d.status === "pending_signature").length;
  const activeInvestors = investors.filter(i => i.status === "active").length;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Admin Dashboard</h1>
        <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Manage investors, SAFEs, and documents for {COMPANY_NAME}</p>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <Stat label="Total Investors" value={investors.length} sub={`${activeInvestors} active`} icon={I.users} color={T.accent}/>
        <Stat label="SAFEs Issued" value={safes.length} sub={`$${totalRaised.toLocaleString()} funded`} icon={I.dollar} color={T.green}/>
        <Stat label="Documents" value={documents.length} sub={`${pendingSigs} pending sig`} icon={I.file} color={T.purple}/>
        <Stat label="Round Target" value="$30K" sub="$1.5M cap" icon={I.shield} color={T.amber}/>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 16px" }}>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "Invite New Investor", icon: I.plus, view: "investors", color: T.accent },
              { label: "Send SAFE for Signing", icon: I.send, view: "send_safe", color: T.green },
              { label: "Upload Document", icon: I.upload, view: "manage_docs", color: T.purple },
              { label: "View Cap Table", icon: I.bar, view: "cap_table", color: T.amber },
            ].map(a => (
              <button key={a.view} onClick={() => setActive(a.view)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 9, color: a.color, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: font, textAlign: "left", transition: "all 0.12s", width: "100%" }}>
                {a.icon}<span style={{ flex: 1 }}>{a.label}</span>{I.arrow}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 16px" }}>SAFE Round Progress</h3>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: T.textDim }}>Funded</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: mono }}>${totalRaised.toLocaleString()} / $30,000</span>
            </div>
            <div style={{ height: 8, background: T.bgSurface, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min((totalRaised / 30000) * 100, 100)}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.green})`, borderRadius: 4, transition: "width 0.5s" }}/>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { l: "Valuation Cap", v: "$1.5M" }, { l: "Discount", v: "15%" },
              { l: "MFN Clause", v: "Yes" }, { l: "Min Investment", v: "$2,500" },
            ].map(x => (
              <div key={x.l} style={{ padding: "10px 12px", background: T.bgSurface, borderRadius: 7 }}>
                <div style={{ fontSize: 10, color: T.textGhost, fontWeight: 600, textTransform: "uppercase", marginBottom: 3 }}>{x.l}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: mono }}>{x.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function AdminInvestors({ investors, refetch }) {
  const [showInvite, setShowInvite] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationship, setRelationship] = useState("family");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const handleInvite = async () => {
    if (!email || !firstName || !lastName) return;
    setSending(true);
    try {
      await supabase.insert("investors", {
        email, full_name: `${firstName} ${lastName}`,
        relationship, status: "invited", investor_type: "non_accredited"
      });
      if (SEND_INVITE_URL) {
        await fetch(SEND_INVITE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, first_name: firstName, portal_url: `${window.location.origin}/investor` })
        });
      }
      await supabase.insert("activity_log", { actor_id: supabase.user?.id, actor_type: "founder", action: `Invited investor: ${firstName} ${lastName}`, resource_type: "investor" }).catch(() => {});
      setToast({ message: `Invitation sent to ${email}`, type: "success" });
      setShowInvite(false);
      setEmail(""); setFirstName(""); setLastName("");
      refetch();
    } catch (e) { setToast({ message: e.message, type: "error" }); }
    setSending(false);
  };

  const statusColor = { invited: T.amber, active: T.green, inactive: T.textGhost };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Investors</h1>
          <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>{investors.length} total investors</p>
        </div>
        <Btn variant="primary" onClick={() => setShowInvite(true)}>{I.plus} Invite Investor</Btn>
      </div>

      {investors.length === 0 ? (
        <Card><EmptyState icon={I.users} title="No investors yet" sub="Invite your first investor to get started"/></Card>
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Name", "Email", "Type", "Relationship", "Status", "Invited"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.textGhost, textTransform: "uppercase", letterSpacing: "0.05em", background: T.bgSurface }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {investors.map((inv, i) => (
                <tr key={inv.id} style={{ borderBottom: i < investors.length - 1 ? `1px solid ${T.border}` : "none" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: T.text }}>{inv.full_name}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: T.textSec }}>{inv.email}</td>
                  <td style={{ padding: "12px 16px" }}><Badge color={T.accent}>{inv.investor_type || "non-accredited"}</Badge></td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: T.textDim }}>{inv.relationship || "—"}</td>
                  <td style={{ padding: "12px 16px" }}><Badge color={statusColor[inv.status] || T.textDim}>{inv.status}</Badge></td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: T.textGhost }}>{inv.invited_at ? new Date(inv.invited_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Investor">
        <Input label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane"/>
        <Input label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe"/>
        <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com"/>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: T.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Relationship</label>
          <select value={relationship} onChange={e => setRelationship(e.target.value)}
            style={{ width: "100%", padding: "11px 14px", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 9, color: T.text, fontSize: 14, fontFamily: font, outline: "none" }}>
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="advisor">Advisor</option>
          </select>
        </div>
        <div style={{ padding: "12px 16px", background: T.accentDim, borderRadius: 8, marginBottom: 20, fontSize: 12, color: T.textSec, lineHeight: 1.6 }}>
          An invitation email will be sent with a link to create their portal account.
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={() => setShowInvite(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={handleInvite} disabled={sending || !email || !firstName}>{sending ? "Sending..." : "Send Invitation"}</Btn>
        </div>
      </Modal>
      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
    </div>
  );
}

function AdminSendSafe({ investors, safes, refetchSafes }) {
  const [selectedInvestor, setSelectedInvestor] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  const eligibleInvestors = investors.filter(inv => !safes.find(s => s.investor_id === inv.id && s.status !== "cancelled"));

  const handleSend = async () => {
    if (!selectedInvestor || !amount || Number(amount) < SAFE_TERMS.min_investment) return;
    setSending(true);
    try {
      await supabase.insert("safe_instruments", {
        investor_id: selectedInvestor,
        investment_amount: Number(amount),
        valuation_cap: SAFE_TERMS.valuation_cap,
        discount_rate: SAFE_TERMS.discount_rate,
        mfn_clause: SAFE_TERMS.mfn,
        pro_rata_rights: SAFE_TERMS.pro_rata,
        conversion_trigger_amount: SAFE_TERMS.conversion_trigger,
        status: "pending"
      });
      const inv = investors.find(i => i.id === selectedInvestor);
      await supabase.insert("documents", {
        title: `SAFE Agreement — ${inv?.full_name}`,
        doc_type: "safe",
        status: "pending_signature",
        requires_signature: true,
        file_path: `safes/${selectedInvestor}_safe.pdf`,
        file_name: `EH_SAFE_${inv?.full_name?.replace(/\s/g,'_')}_${Date.now()}.pdf`,
        visibility: "specific_investors",
        uploaded_by: supabase.user?.id,
        description: `SAFE for $${Number(amount).toLocaleString()} at $${(SAFE_TERMS.valuation_cap / 1e6).toFixed(1)}M cap, ${SAFE_TERMS.discount_rate}% discount.`
      });
      const docs = await supabase.select("documents", { order: "created_at.desc", limit: 1 });
      if (docs?.[0]) {
        await supabase.insert("document_access", {
          document_id: docs[0].id,
          investor_id: selectedInvestor,
          can_view: true,
          can_sign: true
        });
      }
      await supabase.insert("activity_log", {
        actor_id: supabase.user?.id, actor_type: "founder",
        action: `Sent SAFE to ${inv?.full_name} for $${Number(amount).toLocaleString()}`,
        resource_type: "safe"
      }).catch(() => {});
      setToast({ message: `SAFE sent to ${inv?.full_name}`, type: "success" });
      setSelectedInvestor(""); setAmount("");
      refetchSafes();
    } catch (e) { setToast({ message: e.message, type: "error" }); }
    setSending(false);
  };

  const statusColors = { pending: T.amber, signed: T.accent, funded: T.green, converted: T.purple, cancelled: T.red };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>SAFE Management</h1>
        <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Issue and track SAFE instruments</p>
      </div>
      <Card style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: "0 0 16px" }}>Issue New SAFE</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", color: T.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Investor</label>
            <select value={selectedInvestor} onChange={e => setSelectedInvestor(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 9, color: T.text, fontSize: 14, fontFamily: font, outline: "none", boxSizing: "border-box" }}>
              <option value="">Select investor...</option>
              {eligibleInvestors.map(inv => (
                <option key={inv.id} value={inv.id}>{inv.full_name} ({inv.email})</option>
              ))}
            </select>
          </div>
          <div style={{ position: "relative" }}>
            <Input label="Investment Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="10000" style={{ paddingLeft: 28 }}/>
            <span style={{ position: "absolute", left: 14, top: 33, color: T.textGhost, fontSize: 14, fontWeight: 600 }}>$</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
          {[
            { l: "Valuation Cap", v: `$${(SAFE_TERMS.valuation_cap / 1e6).toFixed(1)}M` },
            { l: "Discount", v: `${SAFE_TERMS.discount_rate}%` },
            { l: "MFN Clause", v: SAFE_TERMS.mfn ? "Yes" : "No" },
            { l: "Min. Investment", v: `$${SAFE_TERMS.min_investment.toLocaleString()}` },
          ].map(x => (
            <div key={x.l} style={{ padding: "8px 12px", background: T.bgSurface, borderRadius: 7, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.textGhost, fontWeight: 600, textTransform: "uppercase" }}>{x.l}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: mono, marginTop: 2 }}>{x.v}</div>
            </div>
          ))}
        </div>
        <Btn variant="success" onClick={handleSend} disabled={sending || !selectedInvestor || Number(amount) < SAFE_TERMS.min_investment}>
          {I.send} {sending ? "Sending..." : "Send SAFE for Signing"}
        </Btn>
        {amount && Number(amount) < SAFE_TERMS.min_investment && (
          <span style={{ fontSize: 12, color: T.red, marginLeft: 12 }}>Minimum investment is ${SAFE_TERMS.min_investment.toLocaleString()}</span>
        )}
      </Card>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0 }}>Issued SAFEs ({safes.length})</h3>
        </div>
        {safes.length === 0 ? (
          <EmptyState icon={I.dollar} title="No SAFEs issued yet" sub="Issue your first SAFE above"/>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Investor", "Amount", "Cap", "Discount", "Status", "Issued"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.textGhost, textTransform: "uppercase", letterSpacing: "0.05em", background: T.bgSurface }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {safes.map((s, i) => {
                const inv = investors.find(inv => inv.id === s.investor_id);
                return (
                  <tr key={s.id} style={{ borderBottom: i < safes.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: T.text }}>{inv ? inv.full_name : "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: T.green, fontFamily: mono }}>${Number(s.investment_amount).toLocaleString()}</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: T.textSec, fontFamily: mono }}>${(Number(s.valuation_cap) / 1e6).toFixed(1)}M</td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: T.textSec }}>{s.discount_rate}%</td>
                    <td style={{ padding: "12px 16px" }}><Badge color={statusColors[s.status] || T.textDim}>{s.status}</Badge></td>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: T.textGhost }}>{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
    </div>
  );
}

function AdminDocuments({ documents, investors, refetchDocs }) {
  const [showUpload, setShowUpload] = useState(false);
  const [title, setTitle] = useState("");
  const [docType, setDocType] = useState("other");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("all_investors");
  const [requiresSig, setRequiresSig] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);

  const handleUpload = async () => {
    if (!title || !file) return;
    setUploading(true);
    try {
      const filePath = `documents/${Date.now()}_${file.name}`;
      await supabase.uploadFile("investor-docs", filePath, file);
      await supabase.insert("documents", {
        title, doc_type: docType, description, visibility,
        requires_signature: requiresSig,
        file_path: filePath, file_name: file.name,
        file_size: file.size, mime_type: file.type,
        status: requiresSig ? "pending_signature" : "draft",
        uploaded_by: supabase.user?.id
      });
      await supabase.insert("activity_log", {
        actor_id: supabase.user?.id, actor_type: "founder",
        action: `Uploaded document: ${title}`, resource_type: "document"
      }).catch(() => {});
      setToast({ message: "Document uploaded", type: "success" });
      setShowUpload(false);
      setTitle(""); setDescription(""); setFile(null);
      refetchDocs();
    } catch (e) { setToast({ message: e.message, type: "error" }); }
    setUploading(false);
  };

  const statusColors = { draft: T.purple, pending_signature: T.amber, partially_signed: T.accent, fully_executed: T.green, archived: T.textGhost };
  const typeLabels = { safe: "SAFE", operating_agreement: "OpAg", ip_assignment: "IP", subscription_agreement: "Sub", investor_update: "Update", tax_document: "Tax", rua: "RUA", nda: "NDA", other: "Other" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Document Vault</h1>
          <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>{documents.length} documents · Encrypted storage</p>
        </div>
        <Btn variant="primary" onClick={() => setShowUpload(true)}>{I.upload} Upload Document</Btn>
      </div>
      {documents.length === 0 ? (
        <Card><EmptyState icon={I.file} title="No documents yet" sub="Upload your first document to get started"/></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {documents.map(doc => (
            <Card key={doc.id} hoverable>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                    <Badge color={T.accent}>{typeLabels[doc.doc_type] || doc.doc_type}</Badge>
                    <Badge color={statusColors[doc.status]}>{doc.status?.replace(/_/g, " ")}</Badge>
                    {doc.requires_signature && <Badge color={T.pink}>Sig Required</Badge>}
                  </div>
                  <h4 style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: "0 0 4px" }}>{doc.title}</h4>
                  <p style={{ fontSize: 12, color: T.textGhost, margin: 0, lineHeight: 1.5 }}>{doc.description}</p>
                  <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: T.textGhost }}>{doc.file_name}</span>
                    <span style={{ fontSize: 11, color: T.textGhost }}>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn size="sm">{I.eye} View</Btn>
                  <Btn size="sm">{I.dl} Download</Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Upload Document" width={560}>
        <Input label="Document Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="SAFE Agreement — John Doe"/>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: T.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Document Type</label>
          <select value={docType} onChange={e => setDocType(e.target.value)}
            style={{ width: "100%", padding: "11px 14px", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 9, color: T.text, fontSize: 14, fontFamily: font, outline: "none" }}>
            {Object.entries({ safe: "SAFE Agreement", operating_agreement: "Operating Agreement", ip_assignment: "IP Assignment", rua: "Restricted Unit Agreement", nda: "NDA", investor_update: "Investor Update", tax_document: "Tax Document", other: "Other" }).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <Input label="Description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of this document"/>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", color: T.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Visibility</label>
            <select value={visibility} onChange={e => setVisibility(e.target.value)}
              style={{ width: "100%", padding: "11px 14px", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 9, color: T.text, fontSize: 14, fontFamily: font, outline: "none" }}>
              <option value="all_investors">All Investors</option>
              <option value="specific_investors">Specific Investors</option>
              <option value="founders_only">Founders Only</option>
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", paddingTop: 22 }}>
            <input type="checkbox" checked={requiresSig} onChange={e => setRequiresSig(e.target.checked)} style={{ accentColor: T.accent }}/>
            <span style={{ fontSize: 13, color: T.textSec }}>Requires signature</span>
          </label>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", color: T.textDim, fontSize: 11, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>File</label>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.doc" onChange={e => setFile(e.target.files?.[0])} style={{ display: "none" }}/>
          <button onClick={() => fileRef.current?.click()}
            style={{ width: "100%", padding: "24px", background: T.bgSurface, border: `2px dashed ${T.border}`, borderRadius: 10, color: T.textDim, fontSize: 13, cursor: "pointer", fontFamily: font }}>
            {file ? <span style={{ color: T.accent, fontWeight: 600 }}>{file.name} ({(file.size / 1024).toFixed(0)} KB)</span> : "Click to select file (PDF, DOCX)"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <Btn onClick={() => setShowUpload(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={handleUpload} disabled={uploading || !title || !file}>{uploading ? "Uploading..." : "Upload Document"}</Btn>
        </div>
      </Modal>
      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
    </div>
  );
}

// ─── SHARED: CAP TABLE ──────────────────────────────────────
function CapTableView() {
  const { data: capTable, loading } = useSupabase("cap_table", { order: "stakeholder_type.asc" });
  const total = capTable.reduce((a, r) => a + Number(r.units_authorized || 0), 0) || 10000000;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Cap Table</h1>
        <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>{COMPANY_NAME} — Ownership structure</p>
      </div>
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", height: 36, borderRadius: 7, overflow: "hidden", marginBottom: 14 }}>
          {capTable.map((row, i) => {
            const pct = (Number(row.units_authorized) / total) * 100;
            const colors = [
              `linear-gradient(90deg, ${T.accent}, #2196F3)`,
              `linear-gradient(90deg, ${T.purple}, #A855F7)`,
              `linear-gradient(90deg, ${T.green}, #34D399)`,
              `linear-gradient(90deg, ${T.amber}, #FBBF24)`,
            ];
            return (
              <div key={i} style={{ width: `${pct}%`, background: colors[i % colors.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: pct > 10 ? 11 : 9, fontWeight: 700, color: "#fff", minWidth: pct > 3 ? "auto" : 0 }}>
                {pct > 8 ? `${row.stakeholder_name?.split(" ")[0]} — ${pct.toFixed(0)}%` : ""}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {capTable.map((row, i) => {
            const dotColors = [T.accent, T.purple, T.green, T.amber];
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 9, height: 9, borderRadius: 3, background: dotColors[i % dotColors.length] }}/>
                <span style={{ fontSize: 12, color: T.textDim }}>{row.stakeholder_name} ({Number(row.units_authorized).toLocaleString()})</span>
              </div>
            );
          })}
        </div>
      </Card>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: T.textDim, fontSize: 13 }}>Loading cap table...</div>
        ) : (
          <>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                    {["Holder", "Type", "Instrument", "Units", "%", "Consideration", "Notes"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: T.textGhost, textTransform: "uppercase", letterSpacing: "0.05em", background: T.bgSurface }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {capTable.map((row, i) => {
                    const pct = ((Number(row.units_authorized) / total) * 100).toFixed(1);
                    const typeColor = { founder: T.accent, pool: T.purple, investor: T.green, advisor: T.amber, employee: T.pink }; // stakeholder_type values
                    return (
                      <tr key={row.id || i} style={{ borderBottom: i < capTable.length - 1 ? `1px solid ${T.border}` : "none" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: T.text }}>{row.stakeholder_name}</td>
                        <td style={{ padding: "12px 16px" }}><Badge color={typeColor[row.stakeholder_type] || T.textDim}>{row.stakeholder_type}</Badge></td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: T.textSec }}>{row.instrument_type?.replace(/_/g, " ")}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: T.text, fontFamily: mono }}>{Number(row.units_authorized).toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: T.text, fontFamily: mono }}>{pct}%</td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: T.textDim }}>
                          {row.consideration_type !== "none" ? `$${Number(row.consideration).toLocaleString()} (${row.consideration_type?.replace(/_/g, " ")})` : "—"}
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: T.textGhost, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.notes || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", background: T.bgSurface }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.textDim }}>Total Authorized</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text, fontFamily: mono }}>{total.toLocaleString()} units</span>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ─── INVESTOR: DASHBOARD ────────────────────────────────────
function InvestorDashboard({ setActive, safes }) {
  const mySafe = safes?.[0];
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Dashboard</h1>
        <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Your investment overview for {COMPANY_NAME}</p>
      </div>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
        <Stat label="Valuation Cap" value="$1.5M" sub="Pre-money" icon={I.shield} color={T.accent}/>
        <Stat label="Your Investment" value={mySafe ? `$${Number(mySafe.investment_amount).toLocaleString()}` : "—"} sub={mySafe?.status || "No SAFE yet"} icon={I.dollar} color={T.green}/>
        <Stat label="Discount Rate" value="15%" sub="To next round" icon={I.bar} color={T.purple}/>
      </div>
      <Card style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: "0 0 12px" }}>How Your SAFE Converts</h3>
        <p style={{ fontSize: 13, color: T.textDim, margin: "0 0 14px", lineHeight: 1.6 }}>Your SAFE converts at the $1.5M cap regardless of the next round's valuation. The higher the next round, the better the deal you're getting as an early supporter.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { s: "Next round at $3M", o: "~2.0%", b: "2x better" },
            { s: "Next round at $5M", o: "~2.0%", b: "3.3x better" },
            { s: "Next round at $10M", o: "~2.0%", b: "6.7x better" },
          ].map(x => (
            <div key={x.s} style={{ flex: 1, minWidth: 140, padding: "12px 14px", background: T.bgSurface, borderRadius: 8, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 10, color: T.textGhost, fontWeight: 600, marginBottom: 4 }}>{x.s}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.accent, fontFamily: mono }}>{x.o}</div>
              <div style={{ fontSize: 10, color: T.green, fontWeight: 700, marginTop: 3 }}>{x.b}</div>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "flex", gap: 10 }}>
        {[
          { l: "View Cap Table", v: "cap_table", i: I.bar, c: T.accent },
          { l: "Browse Documents", v: "documents", i: I.file, c: T.purple },
          { l: "Sign SAFE", v: "safe", i: I.pen, c: T.green },
        ].map(a => (
          <Btn key={a.v} onClick={() => setActive(a.v)} style={{ color: a.c, borderColor: `${a.c}33` }}>{a.i} {a.l}</Btn>
        ))}
      </div>
    </div>
  );
}

// ─── INVESTOR: SIGN SAFE ────────────────────────────────────
function InvestorSignSafe({ safes, refetch }) {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [typedSig, setTypedSig] = useState("");
  const [signed, setSigned] = useState(false);
  const [toast, setToast] = useState(null);
  const pendingSafe = safes.find(s => s.status === "pending");

  const handleSign = async () => {
    if (!pendingSafe || !typedSig) return;
    try {
      await supabase.insert("signatures", {
        document_id: pendingSafe.document_id,
        investor_id: pendingSafe.investor_id,
        signature_type: "type",
        signature_data: typedSig,
        legal_name: typedSig,
        agreement_text: `SAFE for $${Number(pendingSafe.investment_amount).toLocaleString()} at $${(Number(pendingSafe.valuation_cap) / 1e6).toFixed(1)}M cap, ${pendingSafe.discount_rate}% discount.`
      });
      await supabase.update("safe_instruments", { status: "signed" }, { id: pendingSafe.id });
      await supabase.insert("activity_log", {
        actor_id: supabase.user?.id, actor_type: "investor",
        action: `Signed SAFE for $${Number(pendingSafe.investment_amount).toLocaleString()}`,
        resource_type: "safe", resource_id: pendingSafe.id
      }).catch(() => {});
      setSigned(true);
      refetch();
    } catch (e) { setToast({ message: e.message, type: "error" }); }
  };

  if (!pendingSafe && !signed) {
    return (
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Sign SAFE</h1>
        <Card style={{ marginTop: 20 }}><EmptyState icon={I.pen} title="No pending SAFE" sub="You don't have a SAFE awaiting your signature right now."/></Card>
      </div>
    );
  }

  if (signed) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 380, textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.greenDim, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 6px" }}>SAFE Signed Successfully</h2>
        <p style={{ color: T.textDim, fontSize: 13, maxWidth: 380, margin: "0 0 20px", lineHeight: 1.6 }}>
          Your SAFE for ${Number(pendingSafe?.investment_amount).toLocaleString()} has been recorded. You'll receive a countersigned copy via email.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Sign SAFE Agreement</h1>
        <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Review and sign your SAFE for ${Number(pendingSafe.investment_amount).toLocaleString()}</p>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
        {["Review Terms", "Sign"].map((s, i) => (
          <div key={s} style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 3, borderRadius: 2, background: i + 1 <= step ? T.accent : T.border, transition: "all 0.3s", marginBottom: 6 }}/>
            <span style={{ fontSize: 11, fontWeight: 600, color: i + 1 <= step ? T.accent : T.textGhost }}>{s}</span>
          </div>
        ))}
      </div>
      {step === 1 && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>SAFE Terms</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {[
              ["Investment", `$${Number(pendingSafe.investment_amount).toLocaleString()}`],
              ["Valuation Cap", `$${(Number(pendingSafe.valuation_cap) / 1e6).toFixed(1)}M`],
              ["Discount", `${pendingSafe.discount_rate}%`],
              ["MFN Clause", pendingSafe.mfn_clause ? "Yes" : "No"],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: "10px 14px", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: T.textGhost, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: T.text, fontFamily: mono }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 13, color: T.textSec, lineHeight: 1.7, maxHeight: 240, overflowY: "auto" }}>
            <p style={{ fontWeight: 700, color: T.text, margin: "0 0 8px" }}>Key Terms Summary</p>
            <p>This SAFE converts into membership units upon a Qualified Financing of $250,000 or more, at the lower of the valuation cap or the next round price less the discount rate.</p>
            <p>Upon dissolution prior to conversion, you are entitled to repayment of your investment amount, junior to creditors but senior to equity holders.</p>
            <p>As an LLC investor, you will receive K-1 tax forms upon conversion and may owe taxes on allocable income regardless of distributions.</p>
          </div>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer", marginBottom: 16 }}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: T.accent }}/>
            <span style={{ fontSize: 13, color: T.textSec, lineHeight: 1.5 }}>I have read and understand these terms. I understand this is a high-risk investment.</span>
          </label>
          <Btn variant="primary" onClick={() => agreed && setStep(2)} disabled={!agreed} style={{ width: "100%", justifyContent: "center" }}>
            Continue to Signature
          </Btn>
        </Card>
      )}
      {step === 2 && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Sign Agreement</h3>
          <p style={{ fontSize: 12, color: T.textDim, margin: "0 0 14px" }}>Type your full legal name as your electronic signature.</p>
          <input value={typedSig} onChange={e => setTypedSig(e.target.value)} placeholder="Your full legal name"
            style={{ width: "100%", padding: "18px 20px", background: T.bgSurface, border: `1px solid ${T.border}`, borderRadius: 10, color: T.accent, fontSize: 26, fontFamily: "'Brush Script MT', 'Segoe Script', cursive", fontStyle: "italic", outline: "none", boxSizing: "border-box", textAlign: "center", marginBottom: 16 }}/>
          <div style={{ padding: "12px 16px", background: T.bgSurface, borderRadius: 8, marginBottom: 16, fontSize: 12, color: T.textDim, lineHeight: 1.6 }}>
            By signing, I agree to invest <strong style={{ color: T.text }}>${Number(pendingSafe.investment_amount).toLocaleString()}</strong> via SAFE at a <strong style={{ color: T.text }}>${(Number(pendingSafe.valuation_cap) / 1e6).toFixed(1)}M</strong> valuation cap. Signed electronically on {new Date().toLocaleDateString()}.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => setStep(1)}>Back</Btn>
            <Btn variant="success" onClick={handleSign} disabled={!typedSig} style={{ flex: 1, justifyContent: "center" }}>
              Sign & Execute SAFE
            </Btn>
          </div>
        </Card>
      )}
      {toast && <Toast {...toast} onClose={() => setToast(null)}/>}
    </div>
  );
}

// ─── INVESTOR: DOCUMENTS ────────────────────────────────────
function InvestorDocuments() {
  const { data: docs, loading } = useSupabase("documents", { order: "created_at.desc" });
  const statusColors = { draft: T.purple, pending_signature: T.amber, fully_executed: T.green, archived: T.textGhost };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Documents</h1>
          <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Your legal documents and agreements</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.textGhost, fontSize: 12 }}>{I.shield} Encrypted</div>
      </div>
      {loading ? <Card><div style={{ padding: 20, textAlign: "center", color: T.textDim }}>Loading...</div></Card> :
        docs.length === 0 ? <Card><EmptyState icon={I.file} title="No documents" sub="Documents will appear here when shared with you"/></Card> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {docs.map(doc => (
              <Card key={doc.id} hoverable>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <Badge color={T.accent}>{doc.doc_type?.replace(/_/g, " ")}</Badge>
                      <Badge color={statusColors[doc.status]}>{doc.status?.replace(/_/g, " ")}</Badge>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: "0 0 4px" }}>{doc.title}</h4>
                    <p style={{ fontSize: 12, color: T.textGhost, margin: 0 }}>{doc.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Btn size="sm">{I.eye} View</Btn>
                    <Btn size="sm">{I.dl} Download</Btn>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}

// ─── ACTIVITY VIEW ──────────────────────────────────────────
function ActivityView() {
  const { data: logs, loading } = useSupabase("activity_log", { order: "created_at.desc", limit: 50 });

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 4px" }}>Activity Log</h1>
        <p style={{ color: T.textDim, fontSize: 13, margin: 0 }}>Audit trail of all portal activity</p>
      </div>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {loading ? <div style={{ padding: 30, textAlign: "center", color: T.textDim }}>Loading...</div> :
          logs.length === 0 ? <EmptyState icon={I.clock} title="No activity yet" sub="Actions will be logged here"/> :
            logs.map((a, i) => (
              <div key={a.id} style={{ padding: "13px 18px", borderBottom: i < logs.length - 1 ? `1px solid ${T.border}` : "none", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.accent, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: T.textGhost, marginTop: 1 }}>{new Date(a.created_at).toLocaleString()}</div>
                </div>
                <Badge color={T.accent}>{a.resource_type || "system"}</Badge>
              </div>
            ))}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN INVESTOR PORTAL APP
// ═══════════════════════════════════════════════════════════
export default function InvestorPortal() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("investor");
  const [active, setActive] = useState("overview");
  const [loading, setLoading] = useState(true);

  const { data: investors, refetch: refetchInvestors } = useSupabase("investors", { order: "created_at.desc" });
  const { data: safes, refetch: refetchSafes } = useSupabase("safe_instruments", { order: "created_at.desc" });
  const { data: documents, refetch: refetchDocs } = useSupabase("documents", { order: "created_at.desc" });

  useEffect(() => {
    const restored = supabase.restoreSession();
    if (restored) {
      setUser(supabase.user);
      if (supabase.user?.id === FOUNDER_AUTH_ID) setRole("admin");
    }
    setLoading(false);
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    if (u?.id === FOUNDER_AUTH_ID) {
      setRole("admin");
      setActive("overview");
    } else {
      setRole("investor");
      setActive("dashboard");
    }
  };

  const handleLogout = () => {
    supabase.signOut();
    setUser(null);
    setRole("investor");
    setActive("overview");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font }}>
      <link href={fontLink} rel="stylesheet"/>
      <div style={{ color: T.textDim, fontSize: 14 }}>Loading...</div>
    </div>
  );

  if (!user) return <AuthScreen onLogin={handleLogin}/>;

  const adminNav = [
    { id: "overview", label: "Overview", icon: I.grid },
    { id: "investors", label: "Investors", icon: I.users, badge: investors.filter(i => i.status === "invited").length || null },
    { id: "send_safe", label: "SAFE Management", icon: I.send },
    { id: "manage_docs", label: "Documents", icon: I.file },
    { id: "cap_table", label: "Cap Table", icon: I.bar },
    { id: "activity", label: "Activity", icon: I.clock },
  ];

  const investorNav = [
    { id: "dashboard", label: "Dashboard", icon: I.grid },
    { id: "cap_table", label: "Cap Table", icon: I.bar },
    { id: "documents", label: "Documents", icon: I.file },
    { id: "safe", label: "Sign SAFE", icon: I.pen, badge: safes.filter(s => s.status === "pending").length || null },
    { id: "activity", label: "Activity", icon: I.clock },
  ];

  const nav = role === "admin" ? adminNav : investorNav;

  const adminViews = {
    overview: <AdminOverview investors={investors} safes={safes} documents={documents} setActive={setActive}/>,
    investors: <AdminInvestors investors={investors} refetch={refetchInvestors}/>,
    send_safe: <AdminSendSafe investors={investors} safes={safes} refetchSafes={refetchSafes}/>,
    manage_docs: <AdminDocuments documents={documents} investors={investors} refetchDocs={refetchDocs}/>,
    cap_table: <CapTableView/>,
    activity: <ActivityView/>,
  };

  const investorViews = {
    dashboard: <InvestorDashboard setActive={setActive} safes={safes}/>,
    cap_table: <CapTableView/>,
    documents: <InvestorDocuments/>,
    safe: <InvestorSignSafe safes={safes} refetch={refetchSafes}/>,
    activity: <ActivityView/>,
  };

  const views = role === "admin" ? adminViews : investorViews;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg, fontFamily: font, color: T.text }}>
      <link href={fontLink} rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        select option { background: ${T.bgCard}; color: ${T.text}; }
      `}</style>
      <Sidebar nav={nav} active={active} setActive={setActive} user={user} role={role} onLogout={handleLogout}/>
      <main style={{ flex: 1, padding: "28px 36px", overflowY: "auto", maxHeight: "100vh" }}>
        <div style={{ animation: "fadeUp 0.3s ease" }} key={active}>
          {views[active] || <div style={{ color: T.textDim }}>View not found</div>}
        </div>
      </main>
    </div>
  );
}
