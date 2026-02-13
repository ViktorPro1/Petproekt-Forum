import { useState, useEffect } from "react";

function CommentList({ postId, reload }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/api/comments/${postId}`);
                const data = await res.json();

                if (!res.ok) {
                    setError(data.message || "Помилка при завантаженні коментарів");
                    setComments([]);
                } else {
                    setComments(data);
                    setError("");
                }
            } catch (err) {
                console.error("Помилка при запиті до сервера:", err);
                setError("Помилка при запиті до сервера");
                setComments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId, reload]); // оновлюємо при зміні посту або reload

    return (
        <div style={{ marginTop: "10px", marginBottom: "20px" }}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p>Завантаження коментарів...</p>}
            {!loading && comments.length === 0 && !error && <p>Коментарів немає</p>}
            <ul style={{ listStyle: "none", padding: 0 }}>
                {comments.map((c) => (
                    <li
                        key={c.id}
                        style={{
                            marginBottom: "8px",
                            padding: "6px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <b>Користувач {c.user_id}:</b> {c.content}{" "}
                        <i style={{ fontSize: "0.8em", color: "#555" }}>
                            ({new Date(c.created_at).toLocaleString()})
                        </i>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentList;
