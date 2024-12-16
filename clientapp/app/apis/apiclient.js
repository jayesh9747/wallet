import axios from 'axios';
import { Platform } from 'react-native';
import authStore from '../auth/authStore';
import cache from '../utility/cache';


// Function to retrieve the token
const getToken = async () => {
    const token = await authStore.getToken();
    return token;
};

const apiClient = axios.create({
    baseURL: 'https://c028-2409-40c1-4b-fc96-3381-5a9e-5309-24d9.ngrok-free.app/api/v1',
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
    timeout: 3000
});


// Add request interceptor
apiClient.interceptors.request.use(
    async (request) => {
        const token = await getToken();
        if (token) {
            request.headers['Authorization'] = `Bearer ${token}`;
        }

        if (['post', 'put', 'patch'].includes(request.method)) {
            if (!request.data) {
                request.data = {};
            }
            request.data.platform = Platform.OS;
            request.data.device_id = '-';
        }

        return request;
    },
    (error) => {

        return Promise.reject(error);
    }
);

export default apiClient;
