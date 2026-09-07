// Editor.jsx — admin compose view with markdown body, image upload, video insert,
// and cover-picker.

const Editor = ({ onCancel, onPublish, onEditPublished, session, editId }) => {
  const isMobile = useIsMobile();
  const [mobileTab, setMobileTab] = React.useState("write"); // "write" | "preview"
  const [title, setTitle] = React.useState("");
  const [cat, setCat] = React.useState("eng");
  const [cover, setCover] = React.useState({ motif: "router", tint: "indigo" });
  const [coverSrc, setCoverSrc] = React.useState(null);
  const [body, setBody] = React.useState(
`# Drafting in markdown

Write something true. Try a *quote*, a \`code\` snippet, or paste a link to get a preview card.

> A short axiom you actually believe.

\`\`\`python
for day in week:
    work(day)
\`\`\`
`
  );

  const textareaRef = React.useRef(null);
  const fileRef = React.useRef(null);
  const coverRef = React.useRef(null);

  const [publishing, setPublishing] = React.useState(false);
  const [pubError, setPubError] = React.useState("");
  const [loading, setLoading] = React.useState(!!editId);

  // When editing an existing post, load it and populate the fields.
  React.useEffect(() => {
    if (!editId) { setLoading(false); return; }
    setLoading(true);
    API.get(`/posts/${editId}`).then((post) => {
      if (post && post.id) {
        setTitle(post.title || "");
        setCat(post.cat || "eng");
        const c = post.cover || {};
        setCover({ motif: c.motif || "router", tint: c.tint || "indigo" });
        setCoverSrc(c.src || null);
        // Prefer the stored markdown (lossless); fall back to a lossy
        // reconstruction for legacy posts that pre-date the markdown field.
        setBody(post.markdown || blocksToMarkdown(post.body));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [editId]);

  const doPublish = async () => {
    if (!title.trim()) { setPubError("先写个标题吧。"); return; }
    setPubError("");
    setPublishing(true);
    try {
      const blocks = markdownToBlocks(body);
      const payload = {
        title: title.trim(),
        cat,
        body: blocks,
        markdown: body,
        cover: { motif: cover.motif, tint: cover.tint, src: coverSrc || null },
        status: "published",
      };
      const opts = session ? { nickname: session.nickname, token: session.token } : {};
      let post;
      if (editId) {
        post = await API.put(`/posts/${editId}`, payload, opts);
      } else {
        post = await API.post("/posts", payload, opts);
      }
      if (post && (post.id || post.ok)) {
        if (editId && onEditPublished && post.id) onEditPublished(post);
        else onPublish(post);
      } else {
        setPubError((post && post.error) || "保存失败，请重试。");
        setPublishing(false);
      }
    } catch (e) {
      setPubError("网络错误，保存失败。");
      setPublishing(false);
    }
  };

  const insertAtCursor = (text) => {
    const el = textareaRef.current;
    if (!el) { setBody(body + "\n\n" + text); return; }
    const start = el.selectionStart, end = el.selectionEnd;
    const before = body.slice(0, start), after = body.slice(end);
    const padBefore = before.endsWith("\n\n") || before === "" ? "" : "\n\n";
    const padAfter = after.startsWith("\n\n") || after === "" ? "" : "\n\n";
    const next = before + padBefore + text + padAfter + after;
    setBody(next);
    setTimeout(() => {
      el.focus();
      const cursor = (before + padBefore + text).length;
      el.setSelectionRange(cursor, cursor);
    }, 0);
  };

  const onImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      insertAtCursor(`![${file.name.replace(/\.[^.]+$/, "")}](${reader.result})`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCoverSrc(reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const insertVideo = () => {
    insertAtCursor(`@video[paste a youtube / bilibili URL or filename here]`);
  };

  const pad = isMobile ? "16px 16px 60px" : "32px 44px";
  const showComposer = !isMobile || mobileTab === "write";
  const showPreview = !isMobile || mobileTab === "preview";

  return (
    <div style={{
      height: "100%", overflow: "hidden", background: "var(--paper)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        height: 56, borderBottom: "1px solid var(--hairline)",
        display: "flex", alignItems: "center",
        padding: isMobile ? "0 12px" : "0 32px", gap: isMobile ? 8 : 14,
        background: "var(--paper)", flexShrink: 0,
      }}>
        <Eyebrow color="var(--rust)">{editId ? "Admin · Edit" : "Admin · Compose"}</Eyebrow>
        <div style={{ flex: 1 }}/>
        {!isMobile && (
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11,
            color: pubError ? "var(--rust)" : "var(--ink-mute)",
          }}>{pubError || (loading ? "loading…" : (editId ? "editing · " + editId : "autosaved · just now"))}</span>
        )}
        {isMobile && pubError && (
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--rust)", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pubError}</span>
        )}
        <Button variant="ghost" onClick={onCancel} style={isMobile ? { padding: "6px 10px", fontSize: 12 } : undefined}>Cancel</Button>
        {editId ? null : (isMobile ? null : <Button variant="secondary">Save draft</Button>)}
        <Button variant="primary" onClick={doPublish} disabled={publishing || loading} leadIcon={isMobile ? null : <I.Arrow size={14}/>}
          style={isMobile ? { padding: "6px 14px", fontSize: 13 } : undefined}>
          {publishing ? "…" : (editId ? "Save" : "Publish")}
        </Button>
      </div>

      {/* Mobile tab toggle */}
      {isMobile && (
        <div style={{ display: "flex", borderBottom: "1px solid var(--hairline)", background: "var(--paper)", flexShrink: 0 }}>
          <button onClick={() => setMobileTab("write")} style={mobileTabBtn(mobileTab === "write")}>✎ Write</button>
          <button onClick={() => setMobileTab("preview")} style={mobileTabBtn(mobileTab === "preview")}>👁 Preview</button>
        </div>
      )}

      {/* Body */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
        minHeight: 0,
      }}>
        {/* LEFT — composer */}
        {showComposer && (
          <div style={{
            overflow: "auto", padding: pad,
            borderRight: isMobile ? "none" : "1px solid var(--hairline)",
          }}>
            <Eyebrow>Category</Eyebrow>
            <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 24, flexWrap: "wrap" }}>
              {Object.entries(CATEGORIES).map(([k, c]) => (
                <Pill key={k} active={cat === k} onClick={() => {
                  setCat(k);
                  if (!coverSrc) setCover({ ...cover, tint: k === "eng" ? "indigo" : k === "research" ? "pine" : "rust" });
                }}>{isMobile ? c.cn : c.cn + " · " + c.en}</Pill>
              ))}
            </div>

            <Eyebrow>Cover</Eyebrow>
            <div style={{
              display: "flex", flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 16 : 12, marginTop: 10, marginBottom: 8,
              alignItems: isMobile ? "stretch" : "flex-start",
            }}>
              <div style={{ width: isMobile ? "100%" : 180, flexShrink: 0 }}>
                <CoverArt cover={cover} src={coverSrc} size="card"/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-mute)",
                  marginBottom: 6,
                }}>motif</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {["router", "paper", "mountain", "code", "attention", "path", "diagram"].map((m) => (
                    <button key={m}
                      onClick={() => { setCover({ ...cover, motif: m }); setCoverSrc(null); }}
                      style={miniPick(cover.motif === m && !coverSrc)}>
                      {m}
                    </button>
                  ))}
                </div>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-mute)",
                  marginTop: 12, marginBottom: 6,
                }}>or upload your own</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Button variant="secondary" onClick={() => coverRef.current.click()} style={isMobile ? { padding: "6px 12px", fontSize: 12 } : undefined}>
                    <I.Plus size={13}/> upload cover
                  </Button>
                  {coverSrc && (
                    <button onClick={() => setCoverSrc(null)} style={{
                      border: 0, background: "transparent", cursor: "pointer",
                      fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-mute)",
                      textDecoration: "underline",
                    }}>remove</button>
                  )}
                  <input ref={coverRef} type="file" accept="image/*" onChange={onCoverFile} style={{ display: "none" }}/>
                </div>
              </div>
            </div>

            <Eyebrow>Title</Eyebrow>
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="something small and true…"
              style={{
                width: "100%", boxSizing: "border-box",
                fontFamily: "var(--font-display)", fontSize: isMobile ? 26 : 34, fontWeight: 500,
                color: "var(--ink)", background: "transparent",
                border: 0, borderBottom: "1px solid var(--hairline)",
                padding: "8px 0 12px", outline: "none", marginTop: 10, marginBottom: 22,
                lineHeight: 1.1,
              }}/>

            <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12 }}>
              <Eyebrow>Body · md</Eyebrow>
              <div style={{ flex: 1 }}/>
              <button onClick={() => fileRef.current.click()} style={toolBtn()}>
                <I.Plus size={12}/> image
              </button>
              <button onClick={insertVideo} style={toolBtn()}>
                <I.Play size={11}/> video
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={onImageFile} style={{ display: "none" }}/>
            </div>
            <textarea ref={textareaRef} value={body} onChange={(e) => setBody(e.target.value)}
              style={{
                width: "100%", boxSizing: "border-box", marginTop: 10,
                height: isMobile ? "55vh" : 380, resize: "vertical",
                fontFamily: "var(--font-mono)", fontSize: isMobile ? 13 : 13.5, lineHeight: 1.7,
                color: "var(--ink)", background: "var(--paper-soft)",
                border: "1px solid var(--hairline)", borderRadius: 4,
                padding: "16px 18px", outline: "none",
              }}/>
            <div style={{
              marginTop: 10, fontFamily: "var(--font-mono)",
              fontSize: isMobile ? 10 : 11,
              color: "var(--ink-mute)", display: "flex", gap: isMobile ? 10 : 16, flexWrap: "wrap",
            }}>
              <span>**bold**</span><span>*italic*</span><span>`code`</span>
              <span>`{">"}` quote</span><span>``` block</span>
              <span>![alt](url) image</span><span>@video[url] video</span>
            </div>
          </div>
        )}

        {/* RIGHT — live preview */}
        {showPreview && (
          <div style={{ overflow: "auto", padding: pad, background: "var(--paper)" }}>
            <Eyebrow>Preview</Eyebrow>
            <div style={{ marginTop: 18 }}>
              <div style={{ marginBottom: 28 }}>
                <CoverArt cover={cover} src={coverSrc} size="card"/>
              </div>
              <div style={{ maxWidth: "60ch" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
                  <Seal cat={cat} size={30}/>
                  <div style={{ fontFamily: "var(--font-cn-display)", fontSize: 14, color: "var(--ink)" }}>{CATEGORIES[cat].cn}</div>
                </div>
                <h1 style={{
                  fontFamily: "var(--font-display)", fontWeight: 500,
                  fontSize: isMobile ? 28 : 44, lineHeight: 1.05, color: title ? "var(--ink)" : "var(--ink-faint)",
                  margin: "0 0 18px", letterSpacing: "-0.012em",
                }}>{title || "untitled essay"}</h1>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-mute)",
                  marginBottom: 32, letterSpacing: "0.04em",
                }}>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
                <div dangerouslySetInnerHTML={{ __html: miniMarkdown(body) }}/>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const toolBtn = () => ({
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "5px 10px", borderRadius: 999,
  border: "1px solid var(--hairline)", background: "var(--paper)",
  fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-soft)",
  cursor: "pointer",
});
const mobileTabBtn = (active) => ({
  flex: 1, padding: "10px 0", border: 0, cursor: "pointer",
  background: active ? "var(--paper-soft)" : "var(--paper)",
  fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: active ? 600 : 400,
  color: active ? "var(--ink)" : "var(--ink-mute)",
  borderBottom: active ? "2px solid var(--rust)" : "2px solid transparent",
  transition: "all .18s var(--ease-out)",
});
const miniPick = (active) => ({
  padding: "5px 10px", borderRadius: 999, cursor: "pointer",
  border: "1px solid " + (active ? "var(--ink)" : "var(--hairline)"),
  background: active ? "var(--ink)" : "var(--paper)",
  color: active ? "var(--paper)" : "var(--ink-soft)",
  fontFamily: "var(--font-mono)", fontSize: 11,
});

// Very small markdown → HTML for the preview pane.
function miniMarkdown(src) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks = src.split(/\n{2,}/);
  return blocks.map((b) => {
    if (b.startsWith("```")) {
      const code = b.replace(/^```\w*\n?/, "").replace(/```$/, "");
      return `<pre style="background:#1F1B16;color:#E8DFC9;font-family:var(--font-mono);font-size:13px;line-height:1.65;padding:14px 16px;border-radius:6px;overflow:auto;margin:22px 0">${esc(code)}</pre>`;
    }
    if (b.startsWith("#")) {
      const m = b.match(/^(#+)\s+(.*)$/);
      const level = Math.min(m[1].length, 3);
      const sz = level === 1 ? 30 : level === 2 ? 24 : 19;
      return `<h${level} style="font-family:var(--font-display);font-weight:500;font-size:${sz}px;line-height:1.2;letter-spacing:-0.01em;color:var(--ink);margin:30px 0 12px">${esc(m[2])}</h${level}>`;
    }
    if (b.startsWith(">")) {
      const t = b.replace(/^>\s*/, "");
      return `<blockquote style="font-family:var(--font-display);font-style:italic;font-size:22px;line-height:1.45;color:var(--ink-soft);border-left:2px solid var(--rust);padding-left:20px;margin:28px 0">${esc(t)}</blockquote>`;
    }
    // Image: ![alt](src)
    const imgMatch = b.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      const cap = alt ? `<figcaption style="margin-top:8px;font-family:var(--font-sans);font-size:12px;color:var(--ink-mute);font-style:italic">${esc(alt)}</figcaption>` : "";
      return `<figure style="margin:26px 0"><img src="${src}" alt="${esc(alt)}" style="width:100%;border-radius:6px;display:block;background:var(--paper-deep)"/>${cap}</figure>`;
    }
    // Video: @video[caption]
    const vidMatch = b.match(/^@video\[([^\]]*)\]$/);
    if (vidMatch) {
      return `<figure style="margin:26px 0"><div style="aspect-ratio:16/9;border-radius:6px;background:linear-gradient(135deg,#2A2520,#1A1612);position:relative;box-shadow:var(--shadow-2)"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><div style="width:54px;height:54px;border-radius:999px;border:1.5px solid rgba(245,241,232,0.9);display:flex;align-items:center;justify-content:center;color:var(--paper)"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg></div></div><div style="position:absolute;bottom:10px;left:14px;font-family:var(--font-mono);font-size:11px;color:rgba(245,241,232,0.7)">${esc(vidMatch[1] || "video")}</div></div></figure>`;
    }
    let line = esc(b);
    // inline image
    line = line.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:4px;margin:6px 0"/>');
    line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/\*(.+?)\*/g, '<em style="font-style:italic">$1</em>');
    line = line.replace(/`([^`]+)`/g, '<code style="font-family:var(--font-mono);font-size:0.92em;background:var(--paper-soft);padding:0 5px;border-radius:2px">$1</code>');
    return `<p style="font-family:var(--font-serif);font-size:17px;line-height:1.65;color:var(--ink);margin:0 0 22px;text-wrap:pretty">${line}</p>`;
  }).join("");
}

// markdown → article blocks (drop/p/h1/h2/h3/quote/code/image/video/hr/list)
// Inline formatting (**bold**, *italic*, `code`, [link](url)) is left raw —
// the article renderer's renderText() handles it.
function markdownToBlocks(src) {
  const lines = String(src || "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  const pushPara = (text) => {
    const t = text.trim();
    if (!t) return;
    // First paragraph becomes a "drop" (drop-cap), rest are plain paragraphs.
    if (blocks.length === 0) blocks.push({ type: "drop", text: t });
    else blocks.push({ type: "p", text: t });
  };
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      const lang = fence[1] || "";
      const code = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
      i++;
      blocks.push({ type: "code", lang, code: code.join("\n") });
      continue;
    }
    const h = line.match(/^(#{1,3})\s+(.*)$/);
    if (h) { blocks.push({ type: "h" + h[1].length, text: h[2].trim() }); i++; continue; }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { blocks.push({ type: "hr" }); i++; continue; }
    if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
      blocks.push({ type: "quote", text: q.join(" ").trim() });
      continue;
    }
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (img) { blocks.push({ type: "image", alt: img[1], src: img[2], caption: img[1] }); i++; continue; }
    const vid = line.match(/^@video\[([^\]]*)\]\s*$/);
    if (vid) { blocks.push({ type: "video", caption: vid[1], title: vid[1] }); i++; continue; }
    if (/^[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) { items.push({ text: lines[i].replace(/^[-*+]\s+/, "") }); i++; }
      blocks.push({ type: "list", ordered: false, items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) { items.push({ text: lines[i].replace(/^\d+\.\s+/, "") }); i++; }
      blocks.push({ type: "list", ordered: true, items });
      continue;
    }
    if (line.trim() === "") { i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() !== "" &&
      !/^```/.test(lines[i]) && !/^#{1,3}\s/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) && !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) && !/^!\[[^\]]*\]\([^)]+\)\s*$/.test(lines[i]) &&
      !/^@video\[/.test(lines[i]) && !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    pushPara(para.join(" "));
  }
  return blocks;
}

// blocks → markdown (lossy). Only used for legacy posts that have no stored
// `markdown` field; new posts created/edited through this editor keep the
// original source verbatim. Inline **bold**/*italic*/`code` is not recoverable.
function blocksToMarkdown(blocks) {
  return (blocks || []).map((b) => {
    switch (b.type) {
      case "drop": case "p": return b.text || "";
      case "h1": return "# " + (b.text || "");
      case "h2": return "## " + (b.text || "");
      case "h3": return "### " + (b.text || "");
      case "quote": return "> " + (b.text || "");
      case "code": return "```" + (b.lang || "") + "\n" + (b.code || "") + "\n```";
      case "image": return `![${b.alt || ""}](${b.src || ""})`;
      case "video": return `@video[${b.caption || ""}]`;
      case "list": return (b.items || []).map((it) => (b.ordered ? "1. " : "- ") + (it.text || "")).join("\n");
      case "hr": return "---";
      default: return b.text || "";
    }
  }).filter(Boolean).join("\n\n");
}
window.blocksToMarkdown = blocksToMarkdown;

window.Editor = Editor;
