import { useState } from "react";

function PostForm({ token, onPostAdded }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setError("Заповніть всі поля");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, category_id: 1 }), // для спрощення category_id = 1
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Помилка при створенні поста");
            } else {
                setTitle("");
                setContent("");
                setError("");
                if (onPostAdded) onPostAdded(); // сигналізує App про оновлення
            }
        } catch (err) {
            console.error(err);
            setError("Помилка при запиті до сервера");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <h3>Створити пост</h3>
            <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "300px", marginBottom: "5px" }}
            />
            <br />
            <textarea
                placeholder="Текст поста"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                cols={50}
            />
            <br />
            <button type="submit">Створити</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
}

export default PostForm;
