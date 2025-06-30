import { useState, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useAuthStore } from '../store/auth';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<string[]>([]);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (!token) return;

        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5001/chatHub', {
                accessTokenFactory: () => token!,
            })
            .build();

        connection.on('ReceiveMessage', (user: string, message: string) => {
            setMessages((prev) => [...prev, `${user}: ${message}`]);
        });

        connection.start()
            .catch((_err: Error) => console.error(_err)); // Переименован в _err, чтобы показать игнорирование

        return () => {
            connection.stop();
        };
    }, [token]);

    const sendMessage = async () => {
        if (!token) return;
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5001/chatHub', {
                accessTokenFactory: () => token,
            })
            .build();
        await connection.start();
        await connection.invoke('SendMessage', 'User', message);
        setMessage('');
    };

    if (!token) return <div className="text-center p-4 text-gray-600">Please log in to chat.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Chat with Manager</h1>
            <div className="bg-white p-4 rounded-lg shadow-md h-64 overflow-y-auto mb-4">
                {messages.map((msg, index) => (
                    <p key={index} className="text-gray-700">{msg}</p>
                ))}
            </div>
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;