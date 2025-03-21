export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BLOCK_SIZE = 32;
export const NEXT_BLOCKS = 4;

export type Cell = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7; // 0 - empty, 1-7 - colors
export type Board = Cell[][];

export type Tetromino = {
    name: string;
    color: Cell;
    schema: number[][];
};

export const TETROMINOES: Tetromino[] = [
    { name: "L", color: 1, schema: [[1, 1, 1], [1, 0, 0]] }, // Orange
    { name: "J", color: 2, schema: [[1, 1, 1], [0, 0, 1]] }, // Blue
    { name: "O", color: 3, schema: [[1, 1], [1, 1]] }, // Yellow
    { name: "I", color: 4, schema: [[1, 1, 1, 1]] }, // Cyan
    { name: "Z", color: 5, schema: [[0, 1, 1], [1, 1, 0]] }, // Red
    { name: "S", color: 6, schema: [[1, 1, 0], [0, 1, 1]] }, // Green
    { name: "T", color: 7, schema: [[0, 1, 0], [1, 1, 1]] }, // Magenta
];

export const COLORS: { [key: number]: string } = {
    0: "black",
    1: "orange",
    2: "blue",
    3: "yellow",
    4: "cyan",
    5: "red",
    6: "green",
    7: "magenta",
};