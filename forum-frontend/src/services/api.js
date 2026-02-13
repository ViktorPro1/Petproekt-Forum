const API_URL = "http://localhost:5000/api";

// Auth
export const register = async (username, email, password) => {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
        return await res.json();
    } catch (err) {
        return { message: "Помилка сервера" };
    }
};

export const login = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        return await res.json();
    } catch (err) {
        return { message: "Помилка сервера" };
    }
};

// Posts
export const getPosts = async () => {
    try {
        const res = await fetch(`${API_URL}/posts`);
        return await res.json();
    } catch {
        return [];
    }
};

export const createPost = async (token, category_id, title, content) => {
    try {
        const res = await fetch(`${API_URL}/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ category_id, title, content }),
        });
        return await res.json();
    } catch {
        return { message: "Помилка сервера" };
    }
};

// Comments
export const getComments = async (postId) => {
    try {
        const res = await fetch(`${API_URL}/comments/${postId}`);
        return await res.json();
    } catch {
        return [];
    }
};

export const createComment = async (token, postId, content) => {
    try {
        const res = await fetch(`${API_URL}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ post_id: postId, content }),
        });
        return await res.json();
    } catch {
        return { message: "Помилка сервера" };
    }
};
