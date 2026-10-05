"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [color, setColor] = useState("white");
  const [level, setLevel] = useState(5);

  const startGame = () => {
    router.push(
      `/stockfish/play?color=${color}&level=${level}`
    );
  };

  return (
    <main className="setupPage">
      <div className="setupCard">
        <div className="badge">
          Vision 64 Arena
        </div>

        <h1 className="setupTitle">
          Challenge Stockfish
        </h1>

        <p className="setupSubtitle">
          Choose your side and difficulty.
          Enter the arena and test your
          limits.
        </p>

        <div className="section">
          <h3>Choose Your Color</h3>

          <div className="colorGrid">
            <button
              className={`colorCard ${
                color === "white"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setColor("white")
              }
            >
              ♔
              <span>White</span>
            </button>

            <button
              className={`colorCard ${
                color === "black"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setColor("black")
              }
            >
              ♚
              <span>Black</span>
            </button>
          </div>
        </div>

        <div className="section">
          <h3>
            Stockfish Level
          </h3>

          <div className="levelDisplay">
            {level}
          </div>

          <input
            type="range"
            min="1"
            max="20"
            value={level}
            onChange={(e) =>
              setLevel(
                Number(e.target.value)
              )
            }
            className="slider"
          />

          <div className="levelLabels">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        <button
          className="startButton"
          onClick={startGame}
        >
          Enter Arena
        </button>
      </div>
    </main>
  );
}