"use client";

interface ReviewPopupProps {
isOpen: boolean;
onClose: () => void;

accuracy: number;
bestMoves: number;
brilliantMoves: number;
mistakes: number;
blunders: number;

onAnalyze: () => void;
onNewGame: () => void;
onDownloadPGN: () => void;
}

export default function ReviewPopup({
isOpen,
onClose,
accuracy,
bestMoves,
brilliantMoves,
mistakes,
blunders,
onAnalyze,
onNewGame,
onDownloadPGN,
}: ReviewPopupProps) {
if (!isOpen) return null;

return ( <div className="reviewOverlay"> <div className="reviewPopup"> <h2 className="reviewTitle">
Game Review </h2>

```
    <div className="accuracySection">
      <span className="accuracyLabel">
        Accuracy
      </span>

      <div className="accuracyValue">
        {accuracy}%
      </div>
    </div>

    <div className="statsGrid">
      <div className="statCard">
        <span>Best Moves</span>
        <strong>{bestMoves}</strong>
      </div>

      <div className="statCard">
        <span>Brilliant Moves</span>
        <strong>{brilliantMoves}</strong>
      </div>

      <div className="statCard">
        <span>Mistakes</span>
        <strong>{mistakes}</strong>
      </div>

      <div className="statCard">
        <span>Blunders</span>
        <strong>{blunders}</strong>
      </div>
    </div>

    <div className="reviewButtons">
      <button
        className="analyzeBtn"
        onClick={onAnalyze}
      >
        Analyze on Lichess
      </button>

      <button
        className="downloadBtn"
        onClick={onDownloadPGN}
      >
        Download PGN
      </button>

      <button
        className="newGamePopupBtn"
        onClick={onNewGame}
      >
        Start New Game
      </button>

      <button
        className="closeBtn"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
</div>

);
}
