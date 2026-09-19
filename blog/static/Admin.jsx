// Admin.jsx — management dashboard for blog posts + site config.
// Accessible at /blog/admin. Requires an admin session (with a server token).

// Shared underline-input style (mirrors Auth.jsx).
const adminInputStyle = {
  width: "100%", boxSizing: "border-box", padding: "9px 0",
  border: 0, borderBottom: "1px solid var(--hairline)",
  background: "transparent", fontFamily: "var(--font-serif)",
  fontSize: 16, color: "var(--ink)", outline: "none",
  transition: "border-color .18s var(--ease-out)",
};
const adminLabelStyle = {
  display: "block", fontFamily: "var(--font-sans)", fontSize: 11,
  fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase",
  color: "var(--ink-mute)", marginBottom: 6,
};
const focusUnderline = (e) => e.currentTarget.style.borderBottomColor = "var(--ink)";
const blurUnderline = (e) => e.currentTarget.style.borderBottomColor = "var(--hairline)";

const Admin = ({ session, onOpenAuth, onEdit, onCompose, onHome }) => {
  const [tab, setTab] = React.useState("posts"); // posts | config

  // Guard: only signed-in admins (with a server token) may pass.
  const isAdmin = session && session.role === "admin" && session.token;
  if (!isAdmin) {
    return (
      <div style={{
        height: "100%", overflow: "auto", background: "var(--paper)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 32,
      }}>
        <div style={{ maxWidth: 380, textAlign: "center" }}>
          <Eyebrow color="var(--rust)">Admin</Eyebrow>
          <div style={{
            fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 30,
            color: "var(--ink)", marginTop: 8, lineHeight: 1.15,
          }}>需要管理员登录</div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: 13,
            color: "var(--ink-mute)", marginTop: 8,
          }}>管理后台仅对管理员开放。请用管理员账号登录后重试。</div>
          <div style={{ marginTop: 24, display: "flex", gap: 10, justifyContent: "center" }}>
            <Button variant="ghost" onClick={onHome}>返回首页</Button>
            <Button variant="primary" onClick={onOpenAuth} leadIcon={<I.Lock size={14}/>}>Sign in</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflow: "auto", background: "var(--paper)" }}>
      {/* Header bar */}
      <div style={{
        height: 56, borderBottom: "1px solid var(--hairline)",
        display: "flex", alignItems: "center", padding: "0 32px", gap: 14,
        background: "var(--paper)", position: "sticky", top: 0, zIndex: 2,
      }}>
        <Eyebrow color="var(--rust)">Admin · 管理</Eyebrow>
        <div style={{ flex: 1 }}/>
        <button onClick={onHome} style={{
          border: 0, background: "transparent", cursor: "pointer",
          fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-mute)",
        }}>← back to blog</button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", borderBottom: "1px solid var(--hairline)",
        padding: "0 32px",
      }}>
        {[["posts", "文章管理"], ["config", "配置"]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: "12px 18px", border: 0, background: "transparent",
            fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600,
            cursor: "pointer",
            color: tab === k ? "var(--ink)" : "var(--ink-faint)",
            borderBottom: "2px solid " + (tab === k ? "var(--rust)" : "transparent"),
            transition: "all .18s var(--ease-out)", marginBottom: -1,
          }}>{l}</button>
        ))}
      </div>

      <div style={{ padding: "28px 32px 80px", maxWidth: 1100 }}>
        {tab === "posts" && <PostsTab session={session} onEdit={onEdit} onCompose={onCompose}/>}
        {tab === "config" && <ConfigTab session={session}/>}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Posts tab
