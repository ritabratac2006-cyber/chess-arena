"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="setupPage">
      <div className="setupCard">
        <div className="badge">
          Vision 64 Training Arena
        </div>

        <h1 className="setupTitle">
          Train Like a Master
        </h1>

        <p className="setupSubtitle">
          Choose your path and improve your chess
          through battles, puzzles and opening
          preparation.
        </p>

        <div className="trainingGrid">

          <button
            className="trainingCard"
            onClick={() =>
              router.push("/stockfish")
            }
          >
            <div className="trainingEmoji">
              🤖
            </div>

            <h3>Play vs Stockfish</h3>

            <p>
              Adjustable engine strength with
              optional evaluation bar.
            </p>
          </button>

          <button
            className="trainingCard"
            onClick={() =>
              router.push("/characters")
            }
          >
            <div className="trainingEmoji">
              🎭
            </div>

            <h3>Play vs Characters</h3>

            <p>
              Face unique personalities with
              distinct styles and weaknesses.
            </p>
          </button>

          <button
            className="trainingCard"
            onClick={() =>
              router.push("/puzzles")
            }
          >
            <div className="trainingEmoji">
              🧩
            </div>

            <h3>Puzzle Trainer</h3>

            <p>
              Solve tactical challenges and
              sharpen calculation.
            </p>
          </button>

          <button
            className="trainingCard"
            onClick={() =>
              router.push("/openings")
            }
          >
            <div className="trainingEmoji">
              📚
            </div>

            <h3>Openings Lab</h3>

            <p>
              Learn and practice opening systems
              move by move.
            </p>
          </button>

        </div>
      </div>
    </main>
  );
}