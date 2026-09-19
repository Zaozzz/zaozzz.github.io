// Comments.jsx — top-level comment section at the bottom of each article.

const Comments = ({ postId, session, onSignIn }) => {
  const [comments, setComments] = React.useState([]);
  const [draft, setDraft] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [replyingTo, setReplyingTo] = React.useState(null); // { id, user }

  React.useEffect(() => {
    API.get(`/comments/${postId}`).then(d => {
      const arr = Array.isArray(d) ? d : (d && d.items) || [];
      setComments(arr.map(normalizeComment));
    }).catch(() => {});
  }, [postId]);

  const submit = async (text, replyTo) => {
    if (!session) { onSignIn(); return; }
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    try {
      const body = { text: t };
      if (replyTo) body.replyTo = replyTo;
      const c = await API.post(`/comments/${postId}`, body, { nickname: session.nickname });
      if (c && c.id) {
        setComments(arr => [...arr, normalizeComment(c)]);
      }
    } catch (e) {}
    setSending(false);
  };

  // Organise into threads: top-level + replies map
  const topLevel = comments.filter(c => !c.replyTo);
  const repliesFor = (id) => comments.filter(c => c.replyTo === id);

  const placeholder = session
    ? "leave a comment for Xu Wang and the next reader…"
    : "sign in to leave a comment…";

  return (
    <section style={{ marginTop: 64, maxWidth: "68ch" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 22 }}>
        <Eyebrow>Comments</Eyebrow>
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: 22, color: "var(--rust)", lineHeight: 1,
        }}>·{comments.length}</span>
        <span style={{ flex: 1 }}/>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)" }}>
          most recent first
        </span>
      </div>

      {/* Top-level composer */}
      <Composer
        session={session}
        onSignIn={onSignIn}
        placeholder={placeholder}
        sending={sending}
        onSubmit={(t) => { submit(t, null); }}
      />

      {/* Thread list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {topLevel.length === 0 && (
          <div style={{
            fontFamily: "var(--font-serif)", fontStyle: "italic",
            fontSize: 15, color: "var(--ink-mute)",
            padding: "20px 0",
          }}>还没有人留言。说一句话也好。</div>
        )}
        {topLevel.map((c) => (
          <div key={c.id}>
            <CommentRow
              c={c}
              replyingTo={replyingTo}
              onReply={() => setReplyingTo(replyingTo?.id === c.id ? null : { id: c.id, user: c.user })}
            />
            {/* Inline reply composer */}
            {replyingTo?.id === c.id && (
              <div style={{ marginLeft: 52, marginTop: 12 }}>
                <Composer
                  session={session}
                  onSignIn={onSignIn}
                  placeholder={`reply to ${c.user}…`}
                  sending={sending}
                  autoFocus
                  compact
                  onSubmit={(t) => { submit(t, c.id); setReplyingTo(null); }}
                  onCancel={() => setReplyingTo(null)}
                />
              </div>
            )}
            {/* Replies */}
            {repliesFor(c.id).length > 0 && (
              <div style={{ marginLeft: 52, marginTop: 16, display: "flex", flexDirection: "column", gap: 18 }}>
                {repliesFor(c.id).map((r) => (
                  <CommentRow key={r.id} c={r} isReply/>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// Shared composer — used for top-level and inline replies
const Composer = ({ session, onSignIn, placeholder, sending, onSubmit, onCancel, autoFocus, compact }) => {
  const [draft, setDraft] = React.useState("");
  const [focused, setFocused] = React.useState(!!autoFocus);

  const handleSubmit = () => {
    if (!session) { onSignIn(); return; }
    const t = draft.trim();
    if (!t || sending) return;
    onSubmit(t);
    setDraft("");
    setFocused(false);
  };

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "40px 1fr", gap: compact ? 10 : 14,
      padding: compact ? "12px 14px" : "16px 18px", borderRadius: 8,
      border: "1px solid " + (focused ? "var(--ink-soft)" : "var(--hairline)"),
      background: "var(--paper)",
      transition: "border-color .18s var(--ease-out)",
      marginBottom: compact ? 0 : 30,
    }} onClick={() => { if (!session) onSignIn(); }}>
      <Avatar
        initial={session ? session.nickname[0].toUpperCase() : "?"}
        color={session ? (session.role === "admin" ? "rust" : "pine") : "ink"}
        size={compact ? 28 : 36}
      />
      <div style={{ minWidth: 0 }}>
        {!compact && session && (
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{session.nickname}</span>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: session.role === "admin" ? "var(--rust)" : "var(--ink-mute)",
            }}>{session.role}</span>
          </div>
        )}
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!draft) setFocused(false); }}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); if (e.key === "Escape" && onCancel) onCancel(); }}
          disabled={!session}
          placeholder={placeholder}
          autoFocus={autoFocus}
          rows={focused || draft ? 3 : 1}
          style={{
            width: "100%", boxSizing: "border-box", border: 0, outline: "none",
            background: "transparent", resize: "none",
            fontFamily: "var(--font-serif)", fontSize: compact ? 14 : 15, lineHeight: 1.55,
            color: "var(--ink)", padding: 0,
            cursor: session ? "text" : "pointer",
          }}
        />
        {(focused || draft) && (
          <div style={{
            display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 8,
            marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--hairline-soft)",
          }}>
            {onCancel && (
              <Button variant="ghost" onClick={onCancel}>cancel</Button>
            )}
            <Button variant="primary" onClick={handleSubmit} disabled={!draft.trim() || sending}>
              {sending ? "sending…" : <span>send <I.Arrow size={13}/></span>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const normalizeComment = (c) => ({
  id: c.id,
  user: c.user,
  initial: (c.user || "?")[0].toUpperCase(),
  avatarColor: c.avatarColor || "pine",
  time: c.time || "now",
  text: c.text,
  isAuthor: c.isAuthor || false,
  replyTo: c.replyTo || null,
});

const CommentRow = ({ c, replyingTo, onReply, isReply }) => (
  <div style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 14 }}>
    <Avatar initial={c.initial} color={c.avatarColor} size={isReply ? 28 : 36}/>
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: isReply ? 12.5 : 13.5,
          fontWeight: 600, color: "var(--ink)",
        }}>{c.user}</span>
        {c.isAuthor && (
          <span style={{
            padding: "1px 7px", borderRadius: 999,
            background: "var(--rust-wash)", color: "var(--rust-deep)",
            fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600,
            letterSpacing: "0.1em",
          }}>author</span>
        )}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)" }}>{c.time}</span>
      </div>
      <div style={{
        fontFamily: "var(--font-serif)", fontSize: isReply ? 14.5 : 15.5, lineHeight: 1.6,
        color: "var(--ink)", textWrap: "pretty", whiteSpace: "pre-wrap",
      }}>{c.text}</div>
      {!isReply && onReply && (
        <div style={{ marginTop: 8 }}>
          <button
            onClick={onReply}
            style={{
              border: 0, background: "transparent", padding: 0, cursor: "pointer",
              fontFamily: "var(--font-sans)", fontSize: 12,
              color: replyingTo?.id === c.id ? "var(--ink)" : "var(--ink-mute)",
              textDecoration: replyingTo?.id === c.id ? "underline" : "none",
              textUnderlineOffset: 3,
            }}
          >{replyingTo?.id === c.id ? "cancel reply" : "reply"}</button>
        </div>
      )}
    </div>
  </div>
);

window.Comments = Comments;
