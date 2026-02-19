import { useState, useEffect, useCallback } from "react";

function PostList({ categoryId, reload, selectedPost, onSelectPost, token }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState("user");
    const [deleteHovered, setDeleteHovered] = useState(null);
    const [expandedPosts, setExpandedPosts] = useState({}); // Які пости розгорнуті
    const [reactions, setReactions] = useState({}); // Реакції для кожного поста
    const [userReactions, setUserReactions] = useState({}); // Реакції поточного користувача

    useEffect(() => {
        const role = localStorage.getItem("userRole") || "user";
        setUserRole(role);
    }, []);

    // Завантажити реакції для поста (обернуто в useCallback)
    const fetchPostReactions = useCallback(async (postId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/reactions/post/${postId}`);
            const data = await res.json();
            setReactions(prev => ({ ...prev, [postId]: data }));
        } catch (err) {
            console.error("Error fetching reactions:", err);
        }
    }, []);

    // Завантажити реакцію користувача (обернуто в useCallback)
    const fetchUserReaction = useCallback(async (postId) => {
        if (!token) return;
        try {
            const res = await fetch(`http://localhost:5000/api/reactions/post/${postId}/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.reaction) {
                setUserReactions(prev => ({ ...prev, [postId]: data.reaction }));
            }
        } catch (err) {
            console.error("Error fetching user reaction:", err);
        }
    }, [token]);

    const fetchPosts = useCallback(async () => {
        if (!categoryId) return;

        setLoading(true);
        let url = "http://localhost:5000/api/posts";
        if (categoryId) url += `?category_id=${categoryId}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            setPosts(data);

            // Завантажуємо реакції для кожного поста
            data.forEach(post => {
                fetchPostReactions(post.id);
                fetchUserReaction(post.id);
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [categoryId, fetchPostReactions, fetchUserReaction]); // ← видалено token

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, reload]);

    // Додати/змінити реакцію
    const handleReaction = async (postId, reactionType, e) => {
        e.stopPropagation();

        if (!token) {
            alert("Увійдіть щоб ставити реакції");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/reactions/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ post_id: postId, reaction_type: reactionType })
            });

            if (res.ok) {
                // Оновлюємо реакції
                await fetchPostReactions(postId);
                await fetchUserReaction(postId);
            }
        } catch (err) {
            console.error("Error adding reaction:", err);
        }
    };

    const handleDeletePost = async (postId, e) => {
        e.stopPropagation();

        if (!window.confirm("Ви впевнені що хочете видалити цей пост?")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                setPosts(posts.filter(p => p.id !== postId));
                if (selectedPost === postId) {
                    onSelectPost(null);
                }
            } else {
                alert(data.message || "Помилка при видаленні поста");
            }
        } catch (err) {
            console.error(err);
            alert("Помилка при видаленні поста");
        }
    };

    // Перемкнути розгортання поста
    const toggleExpand = (postId, e) => {
        e.stopPropagation();
        setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    // Іконки реакцій
    const reactionIcons = {
        like: '👍',
        heart: '❤️',
        handshake: '🤝'
    };

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                }}>
                    <svg style={{ width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 20 20">
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
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'linear-gradient(135deg, #0969da, #1f6feb)',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                }}>
                    <svg style={{ width: '12px', height: '12px' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    МОД
                </span>
            );
        }
        return null;
    };

    const canModerate = userRole === 'admin' || userRole === 'moderator';

    if (!categoryId) {
        return (
            <div className="card p-16 text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <svg className="w-10 h-10 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                    Оберіть категорію
                </h3>
                <p className="text-[var(--text-secondary)] max-w-sm mx-auto">
                    Виберіть категорію зліва, щоб побачити пости та почати обговорення
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="card p-6 animate-pulse">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-[var(--bg-tertiary)] rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/3 mb-3"></div>
                                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-full mb-2"></div>
                                <div className="h-3 bg-[var(--bg-tertiary)] rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="card p-16 text-center animate-fade-in">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
                    <svg className="w-10 h-10 text-[var(--text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    Постів поки немає
                </h3>
                <p className="text-[var(--text-secondary)] max-w-sm mx-auto">
                    Будьте першим, хто створить пост у цій категорії!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3 animate-fade-in">
            {posts.map((post, index) => {
                const isExpanded = expandedPosts[post.id];
                const postReactions = reactions[post.id] || { like: { count: 0 }, heart: { count: 0 }, handshake: { count: 0 } };
                const userReaction = userReactions[post.id];
                const contentLength = post.content.length;
                const shouldShowExpand = contentLength > 300;

                return (
                    <article
                        key={post.id}
                        onClick={() => onSelectPost(post.id)}
                        style={{ animationDelay: `${index * 50}ms` }}
                        className={`
                            card-hover cursor-pointer p-5 animate-slide-up relative
                            ${selectedPost === post.id
                                ? "ring-2 ring-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
                                : ""
                            }
                        `}
                    >
                        {canModerate && (
                            <button
                                onClick={(e) => handleDeletePost(post.id, e)}
                                onMouseEnter={() => setDeleteHovered(post.id)}
                                onMouseLeave={() => setDeleteHovered(null)}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: deleteHovered === post.id ? '#fee' : '#fef2f2',
                                    border: '1px solid ' + (deleteHovered === post.id ? '#f87171' : '#fecaca'),
                                    color: deleteHovered === post.id ? '#dc2626' : '#ef4444',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 10,
                                }}
                                title="Видалити пост"
                            >
                                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}

                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                                {post.username ? post.username.charAt(0).toUpperCase() : '?'}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="font-semibold text-[var(--text-primary)] text-sm">
                                        {post.username || 'Анонім'}
                                    </span>
                                    {getRoleBadge(post.role)}
                                    <span className="text-xs text-[var(--text-tertiary)]">•</span>
                                    <time className="text-xs text-[var(--text-tertiary)]">
                                        {new Date(post.created_at).toLocaleDateString('uk-UA', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </time>
                                </div>
                            </div>

                            {selectedPost === post.id && (
                                <span className="badge badge-primary">Вибрано</span>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="font-bold text-[var(--text-primary)] text-lg leading-snug">
                                {post.title}
                            </h3>
                            <p className={`text-[var(--text-secondary)] leading-relaxed ${!isExpanded && shouldShowExpand ? 'line-clamp-3' : ''}`}>
                                {post.content}
                            </p>
                            {shouldShowExpand && (
                                <button
                                    onClick={(e) => toggleExpand(post.id, e)}
                                    className="text-sm text-[var(--accent-primary)] hover:underline font-medium"
                                >
                                    {isExpanded ? 'Показати менше' : 'Показати більше'}
                                </button>
                            )}
                        </div>

                        {/* Реакції */}
                        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-secondary)]">
                            {/* Кнопки реакцій */}
                            <div className="flex items-center gap-2">
                                {Object.entries(reactionIcons).map(([type, icon]) => {
                                    const count = postReactions[type]?.count || 0;
                                    const isActive = userReaction === type;

                                    return (
                                        <button
                                            key={type}
                                            onClick={(e) => handleReaction(post.id, type, e)}
                                            className="flex items-center gap-1 px-2 py-1 rounded-lg transition-all hover:bg-[var(--bg-tertiary)]"
                                            style={{
                                                background: isActive ? 'var(--accent-primary)' : 'transparent',
                                                color: isActive ? 'white' : 'var(--text-secondary)',
                                            }}
                                            title={postReactions[type]?.users?.join(', ') || ''}
                                        >
                                            <span className="text-base">{icon}</span>
                                            {count > 0 && (
                                                <span className="text-xs font-semibold">{count}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Коментарі */}
                            <button
                                className="btn-ghost !p-0 text-xs flex items-center gap-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] ml-auto"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectPost(post.id);
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Коментарі
                            </button>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}

export default PostList;