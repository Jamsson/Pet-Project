import React, { useState, useEffect, useRef } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";

const Chat = ({ messages, newMessage, setNewMessage, sendMessage, user, friend }) => {
    const [senders, setSenders] = useState({});
    const messagesEndRef = useRef(null);

    const getAvatarUrl = (senderId, avatar) => {
        if (avatar) return avatar;
        return `https://api.dicebear.com/9.x/avataaars/svg?seed=${senderId}`;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const uniqueSenderIds = [...new Set(messages.map((msg) => msg.sender))];

        uniqueSenderIds.forEach((senderId) => {
            setSenders((prevSenders) => {
                if (prevSenders[senderId]) {
                    return prevSenders;
                }

                const senderRef = ref(database, `users/${senderId}`);
                onValue(
                    senderRef,
                    (snapshot) => {
                        const data = snapshot.val();
                        if (data) {
                            setSenders((prev) => ({
                                ...prev,
                                [senderId]: {
                                    name: data.name || "Без имени",
                                    avatar: data.avatar,
                                },
                            }));
                        }
                    },
                    { onlyOnce: true }
                );

                return prevSenders;
            });
        });
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (newMessage.trim()) {
                sendMessage();
                scrollToBottom();
            }
        }
    };

    return (
        <div style={{ height: "100%", width: "100%", backgroundColor: "#fff", position: "relative" }}>
            {/* Область сообщений */}
            <div
                style={{
                    position: "absolute",
                    top: "60px", // Высота шапки
                    bottom: "60px", // Высота поля ввода
                    left: 0,
                    right: 0,
                    padding: "1rem",
                    overflowY: "auto", // Включаем прокрутку
                    scrollbarWidth: "none",
                    "-ms-overflow-style": "none",
                }}
                className="hide-scrollbar"
            >
                {messages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#888", padding: "1rem" }}>
                        Нет сообщений
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const sender = senders[msg.sender] || { name: "Загрузка...", avatar: null };
                        const isCurrentUser = msg.sender === user.uid;

                        return (
                            <div
                                key={index}
                                style={{
                                    marginBottom: "1rem",
                                    padding: "0.5rem 1rem",
                                    backgroundColor: isCurrentUser ? "#DCF8C6" : "#E5E5EA",
                                    borderRadius: "0.5rem",
                                    maxWidth: "70%",
                                    alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                                    position: "relative",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "0.875rem",
                                        fontWeight: "bold",
                                        color: "#555",
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    {sender.name}
                                </div>

                                <div
                                    style={{
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {msg.text}
                                </div>

                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#888",
                                        marginTop: "0.25rem",
                                        textAlign: isCurrentUser ? "right" : "left",
                                    }}
                                >
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>

                                <img
                                    src={getAvatarUrl(msg.sender, sender.avatar)}
                                    alt={`${sender.name}'s avatar`}
                                    style={{
                                        width: "30px",
                                        height: "30px",
                                        borderRadius: "50%",
                                        position: "absolute",
                                        bottom: "-15px",
                                        left: isCurrentUser ? "auto" : "-15px",
                                        right: isCurrentUser ? "-15px" : "auto",
                                    }}
                                />
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Поле ввода фиксировано внизу экрана */}
            <div
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderTop: "1px solid #ddd",
                    display: "flex",
                    alignItems: "center",
                    zIndex: 5,
                    height: "60px", // Явно задаём высоту поля ввода
                    boxSizing: "border-box",
                }}
            >
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Введите сообщение..."
                    style={{
                        flex: 1,
                        padding: "0.75rem",
                        border: "1px solid #ddd",
                        borderRadius: "0.375rem",
                        marginRight: "1rem",
                        minHeight: "40px",
                        resize: "vertical",
                    }}
                />
                <button
                    onClick={() => {
                        sendMessage();
                        scrollToBottom();
                    }}
                    style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: "#25d366",
                        color: "white",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#20b858")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#25d366")}
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default Chat;