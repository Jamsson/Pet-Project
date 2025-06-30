import { useState } from 'react';
import { useAuthStore } from '../store/auth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            alert('Login successful!');
        } catch (error) {
            alert('Login failed!');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h1>
            <form onSubmit={handleLogin} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;