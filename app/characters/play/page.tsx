"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move, type Square } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRouter, useSearchParams } from "next/navigation";
import ReviewPopup from "../../components/ReviewPopup";
import {
  CHARACTERS,
  OPENING_REPERTOIRE,
  type Character,
  type CharacterSpeech,
} from "../../lib/characters";

type PlayerColor = "white" | "black";
type SquareStyles = Record<string, React.CSSProperties>;
type SpeechBubble = {
  id: number;
  text: string;
  visible: boolean;
};
type SpeechKey = keyof CharacterSpeech;

const LIGHT_SQUARE = "#f0d9b5";
const DARK_SQUARE = "#b58863";
const LAST_MOVE = "rgba(250, 204, 21, 0.45)";
const LEGAL_DOT =
  "radial-gradient(circle, rgba(17, 24, 39, 0.34) 20%, transparent 21%)";
const SPEECH_COOLDOWN_MS = 10000;

function colorFromTurn(turn: "w" | "b"): PlayerColor {
  return turn === "w" ? "white" : "black";
}

function getBoardWidth() {
  if (typeof window === "undefined") return 560;
  return Math.min(560, window.innerWidth - 32);
}

function randomItem(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function isHistoryPrefix(history: string[], line: string[]) {
  return history.every((move, index) => move === line[index]);
}

function getOpeningLines(character: Character) {
  return character.openingBook.flatMap((name) => OPENING_REPERTOIRE[name] ?? []);
}

function getMatchedOpening(history: string[], character: Character) {
  if (history.length === 0) return null;

  return character.openingBook.find((openingName) =>
    (OPENING_REPERTOIRE[openingName] ?? []).some(
      (line) => history.length <= line.length && isHistoryPrefix(history, line)
    )
  );
}

function getOpeningSpeechMatch(history: string[], character: Character) {
  if (history.length === 0) return false;

  return getOpeningLines(character).some(
    (line) => history.length <= line.length && isHistoryPrefix(history, line)
  );
}

function chooseOpeningMove(currentGame: Chess, character: Character) {
  const history = currentGame.history();
  const matchingLines = getOpeningLines(character).filter(
    (line) => history.length < line.length && isHistoryPrefix(history, line)
  );

  if (matchingLines.length === 0) return { abandoned: true as const };

  const sanMoves = Array.from(new Set(matchingLines.map((line) => line[history.length])));
  const legalMoves = currentGame.moves({ verbose: true });

  const legalBookMoves = sanMoves.map((san) => ({
    san,
    move: legalMoves.find((legalMove) => legalMove.san === san),
  }));

  if (legalBookMoves.some((item) => !item.move)) {
    return { abandoned: true as const };
  }

  const selected = legalBookMoves[Math.floor(Math.random() * legalBookMoves.length)]?.move;
  if (!selected) return { abandoned: true as const };

  const bookGame = new Chess(currentGame.fen());
  const move = bookGame.move({
    from: selected.from,
    to: selected.to,
    promotion: selected.promotion ?? "q",
  });

  if (!move) return { abandoned: true as const };

  return {
    abandoned: false as const,
    game: bookGame,
    move,
  };
}

function getMaterialScore(currentGame: Chess, color: PlayerColor) {
  const values: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  return currentGame.board().flat().reduce((score, piece) => {
    if (!piece) return score;

    const pieceColor = piece.color === "w" ? "white" : "black";
    const value = values[piece.type] ?? 0;

    return score + (pieceColor === color ? value : -value);
  }, 0);
}

function chooseRandomMove(currentGame: Chess) {
  const legalMoves = currentGame.moves({ verbose: true });
  const selectedMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];

  if (!selectedMove) return null;

  const randomGame = new Chess(currentGame.fen());
  const move = randomGame.move({
    from: selectedMove.from,
    to: selectedMove.to,
    promotion: selectedMove.promotion ?? "q",
  });

  if (!move) return null;

  return {
    game: randomGame,
    move,
  };
}

