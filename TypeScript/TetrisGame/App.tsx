import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Keyboard } from "react-native";
import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    BLOCK_SIZE,
    NEXT_BLOCKS,
    Board,
    Tetromino,
    TETROMINOES,
    COLORS,
    Cell,
} from "./types";

// Hook for keyboard input (web version)
const useKeyboard = (
    moveLeft: () => void,
    moveRight: () => void,
    moveDown: () => void,
    rotate: () => void,
    drop: () => void
) => {
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    moveLeft();
                    break;
                case "ArrowRight":
                    moveRight();
                    break;
                case "ArrowDown":
                    moveDown();
                    break;
                case "ArrowUp":
                    rotate();
                    break;
                case " ":
                    drop();
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [moveLeft, moveRight, moveDown, rotate, drop]);
};

const App = () => {
    // State
    const [landed, setLanded] = useState<Board>(() =>
        Array(BOARD_HEIGHT)
            .fill(0)
            .map(() => Array(BOARD_WIDTH).fill(0 as Cell))
    );
    const [currentSchema, setCurrentSchema] = useState<number[][]>([]);
    const [currentBlockIndex, setCurrentBlockIndex] = useState<number>(0);
    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(0);
    const [nextBlockIndexes, setNextBlockIndexes] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [stoper, setStoper] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Initialize the game
    useEffect(() => {
        if (nextBlockIndexes.length === 0) {
            getNewBlock();
        }
    }, []);

    // Проверка столкновений
    const checkCollision = (schema: number[][], dx: number, dy: number) => {
        return checkCollisionWithPosition(schema, currentX + dx, currentY + dy);
    };

    // Фиксация фигуры
    const setSolid = () => {
        const newLanded = landed.map((row) => [...row]);
        for (let t = 0; t < currentSchema.length; t++) {
            for (let e = 0; e < currentSchema[t].length; e++) {
                if (currentSchema[t][e] === 1) {
                    const boardY = t + currentY;
                    const boardX = e + currentX;
                    if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                        newLanded[boardY][boardX] = TETROMINOES[currentBlockIndex].color;
                    } else {
                        console.log(`Out of bounds in setSolid: boardY=${boardY}, boardX=${boardX}`);
                    }
                }
            }
        }
        setLanded(newLanded);
        console.log("Landed after setSolid:", newLanded);
    };

    // Создание новой фигуры
    const getNewBlock = () => {
        let newNextBlockIndexes = [...nextBlockIndexes];
        if (newNextBlockIndexes.length === 0) {
            for (let t = 0; t < NEXT_BLOCKS; t++) {
                newNextBlockIndexes.push(Math.floor(Math.random() * TETROMINOES.length));
            }
        }

        const newBlockIndex = newNextBlockIndexes[0];
        let newSchema = JSON.parse(JSON.stringify(TETROMINOES[newBlockIndex].schema));
        newNextBlockIndexes.shift();
        newNextBlockIndexes.push(Math.floor(Math.random() * TETROMINOES.length));

        for (let t = 0; t < Math.floor(4 * Math.random()); t++) {
            newSchema = rotateClockwise(newSchema);
        }

        const newY = 1 - newSchema.length;
        const newX = Math.floor(BOARD_WIDTH / 2 - newSchema[0].length / 2);

        // Проверяем столкновение с новыми координатами
        const tempX = currentX;
        const tempY = currentY;
        const tempSchema = currentSchema;

        // Временно используем новые значения для проверки
        const collision = checkCollisionWithPosition(newSchema, newX, newY);

        if (collision) {
            console.log("Game Over: new piece cannot spawn", { newX, newY, newSchema, landed });
            setGameOver(true);
            return;
        }

        // Если столкновения нет, обновляем состояние
        setCurrentBlockIndex(newBlockIndex);
        setCurrentSchema(newSchema);
        setNextBlockIndexes(newNextBlockIndexes);
        setCurrentX(newX);
        setCurrentY(newY);
    };

    const checkCollisionWithPosition = (schema: number[][], x: number, y: number) => {
        for (let h = 0; h < schema.length; h++) {
            for (let i = 0; i < schema[h].length; i++) {
                const r = h + y;
                const c = i + x;
                if (schema[h][i] !== 0) {
                    if (r >= BOARD_HEIGHT || c < 0 || c >= BOARD_WIDTH) {
                        console.log(`Collision detected: out of bounds (r=${r}, c=${c})`);
                        return true;
                    }
                    if (r >= 0 && landed[r][c] !== 0) {
                        console.log(`Collision detected: block at (r=${r}, c=${c})`);
                        return true;
                    }
                }
            }
        }
        return false;
    };

    // Game loop
    useEffect(() => {
        const gameLoop = setInterval(() => {
            if (gameOver) return;

            setStoper((prev) => {
                const newStoper = prev + 16;
                if (newStoper > 500) {
                    setCurrentY((prevY) => prevY + 1);
                    if (checkCollision(currentSchema, 0, 1)) {
                        setSolid();
                        console.log("Calling checkLines after setSolid");
                        checkLines();
                        getNewBlock();
                    }
                    return 0;
                }
                return newStoper;
            });
        }, 16);

        return () => clearInterval(gameLoop);
    }, [currentSchema, currentX, currentY, gameOver]);

    const rotateClockwise = (schema: number[][]) => {
        const s = schema.length;
        const h = schema[0].length;
        const newSchema: number[][] = Array(h)
            .fill(0)
            .map(() => Array(s).fill(0));
        for (let i = 0; i < s; i++) {
            for (let r = 0; r < h; r++) {
                newSchema[r][s - 1 - i] = schema[i][r];
            }
        }
        return newSchema;
    };

    const checkLines = () => {
        let linesToRemove: number[] = [];
        for (let e = BOARD_HEIGHT - 1; e > 0; e--) {
            let filledCells = 0;
            for (let t = 0; t < BOARD_WIDTH; t++) {
                if (landed[e][t] !== 0) filledCells++;
            }
            if (filledCells === BOARD_WIDTH) {
                linesToRemove.push(e);
            }
        }

        if (linesToRemove.length > 0) {
            console.log(`Found ${linesToRemove.length} lines to remove: ${linesToRemove}`);
            console.log("Landed before shiftLines:", landed);
            switch (linesToRemove.length) {
                case 1:
                    setScore((prev) => prev + 100);
                    break;
                case 2:
                    setScore((prev) => prev + 300);
                    break;
                case 3:
                    setScore((prev) => prev + 500);
                    break;
                case 4:
                    setScore((prev) => prev + 800);
                    break;
                default:
                    if (linesToRemove.length > 4) {
                        setScore((prev) => prev + 800 + 400 * linesToRemove.length);
                    }
                    break;
            }

            shiftLines(linesToRemove);
            console.log("Landed after shiftLines:", landed);
        } else {
            console.log("No lines to remove");
        }
    };

    const shiftLines = (linesToRemove: number[]) => {
        if (linesToRemove.length === 0) return;

        const newLanded = landed.map((row) => [...row]);
        const sortedLines = linesToRemove.sort((a, b) => a - b);

        for (const line of sortedLines) {
            for (let e = line; e > 0; e--) {
                for (let t = 0; t < BOARD_WIDTH; t++) {
                    newLanded[e][t] = newLanded[e - 1][t];
                }
            }
            for (let t = 0; t < BOARD_WIDTH; t++) {
                newLanded[0][t] = 0;
            }
        }

        setLanded(newLanded);
        console.log("Landed after shiftLines:", newLanded);
    };

    // Movement Functions
    const moveLeft = () => {
        if (!checkCollision(currentSchema, -1, 0)) {
            setCurrentX((prev) => prev - 1);
        }
    };

    const moveRight = () => {
        if (!checkCollision(currentSchema, 1, 0)) {
            setCurrentX((prev) => prev + 1);
        }
    };

    const moveDown = () => {
        if (!checkCollision(currentSchema, 0, 1)) {
            setCurrentY((prev) => prev + 1);
            setStoper(0);
        }
    };

    const rotate = () => {
        const newSchema = rotateClockwise(currentSchema);
        if (!checkCollision(newSchema, 0, 0) && !checkCollision(newSchema, 0, 1)) {
            setCurrentSchema(newSchema);
        }
    };

    const drop = () => {
        while (!checkCollision(currentSchema, 0, 1)) {
            setCurrentY((prev) => prev + 1);
        }
        setSolid();
        checkLines();
        getNewBlock();
    };

    // Hook for keyboard input
    useKeyboard(moveLeft, moveRight, moveDown, rotate, drop);

    // Rendering Functions
    const renderBoard = () => {
        const displayBoard = landed.map((row) => [...row]);
        for (let t = 0; t < currentSchema.length; t++) {
            for (let e = 0; e < currentSchema[t].length; e++) {
                if (currentSchema[t][e] === 1) {
                    const boardY = t + currentY;
                    const boardX = e + currentX;
                    if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                        displayBoard[boardY][boardX] = TETROMINOES[currentBlockIndex].color;
                    }
                }
            }
        }

        return displayBoard.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
                {row.map((cell, cellIndex) => (
                    <View
                        key={cellIndex}
                        style={[styles.cell, { backgroundColor: COLORS[cell] }]}
                    />
                ))}
            </View>
        ));
    };

    const renderNextTetromino = () => {
        return nextBlockIndexes.map((blockIndex, index) => {
            const schema = TETROMINOES[blockIndex].schema;
            return (
                <View key={index} style={styles.nextBlock}>
                    {schema.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {row.map((cell, cellIndex) => (
                                <View
                                    key={cellIndex}
                                    style={[
                                        styles.cell,
                                        { backgroundColor: cell ? COLORS[TETROMINOES[blockIndex].color] : "black" },
                                    ]}
                                />
                            ))}
                        </View>
                    ))}
                </View>
            );
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.gameContainer}>
                <View style={styles.board}>{renderBoard()}</View>
                <View style={styles.sidebar}>
                    <Text style={styles.score}>Score: {score}</Text>
                    <Text style={styles.nextLabel}>Next blocks</Text>
                    <View style={styles.nextTetromino}>{renderNextTetromino()}</View>
                </View>
            </View>
            {gameOver && (
                <Text style={styles.gameOver}>Game Over! Score: {score}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000b18",
        justifyContent: "center",
        alignItems: "center",
    },
    gameContainer: {
        flexDirection: "row",
        borderWidth: 3,
        borderColor: "cyan",
        shadowColor: "cyan",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 50,
    },
    board: {
        backgroundColor: "#000b1f",
    },
    sidebar: {
        marginLeft: 20,
        alignItems: "center",
    },
    score: {
        color: "white",
        fontSize: 26,
        marginBottom: 10,
    },
    nextLabel: {
        color: "white",
        fontSize: 16,
        marginBottom: 10,
    },
    nextTetromino: {
        alignItems: "center",
    },
    nextBlock: {
        marginVertical: 64,
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        borderWidth: 1,
        borderColor: "#333",
    },
    controls: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "space-around",
        width: "80%",
    },
    button: {
        color: "white",
        backgroundColor: "#555",
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
    },
    gameOver: {
        color: "red",
        fontSize: 24,
        marginVertical: 20,
    },
});

export default App;