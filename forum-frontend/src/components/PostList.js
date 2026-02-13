import { useState, useEffect } from "react";

function PostList({ selectedPost, onSelectPost, reload }) {
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
        fetch("http://localhost:5000/api/posts")
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Помилка при завантаженні постів:", err));
    };

    // Перший рендер
    useEffect(() => {
        fetchPosts();
    }, []);

    // Перезавантаження при зміні reload
    useEffect(() => {
        fetchPosts();
    }, [reload]);

    return (
        <div>
            <h3>Список постів</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {posts.map(post => (
                    <li
                        key={post.id}
                        onClick={() => onSelectPost(post.id)}
                        style={{
                            cursor: "pointer",
                            fontWeight: post.id === selectedPost ? "bold" : "normal",
                            backgroundColor: post.id === selectedPost ? "#f0f0f0" : "transparent",
                            padding: "5px",
                            margin: "3px 0",
                            borderRadius: "4px"
                        }}
                    >
                        {post.title}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PostList;
