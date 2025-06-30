import axios from 'axios';

const API_URL = 'http://localhost:5001/api/auth/';

export const register = async (username: string, password: string) => {
    const response = await axios.post(API_URL + 'register', { username, password }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }, // Явно указываем тип контента
    });
    return response.data;
};

export const login = async (username: string, password: string) => {
    const response = await axios.post(API_URL + 'login', { username, password }, { withCredentials: true });
    return response.data;
};

export const logout = async () => {
    const response = await axios.post(API_URL + 'logout', {}, { withCredentials: true });
    return response.data;
};

export const getCurrentUser = () => {
    return null;
};