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
    // for production build we have to use the ngrok URL to make the API calls to the backend
    // at the same time, the backend should be running on the local machine
    // ngrok URL is used to expose the local server to the internet
    // is a temporary solution, for the production build, the backend should be deployed to the cloud
    BASE_URL = "https://fd90-103-178-205-124.ngrok-free.app/api/v1" // Use the ngrok URL
}

// Create a private Axios instance for authenticated requests
export const axiosPrivate: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
} as AxiosConfig)
