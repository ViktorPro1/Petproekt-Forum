import { useState } from "react";

function CommentForm({ token, postId, onCommentAdded }) {
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError("Коментар не може бути порожнім");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ post_id: postId, content }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Помилка при додаванні коментаря");
            } else {
                setContent(""); // очистити поле
                onCommentAdded(); // сигналізує App про оновлення CommentList
            }
        } catch (err) {
            console.error("Помилка при запиті до сервера:", err);
            setError("Помилка при запиті до сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "10px" }}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Ваш коментар"
                rows={3}
                style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    resize: "vertical",
                }}
            />
            <br />
            <button
                type="submit"
                disabled={loading}
                style={{
                    marginTop: "5px",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    cursor: loading ? "not-allowed" : "pointer",
                }}
            >
                {loading ? "Відправка..." : "Додати коментар"}
            </button>
            {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
        </form>
    );
}

export default CommentForm;
