import axios from "axios"
import { useMemo } from "react"

export const useApi = () => {
    const token = localStorage.getItem("access_token")
    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
            headers: {
                "Content-Type": "application/json",
            },
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
                if (error.response) {
                    const status = error.response.status;
                    console.log(status )
                    if (status === 401 || status === 403 ){
                        console.warn("unauthrized token or expired")

                        localStorage.removeItem("access_token");
                        window.location.href = "/login";
                    }
                }
                return Promise.reject(error);
            } 
        )
        return instance

    },[token])
    return api
}
