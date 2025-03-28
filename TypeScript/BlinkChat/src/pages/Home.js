import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, push, onValue, set, get } from "firebase/database";
import Header from "../components/Header";
import FriendList from "../components/FriendList";
import Chat from "../components/Chat";

const Home = () => {
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                window.location.href = "/";
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const friendsRef = ref(database, `users/${user.uid}/friends`);
            onValue(friendsRef, (snapshot) => {
                const friendsData = snapshot.val();
                if (friendsData) {
                    const friendIds = Object.keys(friendsData);
                    const friendsList = [];
                    friendIds.forEach((friendId) => {
                        if (friendId !== user.uid) {
                            const friendNameRef = ref(database, `users/${friendId}/name`);
                            const friendAvatarRef = ref(database, `users/${friendId}/avatar`);
                            const friendNumericIdRef = ref(database, `users/${friendId}/numericId`);

                            onValue(friendNameRef, (nameSnapshot) => {
                                onValue(friendAvatarRef, (avatarSnapshot) => {
                                    onValue(friendNumericIdRef, (numericIdSnapshot) => {
                                        const name = nameSnapshot.val();
                                        const avatar = avatarSnapshot.val();
                                        const numericId = numericIdSnapshot.val();
                                        if (name && avatar && numericId) {
                                            friendsList.push({
                                                id: friendId,
                                                name,
                                                avatar,
                                                numericId,
                                            });
                                            setFriends([...friendsList]);
                                        }
                                    });
                                });
                            });
                        }
                    });
                } else {
                    setFriends([]);
                }
            });
        }
    }, [user]);

    const getChatId = (uid1, uid2) => {
        return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
    };

    useEffect(() => {
        if (selectedFriend && user) {
            const chatId = getChatId(user.uid, selectedFriend.id);
            const chatRef = ref(database, `chats/${chatId}`);
            onValue(chatRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setMessages(Object.values(data));
                    console.log("Messages loaded:", Object.values(data));
                } else {
                    setMessages([]);
                    console.log("No messages found for chat:", chatId);
                }
            }, (error) => {
                console.error("Error loading messages:", error);
            });
        } else {
            setMessages([]);
        }
    }, [selectedFriend, user]);

    const sendMessage = () => {
        if (newMessage.trim() && selectedFriend && user) {
            const message = {
                text: newMessage,
                sender: user.uid,
                timestamp: Date.now(),
            };

            const chatId = getChatId(user.uid, selectedFriend.id);
            const chatRef = ref(database, `chats/${chatId}`);
            push(chatRef, message);

            setNewMessage("");
        }
    };

    const handleSearch = async () => {
        if (!/^\d{10}$/.test(searchId.trim())) {
            alert("ID должен состоять ровно из 10 цифр.");
            return;
        }

        try {
            const usersRef = ref(database, "users");
            const usersSnapshot = await get(usersRef);
            const usersData = usersSnapshot.val();

            if (usersData) {
                let foundUser = null;
                const userIds = Object.keys(usersData);

                for (const uid of userIds) {
                    if (uid === user.uid) continue;

                    const numericIdRef = ref(database, `users/${uid}/numericId`);
                    const numericIdSnapshot = await get(numericIdRef);
                    const numericId = numericIdSnapshot.val();

                    if (numericId === searchId) {
                        const nameRef = ref(database, `users/${uid}/name`);
                        const avatarRef = ref(database, `users/${uid}/avatar`);

                        const [nameSnapshot, avatarSnapshot] = await Promise.all([
                            get(nameRef),
                            get(avatarRef),
                        ]);

                        const name = nameSnapshot.val();
                        const avatar = avatarSnapshot.val();

                        if (name && avatar && numericId) {
                            foundUser = {
                                id: uid,
                                name,
                                avatar,
                                numericId,
                            };
                            break;
                        }
                    }
                }

                if (foundUser) {
                    setSearchResult(foundUser);
                } else {
                    setSearchResult(null);
                    alert("Пользователь с таким ID не найден.");
                }
            } else {
                setSearchResult(null);
                alert("Пользователь с таким ID не найден.");
            }
        } catch (error) {
            console.error("Ошибка при поиске пользователя:", error);
            setSearchResult(null);
            alert("Произошла ошибка при поиске пользователя.");
        }
    };

    const handleAddFriend = () => {
        if (searchResult && user) {
            const userFriendsRef = ref(database, `users/${user.uid}/friends/${searchResult.id}`);
            set(userFriendsRef, true);

            const friendFriendsRef = ref(database, `users/${searchResult.id}/friends/${user.uid}`);
            set(friendFriendsRef, true);

            setFriends((prevFriends) => [...prevFriends, searchResult]);
            setSearchResult(null);
            setSearchId("");
            setIsSearchOpen(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleClearSearch = () => {
        setSearchId("");
        setSearchResult(null);
        setIsSearchOpen(false);
    };

    const getAvatarUrl = (friend) => {
        if (friend.avatar) return friend.avatar;
        return `https://api.dicebear.com/9.x/avataaars/svg?seed=${friend.id}`;
    };

    const handleBackToFriends = () => {
        setSelectedFriend(null);
        setMessages([]);
    };

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div style={{ display: "flex", height: "100vh", width: "100vw", backgroundColor: "#f0f2f5" }}>
            {!selectedFriend ? (
                <div
                    style={{
                        width: "300px",
                        backgroundColor: "#fff",
                        borderRight: "1px solid #ddd",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        "-ms-overflow-style": "none",
                    }}
                    className="hide-scrollbar"
                >
                    <Header
                        isSearchOpen={isSearchOpen}
                        setIsSearchOpen={setIsSearchOpen}
                        searchId={searchId}
                        setSearchId={setSearchId}
                        handleKeyPress={handleKeyPress}
                        handleClearSearch={handleClearSearch}
                    />
                    <FriendList
                        onSelectFriend={setSelectedFriend}
                        user={user}
                        friends={friends}
                        searchId={searchId}
                        setSearchId={setSearchId}
                        searchResult={searchResult}
                        setSearchResult={setSearchResult}
                        handleSearch={handleSearch}
                        handleAddFriend={handleAddFriend}
                        handleClearSearch={handleClearSearch}
                        isSearchOpen={isSearchOpen}
                        setIsSearchOpen={setIsSearchOpen}
                    />
                </div>
            ) : (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", height: "100vh" }}>
                    {/* Фиксированная шапка */}
                    <div
                        style={{
                            padding: "1rem",
                            backgroundColor: "#fff",
                            borderBottom: "1px solid #ddd",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 10,
                            height: "60px",
                            boxSizing: "border-box",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <button
                                onClick={handleBackToFriends}
                                style={{
                                    marginRight: "1rem",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <img
                                src={getAvatarUrl(selectedFriend)}
                                alt="avatar"
                                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "1rem" }}
                            />
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>{selectedFriend.name}</h2>
                        </div>
                    </div>

                    {/* Чат */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <Chat
                            messages={messages}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            sendMessage={sendMessage}
                            user={user}
                            friend={selectedFriend}
                        />
                    </div>
                </div>
            )}

            {!selectedFriend && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                    Выберите чат, чтобы начать общение
                </div>
            )}
        </div>
    );
};

export default Home;