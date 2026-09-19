// Auth.jsx — sign-in modal (nickname for readers, password for admin)

const AuthModal = ({ open, onClose, onSignIn }) => {
  const [tab, setTab] = React.useState("reader"); // reader | admin
  const [nickname, setNickname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");

  React.useEffect(() => { if (open) { setNickname(""); setPassword(""); setErr(""); } }, [open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (tab === "reader") {
      if (!nickname.trim()) { setErr("Just leave a name."); return; }
      onSignIn({ nickname: nickname.trim(), role: "reader" });
      onClose();
      return;
    }
    // Admin tab: pre-check client-side, then obtain a server token.
    if (nickname.trim() !== "wangxu" || password !== "0520") {
      setErr("Wrong nickname or password.");
      return;
    }
    try {
      const res = await API.post("/admin/login", { nickname: nickname.trim(), password });
      if (res && res.ok && res.token) {
        onSignIn({ nickname: "Xu Wang", role: "admin", token: res.token });
        onClose();
      } else {
        setErr((res && res.error) || "登录失败，请重试。");
      }
    } catch (e) {
      setErr("网络错误，登录失败。");
    }
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(26,22,18,0.32)",
      backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 240ms var(--ease-out)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 420, background: "var(--paper)", borderRadius: 8,
        boxShadow: "var(--shadow-4)", overflow: "hidden",
        animation: "modalIn 320ms var(--ease-out)",
      }}>
        <div style={{
          padding: "28px 32px 18px", display: "flex",
          justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <Eyebrow>Welcome in</Eyebrow>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 500,
              fontSize: 28, color: "var(--ink)", marginTop: 6, lineHeight: 1.1,
            }}>
              {tab === "reader" ? "怎么称呼你呀？" : "Hey Xu Wang, prove it."}
            </div>
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 13,
              color: "var(--ink-mute)", marginTop: 4,
            }}>
              {tab === "reader" ? "Just a nickname — no signup, no email." : "Admin only — password required."}
            </div>
          </div>
          <button onClick={onClose} style={{
            border: 0, background: "transparent", cursor: "pointer", color: "var(--ink-mute)", padding: 4,
          }}><I.X size={20}/></button>
        </div>

        <div style={{
          display: "flex", borderTop: "1px solid var(--hairline)",
          borderBottom: "1px solid var(--hairline)",
        }}>
          {[["reader", "Reader"], ["admin", "Admin"]].map(([k, l]) => (
            <button key={k} onClick={() => { setTab(k); setErr(""); }} style={{
              flex: 1, padding: "12px 0", border: 0, background: "transparent",
              fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              cursor: "pointer",
              color: tab === k ? "var(--ink)" : "var(--ink-faint)",
              borderBottom: "2px solid " + (tab === k ? "var(--rust)" : "transparent"),
              transition: "all .18s var(--ease-out)",
            }}>{l}</button>
          ))}
        </div>

        <form onSubmit={submit} style={{ padding: "24px 32px 28px" }}>
          <label style={{
            display: "block", fontFamily: "var(--font-sans)", fontSize: 11,
            fontWeight: 600, letterSpacing: "0.15em",
            textTransform: "uppercase", color: "var(--ink-mute)", marginBottom: 6,
          }}>Nickname</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)}
            placeholder={tab === "reader" ? "what should i call you?" : "wangxu"}
            autoFocus style={{
              width: "100%", boxSizing: "border-box", padding: "10px 0",
              border: 0, borderBottom: "1px solid var(--hairline)",
              background: "transparent", fontFamily: "var(--font-serif)",
              fontSize: 18, color: "var(--ink)", outline: "none",
              transition: "border-color .18s var(--ease-out)",
            }}
            onFocus={(e) => e.currentTarget.style.borderBottomColor = "var(--ink)"}
            onBlur={(e) => e.currentTarget.style.borderBottomColor = "var(--hairline)"}
          />

          {tab === "admin" && (
            <>
              <label style={{
                display: "block", fontFamily: "var(--font-sans)", fontSize: 11,
                fontWeight: 600, letterSpacing: "0.15em",
                textTransform: "uppercase", color: "var(--ink-mute)",
                marginBottom: 6, marginTop: 22,
              }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••" style={{
                  width: "100%", boxSizing: "border-box", padding: "10px 0",
                  border: 0, borderBottom: "1px solid var(--hairline)",
                  background: "transparent", fontFamily: "var(--font-serif)",
                  fontSize: 18, color: "var(--ink)", outline: "none",
                  transition: "border-color .18s var(--ease-out)",
                }}
                onFocus={(e) => e.currentTarget.style.borderBottomColor = "var(--ink)"}
                onBlur={(e) => e.currentTarget.style.borderBottomColor = "var(--hairline)"}
              />

            </>
          )}

          {err && (
            <div style={{
              fontFamily: "var(--font-sans)", fontSize: 12,
              color: "var(--rust)", marginTop: 14,
            }}>{err}</div>
          )}

          <div style={{ marginTop: 26, display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
            <Button variant="primary" type="submit">
              {tab === "reader" ? "Enter" : "Sign in"} <I.Arrow size={14}/>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

window.AuthModal = AuthModal;
