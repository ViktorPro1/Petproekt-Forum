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
                setContent("");
                onCommentAdded();
            }
        } catch (err) {
            console.error("Помилка при запиті до сервера:", err);
            setError("Помилка при запиті до сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card p-4 animate-scale-in">
            <h3 className="font-bold text-[var(--text-primary)] mb-3">Додати коментар</h3>

            {error && (
                <div className="mb-3 p-2 rounded-lg text-xs font-medium bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Поділіться своєю думкою..."
                    rows={3}
                    className="input-field !py-2 text-sm resize-none"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Відправка...
                        </div>
                    ) : (
                        'Додати коментар'
                    )}
                </button>
            </form>
        </div>
    );
}

export default CommentForm;