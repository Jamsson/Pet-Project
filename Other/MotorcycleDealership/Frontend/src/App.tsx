import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Catalog from './components/Catalog';
import Login from './components/Login';
import Register from './components/Register'; // Импортируем Register
import TestDriveForm from './components/TestDriveForm';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import Reviews from './components/Reviews.tsx';
import CalendarComponent from './components/Calendar';
import Chat from './components/Chat';
import Navbar from './components/Navbar';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900">
                <Navbar />
                <main className="container mx-auto p-4 md:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<Catalog />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} /> {/* Новый маршрут для регистрации */}
                        <Route path="/test-drive" element={<TestDriveForm />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/reviews/:motorcycleId" element={<Reviews />} />
                        <Route path="/calendar" element={<CalendarComponent />} />
                        <Route path="/chat" element={<Chat />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;