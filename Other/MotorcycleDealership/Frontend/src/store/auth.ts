import { create } from 'zustand';
import { login as authLogin, logout as authLogout, register as authRegister } from '../services/auth';

interface AuthState {
    userId: string | null;
    username: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    userId: null,
    username: null,
    login: async (username: string, password: string) => {
        const response = await authLogin(username, password);
        set({ userId: response.userId, username });
    },
    logout: async () => {
        await authLogout();
        set({ userId: null, username: null });
    },
    register: async (username: string, password: string) => {
        await authRegister(username, password);
        // После регистрации пользователь не аутентифицирован, нужно будет войти
    },
}));