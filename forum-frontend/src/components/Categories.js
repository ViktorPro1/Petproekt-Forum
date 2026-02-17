import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";

function Categories({ onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [reload, setReload] = useState(0);
    const [userRole, setUserRole] = useState("user");
    const [deleteHovered, setDeleteHovered] = useState(null);

    useEffect(() => {
        // Отримуємо роль користувача
        const role = localStorage.getItem("userRole") || "user";
        setUserRole(role);
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    }, [reload]);

    const handleClick = (cat) => {
        setSelectedId(cat.id);
        onSelectCategory(cat.id);
    };

    const handleCategoryAdded = () => {
        setReload(prev => prev + 1);
    };

    const handleDeleteCategory = async (categoryId, e) => {
        e.stopPropagation();

        if (!window.confirm("Ви впевнені що хочете видалити цю категорію?")) {
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:5000/api/categories/${categoryId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                // Оновлюємо список категорій
                setCategories(categories.filter(c => c.id !== categoryId));
                // Якщо видалили вибрану категорію - скидаємо вибір
                if (selectedId === categoryId) {
                    setSelectedId(null);
                    onSelectCategory(null);
                }
            } else {
                alert(data.message || "Помилка при видаленні категорії");
            }
        } catch (err) {
            console.error(err);
            alert("Помилка при видаленні категорії");
        }
    };

    const isAdmin = userRole === 'admin';

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Категорії
                </h2>
            </div>

            {/* Add category form - ТІЛЬКИ ДЛЯ АДМІНІВ */}
            {isAdmin && <CategoryForm onCategoryAdded={handleCategoryAdded} />}

            {/* Якщо не адмін і хоче додати категорію */}
            {!isAdmin && (
                <div className="text-xs text-[var(--text-tertiary)] italic p-2 bg-[var(--bg-tertiary)] rounded-lg">
                    Тільки адміністратори можуть додавати категорії
                </div>
            )}

            {/* Categories list */}
            <div className="space-y-1">
                {categories.length === 0 ? (
                    <div className="card p-6 text-center animate-fade-in">
                        <p className="text-sm text-[var(--text-secondary)]">Категорій поки немає</p>
                        {isAdmin && (
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">Створіть першу</p>
                        )}
                    </div>
                ) : (
                    categories.map(cat => (
                        <div
                            key={cat.id}
                            className={`
                                relative group
                                ${selectedId === cat.id ? "ring-1 ring-[var(--accent-primary)]" : ""}
                                rounded-lg
                            `}
                        >
                            <button
                                onClick={() => handleClick(cat)}
                                className={`
                                    w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200
                                    ${selectedId === cat.id
                                        ? "bg-[var(--accent-primary)] text-white shadow-md"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`
                                        w-2 h-2 rounded-full transition-all
                                        ${selectedId === cat.id ? "bg-white" : "bg-[var(--text-tertiary)] group-hover:bg-[var(--accent-primary)]"}
                                    `}></div>
                                    <div className="flex-1 min-w-0" style={{ paddingRight: isAdmin ? '32px' : '0' }}>
                                        <p className="font-semibold text-sm truncate">
                                            {cat.name}
                                        </p>
                                        {cat.description && (
                                            <p className={`
                                                text-xs truncate mt-0.5
                                                ${selectedId === cat.id ? "text-white/70" : "text-[var(--text-tertiary)]"}
                                            `}>
                                                {cat.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Delete button - ТІЛЬКИ ДЛЯ АДМІНІВ */}
                            {isAdmin && (
                                <button
                                    onClick={(e) => handleDeleteCategory(cat.id, e)}
                                    onMouseEnter={() => setDeleteHovered(cat.id)}
                                    onMouseLeave={() => setDeleteHovered(null)}
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        background: deleteHovered === cat.id ? '#fee' : '#fef2f2',
                                        border: '1px solid ' + (deleteHovered === cat.id ? '#f87171' : '#fecaca'),
                                        color: deleteHovered === cat.id ? '#dc2626' : '#ef4444',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: selectedId === cat.id ? 1 : 0,
                                    }}
                                    className="group-hover:opacity-100"
                                    title="Видалити категорію"
                                >
                                    <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Categories;