function applyCandidateMove(currentGame: Chess, selectedMove: Move) {
  const nextGame = new Chess(currentGame.fen());
  const move = nextGame.move({
    from: selectedMove.from,
    to: selectedMove.to,
    promotion: selectedMove.promotion ?? "q",
  });

  if (!move) return null;

  return {
    game: nextGame,
    move,
  };
}

function causesCheck(currentGame: Chess, move: Move) {
  const nextGame = new Chess(currentGame.fen());
  nextGame.move({
    from: move.from,
    to: move.to,
    promotion: move.promotion ?? "q",
  });
  return nextGame.inCheck();
}

function materialAfterMove(currentGame: Chess, move: Move, color: PlayerColor) {
  const nextGame = new Chess(currentGame.fen());
  nextGame.move({
    from: move.from,
    to: move.to,
    promotion: move.promotion ?? "q",
  });
  return getMaterialScore(nextGame, color);
}

function scorePersonalityMove(currentGame: Chess, move: Move, character: Character) {
  const color = colorFromTurn(currentGame.turn());
  const givesCheck = causesCheck(currentGame, move);
  const captureValue: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  const captureScore = move.captured ? captureValue[move.captured] ?? 0 : 0;
  const piece = currentGame.get(move.from);
  const isTrade = Boolean(move.captured && piece && captureValue[piece.type] >= captureScore);
  const centerBonus = ["d4", "d5", "e4", "e5"].includes(move.to) ? 1 : 0;
  const developmentBonus =
    piece && ["n", "b"].includes(piece.type) && ["1", "8"].includes(move.from[1]) ? 1.5 : 0;
  const quietImprovement = !move.captured && !givesCheck ? centerBonus + developmentBonus : 0;
  const materialScore = materialAfterMove(currentGame, move, color);

  let score = Math.random() * 0.8 + materialScore * 0.12;

  switch (character.id) {
    case "gambit-goblin":
    case "berserker":
      score += captureScore * 2.4 + (givesCheck ? 5 : 0);
      break;
    case "trap-master":
    case "tactical-demon":
      score += captureScore * 1.8 + (givesCheck ? 6 : 0) + (move.san.includes("+") ? 2 : 0);
      break;
    case "positional-snake":
      score += quietImprovement * 2.8 + centerBonus * 1.6 - (move.captured ? 0.4 : 0);
      break;
    case "endgame-monk":
      score += (isTrade ? 5 : 0) + captureScore * 1.1 + (move.san.includes("x") ? 1 : 0);
      break;
    case "troll":
      score += Math.random() * 8 - materialScore * 0.08;
      break;
    default:
      score += captureScore * 1.2 + (givesCheck ? 2 : 0) + quietImprovement;
      break;
  }

  return score;
}

function choosePersonalityMove(currentGame: Chess, character: Character) {
  if (character.id === "timmy" || character.skillLevel <= 1) {
    return chooseRandomMove(currentGame);
  }

  const legalMoves = currentGame.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  if (character.id === "troll" && Math.random() < 0.24) {
    return chooseRandomMove(currentGame);
  }

  const sortedMoves = [...legalMoves].sort(
    (a, b) =>
      scorePersonalityMove(currentGame, b, character) -
      scorePersonalityMove(currentGame, a, character)
  );
  const selectionWindow =
    character.skillLevel >= 18 ? 1 : character.skillLevel >= 12 ? 3 : 5;
  const selectedMove =
    sortedMoves[Math.floor(Math.random() * Math.min(selectionWindow, sortedMoves.length))];

  return selectedMove ? applyCandidateMove(currentGame, selectedMove) : null;
}

function getPersonalityChance(character: Character) {
  if (character.id === "timmy") return 1;
  if (character.id === "troll") return 0.42;
  if (character.id === "the-immortal") return 0.02;

  return Math.max(0.04, 0.72 - character.skillLevel * 0.035);
}

