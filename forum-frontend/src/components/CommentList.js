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

    if (loading) {
        return (
            <div className="card-gradient rounded-2xl p-8">
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="card-gradient rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold gradient-text mb-6">
                Коментарі ({comments.length})
            </h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            {!loading && comments.length === 0 && !error && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">Коментарів немає</p>
                </div>
            )}

            <ul className="space-y-3">
                {comments.map((c) => (
                    <li
                        key={c.id}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {c.user_id}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-gray-700">Користувач {c.user_id}</span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(c.created_at).toLocaleString('uk-UA')}
                                    </span>
                                </div>
                                <p className="text-gray-700">{c.content}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CommentList;