import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";

function Categories({ onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [reload, setReload] = useState(0);

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

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                    Категорії
                </h2>
            </div>

            {/* Add category form */}
            <CategoryForm onCategoryAdded={handleCategoryAdded} />

            {/* Categories list */}
            <div className="space-y-1">
                {categories.length === 0 ? (
                    <div className="card p-6 text-center animate-fade-in">
                        <p className="text-sm text-[var(--text-secondary)]">Категорій поки немає</p>
                        <p className="text-xs text-[var(--text-tertiary)] mt-1">Створіть першу</p>
                    </div>
                ) : (
                    categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleClick(cat)}
                            className={`
                                w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group
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
                                <div className="flex-1 min-w-0">
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
                    ))
                )}
            </div>
        </div>
    );
}

export default Categories;