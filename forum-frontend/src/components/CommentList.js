import { useState, useEffect } from "react";

function CommentList({ postId, reload, token }) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [userRole, setUserRole] = useState("user");
    const [deleteHovered, setDeleteHovered] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem("userRole") || "user";
        setUserRole(role);
    }, []);

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

    const handleDeleteComment = async (commentId, e) => {
        e.stopPropagation();

        if (!window.confirm("Ви впевнені що хочете видалити цей коментар?")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setComments(comments.filter(c => c.id !== commentId));
            } else {
                alert(data.message || "Помилка при видаленні коментаря");
            }
        } catch (err) {
            console.error(err);
            alert("Помилка при видаленні коментаря");
        }
    };

    // Функція для отримання бейджа ролі
    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                }}>
                    <svg style={{ width: '10px', height: '10px' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                    </svg>
                    АДМІН
                </span>
            );
        } else if (role === 'moderator') {
            return (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: 'linear-gradient(135deg, #0969da, #1f6feb)',
                    color: 'white',
                    fontSize: '9px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                }}>
                    <svg style={{ width: '10px', height: '10px' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    МОД
                </span>
            );
        }
        return null;
    };

    const canModerate = userRole === 'admin' || userRole === 'moderator';

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
                        className="flex gap-3 p-3 rounded-xl bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors relative"
                    >
                        {canModerate && (
                            <button
                                onClick={(e) => handleDeleteComment(c.id, e)}
                                onMouseEnter={() => setDeleteHovered(c.id)}
                                onMouseLeave={() => setDeleteHovered(null)}
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '6px',
                                    background: deleteHovered === c.id ? '#fee' : '#fef2f2',
                                    border: '1px solid ' + (deleteHovered === c.id ? '#f87171' : '#fecaca'),
                                    color: deleteHovered === c.id ? '#dc2626' : '#ef4444',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                                title="Видалити коментар"
                            >
                                <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}

                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
                            {c.username ? c.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="flex-1 min-w-0" style={{ paddingRight: canModerate ? '36px' : '0' }}>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-semibold text-[var(--text-primary)] text-sm">
                                    {c.username || 'Анонім'}
                                </span>
                                {/* РОЛЬ БЕЙДЖ */}
                                {getRoleBadge(c.role)}
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