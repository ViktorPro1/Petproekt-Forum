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
    <div style={{ padding: "20px" }}>
      <h1>Forum PetProject</h1>

      {!token ? (
        <>
          <Register />
          <Login setToken={setToken} />
        </>
      ) : (
        <>
          <p>
            Авторизований користувач{" "}
            <button onClick={handleLogout}>Вийти</button>
          </p>

          {/* Форма для створення поста */}
          <PostForm token={token} onPostAdded={handlePostAdded} />

          {/* Список постів */}
          <PostList
            reload={reloadPosts}
            selectedPost={selectedPost}
            onSelectPost={setSelectedPost}
          />

          {selectedPost && (
            <>
              <h3>Коментарі до посту #{selectedPost}</h3>

              {/* Список коментарів */}
              <CommentList postId={selectedPost} reload={reloadComments} />

              {/* Форма додавання коментаря */}
              <CommentForm
                token={token}
                postId={selectedPost}
                onCommentAdded={handleCommentAdded}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