export default function CharacterPlayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const character = useMemo(() => {
    const id = searchParams.get("character");
    return CHARACTERS.find((item) => item.id === id) ?? CHARACTERS[0];
  }, [searchParams]);

  const playerColor: PlayerColor =
    searchParams.get("color") === "black" ? "black" : "white";

  const [game, setGame] = useState(() => new Chess());
  const [history, setHistory] = useState<string[]>([]);
  const [boardWidth, setBoardWidth] = useState(getBoardWidth);
  const [isThinking, setIsThinking] = useState(false);
  const [gameResult, setGameResult] = useState("");
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<SpeechBubble | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | "">("");
  const [moveSquares, setMoveSquares] = useState<SquareStyles>({});
  const [lastMoveSquares, setLastMoveSquares] = useState<SquareStyles>({});
  const [checkSquare, setCheckSquare] = useState<SquareStyles>({});
  const [promotionMove, setPromotionMove] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  const gameRef = useRef(game);
  const stockfishRef = useRef<Worker | null>(null);
  const thinkingRef = useRef(false);
  const movesEndRef = useRef<HTMLDivElement | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);
  const lastSpeechTimestampRef = useRef(0);
  const speechShownThisEngineMoveRef = useRef(false);
  const openingBookActiveRef = useRef(true);
  const openingSpeechShownRef = useRef(false);
  const winningSpeechShownRef = useRef(false);

  const soundsRef = useRef<{
    move?: HTMLAudioElement;
    capture?: HTMLAudioElement;
    check?: HTMLAudioElement;
    win?: HTMLAudioElement;
    loss?: HTMLAudioElement;
    draw?: HTMLAudioElement;
  }>({});

  const isGameOver = game.isGameOver() || Boolean(gameResult);
  const engineColor: PlayerColor = playerColor === "white" ? "black" : "white";

  const reviewStats = useMemo(() => {
    const playerWon =
      (gameResult.includes("White wins") && playerColor === "white") ||
      (gameResult.includes("Black wins") && playerColor === "black");
    const playerLost =
      (gameResult.includes("White wins") && playerColor === "black") ||
      (gameResult.includes("Black wins") && playerColor === "white") ||
      gameResult.includes("resignation");
    const playerMoves = Math.max(1, Math.ceil(history.length / 2));

    return {
      accuracy: gameResult.includes("Draw") ? 74 : playerWon ? 91 : playerLost ? 58 : 70,
      bestMoves: Math.max(1, Math.floor(playerMoves * (playerWon ? 0.45 : 0.28))),
      brilliantMoves: playerWon && playerMoves > 8 ? 1 : 0,
      mistakes: playerLost ? Math.max(1, Math.floor(playerMoves * 0.2)) : 0,
      blunders: playerLost ? 1 : 0,
    };
  }, [gameResult, history.length, playerColor]);

  const showSpeech = useCallback((key: SpeechKey, bypassCooldown = false) => {
    const lines = character.speech[key];
    if (lines.length === 0 || typeof window === "undefined") return false;

    const now = Date.now();

    if (!bypassCooldown && now - lastSpeechTimestampRef.current < SPEECH_COOLDOWN_MS) {
      return false;
    }

    if (speechTimeoutRef.current) {
      window.clearTimeout(speechTimeoutRef.current);
    }

    lastSpeechTimestampRef.current = now;

    setSpeechBubble({
      id: now,
      text: randomItem(lines),
      visible: true,
    });

    speechTimeoutRef.current = window.setTimeout(() => {
      setSpeechBubble((current) =>
        current ? { ...current, visible: false } : current
      );
    }, 3600);

    return true;
  }, [character.speech]);

  const showEngineSpeech = useCallback(
    (key: SpeechKey, bypassCooldown = false) => {
      if (speechShownThisEngineMoveRef.current) return false;

      const shown = showSpeech(key, bypassCooldown);
      if (shown) speechShownThisEngineMoveRef.current = true;

      return shown;
    },
    [showSpeech]
  );

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    const startSpeechTimer = window.setTimeout(() => {
      showSpeech("opening");
    }, 0);

    return () => {
      window.clearTimeout(startSpeechTimer);

      if (speechTimeoutRef.current) {
        window.clearTimeout(speechTimeoutRef.current);
      }
    };
  }, [character.id, showSpeech]);

  useEffect(() => {
    const onResize = () => setBoardWidth(getBoardWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    movesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const playSound = useCallback((name: keyof typeof soundsRef.current) => {
    soundsRef.current[name]?.play().catch(() => {});
  }, []);

  const maybeShowOpeningSpeech = useCallback(
    (currentGame: Chess) => {
      if (openingSpeechShownRef.current) return;

      const matchedOpening = getMatchedOpening(currentGame.history(), character);

      if (matchedOpening) {
        openingSpeechShownRef.current = true;
        showSpeech("opening");
      }
    },
    [character, showSpeech]
  );

  const updateCheckHighlight = useCallback((currentGame: Chess) => {
    if (!currentGame.inCheck()) {
      setCheckSquare({});
      return;
    }

    const board = currentGame.board();
    const kingColor = currentGame.turn();

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = board[row][col];

        if (piece?.type === "k" && piece.color === kingColor) {
          const square = `${"abcdefgh"[col]}${8 - row}`;
          setCheckSquare({
            [square]: {
              background: "rgba(239, 68, 68, 0.62)",
              borderRadius: "50%",
            },
          });
          return;
        }
      }
    }
  }, []);

  const finishIfGameOver = useCallback(
    (currentGame: Chess) => {
      if (currentGame.isCheckmate()) {
        const winner = currentGame.turn() === "w" ? "Black" : "White";
        const playerWon = winner.toLowerCase() === playerColor;

        setGameResult(`Checkmate. ${winner} wins.`);
        setShowReviewPopup(true);
        showSpeech(playerWon ? "lose" : "win", true);
        playSound(playerWon ? "win" : "loss");
        return true;
      }

      if (currentGame.isDraw()) {
        setGameResult("Draw.");
        setShowReviewPopup(true);
        showSpeech("draw", true);
        playSound("draw");
        return true;
      }

      setGameResult("");
      return false;
    },
    [playSound, playerColor, showSpeech]
  );

  const applyMove = useCallback(
    (move: Move, nextGame: Chess) => {
      const characterMoved = colorFromTurn(move.color) === engineColor;
      if (characterMoved) speechShownThisEngineMoveRef.current = false;

      setGame(nextGame);
      setHistory((items) => [...items, move.san]);
      setMoveSquares({});
      setSelectedSquare("");
      setLastMoveSquares({
        [move.from]: { backgroundColor: LAST_MOVE },
        [move.to]: { backgroundColor: LAST_MOVE },
      });

      if (nextGame.inCheck()) {
        playSound("check");
      } else if (move.captured) {
        playSound("capture");
      } else {
        playSound("move");
      }

      updateCheckHighlight(nextGame);
      const gameEnded = finishIfGameOver(nextGame);
      if (gameEnded) return;

      if (characterMoved) {
        if (move.captured === "q") {
          showEngineSpeech("blunder", true);
        } else if (nextGame.inCheck()) {
          showEngineSpeech("check");
        } else if (move.captured) {
          showEngineSpeech("capture");
        } else if (
          !winningSpeechShownRef.current &&
          getMaterialScore(nextGame, engineColor) >= 5
        ) {
          winningSpeechShownRef.current = true;
          showEngineSpeech("winning");
        } else if (!openingSpeechShownRef.current && getOpeningSpeechMatch(nextGame.history(), character)) {
          openingSpeechShownRef.current = true;
          showEngineSpeech("opening");
        } else if (Math.random() < 0.18) {
          showEngineSpeech("thinking");
        }
      } else {
        maybeShowOpeningSpeech(nextGame);
      }
    },
    [
      character,
      engineColor,
      finishIfGameOver,
      maybeShowOpeningSpeech,
      playSound,
      showEngineSpeech,
      updateCheckHighlight,
    ]
  );

  useEffect(() => {
    soundsRef.current = {
      move: new Audio("/sounds/Move.ogg"),
      capture: new Audio("/sounds/Capture.ogg"),
      check: new Audio("/sounds/Check.ogg"),
      win: new Audio("/sounds/Victory.ogg"),
      loss: new Audio("/sounds/Defeat.ogg"),
      draw: new Audio("/sounds/Draw.ogg"),
    };

    const stockfish = new Worker("/stockfish/stockfish.js");
    stockfishRef.current = stockfish;
    stockfish.postMessage("uci");

    stockfish.onmessage = (event) => {
      const line = typeof event.data === "string" ? event.data : "";

      if (!line.startsWith("bestmove")) return;

      thinkingRef.current = false;
      setIsThinking(false);

      const bestMove = line.split(" ")[1];
      if (!bestMove || bestMove === "(none)") return;

      const currentGame = gameRef.current;
      if (colorFromTurn(currentGame.turn()) !== engineColor) return;

      const nextGame = new Chess(currentGame.fen());
      const move = nextGame.move({
        from: bestMove.slice(0, 2),
        to: bestMove.slice(2, 4),
        promotion: bestMove[4] || "q",
      });

      if (move) applyMove(move, nextGame);
    };

    return () => {
      stockfish.terminate();
      stockfishRef.current = null;
    };
  }, [
    applyMove,
    engineColor,
  ]);

  useEffect(() => {
    const currentTurn = colorFromTurn(game.turn());

    if (
      currentTurn !== engineColor ||
      game.isGameOver() ||
      gameResult ||
      thinkingRef.current
    ) {
      return;
    }

    thinkingRef.current = true;
    setIsThinking(true);

    window.setTimeout(() => {
      const currentGame = gameRef.current;

      if (
        currentGame.isGameOver() ||
        colorFromTurn(currentGame.turn()) !== engineColor
      ) {
        thinkingRef.current = false;
        setIsThinking(false);
        return;
      }

      const openingMove = openingBookActiveRef.current
        ? chooseOpeningMove(currentGame, character)
        : null;

      if (openingMove?.abandoned) {
        openingBookActiveRef.current = false;
      } else if (openingMove) {
        thinkingRef.current = false;
        setIsThinking(false);
        applyMove(openingMove.move, openingMove.game);
        return;
      }

      const personalityChance = getPersonalityChance(character);
      const personalityMove =
        Math.random() < personalityChance
          ? choosePersonalityMove(currentGame, character)
          : null;

      if (personalityMove) {
        thinkingRef.current = false;
        setIsThinking(false);
        applyMove(personalityMove.move, personalityMove.game);
        return;
      }

      const activeStockfish = stockfishRef.current;

      if (!activeStockfish) {
        thinkingRef.current = false;
        setIsThinking(false);
        return;
      }

      activeStockfish.postMessage(
        `setoption name Skill Level value ${character.skillLevel}`
      );
      activeStockfish.postMessage(`position fen ${currentGame.fen()}`);
      activeStockfish.postMessage(`go movetime ${character.moveTime}`);
    }, 220);
  }, [
    applyMove,
    character,
    engineColor,
    game,
    gameResult,
    showSpeech,
  ]);

  const showLegalMoves = useCallback(
    (square: Square) => {
      const piece = game.get(square);

      if (!piece || colorFromTurn(piece.color) !== playerColor) {
        setMoveSquares({});
        setSelectedSquare("");
        return;
      }

      const legalMoves = game.moves({ square, verbose: true });
      const nextSquares: SquareStyles = {
        [square]: {
          backgroundColor: LAST_MOVE,
          borderRadius: "50%",
        },
      };

      legalMoves.forEach((move) => {
        nextSquares[move.to] = {
          background: LEGAL_DOT,
          borderRadius: "50%",
        };
      });

      setSelectedSquare(square);
      setMoveSquares(nextSquares);
    },
    [game, playerColor]
  );

  const makePlayerMove = useCallback(
    (sourceSquare: string, targetSquare: string, piece?: string) => {
      if (
        thinkingRef.current ||
        isGameOver ||
        colorFromTurn(game.turn()) !== playerColor
      ) {
        return false;
      }

      const sourcePiece = game.get(sourceSquare as Square);
      const isPlayerPawn =
        sourcePiece?.type === "p" && colorFromTurn(sourcePiece.color) === playerColor;
      const isPromotionTarget =
        isPlayerPawn &&
        ((sourcePiece.color === "w" && targetSquare.endsWith("8")) ||
          (sourcePiece.color === "b" && targetSquare.endsWith("1")));

      if (isPromotionTarget) {
        const promotionGame = new Chess(game.fen());
        const legalPromotion = promotionGame.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q",
        });

        if (!legalPromotion) return false;

        setPromotionMove({
          from: sourceSquare,
          to: targetSquare,
        });
        setShowPromotionModal(true);
        setMoveSquares({});
        setSelectedSquare("");
        return true;
      }

      const nextGame = new Chess(game.fen());

      const move = nextGame.move({
        from: sourceSquare,
        to: targetSquare,
      });

      if (!move) return false;

      applyMove(move, nextGame);
      return true;
    },
    [applyMove, game, isGameOver, playerColor]
  );

  const completePromotion = useCallback(
    (piece: "q" | "r" | "b" | "n") => {
      if (!promotionMove) return;

      const nextGame = new Chess(game.fen());
      const move = nextGame.move({
        from: promotionMove.from,
        to: promotionMove.to,
        promotion: piece,
      });

      if (move) {
        applyMove(move, nextGame);
      }

      setShowPromotionModal(false);
      setPromotionMove(null);
    },
    [applyMove, game, promotionMove]
  );

  const onSquareClick = useCallback(
    (square: Square) => {
      if (isGameOver || colorFromTurn(game.turn()) !== playerColor) return;

      if (selectedSquare && makePlayerMove(selectedSquare, square)) return;
      showLegalMoves(square);
    },
    [game, isGameOver, makePlayerMove, playerColor, selectedSquare, showLegalMoves]
  );

  const resignGame = () => {
    if (isGameOver) return;

    const winner = playerColor === "white" ? "Black" : "White";
    setGameResult(`${winner} wins by resignation.`);
    setShowReviewPopup(true);
    showSpeech("win", true);
    playSound("loss");
  };

  const downloadPGN = () => {
    const blob = new Blob([game.pgn()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${character.id}-game.pgn`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const analyzeOnLichess = async () => {
    try {
      await navigator.clipboard.writeText(game.pgn());
    } catch {}

    window.open("https://lichess.org/analysis", "_blank");
  };

  return (
    <main className="container" style={{ position: "relative" }}>
      <h1 className="title">Vision 64 Arena</h1>

      <div className="matchHeader">
        <div>
          {character.name} ({character.elo})
        </div>
        <div>Playing as {playerColor}</div>
      </div>

      <div
        style={{
          minHeight: 132,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div className="resultBox" style={{ marginBottom: 0, minHeight: 28 }}>
          {gameResult || (isThinking ? `${character.name} is thinking...` : " ")}
        </div>

        <div
          aria-live="polite"
          style={{
            minHeight: 58,
            width: "min(520px, 92vw)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            pointerEvents: "none",
            transform: "translateY(42px)",
          }}
        >
          <div
            style={{
              opacity: speechBubble?.visible ? 1 : 0,
              transform: speechBubble?.visible
                ? "translateY(0)"
                : "translateY(-6px)",
              transition: "opacity 220ms ease, transform 220ms ease",
              background: "rgba(15, 23, 42, 0.94)",
              border: "1px solid rgba(255, 255, 255, 0.16)",
              borderRadius: 14,
              boxShadow: "0 18px 40px rgba(0, 0, 0, 0.28)",
              color: "white",
              fontSize: 14,
              lineHeight: 1.45,
              maxWidth: "100%",
              minHeight: 44,
              padding: "10px 14px",
              textAlign: "center",
            }}
          >
            {speechBubble?.text || " "}
          </div>
        </div>

        <div
          className="postGameButtons"
          style={{
            margin: 0,
            visibility: gameResult && !showReviewPopup ? "visible" : "hidden",
          }}
        >
          <button className="analyzeBtn" onClick={analyzeOnLichess}>
            Analyze on Lichess
          </button>
          <button className="downloadBtn" onClick={downloadPGN}>
            Download PGN
          </button>
          <button className="newGamePopupBtn" onClick={() => router.push("/characters")}>
            New Character Game
          </button>
        </div>
      </div>

      <div className="boardWrapper">
        <div className="boardSection">
          <div className="boardBox">
            <Chessboard
              position={game.fen()}
              boardOrientation={playerColor}
              boardWidth={boardWidth}
              autoPromoteToQueen={false}
              onPromotionCheck={() => false}
              onPieceDrop={(source, target, piece) =>
                makePlayerMove(source, target, piece)
              }
              onSquareClick={onSquareClick}
              onPieceDragBegin={(_, square) => showLegalMoves(square)}
              onPieceDragEnd={() => {
                setMoveSquares({});
                setSelectedSquare("");
              }}
              customDarkSquareStyle={{ backgroundColor: DARK_SQUARE }}
              customLightSquareStyle={{ backgroundColor: LIGHT_SQUARE }}
              customSquareStyles={{
                ...lastMoveSquares,
                ...moveSquares,
                ...checkSquare,
              }}
              customBoardStyle={{ borderRadius: "10px" }}
            />
          </div>

          <div className="bottomButtons">
            <button className="resignBtn" onClick={resignGame}>
              Resign
            </button>
          </div>
        </div>

        <div className="moveHistory">
          <h2>Moves</h2>
          <div className="movesList">
            {Array.from({ length: Math.ceil(history.length / 2) }).map((_, index) => (
              <div key={index} className="moveRow">
                <span>{index + 1}.</span>
                <span>{history[index * 2] ?? ""}</span>
                <span>{history[index * 2 + 1] ?? ""}</span>
              </div>
            ))}
            <div ref={movesEndRef} />
          </div>
        </div>
      </div>

      {showPromotionModal && promotionMove && (
        <div className="promotionOverlay" role="presentation">
          <div
            className="promotionModal"
            role="dialog"
            aria-modal="true"
            aria-label="Choose promotion piece"
          >
            <h2 className="promotionTitle">Choose promotion</h2>
            <div className="promotionChoices">
              {(["q", "r", "b", "n"] as const).map((piece) => {
                const promotingPiece = game.get(promotionMove.from as Square);
                const symbols =
                  promotingPiece?.color === "b"
                    ? { q: "♛", r: "♜", b: "♝", n: "♞" }
                    : { q: "♕", r: "♖", b: "♗", n: "♘" };
                const labels = {
                  q: "Queen",
                  r: "Rook",
                  b: "Bishop",
                  n: "Knight",
                };

                return (
                  <button
                    key={piece}
                    type="button"
                    className="promotionPieceButton"
                    onClick={() => completePromotion(piece)}
                    autoFocus={piece === "q"}
                    aria-label={`Promote to ${labels[piece]}`}
                  >
                    <span className="promotionPieceImage" aria-hidden="true">
                      {symbols[piece]}
                    </span>
                    <span className="promotionPieceLabel">{labels[piece]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <ReviewPopup
        isOpen={showReviewPopup}
        onClose={() => setShowReviewPopup(false)}
        accuracy={reviewStats.accuracy}
        bestMoves={reviewStats.bestMoves}
        brilliantMoves={reviewStats.brilliantMoves}
        mistakes={reviewStats.mistakes}
        blunders={reviewStats.blunders}
        onAnalyze={analyzeOnLichess}
        onDownloadPGN={downloadPGN}
        onNewGame={() => router.push("/characters")}
      />
    </main>
  );
}