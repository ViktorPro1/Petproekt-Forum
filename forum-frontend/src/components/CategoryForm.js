import { useState } from "react";

function CategoryForm({ onCategoryAdded }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [addHovered, setAddHovered] = useState(false);
    const [submitHovered, setSubmitHovered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Назва категорії обов'язкова");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, description }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Помилка при створенні категорії");
            } else {
                setName("");
                setDescription("");
                setShowForm(false);
                onCategoryAdded();
            }
        } catch (err) {
            console.error("Помилка при запиті до сервера:", err);
            setError("Помилка при запиті до сервера");
        } finally {
            setLoading(false);
        }
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                onMouseEnter={() => setAddHovered(true)}
                onMouseLeave={() => setAddHovered(false)}
                style={{
                    background: addHovered ? '#f6f8fa' : 'white',
                    color: '#0d1117',
                    fontWeight: '600',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid ' + (addHovered ? '#8b949e' : '#d0d7de'),
                    boxShadow: addHovered
                        ? '0 2px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)'
                        : '0 1px 2px rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: addHovered ? 'translateY(-1px)' : 'translateY(0)',
                    width: '100%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}
            >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Додати категорію
            </button>
        );
    }

    return (
        <div className="card p-4 animate-scale-in">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Нова категорія</h3>
                <button
                    onClick={() => {
                        setShowForm(false);
                        setError("");
                        setName("");
                        setDescription("");
                    }}
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
                    <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Назва категорії"
                    className="input-field !py-2 text-sm"
                    maxLength={50}
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Опис (необов'язково)"
                    rows={2}
                    className="input-field !py-2 text-sm resize-none"
                    maxLength={200}
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
                    {loading ? "Створюємо..." : "Створити"}
                </button>
            </form>
        </div>
    );
}

export default CategoryForm;