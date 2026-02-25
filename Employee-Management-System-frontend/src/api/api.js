import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        console.log('API Request: Adding token to', config.url);
        config.headers.Authorization = `Bearer ${user.token}`;
    } else {
        console.log('API Request: No token found for', config.url);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => {
        // Handle standardized ApiResponse wrapper
        if (response.data && typeof response.data === 'object') {
            const { success, data, message } = response.data;

            // If it follows the ApiResponse structure
            if (success !== undefined) {
                if (success) {
                    return { ...response, data: data };
                } else {
                    // Treat success: false as an error for the catch block
                    return Promise.reject({
                        response: {
                            status: response.status,
                            data: { message: message || 'Operation failed' }
                        }
                    });
                }
            }
        }
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
        if (error.response?.status === 401) {
            console.warn('API 401: Redirecting to login and clearing session');
            localStorage.removeItem('user');
            // Prevent redirect loop if already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
