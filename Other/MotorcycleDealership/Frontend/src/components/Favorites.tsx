import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';

interface Favorite {
    id: string;
    userId: string;
    motorcycleId: string;
}

const fetchFavorites = async (token: string) => {
    const response = await axios.get('http://localhost:5001/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const Favorites = () => {
    const token = useAuthStore((state) => state.token);
    const { data: favorites, isLoading } = useQuery({
        queryKey: ['favorites'],
        queryFn: () => fetchFavorites(token!),
        enabled: !!token,
    });

    if (!token) return <div className="text-center p-4 text-gray-600">Please log in to view your favorites.</div>;
    if (isLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Your Favorites</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites?.length ? (
                    favorites.map((favorite: Favorite) => (
                        <div key={favorite.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <p className="text-gray-800">Motorcycle ID: {favorite.motorcycleId}</p>
                            <Link
                                to="/test-drive"
                                className="mt-4 inline-block w-full bg-blue-600 text-white px-3 py-2 rounded-md text-center hover:bg-blue-700 transition-colors"
                            >
                                Book Test Drive
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No favorites added yet.</p>
                )}
            </div>
        </div>
    );
};

export default Favorites;