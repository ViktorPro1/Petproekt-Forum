import { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [selectedPost, setSelectedPost] = useState(null); // обраний пост для коментарів
  const [reloadPosts, setReloadPosts] = useState(false);   // оновлення списку постів
  const [reloadComments, setReloadComments] = useState(false); // оновлення коментарів
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setSelectedPost(null);
  };

  // Викликаємо після створення нового поста
  const handlePostAdded = () => {
    setReloadPosts(prev => !prev);
  };

  // Викликаємо після додавання нового коментаря
  const handleCommentAdded = () => {
    setReloadComments(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Навігаційна панель */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-blue-100 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold gradient-text">Forum Pro</h1>
            </div>

            <div className="flex items-center space-x-4">
              {token && (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Вийти
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Основний контент */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!token ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-md">
              <div className="text-center mb-6">
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowRegister(false)}
                    className={`font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 ${!showRegister
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50'
                      : 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400'
                      }`}
                  >
                    Логін
                  </button>
                  <button
                    onClick={() => setShowRegister(true)}
                    className={`font-semibold px-6 py-2.5 rounded-xl transition-all duration-300 ${showRegister
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50'
                      : 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400'
                      }`}
                  >
                    Реєстрація
                  </button>
                </div>
              </div>

              {showRegister ? <Register /> : <Login setToken={setToken} />}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ліва колонка - Створення посту */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <PostForm token={token} onPostAdded={handlePostAdded} />
              </div>
            </div>

            {/* Середня колонка - Список постів */}
            <div className="lg:col-span-1">
              <PostList
                reload={reloadPosts}
                selectedPost={selectedPost}
                onSelectPost={setSelectedPost}
              />
            </div>

            {/* Права колонка - Коментарі */}
            <div className="lg:col-span-1">
              {selectedPost ? (
                <div className="space-y-6">
                  <CommentForm
                    token={token}
                    postId={selectedPost}
                    onCommentAdded={handleCommentAdded}
                  />
                  <CommentList postId={selectedPost} reload={reloadComments} />
                </div>
              ) : (
                <div className="card-gradient rounded-2xl p-12 text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    Оберіть пост, щоб переглянути коментарі
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Футер */}
      <footer className="mt-16 bg-white/60 backdrop-blur-lg border-t border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              Зроблено з <span className="text-red-500 animate-pulse">❤️</span> від Forum Pro Team
            </p>
            <p className="text-gray-500 text-sm mt-2">© 2026 Всі права захищено</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;