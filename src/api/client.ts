import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
    timeout: 10_000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("permissions");
            if (window.location.pathname !== "/login") {
                window.location.assign("/login");
            }
        }
        if (
            error.response?.status === 403 &&
            window.location.pathname !== "/403" &&
            window.location.pathname !== "/login"
        ) {
            window.location.assign("/403");
        }
        return Promise.reject(error);
    },
);
