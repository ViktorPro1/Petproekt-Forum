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
    }, [postId, reload]);

    if (loading) {
        return (
            <div className="card p-6">
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 bg-[var(--bg-tertiary)] rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/3 mb-2"></div>
                                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--text-primary)]">
                    Коментарі
                </h3>
                <span className="badge badge-primary">
                    {comments.length}
                </span>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20">
                    {error}
                </div>
            )}

            {!loading && comments.length === 0 && !error && (
                <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
                        <svg className="w-6 h-6 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">Коментарів немає</p>
                </div>
            )}

            <ul className="space-y-3">
                {comments.map((c) => (
                    <li
                        key={c.id}
                        className="flex gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                            {c.username ? c.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-[var(--text-primary)] text-sm">
                                    {c.username || 'Анонім'}
                                </span>
                                <span className="text-xs text-[var(--text-tertiary)]">
                                    {new Date(c.created_at).toLocaleDateString('uk-UA', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {c.content}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentList;