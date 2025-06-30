import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuthStore } from '../store/auth';

interface TestDriveRequest {
    id: string;
    motorcycleId: string;
    userId: string;
    requestedDate: string;
    status: string;
}

const fetchTestDriveRequests = async () => {
    const response = await axios.get('http://localhost:5001/api/testdrive', {
        withCredentials: true, // ⬅️ важное условие для cookie-авторизации
    });
    return response.data;
};

const Profile = () => {
    const username = useAuthStore((state) => state.username); // используем username из zustand
    const { data: requests, isLoading } = useQuery({
        queryKey: ['testDriveRequests'],
        queryFn: fetchTestDriveRequests,
        enabled: !!username, // запрос отправляется только если пользователь залогинен
    });

    if (!username) {
        return (
            <div className="text-center p-4 text-gray-600">
                Please log in to view your profile.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="text-center py-10 text-gray-600">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Your Profile</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">Test Drive Requests</h2>

            {requests?.length ? (
                <div className="grid gap-4">
                    {requests.map((request: TestDriveRequest) => (
                        <div key={request.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                            <p className="text-gray-800">Motorcycle ID: {request.motorcycleId}</p>
                            <p className="text-gray-600">Date: {new Date(request.requestedDate).toLocaleString()}</p>
                            <p className="text-gray-700 font-medium">Status: {request.status}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-600">No test drive requests found.</p>
            )}
        </div>
    );
};

export default Profile;
