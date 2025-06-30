import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';

interface Motorcycle {
    id: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    isAvailable: boolean;
    description: string;
    imageUrl: string;
}

const fetchMotorcycles = async () => {
    const response = await axios.get('http://localhost:5001/api/motorcycles', {
        withCredentials: true,
    });
    return response.data;
};

const TestDrive = () => {
    const userId = useAuthStore((state) => state.userId);
    const { data: motorcycles, isLoading, error } = useQuery<Motorcycle[]>({
        queryKey: ['motorcycles'],
        queryFn: fetchMotorcycles,
    });

    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');

    if (!userId) {
        return (
            <div className="text-center py-10 text-gray-600">
                Please log in to book a test drive.
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

    if (error) {
        return (
            <div className="text-center py-10 text-red-600">
                Error loading motorcycles: {(error as Error).message}
            </div>
        );
    }

    const uniqueBrands = motorcycles ? [...new Set(motorcycles.map((m) => m.brand))] : [];
    const filteredModels =
        selectedBrand && motorcycles
            ? [...new Set(motorcycles.filter((m) => m.brand === selectedBrand).map((m) => m.model))]
            : [];

    const handleTestDrive = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const brand = (form.elements.namedItem('brand') as HTMLSelectElement).value;
        const model = (form.elements.namedItem('model') as HTMLSelectElement).value;
        const dateInput = (form.elements.namedItem('date') as HTMLInputElement).value;

        if (!brand || !model || !dateInput) {
            alert('Please select a motorcycle and date.');
            return;
        }

        const requestedDate = new Date(dateInput);
        const minHour = 9;
        const maxHour = 18;
        const hour = requestedDate.getHours();

        if (hour < minHour || hour >= maxHour) {
            alert('Test drive must be scheduled between 9:00 AM and 6:00 PM.');
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5001/api/testdrive',
                {
                    brand,
                    model,
                    requestedDate: requestedDate.toISOString(),
                    status: 'Pending',
                },
                {
                    withCredentials: true,
                }
            );

            alert(response.data.message ?? 'Test drive booked!');
            form.reset();
            setSelectedBrand('');
            setSelectedModel('');
        } catch (err) {
            console.error(err);
            alert('Failed to book test drive.');
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
                Book a Test Drive
            </h1>
            <form
                onSubmit={handleTestDrive}
                className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
            >
                <div className="mb-4">
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                        Brand
                    </label>
                    <select
                        id="brand"
                        name="brand"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={selectedBrand}
                        onChange={(e) => {
                            setSelectedBrand(e.target.value);
                            setSelectedModel('');
                        }}
                        required
                    >
                        <option value="">Select Brand</option>
                        {uniqueBrands.map((brand) => (
                            <option key={brand} value={brand}>
                                {brand}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                        Model
                    </label>
                    <select
                        id="model"
                        name="model"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        required
                        disabled={!selectedBrand}
                    >
                        <option value="">Select Model</option>
                        {filteredModels.map((model) => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date and Time
                    </label>
                    <input
                        type="datetime-local"
                        id="date"
                        name="date"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        min={new Date().toISOString().slice(0, 16)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Book Test Drive
                </button>
            </form>
        </div>
    );
};

export default TestDrive;
