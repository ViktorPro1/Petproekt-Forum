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
        <div className="card-gradient rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold gradient-text mb-4">Додати коментар</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Ваш коментар..."
                    rows={3}
                    className="input-field min-h-[100px] resize-none"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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