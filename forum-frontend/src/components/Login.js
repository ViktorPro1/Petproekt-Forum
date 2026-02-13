import { useState } from "react";
import { login } from "../services/api";

export default function Login({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.token) {
            setToken(res.token);
            setMessage("Успішний вхід");
            localStorage.setItem("token", res.token);
        } else {
            setMessage(res.message);
        }
    };

    return (
        <div>
            <h2>Логін</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Увійти</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
