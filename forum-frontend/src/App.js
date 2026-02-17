import { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";
import Categories from "./components/Categories";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [reloadPosts, setReloadPosts] = useState(false);
  const [reloadComments, setReloadComments] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hover states для кнопок
  const [themeHovered, setThemeHovered] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);

  // Apply theme on mount and when it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setToken("");
    setSelectedPost(null);
    setSelectedCategory(null);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  const handlePostAdded = () => setReloadPosts(prev => !prev);
  const handleCommentAdded = () => setReloadComments(prev => !prev);

  useEffect(() => setSelectedPost(null), [selectedCategory]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Auth background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItMnptMC0ydi0yIDJ6bS0yIDB2MmgtMnYtMmgyem0wLTJ2LTJoMnYyaC0yem0yIDB2Mmgydi0yaC0yem0wIDJ2Mmgydi0yaC0yem0yLTJ2LTJoMnYyaC0yem0wIDJ2Mmgydi0yaC0yem0tNC0ydjJoLTJ2LTJoMnptMC0ydi0yaDJ2MmgtMnptLTIgMHYyaC0ydi0yaDJ6bTAtMnYtMmgydjJoLTJ6bTIgMHYyaDJ2LTJoLTJ6bTAgMnYyaDJ2LTJoLTJ6bTItMnYtMmgydjJoLTJ6bTAgMnYyaDJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        </div>

        <div className="w-full max-w-md animate-slide-up">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-primary)] shadow-lg mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold gradient-text mb-2">DigitalFlow</h1>
            <p className="text-[var(--text-secondary)]">Приєднуйтесь до спільноти</p>
          </div>

          {/* Theme toggle */}
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleTheme}
              onMouseEnter={() => setThemeHovered(true)}
              onMouseLeave={() => setThemeHovered(false)}
              style={{
                width: '40px',
                height: '40px',
                padding: '0',
                borderRadius: '12px',
                background: themeHovered ? (theme === 'dark' ? '#161b22' : 'white') : (theme === 'dark' ? '#21262d' : '#f6f8fa'),
                border: '1px solid ' + (themeHovered ? (theme === 'dark' ? '#58a6ff' : '#0969da') : (theme === 'dark' ? '#30363d' : '#d0d7de')),
                color: themeHovered ? (theme === 'dark' ? '#58a6ff' : '#0969da') : (theme === 'dark' ? '#8b949e' : '#57606a'),
                boxShadow: themeHovered
                  ? '0 2px 8px rgba(88,166,255,0.15)'
                  : '0 1px 2px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Auth tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setShowRegister(false)}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                background: !showRegister
                  ? 'linear-gradient(135deg, #0969da 0%, #1f6feb 100%)'
                  : (theme === 'dark' ? '#161b22' : 'white'),
                color: !showRegister ? 'white' : (theme === 'dark' ? '#8b949e' : '#57606a'),
                border: !showRegister ? 'none' : '1px solid ' + (theme === 'dark' ? '#30363d' : '#d0d7de'),
                boxShadow: !showRegister
                  ? '0 4px 12px rgba(88,166,255,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset'
                  : 'none',
                cursor: 'pointer',
              }}
            >
              Логін
            </button>
            <button
              onClick={() => setShowRegister(true)}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                background: showRegister
                  ? 'linear-gradient(135deg, #0969da 0%, #1f6feb 100%)'
                  : (theme === 'dark' ? '#161b22' : 'white'),
                color: showRegister ? 'white' : (theme === 'dark' ? '#8b949e' : '#57606a'),
                border: showRegister ? 'none' : '1px solid ' + (theme === 'dark' ? '#30363d' : '#d0d7de'),
                boxShadow: showRegister
                  ? '0 4px 12px rgba(88,166,255,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset'
                  : 'none',
                cursor: 'pointer',
              }}
            >
              Реєстрація
            </button>
          </div>

          {/* Auth form */}
          {showRegister ? <Register /> : <Login setToken={setToken} />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top navbar */}
      <nav className="sticky top-0 z-50 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] shadow-sm">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="btn-ghost lg:hidden"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold gradient-text hidden sm:flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="16">
                  <rect width="22" height="8" fill="#0057B7" />
                  <rect y="8" width="22" height="8" fill="#FFD700" />
                </svg>
                DigitalFlow
              </h1>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle with INLINE STYLES */}
            <button
              onClick={toggleTheme}
              onMouseEnter={() => setThemeHovered(true)}
              onMouseLeave={() => setThemeHovered(false)}
              style={{
                width: '40px',
                height: '40px',
                padding: '0',
                borderRadius: '12px',
                background: themeHovered ? (theme === 'dark' ? '#161b22' : 'white') : (theme === 'dark' ? '#21262d' : '#f6f8fa'),
                border: '1px solid ' + (themeHovered ? (theme === 'dark' ? '#58a6ff' : '#0969da') : (theme === 'dark' ? '#30363d' : '#d0d7de')),
                color: themeHovered ? (theme === 'dark' ? '#58a6ff' : '#0969da') : (theme === 'dark' ? '#8b949e' : '#57606a'),
                boxShadow: themeHovered
                  ? '0 2px 8px rgba(88,166,255,0.15)'
                  : '0 1px 2px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Logout button with INLINE STYLES */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setLogoutHovered(true)}
              onMouseLeave={() => setLogoutHovered(false)}
              style={{
                background: logoutHovered ? (theme === 'dark' ? '#21262d' : '#f6f8fa') : (theme === 'dark' ? '#161b22' : 'white'),
                color: theme === 'dark' ? '#e6edf3' : '#0d1117',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1.5px solid ' + (logoutHovered ? (theme === 'dark' ? '#6e7681' : '#8b949e') : (theme === 'dark' ? '#30363d' : '#d0d7de')),
                boxShadow: logoutHovered
                  ? '0 2px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)'
                  : '0 1px 2px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: logoutHovered ? 'translateY(-1px)' : 'translateY(0)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Вийти</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - Categories & Create Post */}
        <aside className={`
          sidebar w-80 flex-shrink-0 custom-scrollbar
          ${sidebarOpen ? 'block' : 'hidden'} lg:block
          fixed lg:static inset-y-16 left-0 z-40
          lg:z-auto
        `}>
          <div className="p-4 space-y-4">
            <Categories onSelectCategory={setSelectedCategory} />
            <PostForm
              token={token}
              onPostAdded={handlePostAdded}
              categoryId={selectedCategory}
            />
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Center - Posts */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-3xl mx-auto p-4">
            <PostList
              reload={reloadPosts}
              selectedPost={selectedPost}
              onSelectPost={setSelectedPost}
              categoryId={selectedCategory}
              token={token}
            />
          </div>
        </main>

        {/* Right sidebar - Comments */}
        <aside className="sidebar w-96 flex-shrink-0 custom-scrollbar hidden xl:block">
          <div className="p-4 space-y-4">
            {selectedPost ? (
              <>
                <CommentForm
                  token={token}
                  postId={selectedPost}
                  onCommentAdded={handleCommentAdded}
                />
                <CommentList
                  postId={selectedPost}
                  reload={reloadComments}
                  token={token}
                />
              </>
            ) : (
              <div className="card p-12 text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-[var(--text-secondary)] font-medium">
                  Оберіть пост для перегляду коментарів
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile comments modal */}
      {selectedPost && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] p-4 z-50">
          <button
            onClick={() => setSelectedPost(null)}
            className="btn-secondary w-full mb-3"
          >
            Закрити коментарі
          </button>
          <CommentForm
            token={token}
            postId={selectedPost}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[var(--text-primary)]">DigitalFlow</p>
                <p className="text-xs text-[var(--text-tertiary)]">Українська спільнота з розробки, дизайну та маркетингу для обміну досвідом і професійного розвитку.</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <p className="text-sm text-[var(--text-secondary)]">
                © Всі права захищені.
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Зроблено з ❤️ в Україні
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;