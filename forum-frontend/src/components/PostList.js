import { useState, useEffect, useCallback } from "react";

function PostList({ categoryId, reload, selectedPost, onSelectPost }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = useCallback(async () => {
        if (!categoryId) return; // Не завантажувати пости без категорії

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

    // Якщо категорія не вибрана
    if (!categoryId) {
        return (
            <div className="card-gradient rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-2">Оберіть категорію</h3>
                <p className="text-gray-500">Виберіть категорію зліва, щоб побачити пости</p>
            </div>
        );
    }

    // Завантаження
    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 h-32"></div>
                ))}
            </div>
        );
    }

    // Пости відсутні в категорії
    if (posts.length === 0) {
        return (
            <div className="card-gradient rounded-2xl p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Постів поки немає</h3>
                <p className="text-gray-500">Будьте першим, хто створить пост у цій категорії!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map(post => (
                <div
                    key={post.id}
                    onClick={() => onSelectPost(post.id)}
                    className={`cursor-pointer p-6 rounded-xl shadow-md transition-all duration-300 ${selectedPost === post.id
                        ? "bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 shadow-lg"
                        : "bg-white hover:shadow-xl hover:scale-[1.02]"
                        }`}
                >
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                        {selectedPost === post.id && (
                            <span className="px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs rounded-full font-semibold">
                                Вибрано
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                    <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{post.username || 'Анонім'}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PostList;