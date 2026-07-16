// Article.jsx — article reader with markdown features + highlight/comment + gifts

const Article = ({ posts, postId, session, onSignIn, onBack }) => {
  const post = posts.find((p) => p.id === postId) || posts[0];
  const cat = CATEGORIES[post.cat];
  const scrollerRef = React.useRef(null);
  const proseRef = React.useRef(null);
  const isMobile = useIsMobile();

  const [highlights, setHighlights] = React.useState([]);
  const [gifts, setGifts] = React.useState({ ...post.gifts });
  const [activeSlug, setActiveSlug] = React.useState(null);

  // Scrollspy: highlight the TOC entry for the section currently in view
  React.useEffect(() => {
    const scroller = scrollerRef.current;
    const container = proseRef.current;
    if (!scroller || !container) return;
    const headings = [...container.querySelectorAll("h1[id], h2[id], h3[id]")];
    if (!headings.length) return;
    const onScroll = () => {
      const offset = 140;
      let current = headings[0].id;
      for (const h of headings) {
        if (h.getBoundingClientRect().top - offset <= 0) current = h.id;
        else break;
      }
      setActiveSlug(current);
    };
    onScroll();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [post.id, post.body]);

  // Load highlights from server on mount
  React.useEffect(() => {
    API.get(`/posts/${post.id}/highlights`).then(arr => {
      if (Array.isArray(arr)) setHighlights(arr.map(normalizeHL));
    }).catch(() => {});
  }, [post.id]);

  // Floating selection toolbar
  const [tool, setTool] = React.useState(null); // { x, y, text, range }
  const [pendingHL, setPendingHL] = React.useState(null); // text awaiting a comment

  const onMouseUp = () => {
    setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) { setTool(null); return; }
      const text = sel.toString().trim();
      if (text.length < 3) { setTool(null); return; }
      const r = sel.getRangeAt(0).getBoundingClientRect();
      const containerRect = proseRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      setTool({
        text,
        x: r.left + r.width / 2,
        y: r.top - 8,
      });
    }, 10);
  };

  const sendGift = (kind) => {
    // Optimistic update, then persist
    setGifts((g) => ({ ...g, [kind]: (g[kind] || 0) + 1 }));
    if (session) {
      API.post(`/posts/${post.id}/gifts/${kind}`, {}, { nickname: session.nickname })
        .then(d => { if (d && d.gifts) setGifts(d.gifts); })
        .catch(() => {});
    }
  };

  const addHighlight = (color) => {
    if (!tool || !session) {
      if (!session) onSignIn();
      setTool(null);
      return;
    }
    const anchor = tool.text;
    setTool(null);
    window.getSelection().removeAllRanges();
    API.post(`/posts/${post.id}/highlights`, { anchor, color, text: "" }, { nickname: session.nickname })
      .then(h => { if (h && h.id) setHighlights(arr => [...arr, normalizeHL(h)]); })
      .catch(() => {});
  };

  const startComment = () => {
    if (!session) { onSignIn(); return; }
    setPendingHL({ anchor: tool.text, color: "yellow", text: "" });
    setTool(null);
    window.getSelection().removeAllRanges();
  };

  const saveComment = () => {
    const { anchor, color, text } = pendingHL;
    setPendingHL(null);
    API.post(`/posts/${post.id}/highlights`, { anchor, color, text: text.trim() }, { nickname: session.nickname })
      .then(h => { if (h && h.id) setHighlights(arr => [...arr, normalizeHL(h)]); })
      .catch(() => {});
  };

  const normalizeHL = (h) => ({
    id: h.id,
    postId: post.id,
    anchor: h.anchor,
    color: h.color || "yellow",
    user: h.user,
    initial: (h.user || "?")[0].toUpperCase(),
    avatarColor: h.avatarColor || "pine",
    time: h.time || h.createdAt || "now",
    text: h.text || "",
  });

  // Build a map: anchor text → { color, isCommented }
  const hlMap = React.useMemo(() => {
    const m = new Map();
    for (const h of highlights) {
      const existing = m.get(h.anchor);
      if (!existing || h.text) m.set(h.anchor, h);
    }
    return m;
  }, [highlights]);

  return (
    <div ref={scrollerRef} onMouseUp={onMouseUp} style={{
      height: "100%", overflowY: "auto", background: "var(--paper)",
    }}>
      {/* sticky chrome */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20, height: 56,
        background: "rgba(245,241,232,0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--hairline)",
        display: "flex", alignItems: "center", padding: "0 32px", gap: 14,
      }}>
        <button onClick={onBack} style={{
          border: 0, background: "transparent", cursor: "pointer",
          fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink-soft)",
          display: "flex", alignItems: "center", gap: 6,
        }}>← back to notebook</button>
        <div style={{ flex: 1 }}/>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)",
        }}>{post.no} · {post.readTime}</div>
      </div>

      <article style={{
        maxWidth: 1260, margin: "0 auto",
        padding: isMobile ? "32px 18px 80px" : "60px 40px 140px",
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 196px",
        gap: isMobile ? 0 : 40,
      }}>
        <div style={{ minWidth: 0 }}>
          {/* Article hero cover (if any) */}
          {post.cover && (
            <div style={{ marginBottom: 40 }}>
              <CoverArt cover={post.cover} src={post.cover.src} size="hero"/>
            </div>
          )}

          {/* Header */}
          <div style={{ marginBottom: 48, maxWidth: "68ch" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <Seal cat={post.cat} size={36}/>
              <div>
                <div style={{
                  fontFamily: "var(--font-cn-display)", fontSize: 15,
                  fontWeight: 500, color: "var(--ink)", lineHeight: 1.1,
                }}>{cat.cn}</div>
                <div style={{
                  fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: cat.color,
                }}>{cat.en}</div>
              </div>
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 500,
              fontSize: isMobile ? 36 : 62,
              lineHeight: isMobile ? 1.15 : 1.05, letterSpacing: "-0.012em",
              color: "var(--ink)", margin: "0 0 24px",
            }} dangerouslySetInnerHTML={{
              __html: post.title.replace(/\*(.+?)\*/g, '<em style="font-style:italic">$1</em>'),
            }}/>
            <div style={{
              display: "flex", alignItems: "center", gap: 16,
              fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-mute)",
              letterSpacing: "0.04em",
            }}>
              <span>{post.date}</span><span>·</span><span>{post.readTime}</span>
              <span>·</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <I.Hi size={13}/> {highlights.length} highlight{highlights.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          {/* Prose body */}
          <div ref={proseRef} style={{ maxWidth: "68ch" }}>
            {(post.body || []).map((b, i) => (
              <ProseBlock key={i} block={b} hlMap={hlMap}/>
            ))}
          </div>

          {/* End of post — gifts + signature */}
          <hr style={{ margin: "60px 0 40px", border: 0, height: 1, background: "var(--hairline)", maxWidth: "68ch" }}/>
          <div style={{ maxWidth: "68ch" }}>
            <Eyebrow>Enjoyed it? · send a little something</Eyebrow>
            <div style={{ marginTop: 14 }}>
              <GiftBar post={{ ...post, gifts }} onSend={sendGift}/>
            </div>
            <div style={{
              marginTop: 36, fontFamily: "var(--font-display)", fontStyle: "italic",
              fontSize: 22, color: "var(--ink-soft)",
            }}>— Xu Wang, {post.date}</div>
          </div>

          {/* Margin notes (anchored to highlights) */}
          <div style={{ marginTop: 56, maxWidth: "68ch" }}>
            <Eyebrow>Margin notes · {highlights.length}</Eyebrow>
            <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 22 }}>
              {highlights.length === 0 && (
                <div style={{
                  fontFamily: "var(--font-serif)", fontStyle: "italic",
                  color: "var(--ink-mute)", fontSize: 15,
                }}>还没有评论。第一个高亮往往最有意思。</div>
              )}
              {highlights.map((c, i) => <Margin key={i} c={c}/>)}
            </div>
          </div>

          {/* Standalone Comments section */}
          <Comments postId={post.id} session={session} onSignIn={onSignIn}/>
        </div>

        {/* Right rail — TOC + marginalia preview — hidden on mobile */}
        <aside style={{ position: "relative", display: isMobile ? "none" : "block" }}>
          <div style={{
            position: "sticky", top: 96, fontFamily: "var(--font-sans)",
          }}>
            {/* Table of contents */}
            {(post.body || []).some((b) => b.type === "h1" || b.type === "h2" || b.type === "h3") && (
              <div style={{ marginBottom: 32 }}>
                <Eyebrow>目录 · Contents</Eyebrow>
                <nav style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 2 }}>
                  {(post.body || []).filter((b) => b.type === "h1" || b.type === "h2" || b.type === "h3").map((b, i) => {
                    const slug = b.text.replace(/\s+/g, "-").replace(/[^\w一-龥-]/g, "").toLowerCase();
                    const active = activeSlug === slug;
                    const level = b.type === "h1" ? 1 : b.type === "h2" ? 2 : 3;
                    const baseIndent = (level - 1) * 14;
                    const baseSize = level === 1 ? 13.5 : level === 2 ? 12.5 : 11.5;
                    const activeSize = level === 1 ? 15.5 : level === 2 ? 14.5 : 13;
                    return (
                      <a key={i} href={"#" + slug}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(slug);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: active ? activeSize : baseSize,
                          fontWeight: active ? 600 : (level === 1 ? 600 : 400),
                          color: active ? "var(--rust)" : (level === 1 ? "var(--ink)" : "var(--ink-soft)"),
                          textDecoration: "none",
                          paddingLeft: baseIndent,
                          lineHeight: 1.5, paddingTop: 4, paddingBottom: 4,
                          borderLeft: active
                            ? "2px solid var(--rust)"
                            : (level > 1 ? "1px solid var(--hairline)" : "2px solid transparent"),
                          marginLeft: active && level === 1 ? -2 : 0,
                          display: "block",
                          transition: "color .15s, font-size .15s, font-weight .15s",
                        }}
                        onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--ink)"; }}
                        onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = (level === 1 ? "var(--ink)" : "var(--ink-soft)"); }}
                      >{b.text}</a>
                    );
                  })}
                </nav>
              </div>
            )}
            <Eyebrow>Marginalia</Eyebrow>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14, opacity: 0.95 }}>
              {highlights.slice(0, 4).map((c, i) => (
                <div key={i}
                  onClick={() => {
                    const el = document.querySelector(`[data-anchor="${CSS.escape(c.anchor)}"]`);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  style={{
                    borderLeft: `2px solid var(--rust)`,
                    paddingLeft: 12, fontFamily: "var(--font-serif)",
                    fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-soft)",
                    cursor: "pointer",
                  }}>
                  <mark className={`hl-${c.color}`} style={{
                    fontStyle: "italic", padding: "0 2px",
                  }}>{c.anchor.slice(0, 60)}{c.anchor.length > 60 ? "…" : ""}</mark>
                  {c.text && (
                    <div style={{ marginTop: 4, color: "var(--ink-mute)", fontStyle: "normal" }}>
                      <span style={{ color: c.avatarColor === "rust" ? "var(--rust)" : "var(--pine)", fontWeight: 600, fontFamily: "var(--font-sans)", fontSize: 11 }}>{c.user}</span>
                      {" · "}{c.text.slice(0, 80)}{c.text.length > 80 ? "…" : ""}
                    </div>
                  )}
                </div>
              ))}
              {highlights.length === 0 && (
                <div style={{
                  fontFamily: "var(--font-serif)", fontStyle: "italic",
                  fontSize: 13, color: "var(--ink-faint)",
                }}>Select any sentence to highlight it.</div>
              )}
            </div>
          </div>
        </aside>
      </article>

      {/* Floating selection toolbar */}
      {tool && (
        <SelectionToolbar tool={tool} onHighlight={addHighlight} onComment={startComment}/>
      )}

      {/* Comment composer */}
      {pendingHL && (
        <CommentComposer
          hl={pendingHL}
          onChange={(v) => setPendingHL({ ...pendingHL, ...v })}
          onCancel={() => setPendingHL(null)}
          onSave={saveComment}
        />
      )}
    </div>
  );
};

