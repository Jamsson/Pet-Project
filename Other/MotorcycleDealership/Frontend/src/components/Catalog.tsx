import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Reviews from './Reviews'; // Убедитесь, что путь корректен

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
    const response = await axios.get('http://localhost:5001/api/motorcycles', { withCredentials: true });
    return response.data;
};

const Catalog = () => {
    const { data: motorcycles } = useQuery<Motorcycle[]>({
        queryKey: ['motorcycles'],
        queryFn: fetchMotorcycles,
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [yearRange, setYearRange] = useState<[number, number]>([0, 0]);
    const [onlyAvailable, setOnlyAvailable] = useState(false);
    const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
    const [cart, setCart] = useState<string[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Load localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('motorcycleCart');
        if (savedCart) setCart(JSON.parse(savedCart));
        const savedFavorites = localStorage.getItem('motorcycleFavorites');
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    }, []);

    useEffect(() => {
        localStorage.setItem('motorcycleCart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('motorcycleFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const uniqueBrands = motorcycles ? [...new Set(motorcycles.map(m => m.brand))] : [];
    const uniqueModels = selectedBrand && motorcycles
        ? [...new Set(motorcycles.filter(m => m.brand === selectedBrand).map(m => m.model))]
        : [];

    const filteredMotorcycles = motorcycles?.filter((motorcycle) => {
        const matchesSearch =
            !searchTerm ||
            motorcycle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            motorcycle.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = !selectedBrand || motorcycle.brand === selectedBrand;
        const matchesModel = !selectedModel || motorcycle.model === selectedModel;
        const matchesPrice = motorcycle.price >= priceRange[0] && motorcycle.price <= priceRange[1];
        const matchesYear = motorcycle.year >= yearRange[0] && motorcycle.year <= yearRange[1];
        const matchesAvailability = !onlyAvailable || motorcycle.isAvailable;

        return matchesSearch && matchesBrand && matchesModel && matchesPrice && matchesYear && matchesAvailability;
    }) || [];

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedBrand('');
        setSelectedModel('');
        setOnlyAvailable(false);
        if (motorcycles) {
            setPriceRange([Math.min(...motorcycles.map(m => m.price)), Math.max(...motorcycles.map(m => m.price))]);
            setYearRange([Math.min(...motorcycles.map(m => m.year)), Math.max(...motorcycles.map(m => m.year))]);
        }
    };

    const minPrice = motorcycles ? Math.min(...motorcycles.map(m => m.price)) : 0;
    const maxPrice = motorcycles ? Math.max(...motorcycles.map(m => m.price)) : 0;
    const minYear = motorcycles ? Math.min(...motorcycles.map(m => m.year)) : 0;
    const maxYear = motorcycles ? Math.max(...motorcycles.map(m => m.year)) : 0;

    useEffect(() => {
        if (motorcycles) {
            setPriceRange([minPrice, maxPrice]);
            setYearRange([minYear, maxYear]);
        }
    }, [motorcycles, minPrice, maxPrice, minYear, maxYear]);

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = Number(e.target.value);
        setPriceRange(prev => {
            const newRange = [...prev];
            newRange[index] = newValue;
            if (newRange[0] > newRange[1]) newRange[0] = newRange[1];
            return [
                Math.max(minPrice, Math.min(maxPrice, newRange[0])),
                Math.max(minPrice, Math.min(maxPrice, newRange[1]))
            ] as [number, number];
        });
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newValue = Number(e.target.value);
        setYearRange(prev => {
            const newRange = [...prev];
            newRange[index] = newValue;
            if (newRange[0] > newRange[1]) newRange[0] = newRange[1];
            return [
                Math.max(minYear, Math.min(maxYear, newRange[0])),
                Math.max(minYear, Math.min(maxYear, newRange[1]))
            ] as [number, number];
        });
    };

    const handleAddToCart = (motorcycleId: string) => {
        if (!cart.includes(motorcycleId)) {
            setCart([...cart, motorcycleId]);
            alert(`Added ${motorcycleId} to cart!`);
        }
    };

    const handleAddToFavorites = (motorcycleId: string) => {
        if (!favorites.includes(motorcycleId)) {
            setFavorites([...favorites, motorcycleId]);
            alert(`Added ${motorcycleId} to favorites!`);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-56 bg-white shadow-lg p-4 rounded-r-lg fixed top-16 left-4 max-h-[calc(100vh-80px)] overflow-y-auto border-r border-gray-200 transition-all duration-300 ease-in-out z-10">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Search by brand or model..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <select
                        value={selectedBrand}
                        onChange={(e) => {
                            setSelectedBrand(e.target.value);
                            setSelectedModel('');
                        }}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">All Brands</option>
                        {uniqueBrands.map((brand) => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full p-2 border rounded"
                        disabled={!selectedBrand}
                    >
                        <option value="">All Models</option>
                        {uniqueModels.map((model) => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                    <div>
                        <label className="text-sm block mb-2">Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</label>
                        <div className="relative">
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={priceRange[0]}
                                onChange={(e) => handlePriceChange(e, 0)}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none pointer-events-auto"
                            />
                            <input
                                type="range"
                                min={minPrice}
                                max={maxPrice}
                                value={priceRange[1]}
                                onChange={(e) => handlePriceChange(e, 1)}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none pointer-events-auto"
                            />
                            <div
                                className="absolute h-2 bg-blue-500 rounded-lg"
                                style={{
                                    left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                                    width: `${((priceRange[1] - priceRange[0]) / (maxPrice - minPrice)) * 100}%`,
                                    top: '0',
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm block mb-2">Year Range: {yearRange[0]} - {yearRange[1]}</label>
                        <div className="relative">
                            <input
                                type="range"
                                min={minYear}
                                max={maxYear}
                                value={yearRange[0]}
                                onChange={(e) => handleYearChange(e, 0)}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none pointer-events-auto"
                            />
                            <input
                                type="range"
                                min={minYear}
                                max={maxYear}
                                value={yearRange[1]}
                                onChange={(e) => handleYearChange(e, 1)}
                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none pointer-events-auto"
                            />
                            <div
                                className="absolute h-2 bg-blue-500 rounded-lg"
                                style={{
                                    left: `${((yearRange[0] - minYear) / (maxYear - minYear)) * 100}%`,
                                    width: `${((yearRange[1] - yearRange[0]) / (maxYear - minYear)) * 100}%`,
                                    top: '0',
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={onlyAvailable}
                            onChange={(e) => setOnlyAvailable(e.target.checked)}
                            className="mr-2"
                        />
                        <span>Only available</span>
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={resetFilters}
                            className="w-full bg-red-500 text-white p-2 rounded"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Catalog with left margin */}
            <main className="flex-1 p-6 ml-56 overflow-y-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Motorcycle Catalog</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMotorcycles.length > 0 ? (
                        filteredMotorcycles.map((motorcycle) => (
                            <div
                                key={motorcycle.id}
                                className="bg-white p-4 rounded shadow hover:shadow-lg cursor-pointer"
                                onClick={() => setSelectedMotorcycle(motorcycle)}
                            >
                                <img
                                    src={motorcycle.imageUrl || 'https://via.placeholder.com/300x200'}
                                    alt={motorcycle.model}
                                    className="w-full h-40 object-cover mb-4"
                                />
                                <h2 className="text-xl font-semibold">{motorcycle.brand} {motorcycle.model}</h2>
                                <p>Year: {motorcycle.year}</p>
                                <p>Price: ${motorcycle.price}</p>
                                <p className="text-sm text-gray-500">{motorcycle.isAvailable ? 'Available' : 'Out of stock'}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No motorcycles found.</p>
                    )}
                </div>

                {/* Modal for selected motorcycle */}
                {selectedMotorcycle && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
                            <button
                                onClick={() => setSelectedMotorcycle(null)}
                                className="absolute top-2 right-2 text-red-500 text-xl"
                            >
                                ✕
                            </button>
                            <h2 className="text-2xl font-bold mb-2">{selectedMotorcycle.brand} {selectedMotorcycle.model}</h2>
                            <img
                                src={selectedMotorcycle.imageUrl || 'https://via.placeholder.com/300x200'}
                                alt={selectedMotorcycle.model}
                                className="w-full h-48 object-cover mb-4 rounded"
                            />
                            <p className="mb-2 text-gray-700">{selectedMotorcycle.description}</p>
                            <p className="mb-2">Year: {selectedMotorcycle.year}</p>
                            <p className="mb-2">Price: ${selectedMotorcycle.price}</p>
                            <p className="mb-4 text-sm text-gray-600">{selectedMotorcycle.isAvailable ? 'Available' : 'Out of stock'}</p>

                            {/* External Reviews component */}
                            <Reviews motorcycleId={selectedMotorcycle.id} />

                            {/* Buttons below reviews */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleAddToCart(selectedMotorcycle.id)}
                                    className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => handleAddToFavorites(selectedMotorcycle.id)}
                                    className="flex-1 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
                                >
                                    Add to Favorites
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Catalog;