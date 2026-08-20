// CoverArt.jsx — abstract editorial cover illustrations.
// Each motif is a deliberate composition in brand colors. Not photography:
// it's the "paper-pasted" treatment that fits the editorial direction.
//
// Used in two places:
//   <CoverArt cover={{motif,tint}} size="thumb">   — 120px thumb for home list
//   <CoverArt cover={{motif,tint}} size="hero">    — wide hero on the article page
// If an uploaded image is present, render it instead of the motif.

const TINTS = {
  indigo: { fg: "var(--indigo)",    soft: "var(--indigo-soft)", wash: "var(--indigo-wash)" },
  pine:   { fg: "var(--pine)",      soft: "var(--pine-soft)",   wash: "var(--pine-wash)"   },
  rust:   { fg: "var(--rust)",      soft: "var(--rust-soft)",   wash: "var(--rust-wash)"   },
  gold:   { fg: "var(--gold)",      soft: "var(--gold-soft)",   wash: "var(--gold-wash)"   },
};

const Motifs = {
  // Boxes connected by lines — a tiny router diagram
  router: ({ t }) => (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="320" height="200" fill={t.wash}/>
      <g stroke={t.fg} strokeWidth="1.5" fill="none" strokeLinecap="round">
        <path d="M80 100 L140 60 M80 100 L140 100 M80 100 L140 140"/>
        <path d="M180 60 L240 60 M180 100 L240 100 M180 140 L240 140"/>
      </g>
      <g fill={t.fg}>
        <rect x="60" y="86" width="32" height="28" rx="2"/>
      </g>
      <g fill="var(--paper)" stroke={t.fg} strokeWidth="1.5">
        <rect x="140" y="48" width="40" height="24" rx="2"/>
        <rect x="140" y="88" width="40" height="24" rx="2"/>
        <rect x="140" y="128" width="40" height="24" rx="2"/>
      </g>
      <g fill={t.soft}>
        <circle cx="252" cy="60" r="5"/>
        <circle cx="252" cy="100" r="5"/>
        <circle cx="252" cy="140" r="5"/>
      </g>
      <text x="62" y="105" fill="var(--paper)" fontFamily="var(--font-mono)" fontSize="11">q</text>
    </svg>
  ),
  // Stacked horizontal lines — a research paper
  paper: ({ t }) => (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="320" height="200" fill="var(--paper-soft)"/>
      <rect x="56" y="28" width="208" height="144" fill="var(--paper)" stroke={t.fg} strokeWidth="0.5"/>
      <g stroke={t.fg} strokeOpacity="0.5" strokeLinecap="round">
        <line x1="72" y1="48" x2="200" y2="48" strokeWidth="3"/>
        {[68, 80, 92, 104, 116, 128, 140, 152].map((y, i) => (
          <line key={i} x1="72" y1={y} x2={i % 3 === 2 ? 178 : 248} y2={y} strokeWidth="0.8"/>
        ))}
      </g>
      <rect x="72" y="100" width="60" height="32" fill={t.wash}/>
      <text x="232" y="42" fill={t.fg} fontFamily="var(--font-mono)" fontSize="9" opacity="0.7">arXiv</text>
    </svg>
  ),
  // Layered mountain silhouettes
  mountain: ({ t }) => (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="320" height="200" fill={t.wash}/>
      <circle cx="240" cy="55" r="20" fill="var(--gold-soft)"/>
      <path d="M0 200 L0 130 L60 90 L110 130 L160 70 L210 110 L270 80 L320 120 L320 200 Z" fill={t.soft} opacity="0.7"/>
      <path d="M0 200 L0 150 L40 120 L100 160 L150 110 L220 150 L280 130 L320 160 L320 200 Z" fill={t.fg}/>
      <g stroke="var(--paper)" strokeOpacity="0.6" strokeWidth="0.6" fill="none">
        <path d="M40 120 L60 110 M150 110 L170 100"/>
      </g>
    </svg>
  ),
  // Grid of small monospaced glyphs — code feel
  code: ({ t }) => {
    const cells = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 12; c++) {
      const fill = (r + c) % 5 === 0 ? t.fg : (r + c) % 3 === 0 ? t.soft : t.wash;
      cells.push(<rect key={`${r}-${c}`} x={20 + c * 24} y={28 + r * 24} width="20" height="20" rx="2" fill={fill}/>);
    }
    return (
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <rect width="320" height="200" fill="var(--paper-soft)"/>
        {cells}
        <rect x="20" y="28" width="68" height="20" fill="var(--ink)"/>
        <text x="28" y="42" fill={t.wash} fontFamily="var(--font-mono)" fontSize="10">$ debug</text>
      </svg>
    );
  },
  // Attention heatmap circles
  attention: ({ t }) => {
    const dots = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) {
      const dist = Math.abs(c - r) + Math.abs(r - 2);
      const radius = Math.max(2, 14 - dist * 1.5);
      dots.push(<circle key={`${r}-${c}`} cx={40 + c * 30} cy={50 + r * 24} r={radius} fill={t.fg} opacity={Math.max(0.15, 1 - dist * 0.2)}/>);
    }
    return (
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
        <rect width="320" height="200" fill={t.wash}/>
        {dots}
      </svg>
    );
  },
  // Generic diagram with a labeled flow — for inline image blocks
  diagram: ({ t }) => (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="320" height="200" fill="var(--paper-soft)"/>
      <g fill={t.wash} stroke={t.fg} strokeWidth="1.5">
        <rect x="32" y="80" width="60" height="40" rx="3"/>
        <rect x="130" y="80" width="60" height="40" rx="3"/>
        <rect x="228" y="80" width="60" height="40" rx="3"/>
      </g>
      <g stroke={t.fg} strokeWidth="1.5" fill="none" markerEnd="url(#arr)">
        <path d="M92 100 L130 100"/>
        <path d="M190 100 L228 100"/>
      </g>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 Z" fill={t.fg}/>
        </marker>
      </defs>
      <g fontFamily="var(--font-mono)" fontSize="11" fill={t.fg} textAnchor="middle">
        <text x="62" y="105">user</text>
        <text x="160" y="105">route</text>
        <text x="258" y="105">tool</text>
      </g>
      <text x="160" y="160" fontFamily="var(--font-display)" fontStyle="italic" fontSize="14" fill="var(--ink-soft)" textAnchor="middle">
        the small loop, once a turn
      </text>
    </svg>
  ),
  // A simple meandering line — for life posts
  path: ({ t }) => (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="320" height="200" fill={t.wash}/>
      <path d="M-10 160 Q40 80 100 140 T220 100 T340 140" stroke={t.fg} strokeWidth="2" fill="none"/>
      <circle cx="60" cy="118" r="5" fill={t.fg}/>
      <circle cx="260" cy="118" r="5" fill={t.soft}/>
    </svg>
  ),
};

const CoverArt = ({ cover, size = "thumb", src }) => {
  const dims = size === "thumb"
    ? { width: 120, height: 76, radius: 4 }
    : size === "card"
    ? { width: "100%", height: 220, radius: 6 }
    : size === "hero"
    ? { width: "100%", height: 360, radius: 8 }
    : { width: "100%", height: 200, radius: 6 };

  // If user-uploaded src exists, render it.
  if (src) {
    return (
      <div style={{
        width: dims.width, height: dims.height, borderRadius: dims.radius,
        overflow: "hidden", background: "var(--paper-deep)", flexShrink: 0,
      }}>
        <img src={src} alt="" style={{
          width: "100%", height: "100%", objectFit: "cover", display: "block",
        }}/>
      </div>
    );
  }

  if (!cover) return null;
  const Motif = Motifs[cover.motif] || Motifs.router;
  const t = TINTS[cover.tint] || TINTS.indigo;
  return (
    <div style={{
      width: dims.width, height: dims.height, borderRadius: dims.radius,
      overflow: "hidden", flexShrink: 0,
      boxShadow: size === "hero" ? "var(--shadow-2)" : "none",
    }}>
      <Motif t={t}/>
    </div>
  );
};

window.CoverArt = CoverArt;
