import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useAuthStore } from '../store/auth';

interface Event {
    id: string;
    userId: string;
    motorcycleId: string | null;
    startTime: string;
    endTime: string;
    type: string;
}

const fetchEvents = async (token: string) => {
    const response = await axios.get('http://localhost:5001/api/events', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map((event: Event) => ({
        id: event.id,
        title: event.type,
        start: event.startTime,
        end: event.endTime,
    }));
};

const CalendarComponent = () => {
    const token = useAuthStore((state) => state.token);
    const { data: events, isLoading } = useQuery({
        queryKey: ['events'],
        queryFn: () => fetchEvents(token!),
        enabled: !!token,
    });

    if (!token) return <div className="text-center p-4 text-gray-600">Please log in to view your calendar.</div>;
    if (isLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Your Calendar</h1>
            <div className="bg-white rounded-lg shadow-md p-4">
                <Calendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                />
            </div>
        </div>
    );
};

export default CalendarComponent;