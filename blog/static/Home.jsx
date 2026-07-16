// Home.jsx — hero (collapses on scroll) + gradient sidebar TOC + post catalogue

const Home = ({ posts, session, onSignIn, onSignOut, onOpenPost, onCompose, onAdmin }) => {
  const [scrollY, setScrollY] = React.useState(0);
  const [filter, setFilter] = React.useState("research");
  const [activeId, setActiveId] = React.useState(null);
  const scrollerRef = React.useRef(null);
  const isMobile = useIsMobile();

  const filtered = posts.filter((p) => p.cat === filter);

  React.useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      setScrollY(el.scrollTop);
      // Find the post row whose top is just above the trigger line (200px from scroller top)
      const rows = el.querySelectorAll("[data-postid]");
      const triggerY = el.getBoundingClientRect().top + 220;
      let best = null;
      let bestTop = -Infinity;
      rows.forEach((row) => {
        const r = row.getBoundingClientRect();
        if (r.top <= triggerY && r.top > bestTop) {
          bestTop = r.top;
          best = row.dataset.postid;
        }
      });
      if (best) setActiveId(best);
      else if (rows[0]) setActiveId(rows[0].dataset.postid);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [filter]);

  // Hero collapses across 280px of scroll.
  const T = Math.min(1, scrollY / 280);
  const heroOpacity = 1 - T;
  const stripOpacity = T > 0.6 ? (T - 0.6) / 0.4 : 0;

  return (
    <div ref={scrollerRef} style={{
      height: "100%", overflowY: "auto",
      background: "var(--paper)", position: "relative",
    }}>
      {/* Sticky masthead — desktop: appears after hero collapses; mobile: always visible */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        height: 56,
        opacity: isMobile ? 1 : stripOpacity,
        pointerEvents: isMobile ? "auto" : (stripOpacity > 0.5 ? "auto" : "none"),
        background: "rgba(245,241,232,0.85)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--hairline)",
        transition: "opacity .2s var(--ease-out)",
        display: "flex", alignItems: "center",
        padding: isMobile ? "0 16px" : "0 48px", gap: 18,
      }}>
        <div style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          fontSize: 18, color: "var(--ink)", fontWeight: 500,
        }}>Xu Wang</div>
        <div style={{ flex: 1 }}/>
        <SessionChip session={session} onSignIn={onSignIn} onSignOut={onSignOut} compact />
      </div>

      {/* Desktop: hero is absolutely positioned with parallax fade */}
      {!isMobile && (
        <>
          <div style={{
            position: "absolute", top: 56, left: 0, right: 0,
            opacity: heroOpacity, pointerEvents: heroOpacity > 0.3 ? "auto" : "none",
            transition: "opacity .12s linear",
          }}>
            <Hero session={session} onSignIn={onSignIn} onSignOut={onSignOut} onCompose={onCompose} onAdmin={onAdmin}/>
          </div>
          <div style={{ height: 470 }}/>{/* hero spacer */}
        </>
      )}

      {/* Mobile: hero in normal flow, no parallax */}
      {isMobile && (
        <Hero session={session} onSignIn={onSignIn} onSignOut={onSignOut} onCompose={onCompose} onAdmin={onAdmin}/>
      )}

      {/* Body: sidebar TOC + post catalogue */}
      <div style={{
        display: "flex", maxWidth: 1200, margin: "0 auto",
        padding: isMobile ? "16px 16px 80px" : "20px 48px 120px",
        gap: isMobile ? 0 : 56,
      }}>
        {!isMobile && <SidebarTOC posts={filtered} activeId={activeId} onJump={onOpenPost} />}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 28, alignItems: "center", flexWrap: "wrap" }}>
            {Object.entries(CATEGORIES).map(([k, c]) => (
              <Pill key={k} active={filter === k} onClick={() => setFilter(k)}>{c.cn}</Pill>
            ))}
            <div style={{ flex: 1 }}/>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)",
            }}>{filtered.length} entries · since 2024</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((p, i) => (
              <PostRow key={p.id} post={p} index={i} active={p.id === activeId} onOpen={() => onOpenPost(p.id)}/>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

const Hero = ({ session, onSignIn, onSignOut, onCompose, onAdmin }) => {
  const isMobile = useIsMobile();
  const desktopHighlights = [
    "AAAI 2026 Oral Paper",
    "ICASSP 2026 Student Travel Award",
    "Global 2nd&3rd — Tencent AI+Oracle",
    "National Gold — \"ChuangQingChun\"",
    "Provincial Grand — \"Challenge Cup\"",
    "National First — Lanqiao Cup",
    "National First — CRAIC",
    "100+ Awards · 20+ Papers",
  ];
  return (
  <section style={{
    padding: isMobile ? "28px 18px 36px" : "44px 48px 60px",
    maxWidth: 1200, margin: "0 auto",
    textAlign: isMobile ? "center" : "left",
  }}>
    <div style={{
      display: "flex", flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "center" : "flex-start", gap: isMobile ? 20 : 32, marginBottom: 40,
    }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: isMobile ? 260 : 360,
          aspectRatio: "6270 / 4180", borderRadius: 8, overflow: "hidden",
          boxShadow: "var(--shadow-2)",
          border: "1px solid var(--hairline)",
        }}>
          <img src="/assets/optimized/homepage-960.webp" alt="Xu Wang"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.style.background = 'var(--rust)'; e.target.parentElement.style.color = 'var(--paper)'; e.target.parentElement.style.fontFamily = 'var(--font-cn-display)'; e.target.parentElement.style.fontSize = isMobile ? '32px' : '48px'; e.target.parentElement.style.fontWeight = '600'; e.target.parentElement.textContent = '旭'; }}/>
        </div>
        {isMobile && <div style={{
          position: "absolute", bottom: -4, right: -4,
          width: 28, height: 28, borderRadius: 999,
          background: "var(--gold-soft)", color: "var(--ink)",
          border: "3px solid var(--paper)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 600,
        }}>!</div>}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "4px 10px", borderRadius: 999,
          background: "var(--rust-wash)", color: "var(--rust-deep)",
          fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 500,
          marginBottom: 14,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--rust)" }}/>
          {BIO.greet} — welcome in
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 500,
          fontSize: isMobile ? 28 : 44,
          lineHeight: 1.08, letterSpacing: "-0.012em", color: "var(--ink)",
          margin: "0 0 6px",
        }}>
          Hi, I'm <span style={{ color: "var(--rust)" }}>Xu Wang</span>.
        </h1>
        <div style={{
          fontFamily: "var(--font-cn-display)", fontSize: isMobile ? 16 : 22, fontWeight: 500,
          color: "var(--ink-soft)", marginBottom: 14,
        }}>{isMobile ? "王旭的博客 · engineering · research · life" : "王旭 · engineering · research · life"}</div>
        <div style={{
          fontFamily: "var(--font-serif)", fontSize: isMobile ? 15 : 16, lineHeight: 1.6,
          color: "var(--ink-soft)", maxWidth: "60ch", marginBottom: 12,
        }}>
          {isMobile
            ? BIO.blurb
            : "An undergraduate student at Shandong Jianzhu University, working on Natural Language Processing and Computer Vision — controllable generation, object detection, and medical image classification."}
        </div>
        <div style={{
          fontFamily: "var(--font-cn-display)", fontSize: isMobile ? 14 : 15,
          color: "var(--ink-mute)", marginBottom: 22,
        }}>{BIO.blurbCn}</div>

        {isMobile && <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          {BIO.links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" style={{
              fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink)",
              textDecoration: "underline", textDecorationColor: "var(--rust)",
              textUnderlineOffset: 3, textDecorationThickness: 1,
            }}>{l.label}</a>
          ))}
        </div>}
        {isMobile && (
          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <SessionChip session={session} onSignIn={onSignIn} onSignOut={onSignOut}/>
            {session?.role === "admin" && (
              <>
                <Button variant="ghost" onClick={onAdmin} leadIcon={<I.Settings size={14}/>}>管理</Button>
                <Button variant="primary" onClick={onCompose} leadIcon={<I.Pen size={14}/>}>Write</Button>
              </>
            )}
          </div>
        )}
      </div>

      {!isMobile && <div style={{ width: 240, flexShrink: 0, paddingTop: 18 }}>
        <Eyebrow>Highlights</Eyebrow>
        <ul style={{
          listStyle: "none", padding: 0, margin: "10px 0 0",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          {desktopHighlights.map((h) => (
            <li key={h} style={{
              fontFamily: "var(--font-serif)", fontSize: 13.5,
              color: "var(--ink-soft)", lineHeight: 1.4,
              borderLeft: "1px solid var(--hairline)", paddingLeft: 10,
            }}>{h}</li>
          ))}
        </ul>
      </div>}
    </div>

    <div style={{ height: 1, background: "var(--hairline)", marginTop: 36 }}/>
    <div style={{
      display: "flex", justifyContent: "space-between", marginTop: 12,
      fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-mute)",
    }}>
      <span>↓ scroll for the latest posts</span>
      {!isMobile && <span>updated weekly · 旭</span>}
    </div>
    {!isMobile && (
      <div style={{
        marginTop: 20,
        display: "flex",
        gap: "16px 24px",
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        {BIO.links.map((l) => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer" style={{
            fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink)",
            textDecoration: "underline", textDecorationColor: "var(--rust)",
            textUnderlineOffset: 3, textDecorationThickness: 1,
          }}>{l.label}</a>
        ))}
        <span style={{ flex: 1 }}/>
        <SessionChip session={session} onSignIn={onSignIn} onSignOut={onSignOut} />
        {session?.role === "admin" && (
          <>
            <Button variant="ghost" onClick={onAdmin} leadIcon={<I.Settings size={14}/>}>
              管理
            </Button>
            <Button variant="primary" onClick={onCompose} leadIcon={<I.Pen size={14}/>}>
              Write
            </Button>
          </>
        )}
      </div>
    )}
  </section>
  );
};

