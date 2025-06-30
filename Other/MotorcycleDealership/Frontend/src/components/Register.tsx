import { useState } from 'react';
import { useAuthStore } from '../store/auth';
import { register } from '../services/auth';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuthStore();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        if (username.length < 3) {
            setError('Username must be at least 3 characters long.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            await register(username, password);
            await login(username, password); // 👈 сразу логиним
            alert('Registration successful!');
            window.location.href = '/';
        } catch (err: any) {
            const errorMessage = err?.response?.data ?? 'Registration failed';
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register</h1>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
