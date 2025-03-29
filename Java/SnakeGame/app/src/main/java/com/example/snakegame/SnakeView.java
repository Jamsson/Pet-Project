package com.example.snakegame;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.os.Handler;
import android.os.Looper;
import android.util.AttributeSet;
import android.view.View;
import android.widget.Button;
import android.widget.RelativeLayout;
import java.util.ArrayList;
import java.util.Random;

public class SnakeView extends View {
    private Paint paint = new Paint();
    private ArrayList<Point> snake = new ArrayList<>();
    private Point food;
    private int tileSize = 50;
    private String direction = "RIGHT";
    private Handler handler = new Handler(Looper.getMainLooper());
    private boolean gameOver = false;
    private int gridSize = 15;
    private Button restartButton;

    public SnakeView(Context context) {
        super(context);
        init();
    }

    public SnakeView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        snake.add(new Point(5, 5));
        food = new Point(10, 10);
        paint.setStyle(Paint.Style.STROKE);

        // Создаём кнопку рестарта
        restartButton = new Button(getContext());
        restartButton.setText("Restart");
        restartButton.setVisibility(View.GONE); // Скрыта по умолчанию
        restartButton.setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                resetGame();
            }
        });

        // Настраиваем параметры для центрирования
        RelativeLayout.LayoutParams params = new RelativeLayout.LayoutParams(
                RelativeLayout.LayoutParams.WRAP_CONTENT,
                RelativeLayout.LayoutParams.WRAP_CONTENT
        );
        params.addRule(RelativeLayout.CENTER_IN_PARENT); // Центр экрана
        ((MainActivity) getContext()).addContentView(restartButton, params);
    }

    public void startGame() {
        handler.post(new Runnable() {
            @Override
            public void run() {
                if (!gameOver) {
                    moveSnake();
                    checkCollisions();
                    invalidate();
                    handler.postDelayed(this, 200);
                }
            }
        });
    }

    public void setDirection(String newDirection) {
        switch (newDirection) {
            case "UP":
                if (!direction.equals("DOWN")) direction = newDirection;
                break;
            case "DOWN":
                if (!direction.equals("UP")) direction = newDirection;
                break;
            case "LEFT":
                if (!direction.equals("RIGHT")) direction = newDirection;
                break;
            case "RIGHT":
                if (!direction.equals("LEFT")) direction = newDirection;
                break;
        }
    }

    private void moveSnake() {
        Point head = new Point(snake.get(0).x, snake.get(0).y);
        switch (direction) {
            case "UP": head.y--; break;
            case "DOWN": head.y++; break;
            case "LEFT": head.x--; break;
            case "RIGHT": head.x++; break;
        }
        snake.add(0, head);
        if (head.equals(food)) {
            generateFood();
        } else {
            snake.remove(snake.size() - 1);
        }
    }

    private void generateFood() {
        Random random = new Random();
        do {
            food = new Point(random.nextInt(gridSize), random.nextInt(gridSize));
        } while (snake.contains(food));
    }

    private void checkCollisions() {
        Point head = snake.get(0);
        if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
            gameOver = true;
            showRestartButton();
            return;
        }
        for (int i = 1; i < snake.size(); i++) {
            if (head.equals(snake.get(i))) {
                gameOver = true;
                showRestartButton();
                break;
            }
        }
    }

    private void showRestartButton() {
        restartButton.setVisibility(View.VISIBLE);
    }

    public void resetGame() {
        snake.clear();
        snake.add(new Point(5, 5));
        food = new Point(10, 10);
        direction = "RIGHT";
        gameOver = false;
        restartButton.setVisibility(View.GONE);
        startGame();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        // Рисуем сетку
        paint.setColor(Color.GRAY);
        paint.setStrokeWidth(2f);
        for (int i = 0; i <= gridSize; i++) {
            canvas.drawLine(i * tileSize, 0, i * tileSize, gridSize * tileSize, paint);
            canvas.drawLine(0, i * tileSize, gridSize * tileSize, i * tileSize, paint);
        }

        if (gameOver) {
            paint.setColor(Color.RED);
            paint.setTextSize(100f);
            paint.setStyle(Paint.Style.FILL);
            canvas.drawText("Game Over", getWidth() / 4f, getHeight() / 2f - 50, paint); // Сдвигаем текст вверх
            paint.setStyle(Paint.Style.STROKE);
            return;
        }

        paint.setColor(Color.GREEN);
        paint.setStyle(Paint.Style.FILL);
        for (Point part : snake) {
            canvas.drawRect(
                    part.x * tileSize,
                    part.y * tileSize,
                    (part.x + 1) * tileSize,
                    (part.y + 1) * tileSize,
                    paint
            );
        }

        paint.setColor(Color.RED);
        canvas.drawRect(
                food.x * tileSize,
                food.y * tileSize,
                (food.x + 1) * tileSize,
                (food.y + 1) * tileSize,
                paint
        );

        paint.setStyle(Paint.Style.STROKE);
    }
}