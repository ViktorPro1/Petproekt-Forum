import { useState, useEffect, useCallback } from "react";

function PostList({ categoryId, reload, selectedPost, onSelectPost }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = useCallback(async () => {
        if (!categoryId) return;

        setLoading(true);
        let url = "http://localhost:5000/api/posts";
        if (categoryId) url += `?category_id=${categoryId}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, reload]);

    // No category selected
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

    // Loading state
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

    // Empty state
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
            {posts.map((post, index) => (
                <article
                    key={post.id}
                    onClick={() => onSelectPost(post.id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className={`
                        card-hover cursor-pointer p-5 animate-slide-up
                        ${selectedPost === post.id
                            ? "ring-2 ring-[var(--accent-primary)] bg-[var(--accent-primary)]/5"
                            : ""
                        }
                    `}
                >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                            {post.username ? post.username.charAt(0).toUpperCase() : '?'}
                        </div>

                        {/* Meta info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-[var(--text-primary)] text-sm">
                                    {post.username || 'Анонім'}
                                </span>
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

                        {/* Selected badge */}
                        {selectedPost === post.id && (
                            <span className="badge badge-primary">Вибрано</span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <h3 className="font-bold text-[var(--text-primary)] text-lg leading-snug">
                            {post.title}
                        </h3>
                        <p className="text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                            {post.content}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-secondary)]">
                        <button
                            className="btn-ghost !p-0 text-xs flex items-center gap-1.5 text-[var(--text-tertiary)] hover:text-[var(--accent-primary)]"
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
            ))}
        </div>
    );
}

export default PostList;