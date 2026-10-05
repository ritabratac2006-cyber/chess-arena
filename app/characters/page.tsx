"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CHARACTERS } from "../lib/characters";

export default function CharactersPage() {
  const router = useRouter();

  const [selectedCharacter, setSelectedCharacter] =
    useState(CHARACTERS[0]);

  const [color, setColor] =
    useState<"white" | "black">("white");

  const emojis: Record<string, string> = {
    timmy: "🤡",
    "gambit-goblin": "👺",
    "trap-master": "🪤",
    berserker: "⚔️",
    "tactical-demon": "😈",
    "positional-snake": "🐍",
    troll: "🧌",
    "endgame-monk": "🧘",
    "arena-champion": "🏆",
    "calculation-beast": "🦁",
    "grandmaster-ghost": "👻",
    "the-immortal": "👑",
  };

  const startGame = () => {
    router.push(
      `/characters/play?character=${selectedCharacter.id}&color=${color}`
    );
  };

  return (
    <main className="charactersPage">
      <div className="charactersContainer">

        <div className="charactersHeader">
          <div className="badge">
            Vision 64 Character Arena
          </div>

          <h1 className="charactersTitle">
            Choose Your Opponent
          </h1>

          <p className="charactersSubtitle">
            Every character has a unique
            personality, opening repertoire and
            playing style.
          </p>
        </div>

        <div className="colorSection">
          <h3>Choose Your Color</h3>

          <div className="colorButtons">

            <button
              className={`colorChoice ${
                color === "white"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setColor("white")
              }
            >
              ♔ White
            </button>

            <button
              className={`colorChoice ${
                color === "black"
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setColor("black")
              }
            >
              ♚ Black
            </button>

          </div>
        </div>

        <div className="charactersGrid">

          {CHARACTERS.map((character) => (
            <div
              key={character.id}
              className={`characterCard ${
                selectedCharacter.id ===
                character.id
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setSelectedCharacter(character)
              }
            >
              <div className="characterEmoji">
                {emojis[character.id]}
              </div>

              <div className="characterName">
                {character.name}
              </div>

              <div className="characterElo">
                {character.elo} Elo
              </div>

              <div className="characterPersonality">
                {character.personality}
              </div>

              <div className="characterOpening">
                {character.openingBook
                  .slice(0, 3)
                  .join(" • ")}
              </div>
            </div>
          ))}

        </div>

        <button
          className="startCharacterGame"
          onClick={startGame}
        >
          Challenge {selectedCharacter.name}
        </button>

      </div>
    </main>
  );
}