// components/Header.js
import React from "react";

const Header = ({ isSearchOpen, setIsSearchOpen, searchId, setSearchId, handleKeyPress, handleClearSearch }) => {
    return (
        <div
            style={{
                padding: "1rem",
                borderBottom: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {!isSearchOpen ? (
                <>
                    {/* Кнопка "Мой профиль" (иконка ≡) слева */}
                    <button
                        onClick={() => (window.location.href = "/profile")}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "1.5rem",
                            color: "#000",
                            padding: "0",
                            margin: "0",
                        }}
                    >
                        ≡
                    </button>

                    {/* Кнопка поиска (иконка лупы) справа */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        style={{
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            padding: "0",
                            margin: "0",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="#000"
                            viewBox="0 0 16 16"
                        >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </button>
                </>
            ) : (
                <div
                    style={{
                        position: "relative",
                        width: "80%", // Уменьшаем ширину поля, чтобы оно не занимало весь контейнер
                        margin: "0 auto", // Центрируем поле
                    }}
                >
                    <input
                        type="text"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Введите 10-значный ID друга"
                        style={{
                            width: "100%",
                            padding: "0.5rem 2.5rem 0.5rem 0.5rem", // Увеличиваем правый отступ, чтобы текст не перекрывал крестик
                            border: "1px solid #ddd",
                            borderRadius: "0.375rem",
                            fontSize: "0.875rem",
                            height: "30px",
                            boxSizing: "border-box", // Учитываем padding в общей ширине
                        }}
                    />
                    {searchId && (
                        <button
                            onClick={handleClearSearch}
                            style={{
                                position: "absolute",
                                right: "0.5rem", // Крестик в самом конце поля
                                top: "50%",
                                transform: "translateY(-50%)", // Центрируем крестик по вертикали
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "0",
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Header;