// — Prose block —
const ProseBlock = ({ block, hlMap }) => {
  const isMobile = useIsMobile();
  const renderText = (text) => {
    // Wrap any anchor in hlMap with <mark>
    const anchors = [...hlMap.keys()].sort((a, b) => b.length - a.length);
    let nodes = [text];
    for (const a of anchors) {
      const next = [];
      for (const n of nodes) {
        if (typeof n !== "string") { next.push(n); continue; }
        const idx = n.indexOf(a);
        if (idx === -1) { next.push(n); continue; }
        const h = hlMap.get(a);
        next.push(n.slice(0, idx));
        next.push(
          <mark key={a} data-anchor={a} className={`hl-${h.color}`} style={{
            padding: "0 .15em", boxDecorationBreak: "clone",
            position: "relative",
          }}>{a}</mark>
        );
        next.push(n.slice(idx + a.length));
      }
      nodes = next;
    }
    // inline bold / italic / code / links — single combined pass to avoid clashes
    const INLINE_RE = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|`([^`]+?)`|\$([^$\n]+?)\$|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s一-鿿，。；！？、："'（）【】《》]+)|\*([^*]+?)\*)/g;
    const formatted = [];
    nodes.forEach((n, ni) => {
      if (typeof n !== "string") { formatted.push(n); return; }
      let last = 0, m, ki = 0;
      while ((m = INLINE_RE.exec(n))) {
        if (m.index > last) formatted.push(n.slice(last, m.index));
        const key = `i${ni}-${ki++}`;
        if (m[2] !== undefined) formatted.push(<strong key={key}><em>{m[2]}</em></strong>);
        else if (m[3] !== undefined) formatted.push(<strong key={key}>{m[3]}</strong>);
        else if (m[4] !== undefined) formatted.push(
          <code key={key} style={{
            fontFamily: "var(--font-mono)", fontSize: "0.88em", padding: "0.1em 0.35em",
            background: "var(--paper-deep)", borderRadius: 4, color: "var(--rust-deep)",
          }}>{m[4]}</code>
        );
        else if (m[5] !== undefined) formatted.push(<InlineMath key={key} tex={m[5]}/>);
        else if (m[6] !== undefined) formatted.push(
          <a key={key} href={m[7]} target="_blank" rel="noopener noreferrer"
             style={{ color: "var(--rust)", textDecoration: "underline", textUnderlineOffset: 3 }}>{m[6]}</a>
        );
        else if (m[8] !== undefined) formatted.push(
          <a key={key} href={m[8].replace(/[.,;)]+$/, "")} target="_blank" rel="noopener noreferrer"
             style={{ color: "var(--rust)", textDecoration: "underline", textUnderlineOffset: 3, wordBreak: "break-all" }}>{m[8]}</a>
        );
        else if (m[9] !== undefined) formatted.push(<em key={key}>{m[9]}</em>);
        last = INLINE_RE.lastIndex;
      }
      if (last < n.length) formatted.push(n.slice(last));
    });
    return formatted;
  };

  if (block.type === "drop") {
    const t = block.text;
    const first = t[0];
    return (
      <p style={{
        fontFamily: "var(--font-serif)", fontSize: isMobile ? 19 : 21, lineHeight: 1.65,
        color: "var(--ink)", margin: "0 0 24px",
      }}>
        <span style={{
          float: "left", fontFamily: "var(--font-display)",
          fontSize: isMobile ? 56 : 78, lineHeight: 0.85,
          marginRight: isMobile ? 6 : 8, marginTop: isMobile ? 4 : 6,
          color: "var(--rust)", fontWeight: 500,
        }}>{first}</span>
        {renderText(t.slice(1))}
      </p>
    );
  }
  if (block.type === "p") return <p style={isMobile ? pStyleMobile : pStyle}>{renderText(block.text)}</p>;
  if (block.type === "h1") {
    const slug = block.text.replace(/\s+/g, "-").replace(/[^\w一-龥-]/g, "").toLowerCase();
    return (
      <h1 id={slug} style={{
        fontFamily: "var(--font-display)", fontWeight: 600,
        fontSize: isMobile ? 26 : 40, lineHeight: 1.18, color: "var(--ink)",
        margin: isMobile ? "40px 0 18px" : "60px 0 24px", letterSpacing: "-0.01em",
        paddingBottom: 14, borderBottom: "1px solid var(--hairline)",
      }}>{block.text}</h1>
    );
  }
  if (block.type === "h2") {
    const slug = block.text.replace(/\s+/g, "-").replace(/[^\w一-龥-]/g, "").toLowerCase();
    return <h2 id={slug} style={isMobile ? h2StyleMobile : h2Style}>{block.text}</h2>;
  }
  if (block.type === "h3") {
    const slug = block.text.replace(/\s+/g, "-").replace(/[^\w一-龥-]/g, "").toLowerCase();
    return (
      <h3 id={slug} style={{
        fontFamily: "var(--font-display)", fontWeight: 500,
        fontSize: isMobile ? 18 : 23, lineHeight: 1.3, color: "var(--ink-soft)",
        margin: isMobile ? "26px 0 12px" : "36px 0 14px", letterSpacing: "-0.005em",
      }}>{block.text}</h3>
    );
  }
  if (block.type === "list") return <ProseList block={block} renderText={renderText} isMobile={isMobile}/>;
  if (block.type === "table") return <ProseTable block={block} renderText={renderText} isMobile={isMobile}/>;
  if (block.type === "aside") return <ProseAside block={block} renderText={renderText} isMobile={isMobile}/>;
  if (block.type === "math") return <MathBlock tex={block.tex}/>;
  if (block.type === "mermaid") return <MermaidBlock code={block.code}/>;
  if (block.type === "quote") return (
    <blockquote style={{
      fontFamily: "var(--font-display)", fontStyle: "italic",
      fontSize: isMobile ? 20 : 26, lineHeight: 1.45, color: "var(--ink-soft)",
      borderLeft: "2px solid var(--rust)", paddingLeft: isMobile ? 14 : 22,
      margin: isMobile ? "24px 0" : "36px 0",
    }}>{renderText(block.text)}</blockquote>
  );
  if (block.type === "code") return <CodeBlock block={block}/>;
  if (block.type === "link") return <LinkPreview {...block}/>;
  if (block.type === "video") return <VideoEmbed {...block}/>;
  if (block.type === "hr") return <hr style={{ margin: "44px 0", border: 0, height: 1, background: "var(--hairline)", maxWidth: "68ch" }}/>;
  if (block.type === "image") return <ArticleImage {...block}/>;
  return null;
};

// — Lists (supports nested lists / asides / paragraphs inside items) —
const ProseList = ({ block, renderText, isMobile, depth = 0 }) => {
  const Tag = block.ordered ? "ol" : "ul";
  return (
    <Tag style={{
      margin: depth === 0 ? (isMobile ? "0 0 22px" : "0 0 24px") : "8px 0 0",
      paddingLeft: isMobile ? 22 : 26,
      fontFamily: "var(--font-serif)", fontSize: isMobile ? 18 : 19,
      lineHeight: 1.65, color: "var(--ink)",
    }}>
      {block.items.map((item, i) => (
        <li key={i} style={{ margin: "6px 0" }}>
          <span>{renderText(item.text)}</span>
          {item.children && item.children.map((child, ci) => (
            child.type === "list"
              ? <ProseList key={ci} block={child} renderText={renderText} isMobile={isMobile} depth={depth + 1}/>
              : child.type === "aside"
              ? <ProseAside key={ci} block={child} renderText={renderText} isMobile={isMobile}/>
              : child.type === "image"
              ? <ArticleImage key={ci} {...child}/>
              : child.type === "code"
              ? <CodeBlock key={ci} block={child}/>
              : child.type === "mermaid"
              ? <MermaidBlock key={ci} code={child.code}/>
              : <p key={ci} style={{
                  fontFamily: "var(--font-serif)", fontSize: isMobile ? 17 : 18,
                  lineHeight: 1.6, color: "var(--ink-soft)", margin: "8px 0 0",
                }}>{renderText(child.text)}</p>
          ))}
        </li>
      ))}
    </Tag>
  );
};

// — Tables —
const ProseTable = ({ block, renderText, isMobile }) => (
  <div style={{ overflowX: "auto", margin: isMobile ? "24px 0" : "32px 0" }}>
    <table style={{
      borderCollapse: "collapse", width: "100%", minWidth: isMobile ? 480 : "auto",
      fontFamily: "var(--font-sans)", fontSize: isMobile ? 14 : 15,
    }}>
      <thead>
        <tr>
          {block.header.map((h, i) => (
            <th key={i} style={{
              textAlign: "left", padding: "10px 14px", color: "var(--ink)",
              borderBottom: "2px solid var(--ink)", fontWeight: 600,
              whiteSpace: "nowrap",
            }}>{renderText(h)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {block.rows.map((row, ri) => (
          <tr key={ri} style={{ borderBottom: "1px solid var(--hairline)" }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{ padding: "10px 14px", color: "var(--ink-soft)", verticalAlign: "top" }}>{renderText(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// — Asides / callouts —
const ProseAside = ({ block, renderText, isMobile }) => (
  <div style={{
    display: "flex", gap: 12, alignItems: "flex-start",
    background: "var(--rust-paper)", border: "1px solid var(--rust-wash)",
    borderRadius: 8, padding: isMobile ? "14px 16px" : "18px 22px",
    margin: isMobile ? "22px 0" : "30px 0",
  }}>
    <span style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.5 }}>💡</span>
    <div>
      {(block.paragraphs || []).map((p, i) => (
        <p key={i} style={{
          fontFamily: "var(--font-serif)", fontSize: isMobile ? 16 : 17,
          lineHeight: 1.65, color: "var(--ink-soft)",
          margin: i === 0 ? 0 : "10px 0 0",
        }}>{renderText(p)}</p>
      ))}
    </div>
  </div>
);

// — Math (KaTeX) —
const InlineMath = ({ tex }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.katex) {
      try {
        window.katex.render(tex, ref.current, { displayMode: false, throwOnError: false });
      } catch (e) { ref.current.textContent = tex; }
    }
  }, [tex]);
  return <span ref={ref}>{tex}</span>;
};

const MathBlock = ({ tex }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.katex) {
      try {
        window.katex.render(tex, ref.current, { displayMode: true, throwOnError: false });
      } catch (e) { ref.current.textContent = tex; }
    }
  }, [tex]);
  return <div ref={ref} style={{ margin: "32px 0", overflowX: "auto", textAlign: "center", fontSize: 18 }}>{tex}</div>;
};

// — Mermaid diagrams —
let mermaidSeq = 0;
const MermaidBlock = ({ code }) => {
  const ref = React.useRef(null);
  const [svg, setSvg] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    if (window.mermaid) {
      try {
        window.mermaid.initialize({ startOnLoad: false, theme: "neutral",
          themeVariables: { fontFamily: "var(--font-sans)", primaryColor: "#EFD5C8", primaryBorderColor: "#A03A1F", lineColor: "#6B6258" } });
        const id = `mermaid-${++mermaidSeq}`;
        window.mermaid.render(id, code).then(({ svg }) => { if (!cancelled) setSvg(svg); }).catch(() => {});
      } catch (e) {}
    }
    return () => { cancelled = true; };
  }, [code]);
  return (
    <div style={{
      margin: "30px 0", padding: "20px", overflowX: "auto",
      background: "var(--paper-soft)", borderRadius: 8, border: "1px solid var(--hairline)",
      display: "flex", justifyContent: "center",
    }}>
      {svg
        ? <div ref={ref} dangerouslySetInnerHTML={{ __html: svg }}/>
        : <pre style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink-mute)", margin: 0 }}>{code}</pre>}
    </div>
  );
};

const ArticleImage = ({ src, motif, tint, caption, alt }) => (
  <figure style={{ margin: "32px 0" }}>
    {src ? (
      <img src={src} alt={alt || caption || ""} style={{
        width: "100%", height: "auto", display: "block", borderRadius: 4,
      }}/>
    ) : (
      <CoverArt cover={{ motif, tint }} size="card"/>
    )}
    {caption && (
      <figcaption style={{
        marginTop: 10, fontFamily: "var(--font-sans)", fontSize: 12,
        color: "var(--ink-mute)", fontStyle: "italic",
      }}>{caption}</figcaption>
    )}
  </figure>
);

const pStyle = {
  fontFamily: "var(--font-serif)", fontSize: 19, lineHeight: 1.65,
  color: "var(--ink)", margin: "0 0 22px", textWrap: "pretty",
};
const h2Style = {
  fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 32,
  lineHeight: 1.2, color: "var(--ink)", margin: "44px 0 18px",
  letterSpacing: "-0.01em",
};
const pStyleMobile = {
  fontFamily: "var(--font-serif)", fontSize: 18, lineHeight: 1.7,
  color: "var(--ink)", margin: "0 0 20px", textWrap: "pretty",
};
const h2StyleMobile = {
  fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22,
  lineHeight: 1.25, color: "var(--ink)", margin: "32px 0 14px",
  letterSpacing: "-0.01em",
};

const CodeBlock = ({ block }) => {
  const lines = block.code.split("\n");
  return (
    <div style={{
      background: "#1F1B16", borderRadius: 6, overflow: "hidden",
      boxShadow: "var(--shadow-2)", margin: "26px 0",
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 16px", borderBottom: "1px solid rgba(245,241,232,0.08)",
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: "rgba(245,241,232,0.5)",
      }}>
        <span>router.py</span><span>{block.lang}</span>
      </div>
      <pre style={{
        margin: 0, padding: "16px 18px", fontFamily: "var(--font-mono)",
        fontSize: 13.5, lineHeight: 1.65, color: "#E8DFC9", overflow: "auto",
      }}>
        {lines.map((ln, i) => (
          <div key={i} style={{ display: "flex" }}>
            <span style={{
              width: 28, opacity: 0.35, userSelect: "none", flexShrink: 0,
            }}>{i + 1}</span>
            <span dangerouslySetInnerHTML={{ __html: highlightLine(ln) }}/>
          </div>
        ))}
      </pre>
    </div>
  );
};
const highlightLine = (ln) => {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let out = esc(ln);
  out = out.replace(/(#.*)$/g, '<span style="color:#968B7B">$1</span>');
  out = out.replace(/(&quot;[^&]*?&quot;|&#039;[^&]*?&#039;|"[^"]*")/g, '<span style="color:#F2A5B5">$1</span>');
  out = out.replace(/\b(def|return|if|in|else|elif|for|while|import|from|as|class)\b/g, '<span style="color:#C95A38">$1</span>');
  out = out.replace(/\b(str|int|float|bool|list|dict|Tool)\b/g, '<span style="color:#9CC9B8">$1</span>');
  return out;
};

const SelectionToolbar = ({ tool, onHighlight, onComment }) => (
  <div style={{
    position: "fixed", left: tool.x, top: tool.y, zIndex: 90,
    transform: "translate(-50%, -100%)",
    display: "flex", alignItems: "center", gap: 2,
    background: "rgba(245,241,232,0.92)",
    backdropFilter: "blur(20px)",
    border: "1px solid var(--hairline)",
    borderRadius: 999, boxShadow: "var(--shadow-3)",
    padding: "5px 6px",
    animation: "popIn 180ms var(--ease-spring)",
  }}>
    {["yellow", "pink", "mint", "blue"].map((c) => (
      <button key={c} onClick={() => onHighlight(c)} style={{
        width: 26, height: 26, border: 0, cursor: "pointer",
        borderRadius: 999, background: `var(--hl-${c})`,
        boxShadow: `inset 0 0 0 1px var(--hl-${c}-edge)`,
      }} title={c}/>
    ))}
    <div style={{ width: 1, height: 18, background: "var(--hairline)", margin: "0 4px" }}/>
    <button onClick={onComment} style={{
      display: "flex", alignItems: "center", gap: 6, border: 0,
      background: "transparent", padding: "4px 10px",
      fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink)",
      cursor: "pointer", borderRadius: 999,
    }}>
      <I.Msg size={13}/> comment
    </button>
  </div>
);

const CommentComposer = ({ hl, onChange, onCancel, onSave }) => (
  <div onClick={onCancel} style={{
    position: "fixed", inset: 0, zIndex: 95,
    background: "rgba(26,22,18,0.32)", backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    animation: "fadeIn 200ms var(--ease-out)",
  }}>
    <div onClick={(e) => e.stopPropagation()} style={{
      width: 540, background: "var(--paper)", borderRadius: 8,
      boxShadow: "var(--shadow-4)", padding: "26px 28px",
      animation: "modalIn 280ms var(--ease-out)",
    }}>
      <Eyebrow>Comment on highlight</Eyebrow>
      <div style={{
        marginTop: 12, padding: "8px 0 8px 14px",
        borderLeft: "2px solid var(--rust)",
        fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 15,
      }}>
        <mark className={`hl-${hl.color}`} style={{ padding: "0 2px" }}>{hl.anchor}</mark>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
        {["yellow", "pink", "mint", "blue"].map((c) => (
          <button key={c} onClick={() => onChange({ color: c })} style={{
            width: 22, height: 22, border: 0, cursor: "pointer",
            borderRadius: 999, background: `var(--hl-${c})`,
            boxShadow: `inset 0 0 0 ${hl.color === c ? 2 : 1}px var(--hl-${c}-edge)`,
            outline: hl.color === c ? "2px solid var(--ink)" : "none",
            outlineOffset: 2,
          }}/>
        ))}
      </div>
      <textarea autoFocus value={hl.text}
        onChange={(e) => onChange({ text: e.target.value })}
        placeholder="leave a note for the next reader…"
        style={{
          width: "100%", boxSizing: "border-box", marginTop: 16,
          minHeight: 90, resize: "vertical",
          fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.5,
          color: "var(--ink)", background: "var(--paper-soft)",
          border: "1px solid var(--hairline)", borderRadius: 4,
          padding: "10px 12px", outline: "none",
        }}/>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={onSave} disabled={!hl.text.trim()}>
          Save note <I.Check size={14}/>
        </Button>
      </div>
    </div>
  </div>
);

const Margin = ({ c }) => (
  <div>
    <div style={{
      borderLeft: "2px solid var(--rust)", paddingLeft: 14,
      marginBottom: 10,
    }}>
      <mark className={`hl-${c.color}`} style={{
        fontFamily: "var(--font-serif)", fontStyle: "italic",
        fontSize: 14, color: "var(--ink-soft)", padding: "1px 4px",
      }}>{c.anchor}</mark>
    </div>
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingLeft: 14 }}>
      <Avatar initial={c.initial} color={c.avatarColor} size={28}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{c.user}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)" }}>{c.time}</span>
        </div>
        {c.text && (
          <div style={{
            fontFamily: "var(--font-serif)", fontSize: 15, lineHeight: 1.55,
            color: "var(--ink)", marginTop: 4,
          }}>{c.text}</div>
        )}
      </div>
    </div>
  </div>
);

Object.assign(window, { Article });
