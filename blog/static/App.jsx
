// App.jsx — top-level router. GitHub Pages cannot serve arbitrary
// /blog/<post> paths, so the static build uses hash routes.

// Parse current URL path into { view, postId, editId }
const parseUrl = () => {
  var path = window.location.hash.replace(/^#\/?/, "");
  if (!path) path = window.location.pathname.replace(/^\/blog\/?/, "");
  path = path.replace(/^static\/index\.html\/?/, "");
  if (!path || path === "") return { view: "home", postId: null, editId: null };
  if (path === "write") return { view: "editor", postId: null, editId: null };
  if (path === "admin") return { view: "admin", postId: null, editId: null };
  const editMatch = path.match(/^edit\/(.+)$/);
  if (editMatch) return { view: "editor", postId: null, editId: editMatch[1] };
  return { view: "article", postId: path, editId: null };
};

const SITE_TITLE = "Blog · Xu Wang";

const App = () => {
  const initial = parseUrl();
  const [view, setView] = React.useState(initial.view);
  const [postId, setPostId] = React.useState(initial.postId);
  const [editId, setEditId] = React.useState(initial.editId);
  const [authOpen, setAuthOpen] = React.useState(false);
  const [session, setSession] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("blog.session") || "null"); } catch { return null; }
  });
  const [posts, setPosts] = React.useState(POSTS);
  // configVersion is bumped after server config loads so children that read
  // the BIO / CATEGORIES globals re-render with the persisted values.
  const [configVersion, setConfigVersion] = React.useState(0);

  React.useEffect(() => {
    if (session) localStorage.setItem("blog.session", JSON.stringify(session));
    else localStorage.removeItem("blog.session");
  }, [session]);

  React.useEffect(() => {
    API.get('/posts?limit=50&status=published').then(d => {
      if (d.items && d.items.length > 0) setPosts(d.items);
    }).catch(() => {});
  }, []);

  // Pull persisted site config (BIO + CATEGORIES) and overlay it on the
  // globals that data.jsx seeded. Home/Hero read these at render time.
  React.useEffect(() => {
    API.get('/config').then(d => {
      if (d && d.bio) Object.assign(window.BIO, d.bio);
      if (d && d.categories) Object.assign(window.CATEGORIES, d.categories);
      setConfigVersion(v => v + 1);
    }).catch(() => {});
  }, []);

  // Update document.title whenever view/postId/posts changes
  React.useEffect(() => {
    if (view === "article" && postId) {
      const post = posts.find(p => p.id === postId);
      document.title = post ? `${post.title} · Xu Wang` : SITE_TITLE;
    } else {
      document.title = SITE_TITLE;
    }
  }, [view, postId, posts]);

  // Handle browser back / forward
  React.useEffect(() => {
    const onPop = () => {
      const { view: v, postId: p, editId: e } = parseUrl();
      setView(v);
      setPostId(p);
      setEditId(e);
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onPop);
    };
  }, []);

  const openPost = (id) => {
    window.location.hash = `/${id}`;
    setPostId(id);
    setView("article");
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    window.location.hash = "/";
    setView("home");
    setPostId(null);
    setEditId(null);
  };

  const openCompose = () => {
    window.location.hash = "/write";
    setEditId(null);
    setView("editor");
  };

  const openEdit = (id) => {
    window.location.hash = `/edit/${id}`;
    setEditId(id);
    setView("editor");
    window.scrollTo(0, 0);
  };

  const openAdmin = () => {
    window.location.hash = "/admin";
    setView("admin");
    window.scrollTo(0, 0);
  };

  const handlePublish = (post) => {
    setPosts(prev => [post, ...prev.filter(p => p.id !== post.id)]);
    goHome();
  };

  const handleEditPublished = (post) => {
    setPosts(prev => prev.map(p => p.id === post.id ? post : p));
    goHome();
  };

  // configVersion is referenced so the re-render triggers after config load.
  return (
    <div style={{ position: "fixed", inset: 0 }} data-config={configVersion}>
      {view === "home" && (
        <Home
          posts={posts}
          session={session}
          onSignIn={() => setAuthOpen(true)}
          onSignOut={() => setSession(null)}
          onOpenPost={openPost}
          onCompose={openCompose}
          onAdmin={openAdmin}
        />
      )}
      {view === "article" && (
        <Article
          posts={posts}
          postId={postId}
          session={session}
          onSignIn={() => setAuthOpen(true)}
          onBack={goHome}
        />
      )}
      {view === "editor" && (
        <Editor
          onCancel={goHome}
          onPublish={handlePublish}
          onEditPublished={handleEditPublished}
          session={session}
          editId={editId}
        />
      )}
      {view === "admin" && (
        <Admin
          session={session}
          onOpenAuth={() => setAuthOpen(true)}
          onEdit={openEdit}
          onCompose={openCompose}
          onHome={goHome}
        />
      )}
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSignIn={setSession}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
