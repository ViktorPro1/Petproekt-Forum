import { useState } from "react";
import { login } from "../services/api";

export default function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await login(email, password);
        if (res.token) {
            setToken(res.token);
            setMessage("Успішний вхід");
            localStorage.setItem("token", res.token);
        } else {
            setMessage(res.message);
        }
        setLoading(false);
    };

    return (
        <div className="card-gradient rounded-2xl p-8 shadow-2xl shadow-primary-500/20 backdrop-blur-sm max-w-md mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg shadow-primary-500/50">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold gradient-text">Логін</h2>
                <p className="text-gray-600 mt-2">Увійдіть у свій акаунт</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl border-l-4 ${message.includes("Успішний")
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500"
                    : "bg-gradient-to-r from-red-50 to-pink-50 border-red-500"
                    }`}>
                    <p className={`font-medium ${message.includes("Успішний") ? "text-green-700" : "text-red-700"}`}>
                        {message}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 ml-1">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field pl-12"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 ml-1">Пароль</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field pl-12"
                        />
                    </div>
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
                            Входимо...
                        </div>
                    ) : (
                        'Увійти'
                    )}
                </button>
            </form>
        </div>
    );
}