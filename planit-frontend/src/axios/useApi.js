import axios from "axios"
import { useMemo } from "react"
import { useAuth } from "../context/AuthProvider";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useApi = () => {
    const token = localStorage.getItem("access_token")
    const { logout } = useAuth()
    const api = useMemo(() => {

        const instance = axios.create({
            baseURL: BASE_URL || "http://localhost:8000/api",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,

        })

        instance.interceptors.request.use(
            (config) => {
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            }
        )

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                const res = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
                const newToken = res.data.access_token;
                saveToken(newToken); 
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
                } catch (refreshError) {
                    logout();
                return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
            }
        );
        return instance

    },[token])
    return api
}
