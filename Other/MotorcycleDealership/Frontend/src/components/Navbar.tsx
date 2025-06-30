import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

const Navbar = () => {
    const userId = useAuthStore((state) => state.userId); // Используем userId для проверки аутентификации
    const logout = useAuthStore((state) => state.logout);

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link
                    to="/"
                    className="text-2xl md:text-3xl font-bold tracking-wide hover:text-blue-200 transition-colors"
                >
                    Motorcycle Dealership
                </Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:text-blue-200 transition-colors">
                        Catalog
                    </Link>
                    {userId ? (
                        <>
                            <Link
                                to="/test-drive"
                                className="hover:text-blue-200 transition-colors"
                            >
                                Test Drive
                            </Link>
                            <Link
                                to="/profile"
                                className="hover:text-blue-200 transition-colors"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={async () => {
                                    await logout();
                                    window.location.href = '/login'; // Перенаправление после выхода
                                }}
                                className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-200 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="hover:text-blue-200 transition-colors">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;