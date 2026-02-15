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
        setReload(prev => prev + 1); // Оновити список категорій
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold mb-2">Категорії</h2>

            {/* Форма додавання категорії */}
            <CategoryForm onCategoryAdded={handleCategoryAdded} />

            {/* Список категорій */}
            <div className="space-y-2">
                {categories.length === 0 ? (
                    <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                        <p className="text-gray-500 font-medium">Категорій поки немає</p>
                        <p className="text-sm text-gray-400 mt-1">Створіть першу категорію</p>
                    </div>
                ) : (
                    categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleClick(cat)}
                            className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 ${selectedId === cat.id
                                ? "bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <p className="font-semibold">{cat.name}</p>
                            <p className={`text-sm ${selectedId === cat.id ? "text-white/80" : "text-gray-400"}`}>
                                {cat.description || "Без опису"}
                            </p>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default Categories;