const SessionChip = ({ session, onSignIn, onSignOut, compact }) => {
  if (!session) {
    return (
      <Button variant={compact ? "ghost" : "secondary"} onClick={onSignIn}>
        {compact ? "Sign in" : "Sign in · 留个名字"}
      </Button>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar initial={session.nickname[0].toUpperCase()} color={session.role === "admin" ? "rust" : "pine"} size={30}/>
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--ink)" }}>{session.nickname}</span>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: session.role === "admin" ? "var(--rust)" : "var(--ink-mute)",
        }}>{session.role}</span>
      </div>
      <button onClick={onSignOut} style={{
        border: 0, background: "transparent", cursor: "pointer",
        color: "var(--ink-mute)", fontFamily: "var(--font-sans)",
        fontSize: 12, padding: 4,
      }}>sign out</button>
    </div>
  );
};

const SidebarTOC = ({ posts, activeId, onJump }) => {
  const cat = (id) => CATEGORIES[posts.find((p) => p.id === id)?.cat || "eng"];
  return (
    <aside style={{
      width: 240, flexShrink: 0, position: "sticky", top: 76, alignSelf: "flex-start",
      height: "fit-content", padding: "26px 22px 60px",
      background: "linear-gradient(180deg, var(--paper) 0%, var(--paper-soft) 78%, var(--paper-deep) 100%)",
      borderRadius: 6,
      WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 80%, transparent 100%)",
      maskImage: "linear-gradient(180deg, #000 0%, #000 80%, transparent 100%)",
    }}>
      <Eyebrow>In this notebook</Eyebrow>
      <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0", display: "flex", flexDirection: "column", gap: 4 }}>
        {posts.slice(0, 10).map((p) => {
          const active = p.id === activeId;
          const c = CATEGORIES[p.cat];
          return (
            <li key={p.id}>
              <button onClick={() => onJump(p.id)} style={{
                width: "100%", border: 0, background: "transparent",
                padding: "8px 0 8px 12px", textAlign: "left", cursor: "pointer",
                position: "relative",
                borderLeft: `2px solid ${active ? c.color : "transparent"}`,
                transition: "all .22s var(--ease-out)",
              }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontSize: active ? 16 : 15,
                  lineHeight: 1.25, letterSpacing: "-0.005em",
                  color: active ? "var(--ink)" : "var(--ink-mute)",
                  fontWeight: active ? 500 : 400,
                  transition: "all .22s var(--ease-out)",
                }}>{p.title.replace(/\*/g, "")}</div>
                {active && (
                  <div style={{
                    fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: 600,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: c.color, marginTop: 4,
                  }}>{c.cn} · now reading</div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

const PostRow = ({ post, index, active, onOpen }) => {
  const cat = CATEGORIES[post.cat];
  const totalGifts = Object.values(post.gifts || {}).reduce((a, b) => a + b, 0);
  const [h, setH] = React.useState(false);
  const isMobile = useIsMobile();
  return (
    <button data-postid={post.id} onClick={onOpen}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        appearance: "none", border: 0, background: "transparent",
        padding: isMobile ? "20px 0" : "26px 0",
        textAlign: "left", cursor: "pointer",
        borderBottom: "1px solid var(--hairline)",
        display: "grid",
        gridTemplateColumns: isMobile
          ? "1fr"
          : (post.cover ? "100px 1fr 140px" : "100px 1fr"),
        gap: isMobile ? 8 : 24, alignItems: "flex-start",
        position: "relative",
        transition: "background .15s var(--ease-out)",
        width: "100%",
      }}>
      {!isMobile && active && (
        <div style={{
          position: "absolute", left: -24, top: 32,
          width: 12, height: 1, background: cat.color,
        }}/>
      )}
      {!isMobile && (
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: active ? cat.color : "var(--ink-mute)", paddingTop: 4,
        }}>
          <div>{post.no}</div>
          <div style={{ marginTop: 2 }}>{post.date.split(",")[0]}</div>
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: cat.color, marginBottom: isMobile ? 4 : 6,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          {isMobile && <span style={{
            fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink-faint)",
          }}>{post.no}</span>}
          {cat.cn} · {cat.en}
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)", fontWeight: 500,
          fontSize: isMobile ? 22 : 34, lineHeight: isMobile ? 1.2 : 1.12,
          letterSpacing: "-0.01em",
          color: "var(--ink)", margin: isMobile ? "0 0 6px" : "0 0 10px",
        }} dangerouslySetInnerHTML={{
          __html: post.title.replace(/\*(.+?)\*/g, '<em style="font-style:italic">$1</em>'),
        }}/>
        <div style={{
          fontFamily: "var(--font-serif)", fontSize: isMobile ? 14 : 15.5,
          lineHeight: 1.55, color: "var(--ink-soft)", maxWidth: "60ch",
        }}>{post.excerpt}</div>
        <div style={{
          display: "flex", gap: 16, marginTop: 10,
          fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-mute)",
          alignItems: "center",
        }}>
          <span>{post.readTime}</span>
          <span>·</span>
          <span style={{ color: "var(--rust)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, background: "var(--rust)", borderRadius: 999, display: "inline-block" }}/>
            {totalGifts} gifts
          </span>
          <span style={{
            marginLeft: "auto",
            color: h ? "var(--rust)" : "var(--ink-mute)",
            transition: "all .18s var(--ease-out)",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            read <I.Arrow size={13}/>
          </span>
        </div>
      </div>
      {!isMobile && post.cover && (
        <div style={{
          paddingTop: 24,
          transition: "transform .22s var(--ease-out)",
          transform: h ? "translateY(-2px)" : "translateY(0)",
        }}>
          <CoverArt cover={post.cover} src={post.cover && post.cover.src} size="thumb"/>
        </div>
      )}
    </button>
  );
};

Object.assign(window, { Home });
