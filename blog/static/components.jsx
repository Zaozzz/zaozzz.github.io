// components.jsx — shared atoms

const Eyebrow = ({ children, color = "var(--ink-mute)" }) => (
  <div style={{
    fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600,
    letterSpacing: "0.2em", textTransform: "uppercase", color,
  }}>{children}</div>
);

const Seal = ({ size = 42, cat }) => {
  const c = window.CATEGORIES[cat];
  return (
    <div style={{
      width: size, height: size, borderRadius: 4, background: c.color, color: "var(--paper)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-cn-display)", fontWeight: 600, fontSize: size * 0.55,
      boxShadow: "inset 0 0 0 2px rgba(245,241,232,0.35)", flexShrink: 0,
    }}>{c.glyph}</div>
  );
};

const Avatar = ({ initial, color = "ink", size = 32 }) => {
  const palette = {
    ink: { bg: "var(--ink-soft)", fg: "var(--paper)" },
    pine: { bg: "var(--pine-wash)", fg: "var(--pine)" },
    rust: { bg: "var(--rust-wash)", fg: "var(--rust)" },
    indigo: { bg: "var(--indigo-wash)", fg: "var(--indigo)" },
  }[color] || { bg: "var(--paper-deep)", fg: "var(--ink)" };
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      background: palette.bg, color: palette.fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--font-cn-display)", fontWeight: 600, fontSize: size * 0.45,
    }}>{initial}</div>
  );
};

const Button = ({ variant = "primary", children, onClick, style, disabled, leadIcon, ...rest }) => {
  const base = {
    fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500,
    padding: "9px 18px", borderRadius: 4, border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all .18s var(--ease-out)",
    display: "inline-flex", alignItems: "center", gap: 8,
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary:   { background: "var(--ink)", color: "var(--paper)" },
    secondary: { background: "var(--paper)", color: "var(--ink)", borderColor: "var(--ink)" },
    ghost:     { background: "transparent", color: "var(--ink-soft)" },
    seal:      { background: "var(--rust)", color: "var(--paper)" },
  };
  const [hover, setHover] = React.useState(false);
  const hoverStyle = !disabled && hover ? {
    primary: { background: "var(--rust-deep)" },
    secondary: { background: "var(--ink)", color: "var(--paper)" },
    ghost: { background: "var(--paper-soft)", color: "var(--ink)" },
    seal: { background: "var(--rust-deep)" },
  }[variant] : {};
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...hoverStyle, ...style }} {...rest}>
      {leadIcon}{children}
    </button>
  );
};

const IconButton = ({ children, onClick, title, active }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 36, height: 36, padding: 0, borderRadius: 4,
        border: "1px solid " + (active ? "var(--ink)" : "var(--hairline)"),
        background: active ? "var(--ink)" : (h ? "var(--paper-soft)" : "transparent"),
        color: active ? "var(--paper)" : "var(--ink-soft)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all .18s var(--ease-out)",
      }}>{children}</button>
  );
};

const Pill = ({ active, onClick, children }) => {
  const [h, setH] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 14px", borderRadius: 999,
        border: "1px solid " + (active ? "var(--ink)" : "var(--hairline)"),
        background: active ? "var(--ink)" : (h ? "var(--paper-soft)" : "var(--paper)"),
        color: active ? "var(--paper)" : "var(--ink-soft)",
        fontFamily: "var(--font-sans)", fontSize: 13, cursor: "pointer",
        transition: "all .18s var(--ease-out)",
      }}>{children}</button>
  );
};

