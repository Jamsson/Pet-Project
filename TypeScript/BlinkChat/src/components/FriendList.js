import React from "react";

const FriendList = ({
                        onSelectFriend,
                        user,
                        friends,
                        searchId,
                        setSearchId,
                        searchResult,
                        setSearchResult,
                        handleSearch,
                        handleAddFriend,
                        handleClearSearch,
                        isSearchOpen,
                        setIsSearchOpen,
                    }) => {
    const getAvatarUrl = (friend) => {
        if (friend.avatar) return friend.avatar;
        return `https://api.dicebear.com/9.x/avataaars/svg?seed=${friend.id}`;
    };

    return (
        <div
            style={{
                width: "300px",
                backgroundColor: "#fff",
                borderRight: "1px solid #ddd",
                overflowY: "auto",
                overflowX: "hidden",
            }}
        >
            <h2 style={{ padding: "1rem", fontSize: "1.5rem", fontWeight: "bold", borderBottom: "1px solid #ddd" }}>
                Друзья
            </h2>

            {searchResult && (
                <div style={{ padding: "1rem", borderBottom: "1px solid #ddd" }}>
                    <div style={{ marginTop: "1rem", padding: "0.5rem", backgroundColor: "#f5f5f5", borderRadius: "0.375rem" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <img
                                src={getAvatarUrl(searchResult)}
                                alt="avatar"
                                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "1rem" }}
                            />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: "bold", wordBreak: "break-word" }}>{searchResult.name}</div>
                                <div style={{ fontSize: "0.875rem", color: "#888", wordBreak: "break-word" }}>
                                    {searchResult.numericId}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleAddFriend}
                            style={{
                                width: "100%",
                                padding: "0.5rem",
                                marginTop: "0.5rem",
                                backgroundColor: "#4caf50",
                                color: "white",
                                border: "none",
                                borderRadius: "0.375rem",
                                cursor: "pointer",
                            }}
                        >
                            Добавить в друзья
                        </button>
                    </div>
                </div>
            )}

            {friends.map((friend) => (
                <div
                    key={friend.id}
                    onClick={() => onSelectFriend(friend)}
                    style={{
                        padding: "1rem",
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        backgroundColor: "#fff",
                        transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
                >
                    <img
                        src={getAvatarUrl(friend)}
                        alt={`${friend.name}'s avatar`}
                        style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "1rem" }}
                    />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "bold", wordBreak: "break-word" }}>{friend.name}</div>
                        <div style={{ fontSize: "0.875rem", color: friend.online ? "#4caf50" : "#888" }}>
                            {friend.online ? "Онлайн" : "Оффлайн"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FriendList;