// ---------------------------------------------------------------------------
const PostsTab = ({ session, onEdit, onCompose }) => {
  const [posts, setPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState("");
  const [busy, setBusy] = React.useState(null); // pid being deleted

  const refresh = React.useCallback(() => {
    setLoading(true);
    API.get('/posts?limit=200&status=all').then(d => {
      setPosts(Array.isArray(d.items) ? d.items : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const handleDelete = async (p) => {
    if (busy) return;
    if (!window.confirm(`确认删除「${p.title || p.id}」？此操作不可撤销。`)) return;
    setBusy(p.id); setMsg("");
    try {
      const r = await API.del('/posts/' + p.id, { token: session.token });
      const d = await r.json().catch(() => ({}));
      if (d && d.ok) {
        setPosts(prev => prev.filter(x => x.id !== p.id));
        setMsg(`已删除「${p.title || p.id}」`);
      } else {
        setMsg((d && d.error) || "删除失败");
      }
    } catch (e) {
      setMsg("网络错误，删除失败");
    }
    setBusy(null);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 26, color: "var(--ink)" }}>
          文章 · {posts.length}
        </div>
        <div style={{ flex: 1 }}/>
        <Button variant="primary" onClick={onCompose} leadIcon={<I.Plus size={14}/>}>新建文章</Button>
      </div>
      {msg && (
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-mute)",
          marginBottom: 16, padding: "8px 12px", background: "var(--paper-soft)",
          borderRadius: 4,
        }}>{msg}</div>
      )}

      {loading ? (
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-mute)", padding: "20px 0" }}>
          loading…
        </div>
      ) : posts.length === 0 ? (
        <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-mute)", padding: "20px 0" }}>
          还没有文章。
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {posts.map((p) => {
            const cat = window.CATEGORIES[p.cat] || {};
            return (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 6,
                border: "1px solid var(--hairline)", background: "var(--paper)",
              }}>
                <Seal cat={p.cat} size={32}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 16,
                    color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{p.title || "(untitled)"}</div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)",
                    marginTop: 3, display: "flex", gap: 10,
                  }}>
                    <span>{p.id}</span>
                    <span>{cat.cn || p.cat}</span>
                    <span>{p.date}</span>
                    <span style={{ color: p.status === "published" ? "var(--pine)" : "var(--ink-faint)" }}>{p.status}</span>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => onEdit(p.id)} leadIcon={<I.Edit size={13}/>}>Edit</Button>
                <Button variant="ghost" onClick={() => handleDelete(p)} disabled={busy === p.id}
                  leadIcon={<I.Trash size={13}/>} style={{ color: "var(--rust)" }}>
                  {busy === p.id ? "…" : "Delete"}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Config tab
// ---------------------------------------------------------------------------
const ConfigTab = ({ session }) => {
  const [cfg, setCfg] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [highlightsText, setHighlightsText] = React.useState("");

  React.useEffect(() => {
    API.get('/config').then(d => {
      if (d && d.bio && d.categories) {
        // Deep clone so editing local state doesn't mutate the globals.
        setCfg({ bio: JSON.parse(JSON.stringify(d.bio)), categories: JSON.parse(JSON.stringify(d.categories)) });
        setHighlightsText((d.bio.highlights || []).join("\n"));
      }
    }).catch(() => {});
  }, []);

  if (!cfg) {
    return <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--ink-mute)", padding: "20px 0" }}>loading…</div>;
  }

  const setBio = (key, val) => setCfg(c => ({ ...c, bio: { ...c.bio, [key]: val } }));
  const setCat = (key, field, val) => setCfg(c => ({
    ...c,
    categories: { ...c.categories, [key]: { ...c.categories[key], [field]: val } },
  }));

  const addLink = () => setCfg(c => ({ ...c, bio: { ...c.bio, links: [...(c.bio.links || []), { label: "", url: "" }] } }));
  const setLink = (i, field, val) => setCfg(c => {
    const links = (c.bio.links || []).map((l, idx) => idx === i ? { ...l, [field]: val } : l);
    return { ...c, bio: { ...c.bio, links } };
  });
  const removeLink = (i) => setCfg(c => {
    const links = (c.bio.links || []).filter((_, idx) => idx !== i);
    return { ...c, bio: { ...c.bio, links } };
  });

  const save = async () => {
    setSaving(true); setMsg("");
    const payload = {
      bio: { ...cfg.bio, highlights: highlightsText.split("\n").map(s => s.trim()).filter(Boolean) },
      categories: cfg.categories,
    };
    try {
      const updated = await API.put('/config', payload, { token: session.token });
      if (updated && updated.bio) {
        // Overlay onto globals so the rest of the site reflects changes live.
        Object.assign(window.BIO, updated.bio);
        Object.assign(window.CATEGORIES, updated.categories);
        setMsg("已保存 ✓");
      } else {
        setMsg((updated && updated.error) || "保存失败");
      }
    } catch (e) {
      setMsg("网络错误，保存失败");
    }
    setSaving(false);
  };

  const inputCls = (extra) => ({ ...adminInputStyle, ...(extra || {}) });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, maxWidth: 980 }}>
      {/* LEFT — BIO */}
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22, color: "var(--ink)", marginBottom: 18 }}>
          个人信息 (BIO)
        </div>

        <label style={adminLabelStyle}>Name</label>
        <input value={cfg.bio.name || ""} onChange={(e) => setBio("name", e.target.value)}
          style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>中文名 (NameCn)</label>
        <input value={cfg.bio.nameCn || ""} onChange={(e) => setBio("nameCn", e.target.value)}
          style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>Seal (印章字)</label>
        <input value={cfg.bio.seal || ""} onChange={(e) => setBio("seal", e.target.value)}
          style={{ ...inputCls(), maxWidth: 120 }} onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>Role</label>
        <input value={cfg.bio.role || ""} onChange={(e) => setBio("role", e.target.value)}
          style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>Affiliation</label>
        <input value={cfg.bio.affiliation || ""} onChange={(e) => setBio("affiliation", e.target.value)}
          style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>Greet</label>
        <input value={cfg.bio.greet || ""} onChange={(e) => setBio("greet", e.target.value)}
          style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>Blurb (English)</label>
        <textarea value={cfg.bio.blurb || ""} onChange={(e) => setBio("blurb", e.target.value)} rows={3}
          style={{ ...inputCls(), resize: "vertical", fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5 }}
          onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>简介 (BlurbCn)</label>
        <textarea value={cfg.bio.blurbCn || ""} onChange={(e) => setBio("blurbCn", e.target.value)} rows={3}
          style={{ ...inputCls(), resize: "vertical", fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5 }}
          onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>Highlights (每行一条)</label>
        <textarea value={highlightsText} onChange={(e) => setHighlightsText(e.target.value)} rows={3}
          style={{ ...inputCls(), resize: "vertical", fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.5 }}
          onFocus={focusUnderline} onBlur={blurUnderline}/>

        <label style={{ ...adminLabelStyle, marginTop: 18 }}>Links</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {(cfg.bio.links || []).map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input value={l.label} onChange={(e) => setLink(i, "label", e.target.value)}
                placeholder="label" style={{ ...inputCls(), flex: 1 }}
                onFocus={focusUnderline} onBlur={blurUnderline}/>
              <input value={l.url} onChange={(e) => setLink(i, "url", e.target.value)}
                placeholder="url" style={{ ...inputCls(), flex: 2 }}
                onFocus={focusUnderline} onBlur={blurUnderline}/>
              <button onClick={() => removeLink(i)} style={{
                border: 0, background: "transparent", cursor: "pointer", color: "var(--rust)", padding: 4,
              }}><I.X size={16}/></button>
            </div>
          ))}
          <button onClick={addLink} style={{
            alignSelf: "flex-start", border: "1px dashed var(--hairline)", background: "transparent",
            cursor: "pointer", padding: "6px 12px", borderRadius: 4,
            fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-mute)",
          }}><I.Plus size={12}/> add link</button>
        </div>
      </div>

      {/* RIGHT — CATEGORIES */}
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22, color: "var(--ink)", marginBottom: 18 }}>
          分类 (CATEGORIES)
        </div>
        {Object.entries(cfg.categories).map(([key, c]) => (
          <div key={key} style={{
            padding: "16px 0", borderTop: "1px solid var(--hairline)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
            }}>
              <Seal cat={key} size={28}/>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600,
                color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.1em",
              }}>{key}</span>
            </div>
            <label style={adminLabelStyle}>中文名 (cn)</label>
            <input value={c.cn || ""} onChange={(e) => setCat(key, "cn", e.target.value)}
              style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>
            <label style={{ ...adminLabelStyle, marginTop: 14 }}>English (en)</label>
            <input value={c.en || ""} onChange={(e) => setCat(key, "en", e.target.value)}
              style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>
            <div style={{ display: "flex", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ ...adminLabelStyle, marginTop: 14 }}>Glyph</label>
                <input value={c.glyph || ""} onChange={(e) => setCat(key, "glyph", e.target.value)}
                  style={{ ...inputCls(), maxWidth: 80 }} onFocus={focusUnderline} onBlur={blurUnderline}/>
              </div>
              <div style={{ flex: 2 }}>
                <label style={{ ...adminLabelStyle, marginTop: 14 }}>Color (CSS var)</label>
                <input value={c.color || ""} onChange={(e) => setCat(key, "color", e.target.value)}
                  style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>
              </div>
            </div>
            <label style={{ ...adminLabelStyle, marginTop: 14 }}>Wash (CSS var)</label>
            <input value={c.wash || ""} onChange={(e) => setCat(key, "wash", e.target.value)}
              style={inputCls()} onFocus={focusUnderline} onBlur={blurUnderline}/>
          </div>
        ))}

        <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 12 }}>
          <Button variant="primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "保存配置"} <I.Check size={14}/>
          </Button>
          {msg && (
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 12,
              color: msg.includes("✓") ? "var(--pine)" : "var(--rust)",
            }}>{msg}</span>
          )}
        </div>
      </div>
    </div>
  );
};

window.Admin = Admin;