// Five visually distinct gifts — different shapes, fills, and colors.
// Each gift has its own meaning and animation accent.
const GiftGlyphs = {
  // Flower — soft pink filled petals, gold center. "appreciate"
  flower: (s = 30) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <g fill="var(--petal)">
        <circle cx="16" cy="8.5" r="4.2"/>
        <circle cx="22.2" cy="12.5" r="4.2"/>
        <circle cx="20" cy="19.5" r="4.2"/>
        <circle cx="12" cy="19.5" r="4.2"/>
        <circle cx="9.8" cy="12.5" r="4.2"/>
      </g>
      <circle cx="16" cy="14" r="2.8" fill="var(--gold-soft)"/>
      <path d="M16 19 Q16 24 17.5 28.5" stroke="var(--pine)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M17.4 25 Q19.5 23.5 21 24.5" stroke="var(--pine)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    </svg>
  ),
  // Coffee — brown filled mug + 3 steam wisps. "support / buy a coffee"
  coffee: (s = 30) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <path d="M6 12 L6 22 Q6 26 10 26 L19 26 Q23 26 23 22 L23 12 Z" fill="var(--coffee)"/>
      <rect x="6" y="11" width="17" height="3" fill="var(--coffee-dark)"/>
      <path d="M23 14 Q27 14 27 17.5 Q27 21 23 21" stroke="var(--coffee)" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <g stroke="var(--ink-mute)" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.55">
        <path d="M11 8 Q12 6 11 4"/>
        <path d="M15 8 Q16 6 15 4"/>
        <path d="M19 8 Q20 6 19 4"/>
      </g>
    </svg>
  ),
  // Bookmark — rust folded ribbon. "save this"
  bookmark: (s = 30) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <path d="M9 4 L23 4 L23 28 L16 23 L9 28 Z" fill="var(--rust)"/>
      <path d="M11 4 L11 25 M21 4 L21 25" stroke="var(--rust-deep)" strokeWidth="0.6" opacity="0.4"/>
      <circle cx="16" cy="11" r="1.6" fill="var(--paper)"/>
    </svg>
  ),
  // Bulb — gold filled with rays. "inspired me"
  bulb: (s = 30) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <g stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M16 2 L16 5"/>
        <path d="M5 6 L7 8"/>
        <path d="M27 6 L25 8"/>
        <path d="M2 14 L4.5 14"/>
        <path d="M30 14 L27.5 14"/>
      </g>
      <path d="M9 14 Q9 7 16 7 Q23 7 23 14 Q23 18 20 20 L20 22 L12 22 L12 20 Q9 18 9 14 Z" fill="var(--gold-soft)"/>
      <rect x="12.5" y="22.5" width="7" height="2.2" rx="0.5" fill="var(--ink-mute)"/>
      <rect x="13" y="25" width="6" height="1.5" rx="0.5" fill="var(--ink-mute)"/>
      <path d="M14.5 27.2 L17.5 27.2" stroke="var(--ink-mute)" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  // Applause — two filled hands with motion lines. "well said"
  applause: (s = 30) => (
    <svg width={s} height={s} viewBox="0 0 32 32">
      <path d="M11.5 9 Q11.5 6 9 6 Q7 6 7 9 L7 22 Q7 26 10.5 26 Q14 26 14 22 L14 13 Q14 11 12.5 11 L11.5 11 Z" fill="var(--indigo-soft)"/>
      <path d="M20.5 9 Q20.5 6 23 6 Q25 6 25 9 L25 22 Q25 26 21.5 26 Q18 26 18 22 L18 13 Q18 11 19.5 11 L20.5 11 Z" fill="var(--indigo-soft)"/>
      <g stroke="var(--indigo)" strokeWidth="1.4" strokeLinecap="round" opacity="0.7">
        <path d="M3 13 L5 12"/>
        <path d="M2 17 L5 17"/>
        <path d="M3 21 L5 22"/>
        <path d="M29 13 L27 12"/>
        <path d="M30 17 L27 17"/>
        <path d="M29 21 L27 22"/>
      </g>
    </svg>
  ),
};

const GIFT_META = {
  flower:   { label: "flower",   cn: "送一朵花",   tint: "var(--petal)",   anim: "petal" },
  coffee:   { label: "coffee",   cn: "请杯咖啡",   tint: "var(--coffee)",  anim: "steam" },
  bookmark: { label: "bookmark", cn: "收藏一下",   tint: "var(--rust)",    anim: "lift"  },
  bulb:     { label: "bulb",     cn: "灵感 +1",    tint: "var(--gold)",    anim: "sparkle" },
  applause: { label: "applause", cn: "鼓鼓掌",     tint: "var(--indigo)",  anim: "shake" },
};
// Backward-compat name a few older cards still reference.
const GIFT_LABELS = Object.fromEntries(Object.entries(GIFT_META).map(([k, v]) => [k, v.label]));

