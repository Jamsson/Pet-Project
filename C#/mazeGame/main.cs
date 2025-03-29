using System;
using System.IO;
using System.Threading;

class Program
{
    public static void Main(string[] args)
    {
        Console.CursorVisible = false;

        char[,] map = ReadMap("map.txt");
        ConsoleKeyInfo pressedKey = new ConsoleKeyInfo('w', ConsoleKey.W, false, false, false);

        int playerX = 1;
        int playerY = 1;
        int score = 0;

        while (true)
        {
            Console.Clear();

            Console.ForegroundColor = ConsoleColor.Blue;
            DrawMap(map);

            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.SetCursorPosition(playerX, playerY);
            Console.Write('☻');

            Console.ForegroundColor = ConsoleColor.Red;
            Console.SetCursorPosition(20, 0);
            Console.Write($"Score: {score}");

            pressedKey = Console.ReadKey();

            HandelInput(pressedKey, ref playerX, ref playerY, map, ref score);
        }
    }

    private static char[,] ReadMap(string path)
    {
        string[] file = File.ReadAllLines("map.txt");

        char[,] map = new char[GetMaxLengthOfLine(file), file.Length];

        for (int x = 0; x < map.GetLength(0); x++)
            for (int y = 0; y < map.GetLength(1); y++)
                map[x, y] = file[y][x];

        return map;
    }

    public static void DrawMap(char[,] map)
    {
        for (int y = 0; y < map.GetLength(1); y++)
        {
            for (int x = 0; x < map.GetLength(0); x++)
            {
                Console.Write(map[x, y]);
            }
            Console.WriteLine();
        }
    }

    public static void HandelInput(ConsoleKeyInfo pressedKey, ref int playerX, ref int playerY, char[,] map, ref int score)
    {
        int[] direction = GetDirection(pressedKey);
        int nextPlayerPositionX = playerX + direction[0];
        int nextPlayerPositionY = playerY + direction[1];

        char nextCell = map[nextPlayerPositionX, nextPlayerPositionY];

        if (nextCell == ' ' || nextCell == '♦')
        {
            playerX = nextPlayerPositionX;
            playerY = nextPlayerPositionY;

            if (nextCell == '♦')
            {
                score++;
                map[nextPlayerPositionX, nextPlayerPositionY] = ' ';
            }
        }

        if(playerX == 29 && playerY == 12)
        {
            Console.Clear();

            Console.ForegroundColor = ConsoleColor.Blue;
            Console.Write("You won!!!");
            Console.Write($"Number score: {score}");
        }    
    }

    private static int[] GetDirection(ConsoleKeyInfo pressedKey)
    {
        int[] direction = { 0, 0 };

        if (pressedKey.KeyChar == 'w' || pressedKey.Key == ConsoleKey.UpArrow)
            direction[1] = -1;
        else if (pressedKey.KeyChar == 's' || pressedKey.Key == ConsoleKey.DownArrow)
            direction[1] = 1;
        else if (pressedKey.KeyChar == 'a' || pressedKey.Key == ConsoleKey.LeftArrow)
            direction[0] = -1;
        else if (pressedKey.KeyChar == 'd' || pressedKey.Key == ConsoleKey.RightArrow)
            direction[0] = 1;

        return direction;
    } 

    private static int GetMaxLengthOfLine(string[] lines)
    {
        int maxLength = lines[0].Length;

        foreach (var line in lines)
            if (line.Length > maxLength)
                maxLength = line.Length;

        return maxLength;

    }
}