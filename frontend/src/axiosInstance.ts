import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import API_URL from '../axios/API_URL'; 

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Create an Axios instance
const   axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});


// Request Interceptor
axiosInstance.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
        const token = localStorage.getItem("trainer_access_token");
        console.log('toke is there');
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (originalRequest && error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; 
            try {
                
                const response = await axiosInstance.post<{ accessToken: string }>('/api/trainer/refresh-token', {}, { withCredentials: true });
                const { accessToken } = response.data;
                // console.log('new accessToken -- - - -//', accessToken);
                
                localStorage.setItem("trainer_access_token", accessToken);
                
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                
                return axiosInstance(originalRequest); 
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                window.location.href = '/trainer/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
