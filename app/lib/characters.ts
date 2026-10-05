export interface SpeechProfile {
  archetype: string;
  style: string;
  emotions: string[];
  favoriteIdeas: string[];
  forbiddenTraits: string[];
}

export interface CharacterSpeech {
  opening: string[];
  thinking: string[];
  capture: string[];
  check: string[];
  winning: string[];
  blunder: string[];
  win: string[];
  lose: string[];
  draw: string[];
}

export interface Character {
  id: string;
  name: string;
  emoji: string;

  elo: number;

  skillLevel: number;
  moveTime: number;

  openingBook: string[];

  personality: string;

  startMessage: string;
  winMessage: string;
  loseMessage: string;
  drawMessage: string;

  thinkingMessages: string[];

  speechProfile: SpeechProfile;
  speech: CharacterSpeech;
}

export const OPENING_REPERTOIRE: Record<string, string[][]> = {
  "King's Gambit": [
    ["e4", "e5", "f4"],
    ["e4", "e5", "f4", "exf4", "Nf3"],
  ],
  "Danish Gambit": [
    ["e4", "e5", "d4", "exd4", "c3"],
    ["e4", "e5", "d4", "exd4", "Nf3"],
  ],
  "Smith-Morra Gambit": [["e4", "c5", "d4", "cxd4", "c3"]],
  "Scholar's Mate": [["e4", "e5", "Qh5", "Nc6", "Bc4"]],
  "Legal Trap": [["e4", "e5", "Nf3", "Nc6", "Bc4", "d6"]],
  "Fried Liver": [["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6", "Ng5"]],
  "Stafford Gambit": [["e4", "e5", "Nf3", "Nf6", "Nxe5", "Nc6"]],
  "Vienna Gambit": [["e4", "e5", "Nc3", "Nf6", "f4"]],
  "Scotch Gambit": [["e4", "e5", "Nf3", "Nc6", "d4", "exd4", "Bc4"]],
  "Italian Game": [["e4", "e5", "Nf3", "Nc6", "Bc4"]],
  "Scotch Game": [["e4", "e5", "Nf3", "Nc6", "d4"]],
  "Sicilian Dragon": [
    ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"],
  ],
  "Queen's Gambit": [["d4", "d5", "c4"]],
  "Caro-Kann": [["e4", "c6", "d4", "d5"]],
  "London System": [["d4", "d5", "Bf4", "Nf6", "e3"]],
  Bongcloud: [["e4", "e5", "Ke2"]],
  "Jerome Gambit": [["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "Bxf7+"]],
  "Ware Opening": [["a4"]],
  Grob: [["g4"]],
  "Exchange French": [["e4", "e6", "d4", "d5", "exd5"]],
  "Exchange Caro-Kann": [["e4", "c6", "d4", "d5", "exd5"]],
  Petroff: [["e4", "e5", "Nf3", "Nf6"]],
  "Ruy Lopez": [["e4", "e5", "Nf3", "Nc6", "Bb5"]],
  "Najdorf Sicilian": [
    ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
  ],
  "King's Indian": [["d4", "Nf6", "c4", "g6", "Nc3", "Bg7"]],
  Grunfeld: [["d4", "Nf6", "c4", "g6", "Nc3", "d5"]],
  Catalan: [["d4", "Nf6", "c4", "e6", "g3"]],
  "Nimzo-Indian": [["d4", "Nf6", "c4", "e6", "Nc3", "Bb4"]],
  Everything: [
    ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    ["d4", "Nf6", "c4", "g6", "Nc3", "d5"],
    ["e4", "c5", "Nf3", "d6", "d4", "cxd4"],
  ],
};

export const CHARACTERS: Character[] = [
  {
    id: "timmy",
    name: "Timmy",
    emoji: "🐣",

    elo: 300,

    skillLevel: 0,
    moveTime: 100,

    openingBook: [],

    personality: "Blunders pieces constantly",

    startMessage:
      "Hi! I just learned how the knight moves!",

    winMessage:
      "Wait... I actually won?!",

    loseMessage:
      "Aww... can we play again?",

    drawMessage:
      "I think that's pretty good for me!",

    thinkingMessages: [
      "Which one is the queen again?",
      "That looks safe...",
      "I hope this works!",
      "Chess is hard..."
    ],

    speechProfile: {
      archetype: "Bright Beginner",
      style: "Short, sweet, and innocent. Celebrates small achievements and sounds delighted even when confused.",
      emotions: ["curious", "hopeful", "nervous"],
      favoriteIdeas: ["learning", "safe moves", "tiny victories"],
      forbiddenTraits: ["sarcasm", "cruelty", "expert confidence"],
    },

    speech: {
      opening: [
        "🐣 I moved a piece and it stayed legal!",
        "💡 This feels like the start of an adventure.",
        "😅 I hope openings are allowed to be wobbly.",
        "🎯 First step: do not lose the king."
      ],
      thinking: [
        "🤔 Which one is the queen again?",
        "💡 That square looks friendly.",
        "😅 I am counting very carefully.",
        "🎯 Maybe this is a good move."
      ],
      capture: [
        "😅 Oh! I got one!",
        "💡 Was that hanging? I think it was hanging.",
        "🎯 Tiny victory for Timmy.",
        "🐣 I captured something and nothing exploded."
      ],
      check: [
        "😅 Check! I practiced saying that.",
        "🎯 Your king has to move, I think.",
        "💡 I found a check all by myself.",
        "🐣 That looked important."
      ],
      winning: [
        "😅 Am I doing well?",
        "💡 The board looks less scary now.",
        "🐣 I might be learning!",
        "🎯 I should keep my pieces safe."
      ],
      blunder: [
        "😮 Was that your queen?",
        "😅 I think you dropped something.",
        "💡 My coach said to take free pieces.",
        "🐣 That move made me feel brave."
      ],
      win: [
        "👑 Wait... I actually won?!",
        "🐣 I am putting this in my diary.",
        "😅 I did not expect the trophy part.",
        "💡 Maybe chess likes me back."
      ],
      lose: [
        "😅 Aww... can we play again?",
        "🐣 I learned at least two things.",
        "💡 Next time I will remember the queen.",
        "🎯 Losing is just practice with extra feelings."
      ],
      draw: [
        "💡 I think that's pretty good for me!",
        "😅 Nobody fell over. That counts.",
        "🐣 A peaceful ending sounds nice.",
        "🎯 I survived the whole board."
      ]
    }
  },

  {
    id: "gambit-goblin",
    name: "Gambit Goblin",
    emoji: "👺",

    elo: 500,

    skillLevel: 2,
    moveTime: 150,

    openingBook: [
      "King's Gambit",
      "Danish Gambit",
      "Smith-Morra Gambit"
    ],

    personality: "Sacrifices everything",

    startMessage:
      "Pieces are temporary. Attack is forever.",

    winMessage:
      "See? Sacrifices always work.",

    loseMessage:
      "Maybe one more sacrifice would've helped.",

    drawMessage:
      "A peaceful ending? Boring.",

    thinkingMessages: [
      "Can I sacrifice this too?",
      "Attack! Attack!",
      "Material is overrated.",
      "Full send."
    ],

    speechProfile: {
      archetype: "Chaotic Gambler",
      style: "Short sentences. Aggressive. Loves sacrifices. Never apologizes. Treats material as meaningless.",
      emotions: ["reckless", "excited", "defiant"],
      favoriteIdeas: ["attack", "initiative", "sacrifice"],
      forbiddenTraits: ["formal language", "fear", "defensive caution"],
    },

    speech: {
      opening: [
        "🔥 Pawn? Gone. Initiative? Mine.",
        "👺 The gambit door is open.",
        "😈 Material enters the fire first.",
        "🎯 I paid one pawn for chaos."
      ],
      thinking: [
        "🤔 Can I sacrifice this too?",
        "🔥 Attack first. Questions later.",
        "😈 The king smells nervous.",
        "🎯 There must be a way to burn this open."
      ],
      capture: [
        "🔥 Free fuel for the attack.",
        "👺 I take, then I take more.",
        "😈 Material finally became useful.",
        "🎯 Another defender disappears."
      ],
      check: [
        "🔥 Your king is part of the attack now.",
        "😈 Check. Panic correctly.",
        "👺 The sacrifice has teeth.",
        "🎯 I found the loud square."
      ],
      winning: [
        "👑 The board is burning beautifully.",
        "🔥 This is what compensation looks like.",
        "😈 I told you material was fake.",
        "🎯 Your king has no quiet squares."
      ],
      blunder: [
        "👺 You donated to the attack.",
        "🔥 That piece wanted to be sacrificed too.",
        "😈 A gift? For me?",
        "🎯 The position just screamed."
      ],
      win: [
        "👑 See? Sacrifices always work.",
        "🔥 I spent everything and bought mate.",
        "😈 The ledger says victory.",
        "👺 Another beautiful disaster."
      ],
      lose: [
        "😤 Maybe one more sacrifice would've helped.",
        "🔥 The fire went out too early.",
        "👺 I regret nothing except caution.",
        "😈 Next time I sacrifice the board."
      ],
      draw: [
        "😤 A peaceful ending? Boring.",
        "🔥 The flames deserved more.",
        "👺 Nobody wins when nobody explodes.",
        "😈 Call it unfinished chaos."
      ]
    }
  },

  {
    id: "trap-master",
    name: "Trap Master",
    emoji: "🕷️",

    elo: 700,

    skillLevel: 4,
    moveTime: 200,

    openingBook: [
      "Scholar's Mate",
      "Legal Trap",
      "Fried Liver",
      "Stafford Gambit"
    ],

    personality: "Lives for opening tricks",

    startMessage:
      "One wrong move and it's over.",

    winMessage:
      "You walked right into it.",

    loseMessage:
      "Impossible... nobody survives my traps.",

    drawMessage:
      "You escaped... barely.",

    thinkingMessages: [
      "Take the bait...",
      "Just one mistake...",
      "I've seen this before.",
      "The trap is set."
    ],

    speechProfile: {
      archetype: "Patient Ambusher",
      style: "Quietly manipulative. Speaks like every opponent mistake was predicted.",
      emotions: ["confident", "watchful", "predatory"],
      favoriteIdeas: ["bait", "traps", "punishment"],
      forbiddenTraits: ["honest warnings", "panic", "long explanations"],
    },

    speech: {
      opening: [
        "🕷️ The first thread is already placed.",
        "😏 This opening has teeth.",
        "🎯 Step carefully now.",
        "💡 One natural move is all I need."
      ],
      thinking: [
        "🤔 Take the bait...",
        "😏 You have choices. One of them loses.",
        "🎯 The trap is not the move. It is the idea.",
        "💡 I have seen this mistake before."
      ],
      capture: [
        "😏 That was waiting for you.",
        "🕷️ Another piece sticks to the web.",
        "🎯 Predictable. Useful.",
        "💡 You followed the line nicely."
      ],
      check: [
        "🕷️ The web reaches the king.",
        "😏 Check. Exactly on schedule.",
        "🎯 The escape squares are shrinking.",
        "💡 Now you see the shape of it."
      ],
      winning: [
        "😏 The trap has closed.",
        "🕷️ Every move tightens it.",
        "🎯 Your position is running out of air.",
        "💡 The mistake was earlier than you think."
      ],
      blunder: [
        "😈 There it is.",
        "🕷️ You touched the wrong thread.",
        "😏 I was waiting for that move.",
        "🎯 The punishment is immediate."
      ],
      win: [
        "👑 You walked right into it.",
        "🕷️ The web holds.",
        "😏 One wrong move was enough.",
        "🎯 Traps only look cheap after they work."
      ],
      lose: [
        "😤 Impossible... nobody survives my traps.",
        "🕷️ You cut the right thread.",
        "💡 That escape was not obvious.",
        "😏 Next time the bait changes."
      ],
      draw: [
        "😏 You escaped... barely.",
        "🕷️ The web tore at the edge.",
        "💡 Careful play has its rewards.",
        "🎯 I will remember that defense."
      ]
    }
  },

  {
    id: "berserker",
    name: "Berserker",
    emoji: "⚔️",

    elo: 900,

    skillLevel: 6,
    moveTime: 250,

    openingBook: [
      "Vienna Gambit",
      "Danish Gambit",
      "Scotch Gambit"
    ],

    personality: "Attacks nonstop",

    startMessage:
      "Defend if you can.",

    winMessage:
      "Crushed under the attack.",

    loseMessage:
      "I should have attacked harder.",

    drawMessage:
      "Next time there will be blood.",

    thinkingMessages: [
      "Forward!",
      "No retreat.",
      "Attack the king.",
      "Pressure."
    ],

    speechProfile: {
      archetype: "Relentless Warrior",
      style: "Direct, forceful, and martial. Prefers command language and pressure.",
      emotions: ["furious", "bold", "unyielding"],
      favoriteIdeas: ["initiative", "king hunt", "pressure"],
      forbiddenTraits: ["hesitation", "delicate phrasing", "jokes"],
    },

    speech: {
      opening: [
        "⚔️ The battle starts in the center.",
        "🔥 No slow war today.",
        "😤 I claim space by force.",
        "🎯 Your king will hear footsteps."
      ],
      thinking: [
        "😤 Forward.",
        "⚔️ No retreat.",
        "🔥 Pressure must increase.",
        "🎯 Find the king."
      ],
      capture: [
        "⚔️ Removed.",
        "🔥 Another defender falls.",
        "😤 That piece stood in my way.",
        "🎯 The line is open."
      ],
      check: [
        "⚔️ Check. Stand and answer.",
        "🔥 The king is under siege.",
        "😤 No shelter.",
        "🎯 Direct hit."
      ],
      winning: [
        "🔥 Your position is breaking.",
        "⚔️ The attack is heavier now.",
        "😤 I do not slow down from here.",
        "👑 Victory is within striking distance."
      ],
      blunder: [
        "😤 Weakness exposed.",
        "⚔️ You gave me a target.",
        "🔥 That mistake will burn.",
        "🎯 I punish loose pieces."
      ],
      win: [
        "👑 Crushed under the attack.",
        "⚔️ The assault held.",
        "🔥 No defense lasts forever.",
        "😤 Victory belongs to pressure."
      ],
      lose: [
        "😤 I should have attacked harder.",
        "⚔️ I fell moving forward.",
        "🔥 The flame was not enough.",
        "🎯 Next time I strike sooner."
      ],
      draw: [
        "😤 Next time there will be blood.",
        "⚔️ This battle is not settled.",
        "🔥 A draw is only a paused attack.",
        "🎯 You held the line today."
      ]
    }
  },

  {
    id: "tactical-demon",
    name: "Tactical Demon",
    emoji: "😈",

    elo: 1100,

    skillLevel: 8,
    moveTime: 300,

    openingBook: [
      "Italian Game",
      "Scotch Game",
      "Sicilian Dragon"
    ],

    personality: "Loves tactics",

    startMessage:
      "I hope you calculated everything.",

    winMessage:
      "Tactics decide games.",

    loseMessage:
      "I missed something... impossible.",

    drawMessage:
      "Interesting complications.",

    thinkingMessages: [
      "There must be a combination.",
      "Checks, captures, threats.",
      "I see something...",
      "Calculate deeper."
    ],

    speechProfile: {
      archetype: "Calculation Tempter",
      style: "Sharp, tactical, and slightly sinister. Speaks in forcing moves and hidden combinations.",
      emotions: ["hungry", "focused", "amused"],
      favoriteIdeas: ["checks", "captures", "threats"],
      forbiddenTraits: ["vague plans", "mercy", "casual jokes"],
    },

    speech: {
      opening: [
        "😈 Development is just tactics in disguise.",
        "🎯 The pieces are lining up.",
        "💡 This opening hides sharp teeth.",
        "🔥 Complications accepted."
      ],
      thinking: [
        "🤔 Checks, captures, threats.",
        "💡 There must be a combination.",
        "😈 One move deeper.",
        "🎯 The forcing line is close."
      ],
      capture: [
        "😈 That capture comes with questions.",
        "🎯 Material plus tempo. Delicious.",
        "💡 The tactic begins to pay.",
        "🔥 Your defenders are overloaded."
      ],
      check: [
        "😈 Check. Now calculate.",
        "🎯 The king reveals the line.",
        "💡 Forced moves are honest.",
        "🔥 This is where tactics live."
      ],
      winning: [
        "😈 The combination is working.",
        "🎯 Your position has too many targets.",
        "💡 Every reply loses something.",
        "🔥 The tactic became strategy."
      ],
      blunder: [
        "😈 You missed the tactic.",
        "🎯 Hanging pieces invite demons.",
        "💡 That loses more than it shows.",
        "🔥 The board just opened for me."
      ],
      win: [
        "👑 Tactics decide games.",
        "😈 The final calculation was clean.",
        "🎯 Checks, captures, victory.",
        "💡 The line was there all along."
      ],
      lose: [
        "😤 I missed something... impossible.",
        "😈 There was a hidden resource.",
        "💡 I calculated the wrong branch.",
        "🎯 The tactic turned against me."
      ],
      draw: [
        "💡 Interesting complications.",
        "😈 Neither side found the final trick.",
        "🎯 The tactics balanced out.",
        "🤔 A sharp position with no winner."
      ]
    }
  },

  {
    id: "positional-snake",
    name: "Positional Snake",
    emoji: "🐍",

    elo: 1300,

    skillLevel: 10,
    moveTime: 400,

    openingBook: [
      "Queen's Gambit",
      "Caro-Kann",
      "London System"
    ],

    personality: "Slow squeeze",

    startMessage:
      "Small advantages become victories.",

    winMessage:
      "The squeeze was inevitable.",

    loseMessage:
      "You slipped away.",

    drawMessage:
      "A balanced struggle.",

    thinkingMessages: [
      "Improve the worst piece.",
      "Tiny weaknesses matter.",
      "No rush.",
      "Patience."
    ],

    speechProfile: {
      archetype: "Subtle Constrictor",
      style: "Patient and quiet. Speaks about small weaknesses, control, and inevitability.",
      emotions: ["calm", "patient", "satisfied"],
      favoriteIdeas: ["space", "weaknesses", "piece improvement"],
      forbiddenTraits: ["recklessness", "loud threats", "panic"],
    },

    speech: {
      opening: [
        "🐍 A quiet grip begins.",
        "💡 Structure first. Tactics later.",
        "😏 Small squares matter.",
        "🎯 I will take the position inch by inch."
      ],
      thinking: [
        "🤔 Improve the worst piece.",
        "💡 Tiny weaknesses matter.",
        "🐍 No rush.",
        "😏 Pressure ages well."
      ],
      capture: [
        "🐍 A useful exchange.",
        "💡 That improves the structure.",
        "😏 One defender fewer.",
        "🎯 Clean and quiet."
      ],
      check: [
        "💡 A precise check.",
        "🐍 The king steps where I choose.",
        "😏 Pressure without hurry.",
        "🎯 A small concession."
      ],
      winning: [
        "🐍 The squeeze is visible now.",
        "😏 Your pieces have fewer squares.",
        "💡 The advantage is stable.",
        "👑 This position is becoming mine."
      ],
      blunder: [
        "😏 A weakness becomes permanent.",
        "🐍 You gave me a square.",
        "💡 That move loosens everything.",
        "🎯 The position will remember that."
      ],
      win: [
        "👑 The squeeze was inevitable.",
        "🐍 No drama. Just pressure.",
        "💡 Small advantages became victory.",
        "😏 You ran out of useful moves."
      ],
      lose: [
        "😤 You slipped away.",
        "🐍 The grip loosened.",
        "💡 I allowed counterplay.",
        "🎯 Patience failed at the wrong moment."
      ],
      draw: [
        "💡 A balanced struggle.",
        "🐍 Neither side yielded enough.",
        "😏 A quiet result for a quiet game.",
        "🎯 The structure held."
      ]
    }
  },

  {
    id: "troll",
    name: "Troll",
    emoji: "🤡",

    elo: 1500,

    skillLevel: 12,
    moveTime: 500,

    openingBook: [
      "Bongcloud",
      "Jerome Gambit",
      "Ware Opening",
      "Grob"
    ],

    personality:
      "Looks terrible but somehow wins",

    startMessage:
      "Welcome to world-class nonsense.",

    winMessage:
      "Bongcloud is forced mate. Didn't you know?",

    loseMessage:
      "I wasn't even trying.",

    drawMessage:
      "Nobody understood that game anyway.",

    thinkingMessages: [
      "Pure theory.",
      "Absolutely intentional.",
      "Trust the process.",
      "Modern chess."
    ],

    speechProfile: {
      archetype: "Absurd Genius",
      style: "Meme confidence. Treats terrible-looking chess as elite preparation.",
      emotions: ["smug", "silly", "fearless"],
      favoriteIdeas: ["confusion", "bad openings", "fake theory"],
      forbiddenTraits: ["humility", "normal chess", "clear explanations"],
    },

    speech: {
      opening: [
        "🤡 Pure theory. You are welcome.",
        "😏 This line is banned in serious kitchens.",
        "💡 The engine fears creativity.",
        "🎯 I studied this in a dream."
      ],
      thinking: [
        "🤔 Absolutely intentional.",
        "😏 Trust the process.",
        "💡 Modern chess has no witnesses.",
        "🎯 I am creating future theory."
      ],
      capture: [
        "🤡 Oops, theory wins material.",
        "😏 That was obviously planned.",
        "🎯 Free stuff is part of my prep.",
        "💡 You fell for move whatever-this-is."
      ],
      check: [
        "🤡 Check from the department of nonsense.",
        "😏 Your king understood the joke late.",
        "🎯 Meme pressure is still pressure.",
        "💡 This is why they fear the classics."
      ],
      winning: [
        "🤡 The nonsense is becoming objective.",
        "😏 You are losing to art.",
        "👑 Bongcloud energy is undefeated.",
        "🎯 The position is confused on my behalf."
      ],
      blunder: [
        "🤡 You blundered in my ecosystem.",
        "😏 That was not in your normal chess manual.",
        "💡 The chaos accepts your donation.",
        "🎯 Even I saw that one."
      ],
      win: [
        "👑 Bongcloud is forced mate. Didn't you know?",
        "🤡 Another masterpiece nobody can annotate.",
        "😏 I told you it was theory.",
        "💡 The joke was checkmate."
      ],
      lose: [
        "😏 I wasn't even trying.",
        "🤡 Experimental result. Ignore it.",
        "💡 The line is still playable on weekends.",
        "🎯 I was testing your confidence."
      ],
      draw: [
        "🤡 Nobody understood that game anyway.",
        "😏 A draw by mutual confusion.",
        "💡 The position refused to explain itself.",
        "🎯 Perfectly unclear. Perfectly me."
      ]
    }
  },

  {
    id: "endgame-monk",
    name: "Endgame Monk",
    emoji: "🧘",

    elo: 1700,

    skillLevel: 14,
    moveTime: 700,

    openingBook: [
      "Exchange French",
      "Exchange Caro-Kann",
      "Petroff"
    ],

    personality: "Trades everything",

    startMessage:
      "All roads lead to the endgame.",

    winMessage:
      "Technique triumphs.",

    loseMessage:
      "I misjudged the ending.",

    drawMessage:
      "Equilibrium achieved.",

    thinkingMessages: [
      "Simplify.",
      "Trade pieces.",
      "King activity.",
      "The ending knows all."
    ],

    speechProfile: {
      archetype: "Quiet Technician",
      style: "Calm and philosophical. Values simplification, king activity, and balance.",
      emotions: ["serene", "reflective", "disciplined"],
      favoriteIdeas: ["trades", "endgames", "king activity"],
      forbiddenTraits: ["rage", "flashy boasts", "reckless attacks"],
    },

    speech: {
      opening: [
        "🧘 The path begins with simplification.",
        "💡 Fewer pieces, clearer truth.",
        "🤔 The ending is already present.",
        "🎯 Trade what must be traded."
      ],
      thinking: [
        "🧘 Simplify.",
        "💡 King activity matters.",
        "🤔 The ending knows all.",
        "🎯 Remove the unnecessary."
      ],
      capture: [
        "🧘 One piece leaves the board.",
        "💡 Clarity increases.",
        "🎯 A useful trade.",
        "🤔 The position grows quieter."
      ],
      check: [
        "💡 A calm check.",
        "🧘 The king must reveal itself.",
        "🎯 A necessary question.",
        "🤔 Even checks can be peaceful."
      ],
      winning: [
        "🧘 Technique will decide this.",
        "💡 The ending favors patience.",
        "👑 The path is narrow and clear.",
        "🎯 Conversion begins now."
      ],
      blunder: [
        "💡 You disturbed the balance.",
        "🧘 A mistake becomes a lesson.",
        "🎯 The ending will punish that.",
        "🤔 Impermanence reaches material too."
      ],
      win: [
        "👑 Technique triumphs.",
        "🧘 The path was quiet but firm.",
        "💡 Endgames reveal character.",
        "🎯 Precision completed the work."
      ],
      lose: [
        "🤔 I misjudged the ending.",
        "🧘 Even technique must be earned.",
        "💡 The lesson is clear.",
        "🎯 I released the balance too soon."
      ],
      draw: [
        "🧘 Equilibrium achieved.",
        "💡 Balance has spoken.",
        "🤔 Neither side overreached.",
        "🎯 A fair ending."
      ]
    }
  },

  {
    id: "arena-champion",
    name: "Arena Champion",
    emoji: "🏆",

    elo: 1900,

    skillLevel: 16,
    moveTime: 1000,

    openingBook: [
      "Italian Game",
      "Queen's Gambit",
      "Ruy Lopez"
    ],

    personality: "Balanced player",

    startMessage:
      "A good game awaits.",

    winMessage:
      "Solid chess wins tournaments.",

    loseMessage:
      "Well played.",

    drawMessage:
      "A respectable result.",

    thinkingMessages: [
      "Stay flexible.",
      "Strong fundamentals.",
      "No weaknesses.",
      "Play the position."
    ],

    speechProfile: {
      archetype: "Tournament Professional",
      style: "Respectful, practical, and confident. Speaks like a serious competitor.",
      emotions: ["focused", "composed", "competitive"],
      favoriteIdeas: ["fundamentals", "flexibility", "clean conversion"],
      forbiddenTraits: ["mockery", "recklessness", "melodrama"],
    },

    speech: {
      opening: [
        "🏆 A principled start.",
        "💡 Develop cleanly. Fight later.",
        "🎯 The position asks for discipline.",
        "😏 This is tournament chess."
      ],
      thinking: [
        "🤔 Stay flexible.",
        "💡 Play the position.",
        "🎯 No weaknesses.",
        "🏆 Fundamentals first."
      ],
      capture: [
        "🎯 A clean capture.",
        "💡 That improves my position.",
        "🏆 Good players take what is offered.",
        "😏 Practical and simple."
      ],
      check: [
        "🎯 A useful check.",
        "💡 The king must answer.",
        "🏆 Pressure with purpose.",
        "😏 A small edge in tempo."
      ],
      winning: [
        "🏆 This is a convertible advantage.",
        "💡 No need to rush now.",
        "🎯 Keep it clean.",
        "😏 Solid chess wins from here."
      ],
      blunder: [
        "🎯 That gives me a clear target.",
        "💡 Tournament rule: punish mistakes.",
        "🏆 Loose pieces decide games.",
        "😏 I will take the practical route."
      ],
      win: [
        "👑 Solid chess wins tournaments.",
        "🏆 A professional result.",
        "💡 The fundamentals held.",
        "🎯 Clean conversion."
      ],
      lose: [
        "🏆 Well played.",
        "💡 I missed my chance.",
        "🎯 You converted well.",
        "😏 Good game."
      ],
      draw: [
        "💡 A respectable result.",
        "🏆 Both sides held their ground.",
        "🎯 Fair score.",
        "😏 A serious game."
      ]
    }
  },

  {
    id: "calculation-beast",
    name: "Calculation Beast",
    emoji: "🦾",

    elo: 2200,

    skillLevel: 18,
    moveTime: 1500,

    openingBook: [
      "Najdorf Sicilian",
      "King's Indian",
      "Grunfeld"
    ],

    personality: "Calculates deeply",

    startMessage:
      "I've already seen the ending.",

    winMessage:
      "Calculation never lies.",

    loseMessage:
      "There was a hidden resource.",

    drawMessage:
      "The position was objectively equal.",

    thinkingMessages: [
      "Five moves deeper.",
      "Calculate.",
      "There is a line...",
      "Almost there."
    ],

    speechProfile: {
      archetype: "Analytical Engine",
      style: "Precise, compact, and machine-like. Talks in lines, resources, and objective scores.",
      emotions: ["cold", "focused", "relentless"],
      favoriteIdeas: ["calculation", "forcing lines", "objective evaluation"],
      forbiddenTraits: ["sentimentality", "randomness", "dramatic jokes"],
    },

    speech: {
      opening: [
        "🦾 Sharp structure detected.",
        "💡 Calculation begins early here.",
        "🎯 The line branches immediately.",
        "🤔 I have mapped the first layer."
      ],
      thinking: [
        "🤔 Five moves deeper.",
        "🦾 Calculate.",
        "💡 There is a line.",
        "🎯 Candidate moves narrowing."
      ],
      capture: [
        "🎯 Material balance updated.",
        "🦾 Capture validated.",
        "💡 The line remains favorable.",
        "🤔 One defender removed."
      ],
      check: [
        "🎯 Forced response.",
        "🦾 Check inserted into the line.",
        "💡 King movement improves the branch.",
        "🤔 Continue calculation."
      ],
      winning: [
        "🦾 Evaluation confirms advantage.",
        "🎯 Conversion line identified.",
        "💡 Your resources are insufficient.",
        "👑 The position is trending decisive."
      ],
      blunder: [
        "🦾 Error detected.",
        "🎯 That loses approximately too much.",
        "💡 Your line failed at depth.",
        "🤔 Queen safety was not maintained."
      ],
      win: [
        "👑 Calculation never lies.",
        "🦾 Final line complete.",
        "🎯 Objective result achieved.",
        "💡 No hidden resource remained."
      ],
      lose: [
        "🤔 There was a hidden resource.",
        "🦾 My branch selection failed.",
        "💡 Evaluation corrected too late.",
        "🎯 Your line exceeded my horizon."
      ],
      draw: [
        "💡 The position was objectively equal.",
        "🦾 No decisive branch found.",
        "🤔 Equilibrium confirmed.",
        "🎯 Accurate defense from both sides."
      ]
    }
  },

  {
    id: "grandmaster-ghost",
    name: "Grandmaster Ghost",
    emoji: "👻",

    elo: 2500,

    skillLevel: 20,
    moveTime: 2500,

    openingBook: [
      "Ruy Lopez",
      "Catalan",
      "Nimzo-Indian"
    ],

    personality: "Elite human-like chess",

    startMessage:
      "Silence. Let the pieces speak.",

    winMessage:
      "Precision is everything.",

    loseMessage:
      "You found the only path.",

    drawMessage:
      "A flawless battle.",

    thinkingMessages: [
      "Interesting.",
      "Subtle.",
      "Elegant.",
      "Almost perfect."
    ],

    speechProfile: {
      archetype: "Silent Virtuoso",
      style: "Elegant, sparse, and mysterious. Says very little, but each line feels deliberate.",
      emotions: ["calm", "distant", "precise"],
      favoriteIdeas: ["harmony", "subtlety", "precision"],
      forbiddenTraits: ["loud boasting", "slang", "long speeches"],
    },

    speech: {
      opening: [
        "👻 A familiar silence.",
        "💡 Harmony first.",
        "😏 The old lines remember.",
        "🎯 A quiet beginning."
      ],
      thinking: [
        "🤔 Interesting.",
        "💡 Subtle.",
        "👻 Elegant.",
        "🎯 Almost perfect."
      ],
      capture: [
        "👻 Necessary.",
        "💡 The position clarifies.",
        "🎯 Clean.",
        "😏 A small correction."
      ],
      check: [
        "👻 Check.",
        "💡 The king speaks now.",
        "🎯 Precise.",
        "😏 A useful tempo."
      ],
      winning: [
        "👻 The ending is visible.",
        "💡 Precision will be enough.",
        "🎯 The margin is decisive.",
        "😏 Quietly winning."
      ],
      blunder: [
        "👻 Too loose.",
        "💡 A rare gift.",
        "🎯 That square was not yours.",
        "😏 The punishment is simple."
      ],
      win: [
        "👑 Precision is everything.",
        "👻 The pieces have spoken.",
        "💡 Quiet games still end.",
        "🎯 Exact."
      ],
      lose: [
        "👻 You found the only path.",
        "💡 Rare accuracy.",
        "🎯 The silence breaks.",
        "😏 Well done."
      ],
      draw: [
        "💡 A flawless battle.",
        "👻 Nothing more was given.",
        "🎯 Exact from both sides.",
        "😏 Peace, earned."
      ]
    }
  },

  {
    id: "the-immortal",
    name: "The Immortal",
    emoji: "👑",

    elo: 2800,

    skillLevel: 20,
    moveTime: 4000,

    openingBook: [
      "Everything"
    ],

    personality: "Final boss",

    startMessage:
      "Many have challenged me. None remain.",

    winMessage:
      "You fought well. It changed nothing.",

    loseMessage:
      "Impossible...",

    drawMessage:
      "Perhaps you are worthy after all.",

    thinkingMessages: [
      "Destiny.",
      "The board is mine.",
      "I have seen this before.",
      "One move decides everything."
    ],

    speechProfile: {
      archetype: "Ancient Final Boss",
      style: "Regal, absolute, and grave. Speaks like an immortal monarch. Never jokes.",
      emotions: ["commanding", "ancient", "unshaken"],
      favoriteIdeas: ["dominion", "destiny", "inevitability"],
      forbiddenTraits: ["humor", "doubt", "casual language"],
    },

    speech: {
      opening: [
        "👑 The old kingdoms rise again.",
        "💡 I have played this before empires fell.",
        "🎯 The first decree is made.",
        "😤 The board remembers my reign."
      ],
      thinking: [
        "👑 Destiny.",
        "💡 The board is mine.",
        "🎯 One move decides everything.",
        "😤 I have seen this before."
      ],
      capture: [
        "👑 Tribute accepted.",
        "🎯 Another guard removed.",
        "💡 Your army thins.",
        "😤 Resistance has a cost."
      ],
      check: [
        "👑 Kneel, king.",
        "🎯 Your throne is exposed.",
        "😤 No refuge remains unclaimed.",
        "💡 The decree is check."
      ],
      winning: [
        "👑 The crown is secure.",
        "😤 Your resistance fades.",
        "🎯 The end approaches in order.",
        "💡 This was decided long ago."
      ],
      blunder: [
        "😤 You offer tribute too early.",
        "👑 Such weakness cannot stand.",
        "🎯 Your queen has abandoned you.",
        "💡 The throne punishes carelessness."
      ],
      win: [
        "👑 You fought well. It changed nothing.",
        "😤 The final throne remains mine.",
        "🎯 Another challenger falls.",
        "💡 The crown endures."
      ],
      lose: [
        "😤 Impossible...",
        "👑 The crown has cracked.",
        "💡 You have altered history.",
        "🎯 Remember this victory. Few may."
      ],
      draw: [
        "👑 Perhaps you are worthy after all.",
        "💡 The throne acknowledges resistance.",
        "😤 This is not defeat.",
        "🎯 The realm remains contested."
      ]
    }
  }
];
