import { useState } from "react";

function CategoryForm({ onCategoryAdded }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

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
                onCategoryAdded(); // Оновити список категорій
            }
        } catch (err) {
            console.error("Помилка при запиті до сервера:", err);
            setError("Помилка при запиті до сервера");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-4">
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Додати категорію</span>
                </button>
            ) : (
                <div className="card-gradient rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold gradient-text">Нова категорія</h3>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setError("");
                                setName("");
                                setDescription("");
                            }}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 ml-1">
                                Назва категорії
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Наприклад: Технології"
                                className="input-field"
                                maxLength={50}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 ml-1">
                                Опис (необов'язково)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Короткий опис категорії..."
                                rows={2}
                                className="input-field resize-none"
                                maxLength={200}
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
                                    Створюємо...
                                </div>
                            ) : (
                                'Створити категорію'
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default CategoryForm;