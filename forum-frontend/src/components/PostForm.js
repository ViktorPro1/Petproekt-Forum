import { useState } from "react";

function PostForm({ token, onPostAdded, categoryId }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setError("Заповніть всі поля");
            return;
        }
        if (!categoryId) {
            setError("Оберіть категорію");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, category_id: categoryId }),
            });
            const data = await res.json();
            if (!res.ok) setError(data.message || "Помилка сервера");
            else {
                setTitle("");
                setContent("");
                setError("");
                onPostAdded();
            }
        } catch (err) {
            setError("Помилка при запиті до сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-600">{error}</p>}
            <input
                type="text"
                placeholder="Заголовок"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
            />
            <textarea
                placeholder="Вміст"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="input-field"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Публікуємо..." : "Опублікувати"}
            </button>
        </form>
    );
}

export default PostForm;

