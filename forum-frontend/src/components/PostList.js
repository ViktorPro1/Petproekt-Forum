import { useState, useEffect } from "react";

function PostList({ selectedPost, onSelectPost, reload }) {
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
        fetch("http://localhost:5000/api/posts")
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Помилка при завантаженні постів:", err));
    };

    // Перший рендер
    useEffect(() => {
        fetchPosts();
    }, []);

    // Перезавантаження при зміні reload
    useEffect(() => {
        fetchPosts();
    }, [reload]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold gradient-text">Список постів</h3>
                <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    {posts.length} {posts.length === 1 ? 'пост' : 'постів'}
                </span>
            </div>

            {posts.length === 0 ? (
                <div className="card-gradient rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Поки що немає постів</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {posts.map(post => (
                        <li
                            key={post.id}
                            onClick={() => onSelectPost(post.id)}
                            className={`card-gradient rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${post.id === selectedPost
                                ? 'ring-4 ring-primary-400 shadow-xl shadow-primary-500/30'
                                : 'hover:shadow-xl'
                                }`}
                        >
                            <h4 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h4>
                            <p className="text-gray-600 line-clamp-2">{post.content}</p>
                            <div className="flex items-center justify-between text-sm mt-4">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                        {post.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="font-semibold text-gray-700">{post.username || 'Користувач'}</span>
                                </div>
                                <span className="text-gray-500">{new Date(post.created_at).toLocaleDateString('uk-UA')}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default PostList;