import axios, { AxiosInstance, AxiosRequestConfig } from "axios"

interface AxiosConfig extends AxiosRequestConfig {
    baseURL: string
    headers?: Record<string, string>
    withCredentials?: boolean
}

// BASE_URL have to be const, for the production build
let BASE_URL = ""
if (window.location.hostname === "localhost") {
    BASE_URL = "http://127.0.0.1:8003/api/v1"
} else {
    BASE_URL = "https://gradspace.azurewebsites.net/api/v1"
}

// Create a private Axios instance for authenticated requests
export const axiosPrivate: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
} as AxiosConfig)
