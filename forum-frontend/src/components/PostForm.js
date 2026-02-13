import { useState } from "react";

function PostForm({ token, onPostAdded }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setError("Заповніть всі поля");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ title, content, category_id: 1 }), // для спрощення category_id = 1
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Помилка при створенні поста");
            } else {
                setTitle("");
                setContent("");
                setError("");
                if (onPostAdded) onPostAdded(); // сигналізує App про оновлення
            }
        } catch (err) {
            console.error(err);
            setError("Помилка при запиті до сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-gradient rounded-2xl p-6 shadow-xl">
            <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold gradient-text">Створити пост</h3>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Заголовок поста..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div>
                    <textarea
                        placeholder="Що у вас на думці?..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="input-field min-h-[120px] resize-none"
                    />
                </div>

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
                            Публікуємо...
                        </div>
                    ) : (
                        'Опублікувати'
                    )}
                </button>
            </form>
        </div>
    );
}

export default PostForm;