// One gift button with per-gift colored fly-up animation
const GiftButton = ({ kind, count, onSend }) => {
  const meta = GIFT_META[kind];
  const [flying, setFlying] = React.useState([]);
  const [hover, setHover] = React.useState(false);
  const click = () => {
    const id = Math.random();
    setFlying((f) => [...f, id]);
    setTimeout(() => setFlying((f) => f.filter((x) => x !== id)), 900);
    onSend(kind);
  };
  return (
    <button onClick={click}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", display: "flex", flexDirection: "column",
        alignItems: "center", gap: 7, padding: "12px 14px 9px",
        borderRadius: 6, border: "1px solid " + (hover ? meta.tint : "var(--hairline)"),
        background: hover ? "var(--paper-soft)" : "var(--paper)",
        cursor: "pointer", minWidth: 86,
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? "var(--shadow-2)" : "none",
        transition: "all .2s var(--ease-out)",
      }}>
      <div>{GiftGlyphs[kind]()}</div>
      <div style={{
        fontFamily: "var(--font-sans)", fontSize: 11,
        color: "var(--ink-soft)", display: "flex", alignItems: "baseline", gap: 5,
      }}>
        <span>{meta.label}</span>
        <span style={{
          fontFamily: "var(--font-display)", fontStyle: "italic",
          color: meta.tint, fontSize: 13.5,
        }}>·{count}</span>
      </div>
      {flying.map((id) => (
        <span key={id} style={{
          position: "absolute", top: 10, left: "50%",
          transform: "translateX(-50%)", pointerEvents: "none",
          animation: "giftFly 880ms var(--ease-out) forwards",
        }}>{GiftGlyphs[kind](26)}</span>
      ))}
    </button>
  );
};

const GiftBar = ({ post, onSend }) => (
  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
    {Object.keys(GIFT_META).map((k) => (
      <GiftButton key={k} kind={k} count={post.gifts?.[k] || 0} onSend={onSend} />
    ))}
  </div>
);

const LinkPreview = ({ url, site, date, title, desc }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" style={{
    display: "flex", border: "1px solid var(--hairline)", borderRadius: 6,
    overflow: "hidden", background: "var(--paper)", boxShadow: "var(--shadow-1)",
    textDecoration: "none", margin: "28px 0", maxWidth: 560,
    transition: "box-shadow .2s var(--ease-out)",
  }}
  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-3)"; }}
  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-1)"; }}>
    <div style={{
      width: 130, flexShrink: 0,
      background: "linear-gradient(135deg, var(--indigo) 0%, var(--indigo-soft) 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--paper)", fontFamily: "var(--font-display)",
      fontStyle: "italic", fontSize: 32,
    }}>{site.split(".")[0]}</div>
    <div style={{ padding: "14px 18px", minWidth: 0, flex: 1 }}>
      <div style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--ink-mute)", marginBottom: 4 }}>{site} · {date}</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 17, lineHeight: 1.25, color: "var(--ink)", fontWeight: 500, marginBottom: 4 }}>{title}</div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.5, color: "var(--ink-soft)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{desc}</div>
    </div>
  </a>
);

const VideoEmbed = ({ title, caption }) => {
  const [playing, setPlaying] = React.useState(false);
  return (
    <figure style={{ margin: "28px 0" }}>
      <div onClick={() => setPlaying(true)} style={{
        position: "relative", aspectRatio: "16/9", borderRadius: 6,
        background: "linear-gradient(135deg, #2A2520 0%, #1A1612 100%)",
        cursor: "pointer", overflow: "hidden",
        boxShadow: "var(--shadow-2)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 30% 30%, rgba(245,241,232,0.06) 0%, transparent 50%)",
        }}/>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex", alignItems: "center", gap: 14,
          color: "var(--paper)",
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 999,
            border: "1.5px solid rgba(245,241,232,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}>
            <I.Play size={22} stroke={1.2} />
          </div>
        </div>
        <div style={{
          position: "absolute", bottom: 12, left: 14,
          fontFamily: "var(--font-mono)", fontSize: 11,
          color: "rgba(245,241,232,0.7)",
        }}>{title}</div>
      </div>
      {caption && (
        <figcaption style={{
          fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-mute)",
          marginTop: 8, fontStyle: "italic",
        }}>{caption}</figcaption>
      )}
    </figure>
  );
};

const useIsMobile = (breakpoint = 768) => {
  const [mobile, setMobile] = React.useState(() => window.innerWidth < breakpoint);
  React.useEffect(() => {
    const fn = () => setMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [breakpoint]);
  return mobile;
};

Object.assign(window, {
  Eyebrow, Seal, Avatar, Button, IconButton, Pill,
  GiftBar, GiftGlyphs, GIFT_LABELS, GIFT_META,
  LinkPreview, VideoEmbed, useIsMobile,
});
