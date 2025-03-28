import React, { useState, useEffect } from "react";
import { auth, database } from "../firebase";
import { ref, set, onValue, get } from "firebase/database";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [newAvatar, setNewAvatar] = useState(null);
    const [numericId, setNumericId] = useState("");
    const [loading, setLoading] = useState(false);
    const [isGeneratingId, setIsGeneratingId] = useState(false);

    const generateNumericId = async (uid) => { 
        let newId;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!isUnique && attempts < maxAttempts) {
            const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
            newId = randomNum.toString();

            const idRef = ref(database, `numericIds/${newId}`);
            const snapshot = await get(idRef);

            if (!snapshot.exists()) {
                await set(idRef, true);
                const numericIdToUidRef = ref(database, `numericIdToUid/${newId}/${uid}`);
                await set(numericIdToUidRef, true);
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error("Не удалось сгенерировать уникальный ID после максимального количества попыток.");
        }

        return newId;
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userRef = ref(database, `users/${currentUser.uid}`);
                onValue(userRef, async (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setName(data.name || "");
                        setAvatar(data.avatar || "https://api.dicebear.com/9.x/avataaars/svg?seed=" + currentUser.uid);
                        setNumericId(data.numericId || "");
                    } else {
                        setIsGeneratingId(true);
                        try {
                            const newNumericId = await generateNumericId(currentUser.uid);
                            setNumericId(newNumericId);
                            await set(userRef, {
                                name: currentUser.email.split("@")[0],
                                avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=" + currentUser.uid,
                                numericId: newNumericId,
                            });
                        } catch (error) {
                            console.error("Ошибка генерации ID:", error);
                            alert("Не удалось сгенерировать ID: " + error.message);
                        } finally {
                            setIsGeneratingId(false);
                        }
                    }
                });
            } else {
                window.location.href = "/";
            }
        });

        return () => unsubscribe();
    }, []);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleAvatarChange = (e) => {
        if (e.target.files[0]) {
            setNewAvatar(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setLoading(true);
        try {
            let avatarUrl = avatar;

            if (newAvatar) {
                const formData = new FormData();
                formData.append("file", newAvatar);
                formData.append("upload_preset", "messenger_upload");
                formData.append("cloud_name", "dpbojl4sb");

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/dpbojl4sb/image/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                if (response.status === 200) {
                    avatarUrl = response.data.secure_url;
                    setAvatar(avatarUrl);
                    setNewAvatar(null);
                } else {
                    throw new Error("Ошибка загрузки изображения в Cloudinary");
                }
            }

            const userRef = ref(database, `users/${user.uid}`);
            await set(userRef, {
                name: name || user.email.split("@")[0],
                avatar: avatarUrl,
                numericId: numericId,
            });

            alert("Профиль успешно обновлён!");
        } catch (error) {
            console.error("Ошибка при сохранении профиля:", error);
            alert("Произошла ошибка: " + (error.response?.data?.error?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div>Загрузка...</div>;
    }

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
            <div style={{ width: "100%", maxWidth: "400px", padding: "2rem", backgroundColor: "#fff", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                <button onClick={() => navigate("/home")} style={{position: "absolute", left: "1rem", top: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" }}>
                    ←
                </button>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", textAlign: "center", marginBottom: "1.5rem" }}>
                    Личный профиль
                </h2>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
                    <img
                        src={newAvatar ? URL.createObjectURL(newAvatar) : avatar}
                        alt="Аватар"
                        style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                        Изменить аватар:
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        style={{ display: "block", margin: "0 auto" }}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                        Имя:
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Введите ваше имя"
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "0.375rem",
                            outline: "none",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
                        Ваш ID:
                    </label>
                    <input
                        type="text"
                        value={isGeneratingId ? "Генерируется..." : (numericId || "Ошибка генерации")}
                        readOnly
                        style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "1px solid #ddd",
                            borderRadius: "0.375rem",
                            backgroundColor: "#f5f5f5",
                            color: "#888",
                        }}
                    />
                    <p style={{ fontSize: "0.875rem", color: "#888", marginTop: "0.5rem" }}>
                        Поделитесь этим ID с друзьями, чтобы они могли вас найти.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={loading || isGeneratingId}
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: (loading || isGeneratingId) ? "#ccc" : "#25d366",
                        color: "white",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: (loading || isGeneratingId) ? "not-allowed" : "pointer",
                        transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => !(loading || isGeneratingId) && (e.currentTarget.style.backgroundColor = "#20b858")}
                    onMouseLeave={(e) => !(loading || isGeneratingId) && (e.currentTarget.style.backgroundColor = "#25d366")}
                >
                    {loading ? "Сохранение..." : "Сохранить"}
                </button>
            </div>
        </div>
    );
};

export default Profile;
