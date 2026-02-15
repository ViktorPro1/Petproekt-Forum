import { useState } from "react";
import { register } from "../services/api";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await register(username, email, password);
        setMessage(res.message || "Користувача створено");
        setLoading(false);
    };

    return (
        <div className="card p-6 animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Ім'я користувача
                    </label>
                    <input
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                        Пароль
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Реєструємо...
                        </div>
                    ) : (
                        'Зареєструватися'
                    )}
                </button>
            </form>

            {message && (
                <div className="mt-4 p-3 rounded-xl text-sm font-medium bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20">
                    {message}
                </div>
            )}
        </div>
    );
}