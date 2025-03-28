import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // Функция для обработки ошибок Firebase
    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-email":
                return "Некорректный email. Пожалуйста, введите правильный адрес электронной почты.";
            case "auth/user-not-found":
                return "Пользователь с таким email не найден.";
            case "auth/wrong-password":
                return "Неверный пароль. Пожалуйста, попробуйте снова.";
            case "auth/email-already-in-use":
                return "Этот email уже используется. Пожалуйста, используйте другой email.";
            case "auth/weak-password":
                return "Пароль слишком слабый. Пароль должен содержать не менее 6 символов.";
            default:
                return "Произошла ошибка. Пожалуйста, попробуйте снова.";
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/home";
        } catch (err) {
            setError(getErrorMessage(err.code));
        }
    };

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/home";
        } catch (err) {
            setError(getErrorMessage(err.code));
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(to right, #4A00E0, #8E2DE2)",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "300px",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    borderRadius: "0.5rem",
                    boxShadow: "none",
                }}
            >
                <h2
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "1rem",
                    }}
                >
                    Добро пожаловать!
                </h2>

                {error && (
                    <div style={{ color: "red", marginBottom: "0.5rem", textAlign: "center", fontSize: "0.875rem" }}>
                        {error}
                    </div>
                )}

                <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "200px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.25rem",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                            }}
                        >
                            Введите ваш email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            style={{
                                width: "100%",
                                padding: "0.4rem",
                                border: "none",
                                borderRadius: "0.375rem",
                                outline: "none",
                                backgroundColor: "#f0f0f0", // Исправляем цвет фона
                            }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "200px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "0.25rem",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                            }}
                        >
                            Введите ваш пароль
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Пароль"
                            style={{
                                width: "100%",
                                padding: "0.4rem",
                                border: "none",
                                borderRadius: "0.375rem",
                                outline: "none",
                                backgroundColor: "#f0f0f0", // Исправляем цвет фона
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
                    <button
                        onClick={handleLogin}
                        style={{
                            width: "200px",
                            padding: "0.5rem",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                        }}
                    >
                        Войти
                    </button>
                </div>

                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        onClick={handleRegister}
                        style={{
                            width: "200px",
                            padding: "0.5rem",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                        }}
                    >
                        Зарегистрироваться
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;