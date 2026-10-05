"use client";

import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import ReviewPopup from "../../components/ReviewPopup";
import { useSearchParams, useRouter } from "next/navigation";

export default function Home() {
  const [game, setGame] = useState(new Chess());
  const searchParams = useSearchParams();
  const router = useRouter();

const playerColor =
  (searchParams.get("color") as
    | "white"
    | "black") || "white";

const level =
  Number(searchParams.get("level")) || 5;

  
  const [gameResult, setGameResult] =
    useState("");

  const [showEval, setShowEval] =
    useState(true);

  const [evaluation, setEvaluation] =
    useState(0);

  const [gameOver, setGameOver] =
    useState(false);

  const [lastMoveSquares, setLastMoveSquares] =
    useState({});

  const [checkSquare, setCheckSquare] =
    useState({});

  const [moveSquares, setMoveSquares] =
    useState({});

  const stockfishRef = useRef<Worker | null>(
    null
  );

  const thinkingRef = useRef(false);

  const moveHistoryRef =
    useRef<string[]>([]);

  const movesEndRef =
    useRef<HTMLDivElement | null>(null);
  const downloadPGN = () => {
  const blob = new Blob(
    [game.pgn()],
    { type: "text/plain" }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download =
    "chess-arena-game.pgn";

  link.click();

  URL.revokeObjectURL(url);
};
const analyzeOnLichess = async () => {
  try {
    await navigator.clipboard.writeText(
      game.pgn()
    );
  } catch {}

  window.open(
    "https://lichess.org/analysis",
    "_blank"
  );
};

  // Sounds
  const moveSound = useRef<HTMLAudioElement | null>(
    null
  );

  const captureSound =
    useRef<HTMLAudioElement | null>(null);

  const checkSound =
    useRef<HTMLAudioElement | null>(null);

  const victorySound =
    useRef<HTMLAudioElement | null>(null);

  const defeatSound =
    useRef<HTMLAudioElement | null>(null);

  const drawSound =
    useRef<HTMLAudioElement | null>(null);

  // Eval Bar
  const evalPercent =
    playerColor === "white"
      ? Math.max(
          0,
          Math.min(
            100,
            50 - evaluation * 5
          )
        )
      : Math.max(
          0,
          Math.min(
            100,
            50 + evaluation * 5
          )
        );

  const [showReviewPopup, setShowReviewPopup] =
  useState(false);

const [accuracy, setAccuracy] =
  useState(100);

const [bestMoves, setBestMoves] =
  useState(0);

const [brilliantMoves, setBrilliantMoves] =
  useState(0);

const [mistakes, setMistakes] =
  useState(0);

const [blunders, setBlunders] =
  useState(0);

  // Auto Scroll
  useEffect(() => {
    movesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [game]);

  // Init
  useEffect(() => {
    moveSound.current = new Audio(
      "/sounds/move.ogg"
    );

    captureSound.current = new Audio(
      "/sounds/capture.ogg"
    );

    checkSound.current = new Audio(
      "/sounds/check.ogg"
    );

    victorySound.current = new Audio(
      "/sounds/victory.ogg"
    );

    defeatSound.current = new Audio(
      "/sounds/defeat.ogg"
    );

    drawSound.current = new Audio(
      "/sounds/draw.ogg"
    );

    const stockfish = new Worker(
      "/stockfish/stockfish.js"
    );

    stockfishRef.current = stockfish;

    stockfish.postMessage("uci");

    stockfish.onmessage = (event) => {
      const line =
        typeof event.data === "string"
          ? event.data
          : "";

      // Eval
      if (line.includes("score cp")) {
        const match =
          line.match(/score cp (-?\d+)/);

        if (match) {
          setEvaluation(
            parseInt(match[1]) / 100
          );
        }
      }

      // Mate Eval
      if (line.includes("score mate")) {
        const mateMatch =
          line.match(/score mate (-?\d+)/);

        if (mateMatch) {
          const mate = parseInt(
            mateMatch[1]
          );

          setEvaluation(
            mate > 0 ? 10 : -10
          );
        }
      }

      // Engine Move
      if (line.startsWith("bestmove")) {
        const bestMove =
          line.split(" ")[1];

        if (
          bestMove &&
          bestMove !== "(none)"
        ) {
          const updatedGame =
            new Chess(game.fen());

          try {
            const promotion =
              bestMove.length > 4
                ? bestMove[4]
                : undefined;

            const move =
              updatedGame.move({
                from: bestMove.slice(
                  0,
                  2
                ),
                to: bestMove.slice(
                  2,
                  4
                ),
                promotion,
              });

            if (!move) return;

            moveHistoryRef.current = [
              ...moveHistoryRef.current,
              move.san,
            ];

            setGame(updatedGame);

            setMoveSquares({});

            setLastMoveSquares({
              [move.from]: {
                backgroundColor:
                  "rgba(255,255,0,0.4)",
              },

              [move.to]: {
                backgroundColor:
                  "rgba(255,255,0,0.4)",
              },
            });

            if (
              updatedGame.inCheck()
            ) {
              checkSound.current
                ?.play()
                .catch(() => {});
            } else if (
              move.captured
            ) {
              captureSound.current
                ?.play()
                .catch(() => {});
            } else {
              moveSound.current
                ?.play()
                .catch(() => {});
            }

            updateCheckHighlight(
              updatedGame
            );

            checkGameEnd(
              updatedGame
            );
          } catch {}
        }

        thinkingRef.current = false;
      }
    };

    return () => {
      stockfish.terminate();
    };
  }, [game]);

  // Engine Turn
  useEffect(() => {
    const turn =
      game.turn() === "w"
        ? "white"
        : "black";

    const shouldEngineMove =
      turn !== playerColor;

    if (
      shouldEngineMove &&
      !game.isGameOver() &&
      !thinkingRef.current &&
      !gameOver
    ) {
      thinkingRef.current = true;

      const moveTime =
        200 + level * 120;

      setTimeout(() => {
        const stockfish =
          stockfishRef.current;

        if (!stockfish) return;

        stockfish.postMessage(
          `setoption name Skill Level value ${level}`
        );

        stockfish.postMessage(
          `position fen ${game.fen()}`
        );

        stockfish.postMessage(
          `go movetime ${moveTime}`
        );
      }, 250);
    }
  }, [
    game,
    playerColor,
    level,
    gameOver,
  ]);

  // Check Highlight
  const updateCheckHighlight = (
    currentGame: Chess
  ) => {
    if (currentGame.inCheck()) {
      const board =
        currentGame.board();

      let kingSquare = "";

      for (
        let row = 0;
        row < 8;
        row++
      ) {
        for (
          let col = 0;
          col < 8;
          col++
        ) {
          const piece =
            board[row][col];

          if (
            piece &&
            piece.type === "k" &&
            piece.color ===
              currentGame.turn()
          ) {
            kingSquare =
              "abcdefgh"[col] +
              (8 - row);

            break;
          }
        }
      }

      setCheckSquare({
        [kingSquare]: {
          background:
            "rgba(255,0,0,0.6)",

          borderRadius: "50%",
        },
      });
    } else {
      setCheckSquare({});
    }
  };

  // Game End
  const checkGameEnd = (
    currentGame: Chess
  ) => {
    if (currentGame.isCheckmate()) {
      setGameOver(true);
      setShowReviewPopup(true);

      const winner =
        currentGame.turn() === "w"
          ? "Black"
          : "White";

      setGameResult(
        `Checkmate! ${winner} wins`
      );

      const userWon =
        (winner === "White" &&
          playerColor === "white") ||
        (winner === "Black" &&
          playerColor === "black");

      if (userWon) {
        victorySound.current
          ?.play()
          .catch(() => {});
      } else {
        defeatSound.current
          ?.play()
          .catch(() => {});
      }
    } else if (
      currentGame.isDraw()
    ) {
      setGameOver(true);
   setShowReviewPopup(true);


      setGameResult("Draw");

      drawSound.current
        ?.play()
        .catch(() => {});
    } else {
      setGameResult("");
    }
  };

  // Legal Moves
  const onSquareClick = (
    square: string
  ) => {
    const turn =
      game.turn() === "w"
        ? "white"
        : "black";

    if (turn !== playerColor)
      return;

    const piece =
      game.get(square);

    if (
      !piece ||
      (piece.color === "w"
        ? "white"
        : "black") !== playerColor
    ) {
      setMoveSquares({});
      return;
    }

    const moves = game.moves({
      square,
      verbose: true,
    });

    const newSquares: any = {};

    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          "radial-gradient(circle, rgba(0,0,0,0.25) 20%, transparent 20%)",

        borderRadius: "50%",
      };
    });

    newSquares[square] = {
      backgroundColor:
        "rgba(255,255,0,0.4)",

      borderRadius: "50%",
    };

    setMoveSquares(newSquares);
  };

  // Player Move
  const onDrop = (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ) => {
    if (
      thinkingRef.current ||
      gameOver
    )
      return false;

    const turn =
      game.turn() === "w"
        ? "white"
        : "black";

    if (turn !== playerColor)
      return false;

    const updatedGame = new Chess(
      game.fen()
    );

    try {
      const promotion =
        piece?.[1]?.toLowerCase();

      const move =
        updatedGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion,
        });

      if (!move) return false;

      moveHistoryRef.current = [
        ...moveHistoryRef.current,
        move.san,
      ];

      setGame(updatedGame);

      setMoveSquares({});

      setLastMoveSquares({
        [move.from]: {
          backgroundColor:
            "rgba(255,255,0,0.4)",
        },

        [move.to]: {
          backgroundColor:
            "rgba(255,255,0,0.4)",
        },
      });

      if (updatedGame.inCheck()) {
        checkSound.current
          ?.play()
          .catch(() => {});
      } else if (move.captured) {
        captureSound.current
          ?.play()
          .catch(() => {});
      } else {
        moveSound.current
          ?.play()
          .catch(() => {});
      }

      updateCheckHighlight(
        updatedGame
      );

      checkGameEnd(updatedGame);

      return true;
    } catch {
      return false;
    }
  };

  // New Game
  
  // Resign
  const resignGame = () => {
    if (gameOver) return;

    setGameOver(true);
    setShowReviewPopup(true);

    const winner =
      playerColor === "white"
        ? "Black"
        : "White";

    setGameResult(
      `${winner} wins by resignation`
    );

    defeatSound.current
      ?.play()
      .catch(() => {});
  };

  return (
    <main className="container">
      <h1 className="title">
        Chess Arena
      </h1>
<div className="matchHeader">
  <div>
    Level {level}
  </div>

  <div>
    Playing as {playerColor}
  </div>

  <button
    className="evalToggleBtn"
    onClick={() =>
      setShowEval(!showEval)
    }
  >
    {showEval
      ? "Hide Eval"
      : "Show Eval"}
  </button>
</div>

      {gameResult && (
        <div className="resultBox">
          {gameResult}
        </div>
      )}
  {gameOver && !showReviewPopup && (
  <div className="postGameButtons">
    <button
      className="analyzeBtn"
      onClick={analyzeOnLichess}
    >
      Analyze on Lichess
    </button>

    <button
      className="downloadBtn"
      onClick={downloadPGN}
    >
      Download PGN
    </button>

    <button
      className="newGamePopupBtn"
      onClick={() => {
        router.push("/");
      }}
    >
      Start New Game
    </button>
  </div>
)}

      <div className="boardWrapper">
        {showEval && (
          <div
            className={`evalBar ${
              playerColor === "black"
                ? "flipped"
                : ""
            }`}
          >
            <div
              className="evalFill"
              style={{
                height: `${evalPercent}%`,
              }}
            ></div>
          </div>
        )}

        <div className="boardSection">
          <div className="boardBox">
            <Chessboard
              position={game.fen()}
              onPieceDrop={onDrop}
              onSquareClick={
                onSquareClick
              }
              onPieceDragBegin={(
                piece,
                square
              ) => {
                const moves =
                  game.moves({
                    square,
                    verbose: true,
                  });

                const newSquares: any =
                  {};

                moves.forEach(
                  (move) => {
                    newSquares[
                      move.to
                    ] = {
                      background:
                        "radial-gradient(circle, rgba(0,0,0,0.25) 20%, transparent 20%)",

                      borderRadius:
                        "50%",
                    };
                  }
                );

                newSquares[square] = {
                  backgroundColor:
                    "rgba(255,255,0,0.4)",

                  borderRadius:
                    "50%",
                };

                setMoveSquares(
                  newSquares
                );
              }}
              onPieceDragEnd={() => {
                setMoveSquares({});
              }}
              boardOrientation={
                playerColor
              }
              customDarkSquareStyle={{
                backgroundColor:
                  "#b58863",
              }}
              customLightSquareStyle={{
                backgroundColor:
                  "#f0d9b5",
              }}
              customSquareStyles={{
                ...moveSquares,
                ...lastMoveSquares,
                ...checkSquare,
              }}
              customBoardStyle={{
                borderRadius:
                  "10px",
              }}
              boardWidth={
                typeof window !== "undefined"
                ? Math.min(
                  560,
                  window.innerWidth - 32
                )
                : 560
              }
            />
          </div>

          <div className="bottomButtons">

            <button
              className="resignBtn"
              onClick={resignGame}
            >
              Resign
            </button>
          </div>
        </div>

        <div className="moveHistory">
          <h2>Moves</h2>

          <div className="movesList">
            {Array.from({
              length: Math.ceil(
                moveHistoryRef.current
                  .length / 2
              ),
            }).map((_, index) => (
              <div
                key={index}
                className="moveRow"
              >
                <span>
                  {index + 1}.
                </span>

                <span>
                  {moveHistoryRef.current[
                    index * 2
                  ] || ""}
                </span>

                <span>
                  {moveHistoryRef.current[
                    index * 2 + 1
                  ] || ""}
                </span>
              </div>
            ))}

            <div
              ref={movesEndRef}
            ></div>
          </div>
        </div>
      </div>
      <ReviewPopup
  isOpen={showReviewPopup}
  onClose={() =>
    setShowReviewPopup(false)
  }
  accuracy={accuracy}
  bestMoves={bestMoves}
  brilliantMoves={brilliantMoves}
  mistakes={mistakes}
  blunders={blunders}
  onAnalyze={analyzeOnLichess}
  onDownloadPGN={downloadPGN}
  onNewGame={() => {
    router.push("/");
  }}
/>
    </main>
  );
}
