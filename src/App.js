import { useEffect, useRef, useState } from "react";
import "./App.css";
import Food from "./components/Food";
import Snake from "./components/Snake";
import User from "./User";

const randomFoodPosition = () => {
  const pos = { x: 0, y: 0 };
  let x = Math.floor(Math.random() * 96);
  let y = Math.floor(Math.random() * 96);
  pos.x = x - (x % 4);
  pos.y = y - (y % 4); 
  return pos;
};

const extraRandomFoodPosition = () => {
  const pos = { x: 0, y: 0 };
  let x = Math.floor(Math.random() * 96);
  let y = Math.floor(Math.random() * 96);
  pos.x = x - (x % 4);
  pos.y = y - (y % 4); 
  return pos;
};

function App() {

  let initialSnake = {
    snake: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 8, y: 0 },
    ],
    direction: "ArrowRight",
    speed: 100,
  };

  const [snake, setSnake] = useState(initialSnake.snake);
  const [lastDirection, setLastDirection] = useState(initialSnake.direction);
  const [foodPosition, setFoodPosition] = useState(randomFoodPosition());
  const [extraFoodPosition, setExtraFoodPosition] = useState(null);
  const [bonusExtraFoodPosition, setBonusExtraFoodPosition] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const playgroundRef = useRef();
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  if (score === 50 || score === 100) {
    initialSnake.speed -= 50;
  }

  useEffect(() => {
    if (!isStarted) return;

    const handleKeyDown = (e) => {
      if (e.key === " ") {
        setIsPaused(!isPaused);
      } else {
        setLastDirection(e.key);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isStarted, isPaused]);

  useEffect(() => {
    if (!isStarted || isPaused) return;

    const handleCollision = () => {
      const head = snake[snake.length - 1];
      for (let i = 0; i < snake.length - 1; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          setGameOver(true);
          break;
        }
      }
    };

    if (
      snake[snake.length - 1].x >= 100 ||
      snake[snake.length - 1].x === -4 ||
      snake[snake.length - 1].y === -4 ||
      snake[snake.length - 1].y >= 100 ||
      handleCollision()
    ) {
      setGameOver(true);
      return;
    }

    const interval = setInterval(move, initialSnake.speed);
    return () => clearInterval(interval);
  }, [isStarted, isPaused, snake]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const move = () => {
    const tmpSnake = [...snake];
    let x = tmpSnake[tmpSnake.length - 1].x,
      y = tmpSnake[tmpSnake.length - 1].y;

    switch (lastDirection) {
      case "ArrowUp":
        y -= 4;
        break;
      case "ArrowRight":
        x += 4;
        break;
      case "ArrowDown":
        y += 4;
        break;
      case "ArrowLeft":
        x -= 4;
        break;
      default:
        break;
    }

    const newHead = { x, y };
    const collidedWithSelf = tmpSnake.some(
      (bodyPart) => bodyPart.x === newHead.x && bodyPart.y === newHead.y
    );

    if (
      x !== foodPosition.x ||
      y !== foodPosition.y ||
      collidedWithSelf
    ) {
      tmpSnake.shift();
    } else {
      setFoodPosition(randomFoodPosition());
      setScore((prevScore) => prevScore + 1);
      if ((score + 1) % 4 === 0) {
        setExtraFoodPosition(extraRandomFoodPosition());
      }

      if ((score + 1) % 6 === 0) {
        setBonusExtraFoodPosition(extraRandomFoodPosition());
      }
    }

    if (
      extraFoodPosition &&
      x === extraFoodPosition.x &&
      y === extraFoodPosition.y
    ) {
      tmpSnake.unshift(tmpSnake[0]);
      setExtraFoodPosition(null);
      setScore((prevScore) => prevScore + 5);
    }

    if (
      bonusExtraFoodPosition &&
      x === bonusExtraFoodPosition.x &&
      y === bonusExtraFoodPosition.y
    ) {
      tmpSnake.unshift(tmpSnake[0]);
      setBonusExtraFoodPosition(null);
      setScore((prevScore) => prevScore + 10);
    }

    if (collidedWithSelf) {
      setGameOver(true);
      return;
    }

    tmpSnake.push(newHead);
    setSnake(tmpSnake);
  };

  return (
    <div
      className="App"
      onKeyDown={(e) => setLastDirection(e.key)}
      ref={playgroundRef}
      tabIndex={0}
    >
      {User}

      {isStarted && <div className="count">score: {score}</div>}

      {!isStarted && (
        <>
          <button
            onClick={() => {
              setIsStarted(true);
              playgroundRef.current.focus();
            }}
            type="submit"
            className="startnBtn"
          >
            Start
          </button>
          <div className="arrow-msg text">Press Arrow keys to play!</div>
        </>
      )}

      {gameOver && (
        <>
          <div className="game-over text">Game Over!</div>
          <button
            onClick={() => {
              setIsStarted(true);
              setGameOver(false);
              setSnake(initialSnake.snake);
              setLastDirection(initialSnake.direction);
              setScore(0); // Reset score to 0
              playgroundRef.current.focus();
            }}
            type="submit"
          >
            Restart
          </button>
        </>
      )}

      <Snake snake={snake} lastDirection={lastDirection} />

      {!gameOver && <Food position={foodPosition} />}

      {!gameOver && extraFoodPosition && (
        <Food position={extraFoodPosition}  isExtraFood={true} />
      )}

      {!gameOver && bonusExtraFoodPosition && (
        <Food position={bonusExtraFoodPosition}  isExtraFood={true} />
      )}

      {!gameOver && !isPaused && (
        <button className="pauseBtn" onClick={togglePause} type="submit">
          Pause
        </button>
      )}

      {!gameOver && isPaused && (
        <button className="pauseBtn" onClick={togglePause} type="submit">
          Resume
        </button>
      )}
    </div>
  );
}

export default App;
