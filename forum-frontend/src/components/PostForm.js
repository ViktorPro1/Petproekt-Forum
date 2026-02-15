import { useState } from "react";

function PostForm({ token, onPostAdded, categoryId }) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [createHovered, setCreateHovered] = useState(false);
    const [submitHovered, setSubmitHovered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setError("Заповніть всі поля");
            return;
        }
        if (!categoryId) {
            setError("Оберіть категорію");
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
                body: JSON.stringify({ title, content, category_id: categoryId }),
            });
            const data = await res.json();
            if (!res.ok) setError(data.message || "Помилка сервера");
            else {
                setTitle("");
                setContent("");
                setError("");
                setShowForm(false);
                onPostAdded();
            }
        } catch (err) {
            setError("Помилка при запиті до сервера");
        } finally {
            setLoading(false);
        }
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                disabled={!categoryId}
                onMouseEnter={() => setCreateHovered(true)}
                onMouseLeave={() => setCreateHovered(false)}
                title={!categoryId ? "Спочатку оберіть категорію" : ""}
                style={{
                    background: !categoryId
                        ? '#6e7681'
                        : (createHovered
                            ? 'linear-gradient(135deg, #1f6feb 0%, #0969da 100%)'
                            : 'linear-gradient(135deg, #0969da 0%, #1f6feb 100%)'),
                    color: 'white',
                    fontWeight: '600',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: createHovered && categoryId
                        ? '0 4px 8px rgba(0,0,0,0.1), 0 8px 20px rgba(88,166,255,0.3)'
                        : '0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(88,166,255,0.2)',
                    cursor: !categoryId ? 'not-allowed' : 'pointer',
                    opacity: !categoryId ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                    transform: createHovered && categoryId ? 'translateY(-1px)' : 'translateY(0)',
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}
            >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Створити пост
            </button>
        );
    }

    return (
        <div className="card p-4 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--text-primary)]">Новий пост</h3>
                <button
                    onClick={() => {
                        setShowForm(false);
                        setError("");
                        setTitle("");
                        setContent("");
                    }}
                    className="btn-icon !w-8 !h-8"
                    style={{
                        width: '32px',
                        height: '32px',
                        padding: '0',
                        borderRadius: '8px',
                        background: '#f6f8fa',
                        border: '1px solid #d0d7de',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {error && (
                <div className="mb-3 p-2 rounded-lg text-xs font-medium bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field !py-2 text-sm"
                />
                <textarea
                    placeholder="Що у вас на думці?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={3}
                    className="input-field !py-2 text-sm resize-none"
                />
                <button
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setSubmitHovered(true)}
                    onMouseLeave={() => setSubmitHovered(false)}
                    style={{
                        background: loading
                            ? '#6e7681'
                            : (submitHovered
                                ? 'linear-gradient(135deg, #1f6feb 0%, #0969da 100%)'
                                : 'linear-gradient(135deg, #0969da 0%, #1f6feb 100%)'),
                        color: 'white',
                        fontWeight: '600',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: submitHovered && !loading
                            ? '0 4px 8px rgba(0,0,0,0.1), 0 8px 20px rgba(88,166,255,0.3)'
                            : '0 1px 2px rgba(0,0,0,0.05), 0 4px 12px rgba(88,166,255,0.2)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        transform: submitHovered && !loading ? 'translateY(-1px)' : 'translateY(0)',
                        width: '100%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {loading ? "Публікуємо..." : "Опублікувати"}
                </button>
            </form>
        </div>
    );
}

export default PostForm;