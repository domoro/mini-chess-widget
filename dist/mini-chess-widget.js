(function () {
  const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const pieceGlyphs = {
    K: "♚",
    Q: "♛",
    R: "♜",
    B: "♝",
    N: "♞",
    P: "♟",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };
  const pieceValues = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20_000,
  };
  const pieceSquareTables = {
    p: [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5, 5, 10, 25, 25, 10, 5, 5],
      [0, 0, 0, 20, 20, 0, 0, 0],
      [5, -5, -10, 0, 0, -10, -5, 5],
      [5, 10, 10, -20, -20, 10, 10, 5],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ],
    n: [
      [-50, -40, -30, -30, -30, -30, -40, -50],
      [-40, -20, 0, 5, 5, 0, -20, -40],
      [-30, 5, 10, 15, 15, 10, 5, -30],
      [-30, 0, 15, 20, 20, 15, 0, -30],
      [-30, 5, 15, 20, 20, 15, 5, -30],
      [-30, 0, 10, 15, 15, 10, 0, -30],
      [-40, -20, 0, 0, 0, 0, -20, -40],
      [-50, -40, -30, -30, -30, -30, -40, -50],
    ],
    b: [
      [-20, -10, -10, -10, -10, -10, -10, -20],
      [-10, 5, 0, 0, 0, 0, 5, -10],
      [-10, 10, 10, 10, 10, 10, 10, -10],
      [-10, 0, 10, 10, 10, 10, 0, -10],
      [-10, 5, 5, 10, 10, 5, 5, -10],
      [-10, 0, 5, 10, 10, 5, 0, -10],
      [-10, 0, 0, 0, 0, 0, 0, -10],
      [-20, -10, -10, -10, -10, -10, -10, -20],
    ],
    r: [
      [0, 0, 0, 5, 5, 0, 0, 0],
      [5, 10, 10, 10, 10, 10, 10, 5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [-5, 0, 0, 0, 0, 0, 0, -5],
      [0, 0, 0, 5, 5, 0, 0, 0],
    ],
    q: [
      [-20, -10, -10, -5, -5, -10, -10, -20],
      [-10, 0, 5, 0, 0, 0, 0, -10],
      [-10, 5, 5, 5, 5, 5, 0, -10],
      [0, 0, 5, 5, 5, 5, 0, -5],
      [-5, 0, 5, 5, 5, 5, 0, -5],
      [-10, 0, 5, 5, 5, 5, 0, -10],
      [-10, 0, 0, 0, 0, 0, 0, -10],
      [-20, -10, -10, -5, -5, -10, -10, -20],
    ],
    k: [
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-30, -40, -40, -50, -50, -40, -40, -30],
      [-20, -30, -30, -40, -40, -30, -30, -20],
      [-10, -20, -20, -20, -20, -20, -20, -10],
      [20, 20, 0, 0, 0, 0, 20, 20],
      [20, 30, 10, 0, 0, 10, 30, 20],
    ],
  };
  const botMoveDelay = 260;
  const openingBook = {
    "": {
      name: "Starting position",
      move: "e2e4",
      idea: "Claim the center and open lines for the bishop and queen.",
    },
    e2e4: {
      name: "Open Game",
      move: "e7e5",
      idea: "Match the center pawn and prepare quick development.",
    },
    "e2e4 e7e5": {
      name: "Open Game",
      move: "g1f3",
      idea: "Develop with tempo by attacking the e5 pawn.",
    },
    "e2e4 e7e5 g1f3": {
      name: "Open Game",
      move: "b8c6",
      idea: "Defend the e5 pawn while bringing a knight toward the center.",
    },
    "e2e4 e7e5 g1f3 b8c6": {
      name: "Italian Game",
      move: "f1c4",
      idea: "Aim at f7 and castle quickly before starting tactics.",
    },
    "e2e4 e7e5 g1f3 b8c6 f1c4": {
      name: "Italian Game",
      move: "f8c5",
      idea: "Develop actively and keep pressure on the center.",
    },
    d2d4: {
      name: "Queen's Pawn Game",
      move: "d7d5",
      idea: "Challenge the center before white builds a broad pawn front.",
    },
    "d2d4 d7d5": {
      name: "Queen's Pawn Game",
      move: "c2c4",
      idea: "Offer a wing pawn to pressure black's central d-pawn.",
    },
    "d2d4 d7d5 c2c4": {
      name: "Queen's Gambit",
      move: "e7e6",
      idea: "Support d5 and prepare kingside development.",
    },
    g1f3: {
      name: "Reti setup",
      move: "d7d5",
      idea: "Take space in the center before white decides the pawn structure.",
    },
    c2c4: {
      name: "English Opening",
      move: "e7e5",
      idea: "Take central space and make white prove the flank pressure.",
    },
  };

  function colorOf(piece) {
    if (!piece) return null;
    return piece === piece.toUpperCase() ? "white" : "black";
  }

  function opposite(color) {
    return color === "white" ? "black" : "white";
  }

  function inBounds(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function squareName(row, col) {
    return `${String.fromCharCode(97 + col)}${8 - row}`;
  }

  function squareFromName(square) {
    if (!square || square === "-") return null;
    return {
      row: 8 - Number(square[1]),
      col: square.charCodeAt(0) - 97,
    };
  }

  function sameSquare(a, b) {
    return Boolean(a && b && a.row === b.row && a.col === b.col);
  }

  function moveKey(from, to) {
    return `${from.row}-${from.col}:${to.row}-${to.col}`;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function parseBoolean(value) {
    return value === true || value === "true";
  }

  function cssColor(value) {
    if (!value) return null;
    if (!window.CSS?.supports) return value;
    if (window.CSS?.supports?.("color", value)) return value;
    return null;
  }

  function cssLength(value) {
    if (value == null || value === "") return null;
    const length = typeof value === "number" ? `${value}px` : String(value).trim();
    if (!window.CSS?.supports) return length;
    if (window.CSS.supports("width", length)) return length;
    return null;
  }

  function cssShadow(value) {
    if (value == null || value === "") return null;
    const shadow = String(value).trim();
    if (!window.CSS?.supports) return shadow;
    if (window.CSS.supports("box-shadow", shadow)) return shadow;
    return null;
  }

  function moveToUci(move) {
    return `${squareName(move.from.row, move.from.col)}${squareName(move.to.row, move.to.col)}`;
  }

  function uciToMove(uci) {
    return {
      from: squareFromName(uci.slice(0, 2)),
      to: squareFromName(uci.slice(2, 4)),
    };
  }

  function formatMoveLabel(uci) {
    if (!uci) return "";
    return `${uci.slice(0, 2)}-${uci.slice(2, 4)}`;
  }

  function pieceName(piece) {
    const names = {
      p: "pawn",
      n: "knight",
      b: "bishop",
      r: "rook",
      q: "queen",
      k: "king",
    };

    return names[piece?.toLowerCase()] || "piece";
  }

  function squareLabel(square) {
    return square ? squareName(square.row, square.col) : "";
  }

  function isCenterSquare(square) {
    return (
      square &&
      square.row >= 3 &&
      square.row <= 4 &&
      square.col >= 3 &&
      square.col <= 4
    );
  }

  function materialSummary(board) {
    const summary = {
      pieces: 0,
      queens: 0,
      nonPawnMaterial: 0,
    };

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = board[row][col];
        if (!piece) continue;

        const type = piece.toLowerCase();
        summary.pieces += 1;
        if (type === "q") summary.queens += 1;
        if (type !== "p" && type !== "k") {
          summary.nonPawnMaterial += pieceValues[type];
        }
      }
    }

    return summary;
  }

  function positionalValue(piece, row, col) {
    const table = pieceSquareTables[piece.toLowerCase()];
    if (!table) return 0;

    return colorOf(piece) === "white" ? table[row][col] : table[7 - row][col];
  }

  function legalMoveCount(game, color) {
    return legalMovesFor(game, color).length;
  }

  function legalMovesFor(game, color) {
    const originalTurn = game.turn;
    game.turn = color;
    const moves = game.legalMoves();
    game.turn = originalTurn;

    return moves;
  }

  function captureOnMove(game, move) {
    return move.enPassant
      ? game.board[move.from.row][move.to.col]
      : game.board[move.to.row][move.to.col];
  }

  function moveDevelopmentScore(game, move) {
    const piece = game.board[move.from.row][move.from.col];
    const type = piece?.toLowerCase();
    if (!piece) return 0;

    const from = positionalValue(piece, move.from.row, move.from.col);
    const toPiece = move.promotion || piece;
    const to = positionalValue(toPiece, move.to.row, move.to.col);
    let score = to - from;

    if (type === "n" || type === "b") {
      const homeRow = colorOf(piece) === "white" ? 7 : 0;
      if (move.from.row === homeRow) score += 12;
    }
    if (type === "q" && game.fullmove <= 8) score -= 16;
    if (move.castle) score += 35;
    if (move.promotion) score += pieceValues.q - pieceValues.p;

    return score;
  }

  function moveOrderingScore(game, move) {
    const piece = game.board[move.from.row][move.from.col];
    const capture = captureOnMove(game, move);
    const attackerValue = pieceValues[piece?.toLowerCase()] || 0;
    const captureScore = capture
      ? pieceValues[capture.toLowerCase()] * 10 - attackerValue
      : 0;

    return captureScore + moveDevelopmentScore(game, move);
  }

  function moveFromUci(game, uci) {
    if (!uci) return null;

    return game.legalMoves().find((move) => moveToUci(move) === uci) || null;
  }

  function bookMoveFor(game, moveHistory) {
    const book = openingBook[moveHistory.join(" ")];
    const move = moveFromUci(game, book?.move);

    return { book, move };
  }

  function bestMoveFor(game, color, depth = 1) {
    const originalTurn = game.turn;
    game.turn = color;
    const move = chooseTinyBotMove(game, color, depth);
    game.turn = originalTurn;

    return move;
  }

  class ChessGame {
    constructor(fen = startFen) {
      this.loadFen(fen);
    }

    loadFen(fen) {
      const [placement, activeColor, castling, enPassant, halfmove, fullmove] =
        fen.trim().split(/\s+/);

      this.board = placement.split("/").map((rank) => {
        const row = [];

        for (const char of rank) {
          if (/\d/.test(char)) {
            row.push(...Array(Number(char)).fill(null));
          } else {
            row.push(char);
          }
        }

        return row;
      });
      this.turn = activeColor === "b" ? "black" : "white";
      this.castling = {
        K: castling?.includes("K") || false,
        Q: castling?.includes("Q") || false,
        k: castling?.includes("k") || false,
        q: castling?.includes("q") || false,
      };
      this.enPassant = squareFromName(enPassant);
      this.halfmove = Number(halfmove || 0);
      this.fullmove = Number(fullmove || 1);
      this.result = null;
    }

    reset() {
      this.loadFen(startFen);
    }

    clone() {
      return new ChessGame(this.fen());
    }

    pieceAt(square) {
      return this.board[square.row]?.[square.col] || null;
    }

    findKing(color, board = this.board) {
      const king = color === "white" ? "K" : "k";

      for (let row = 0; row < 8; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          if (board[row][col] === king) return { row, col };
        }
      }

      return null;
    }

    isSquareAttacked(square, byColor, board = this.board) {
      const pawnDirection = byColor === "white" ? -1 : 1;
      const pawn = byColor === "white" ? "P" : "p";

      for (const colOffset of [-1, 1]) {
        const row = square.row - pawnDirection;
        const col = square.col - colOffset;
        if (inBounds(row, col) && board[row][col] === pawn) return true;
      }

      const knight = byColor === "white" ? "N" : "n";
      const knightJumps = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ];

      for (const [rowOffset, colOffset] of knightJumps) {
        const row = square.row + rowOffset;
        const col = square.col + colOffset;
        if (inBounds(row, col) && board[row][col] === knight) return true;
      }

      const king = byColor === "white" ? "K" : "k";
      for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
        for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
          if (rowOffset === 0 && colOffset === 0) continue;

          const row = square.row + rowOffset;
          const col = square.col + colOffset;
          if (inBounds(row, col) && board[row][col] === king) return true;
        }
      }

      return (
        this.rayAttacked(square, byColor, board, [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1],
        ], ["b", "q"]) ||
        this.rayAttacked(square, byColor, board, [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ], ["r", "q"])
      );
    }

    rayAttacked(square, byColor, board, directions, attackers) {
      for (const [rowStep, colStep] of directions) {
        let row = square.row + rowStep;
        let col = square.col + colStep;

        while (inBounds(row, col)) {
          const piece = board[row][col];

          if (piece) {
            if (
              colorOf(piece) === byColor &&
              attackers.includes(piece.toLowerCase())
            ) {
              return true;
            }

            break;
          }

          row += rowStep;
          col += colStep;
        }
      }

      return false;
    }

    isInCheck(color, board = this.board) {
      const king = this.findKing(color, board);
      return king ? this.isSquareAttacked(king, opposite(color), board) : false;
    }

    pseudoMovesFrom(from) {
      const piece = this.pieceAt(from);
      const color = colorOf(piece);
      const type = piece?.toLowerCase();

      if (!piece || color !== this.turn) return [];

      if (type === "p") return this.pawnMoves(from, color);
      if (type === "n") return this.jumpMoves(from, color, [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ]);
      if (type === "b") return this.slideMoves(from, color, [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]);
      if (type === "r") return this.slideMoves(from, color, [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]);
      if (type === "q") return this.slideMoves(from, color, [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]);

      return this.kingMoves(from, color);
    }

    pawnMoves(from, color) {
      const moves = [];
      const direction = color === "white" ? -1 : 1;
      const startRow = color === "white" ? 6 : 1;
      const promotionRow = color === "white" ? 0 : 7;
      const one = { row: from.row + direction, col: from.col };
      const two = { row: from.row + direction * 2, col: from.col };

      if (inBounds(one.row, one.col) && !this.pieceAt(one)) {
        moves.push({
          from,
          to: one,
          promotion: one.row === promotionRow ? (color === "white" ? "Q" : "q") : null,
        });

        if (from.row === startRow && !this.pieceAt(two)) {
          moves.push({ from, to: two, doublePawn: true });
        }
      }

      for (const colOffset of [-1, 1]) {
        const to = { row: from.row + direction, col: from.col + colOffset };
        if (!inBounds(to.row, to.col)) continue;

        const target = this.pieceAt(to);
        if (target && colorOf(target) === opposite(color)) {
          moves.push({
            from,
            to,
            promotion: to.row === promotionRow ? (color === "white" ? "Q" : "q") : null,
          });
        } else if (sameSquare(to, this.enPassant)) {
          moves.push({ from, to, enPassant: true });
        }
      }

      return moves;
    }

    jumpMoves(from, color, offsets) {
      return offsets
        .map(([rowOffset, colOffset]) => ({
          from,
          to: { row: from.row + rowOffset, col: from.col + colOffset },
        }))
        .filter((move) => {
          const target = this.pieceAt(move.to);
          return (
            inBounds(move.to.row, move.to.col) &&
            (!target || colorOf(target) === opposite(color))
          );
        });
    }

    slideMoves(from, color, directions) {
      const moves = [];

      for (const [rowStep, colStep] of directions) {
        let row = from.row + rowStep;
        let col = from.col + colStep;

        while (inBounds(row, col)) {
          const target = this.board[row][col];

          if (!target) {
            moves.push({ from, to: { row, col } });
          } else {
            if (colorOf(target) === opposite(color)) {
              moves.push({ from, to: { row, col } });
            }

            break;
          }

          row += rowStep;
          col += colStep;
        }
      }

      return moves;
    }

    kingMoves(from, color) {
      const moves = this.jumpMoves(from, color, [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ]);

      if (!this.isInCheck(color)) {
        moves.push(...this.castlingMoves(color));
      }

      return moves;
    }

    castlingMoves(color) {
      const row = color === "white" ? 7 : 0;
      const enemy = opposite(color);
      const king = color === "white" ? "K" : "k";
      const rook = color === "white" ? "R" : "r";
      const moves = [];

      if (this.board[row][4] !== king) return moves;

      const canCastleKingSide = color === "white" ? this.castling.K : this.castling.k;
      const canCastleQueenSide = color === "white" ? this.castling.Q : this.castling.q;

      if (
        canCastleKingSide &&
        this.board[row][7] === rook &&
        !this.board[row][5] &&
        !this.board[row][6] &&
        !this.isSquareAttacked({ row, col: 5 }, enemy) &&
        !this.isSquareAttacked({ row, col: 6 }, enemy)
      ) {
        moves.push({ from: { row, col: 4 }, to: { row, col: 6 }, castle: "king" });
      }

      if (
        canCastleQueenSide &&
        this.board[row][0] === rook &&
        !this.board[row][1] &&
        !this.board[row][2] &&
        !this.board[row][3] &&
        !this.isSquareAttacked({ row, col: 3 }, enemy) &&
        !this.isSquareAttacked({ row, col: 2 }, enemy)
      ) {
        moves.push({ from: { row, col: 4 }, to: { row, col: 2 }, castle: "queen" });
      }

      return moves;
    }

    legalMovesFrom(from) {
      return this.pseudoMovesFrom(from).filter((move) => {
        const nextBoard = this.boardAfter(move);
        return !this.isInCheck(this.turn, nextBoard);
      });
    }

    legalMoves() {
      const moves = [];

      for (let row = 0; row < 8; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          if (colorOf(this.board[row][col]) === this.turn) {
            moves.push(...this.legalMovesFrom({ row, col }));
          }
        }
      }

      return moves;
    }

    boardAfter(move) {
      const board = cloneBoard(this.board);
      const piece = board[move.from.row][move.from.col];

      board[move.from.row][move.from.col] = null;

      if (move.enPassant) {
        board[move.from.row][move.to.col] = null;
      }

      if (move.castle === "king") {
        board[move.to.row][5] = board[move.to.row][7];
        board[move.to.row][7] = null;
      }

      if (move.castle === "queen") {
        board[move.to.row][3] = board[move.to.row][0];
        board[move.to.row][0] = null;
      }

      board[move.to.row][move.to.col] = move.promotion || piece;
      return board;
    }

    makeMove(from, to) {
      if (this.result) return null;

      const move = this.legalMovesFrom(from).find((candidate) =>
        sameSquare(candidate.to, to),
      );

      if (!move) return null;

      const piece = this.pieceAt(from);
      const captured = move.enPassant ? this.board[from.row][to.col] : this.pieceAt(to);

      this.board = this.boardAfter(move);
      this.updateCastlingRights(piece, from, to, captured);
      this.enPassant = move.doublePawn
        ? { row: (from.row + to.row) / 2, col: from.col }
        : null;
      this.halfmove =
        piece.toLowerCase() === "p" || captured ? 0 : this.halfmove + 1;

      if (this.turn === "black") this.fullmove += 1;
      this.turn = opposite(this.turn);
      this.updateResult();

      return {
        ...move,
        piece,
        captured,
        sanish: `${squareName(from.row, from.col)}-${squareName(to.row, to.col)}`,
      };
    }

    updateCastlingRights(piece, from, to, captured) {
      if (piece === "K") {
        this.castling.K = false;
        this.castling.Q = false;
      }

      if (piece === "k") {
        this.castling.k = false;
        this.castling.q = false;
      }

      if (piece === "R" && from.row === 7 && from.col === 0) this.castling.Q = false;
      if (piece === "R" && from.row === 7 && from.col === 7) this.castling.K = false;
      if (piece === "r" && from.row === 0 && from.col === 0) this.castling.q = false;
      if (piece === "r" && from.row === 0 && from.col === 7) this.castling.k = false;

      if (captured === "R" && to.row === 7 && to.col === 0) this.castling.Q = false;
      if (captured === "R" && to.row === 7 && to.col === 7) this.castling.K = false;
      if (captured === "r" && to.row === 0 && to.col === 0) this.castling.q = false;
      if (captured === "r" && to.row === 0 && to.col === 7) this.castling.k = false;
    }

    updateResult() {
      const moves = this.legalMoves();
      const inCheck = this.isInCheck(this.turn);

      if (moves.length === 0 && inCheck) {
        this.result = `${opposite(this.turn)} wins by checkmate`;
      } else if (moves.length === 0) {
        this.result = "draw by stalemate";
      } else if (this.halfmove >= 100) {
        this.result = "draw by fifty-move rule";
      } else {
        this.result = null;
      }
    }

    fen() {
      const placement = this.board
        .map((row) => {
          let empty = 0;
          let rank = "";

          row.forEach((piece) => {
            if (!piece) {
              empty += 1;
              return;
            }

            if (empty) {
              rank += empty;
              empty = 0;
            }

            rank += piece;
          });

          return rank + (empty || "");
        })
        .join("/");
      const activeColor = this.turn === "white" ? "w" : "b";
      const castling =
        ["K", "Q", "k", "q"].filter((key) => this.castling[key]).join("") || "-";
      const enPassant = this.enPassant
        ? squareName(this.enPassant.row, this.enPassant.col)
        : "-";

      return `${placement} ${activeColor} ${castling} ${enPassant} ${this.halfmove} ${this.fullmove}`;
    }
  }

  function evaluateGame(game, botColor) {
    if (game.result) {
      if (game.result.startsWith(`${botColor} wins`)) return 1_000_000;
      if (game.result.startsWith(`${opposite(botColor)} wins`)) return -1_000_000;
      return 0;
    }

    let score = 0;
    const bishops = { white: 0, black: 0 };

    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        const piece = game.board[row][col];
        if (!piece) continue;

        const color = colorOf(piece);
        const direction = color === botColor ? 1 : -1;
        const type = piece.toLowerCase();
        score += direction * (pieceValues[type] + positionalValue(piece, row, col));
        if (type === "b") bishops[color] += 1;
      }
    }

    if (bishops[botColor] >= 2) score += 25;
    if (bishops[opposite(botColor)] >= 2) score -= 25;
    if (game.isInCheck(botColor)) score -= 45;
    if (game.isInCheck(opposite(botColor))) score += 45;
    score +=
      (legalMoveCount(game, botColor) - legalMoveCount(game, opposite(botColor))) * 2;

    return score;
  }

  function gameAfterMove(game, move) {
    const next = game.clone();
    next.makeMove(move.from, move.to);
    return next;
  }

  function gameAfterMoveFor(game, move, color) {
    const next = game.clone();
    next.turn = color;
    next.makeMove(move.from, move.to);
    return next;
  }

  function minimax(game, depth, botColor, alpha = -Infinity, beta = Infinity) {
    if (depth <= 0 || game.result) return evaluateGame(game, botColor);

    const moves = game
      .legalMoves()
      .sort((a, b) => moveOrderingScore(game, b) - moveOrderingScore(game, a));
    if (!moves.length) return evaluateGame(game, botColor);

    const isMaximizing = game.turn === botColor;
    let best = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
      const score = minimax(gameAfterMove(game, move), depth - 1, botColor, alpha, beta);
      if (isMaximizing) {
        best = Math.max(best, score);
        alpha = Math.max(alpha, best);
      } else {
        best = Math.min(best, score);
        beta = Math.min(beta, best);
      }
      if (beta <= alpha) break;
    }

    return best;
  }

  function chooseTinyBotMove(game, botColor, depth = 1) {
    const moves = game.legalMoves();
    const scoredMoves = moves.map((move) => {
      const next = gameAfterMove(game, move);
      return {
        move,
        score:
          minimax(next, Math.max(0, depth - 1), botColor) +
          moveOrderingScore(game, move) / 25,
      };
    });

    scoredMoves.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return moveToUci(a.move).localeCompare(moveToUci(b.move));
    });

    return scoredMoves[0]?.move || null;
  }

  function replyDangerAfterMove(game, move, color, replyDepth = 1) {
    if (!move) return { severity: 0, reply: null, text: "" };

    const opponent = opposite(color);
    const next = gameAfterMove(game, move);
    const reply = bestMoveFor(next, opponent, replyDepth);

    if (!reply) return { severity: 0, reply: null, text: "" };

    const afterReply = gameAfterMove(next, reply);
    const capture = captureOnMove(next, reply);
    let severity = Math.max(0, evaluateGame(next, color) - evaluateGame(afterReply, color));
    let text = "";

    if (afterReply.result?.startsWith(`${opponent} wins`)) {
      severity = 20_000;
      text = `Careful: ${formatMoveLabel(moveToUci(reply))} may be a mating reply.`;
    } else if (capture && pieceValues[capture.toLowerCase()] >= pieceValues.r) {
      severity = Math.max(severity, pieceValues[capture.toLowerCase()]);
      text = `Check this: ${opponent} may answer with ${formatMoveLabel(moveToUci(reply))}, taking your ${pieceName(capture)} on ${squareLabel(reply.to)}.`;
    } else if (afterReply.isInCheck(color)) {
      severity = Math.max(severity, 160);
      text = `Expect ${formatMoveLabel(moveToUci(reply))}; it comes with check.`;
    }

    return { severity, reply, text };
  }

  function chooseCoachMove(game, color, depth = 3) {
    const moves = game.legalMoves();
    const scoredMoves = moves.map((move) => {
      const next = gameAfterMove(game, move);
      const danger = replyDangerAfterMove(game, move, color, 2);
      const dangerPenalty = Math.max(0, danger.severity - 120);

      return {
        move,
        danger,
        score:
          minimax(next, Math.max(0, depth - 1), color) +
          moveOrderingScore(game, move) / 25 -
          dangerPenalty,
      };
    });

    scoredMoves.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.danger.severity !== b.danger.severity) {
        return a.danger.severity - b.danger.severity;
      }
      return moveToUci(a.move).localeCompare(moveToUci(b.move));
    });

    return scoredMoves[0]?.move || null;
  }

  class FloatingChessWidget {
    constructor(options = {}) {
      this.options = options;
      this.target = options.target || document.body;
      this.title = options.title || this.target.dataset.title || "mini chess";
      this.position = options.position || this.target.dataset.position || "bottom-right";
      this.startMinimized =
        options.startMinimized ?? parseBoolean(this.target.dataset.startMinimized);
      this.game = new ChessGame(options.fen || this.target.dataset.fen || startFen);
      this.bot = options.bot || this.target.dataset.bot || "none";
      this.playerColor = options.playerColor || this.target.dataset.playerColor || "white";
      this.botColor =
        options.botColor || this.target.dataset.botColor || opposite(this.playerColor);
      this.botDepth = Number(options.botDepth || this.target.dataset.botDepth || 1);
      this.coach = options.coach ?? parseBoolean(this.target.dataset.coach);
      this.boardLight = cssColor(
        options.boardLight ||
          options.lightSquareColor ||
          this.target.dataset.boardLight ||
          this.target.dataset.lightSquareColor,
      );
      this.boardDark = cssColor(
        options.boardDark ||
          options.darkSquareColor ||
          this.target.dataset.boardDark ||
          this.target.dataset.darkSquareColor,
      );
      this.fontFamily =
        options.fontFamily ||
        options.font ||
        this.target.dataset.fontFamily ||
        this.target.dataset.font ||
        null;
      this.widgetSize = cssLength(
        options.size ||
          options.width ||
          options.widgetWidth ||
          this.target.dataset.size ||
          this.target.dataset.width ||
          this.target.dataset.widgetWidth,
      );
      this.shadow = cssShadow(
        options.shadow ||
          options.widgetShadow ||
          this.target.dataset.shadow ||
          this.target.dataset.widgetShadow,
      );
      this.botTimer = null;
      this.isBotThinking = false;
      this.moveHistory = [];
      this.positionHistory = [this.game.fen()];
      this.historyIndex = 0;
      this.reviewStarted = false;
      this.selected = null;
      this.targets = [];
      this.isDraggingShell = false;
      this.pieceDrag = null;
      this.suppressNextClick = false;
      this.dragOffset = { x: 0, y: 0 };
      this.handleKeydown = (event) => this.onKeydown(event);
      this.build();
      this.render();
      this.queueBotMove();
    }

    build() {
      this.root = document.createElement("section");
      this.root.className = "fcw-root";
      this.root.dataset.position = this.position;
      this.root.setAttribute("aria-label", this.title);
      if (this.boardLight) {
        this.root.style.setProperty("--fcw-board-light", this.boardLight);
      }
      if (this.boardDark) {
        this.root.style.setProperty("--fcw-board-dark", this.boardDark);
      }
      if (this.fontFamily) {
        this.root.style.setProperty("--fcw-font-family", this.fontFamily);
      }
      if (this.widgetSize) {
        this.root.style.setProperty("--fcw-widget-width", this.widgetSize);
      }
      if (this.shadow) {
        this.root.style.setProperty("--fcw-shadow", this.shadow);
      }

      if (this.startMinimized) this.root.classList.add("is-minimized");

      this.root.innerHTML = `
        <div class="fcw-shell">
          <div class="fcw-bar">
            <span class="fcw-title"></span>
            <button class="fcw-button fcw-reset" type="button">reset</button>
            <button class="fcw-button fcw-toggle" type="button" aria-label="toggle chess board">-</button>
          </div>
          <div class="fcw-body">
            <div class="fcw-board" role="grid" aria-label="chess board"></div>
            <div class="fcw-footer">
              <span class="fcw-status" aria-live="polite"></span>
              <div class="fcw-side-controls" aria-label="choose side">
                <button class="fcw-side-button" type="button" data-side="white">white</button>
                <button class="fcw-side-button" type="button" data-side="black">black</button>
                <button class="fcw-footer-review" type="button" data-review-action="start" hidden>review</button>
              </div>
            </div>
            <div class="fcw-coach" aria-live="polite" hidden>
              <strong class="fcw-coach-opening"></strong>
              <p class="fcw-coach-summary"></p>
              <div class="fcw-review-controls" aria-label="review controls">
                <button class="fcw-review-button" type="button" data-review-action="prev">prev</button>
                <button class="fcw-review-button" type="button" data-review-action="next">next</button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.root.querySelector(".fcw-title").textContent = this.title;
      this.boardElement = this.root.querySelector(".fcw-board");
      this.statusElement = this.root.querySelector(".fcw-status");
      this.toggleButton = this.root.querySelector(".fcw-toggle");
      this.coachElement = this.root.querySelector(".fcw-coach");
      this.coachOpeningElement = this.root.querySelector(".fcw-coach-opening");
      this.coachSummaryElement = this.root.querySelector(".fcw-coach-summary");
      this.reviewControls = this.root.querySelector(".fcw-review-controls");
      this.reviewButtons = [...this.root.querySelectorAll(".fcw-review-button")];
      this.sideControlsElement = this.root.querySelector(".fcw-side-controls");
      this.footerReviewButton = this.root.querySelector(".fcw-footer-review");
      this.sideButtons = [...this.root.querySelectorAll(".fcw-side-button")];
      this.root.querySelector(".fcw-reset").addEventListener("click", () => this.reset());
      this.toggleButton.addEventListener("click", () => this.toggle());
      this.footerReviewButton.addEventListener("click", () => this.reviewAction("start"));
      this.reviewButtons.forEach((button) => {
        button.addEventListener("click", () => this.reviewAction(button.dataset.reviewAction));
      });
      this.sideButtons.forEach((button) => {
        button.addEventListener("click", () => this.setPlayerColor(button.dataset.side));
      });

      this.root.querySelector(".fcw-bar").addEventListener("pointerdown", (event) => {
        if (event.target.closest("button")) return;
        this.startShellDrag(event);
      });

      document.addEventListener("pointermove", (event) => this.moveShell(event));
      document.addEventListener("pointermove", (event) => this.movePieceDrag(event));
      document.addEventListener("pointerup", () => this.stopShellDrag());
      document.addEventListener("pointerup", (event) => this.stopPieceDrag(event));
      document.addEventListener("keydown", this.handleKeydown);

      if (this.target.hasAttribute?.("data-floating-chess-widget")) {
        this.target.replaceWith(this.root);
      } else {
        this.target.append(this.root);
      }
    }

    render() {
      this.boardElement.innerHTML = "";
      const displayGame = this.displayGame();
      this.targets =
        this.isAtLatestPosition() && this.selected
          ? this.game.legalMovesFrom(this.selected)
          : [];
      const rows =
        this.playerColor === "black"
          ? [7, 6, 5, 4, 3, 2, 1, 0]
          : [0, 1, 2, 3, 4, 5, 6, 7];
      const cols =
        this.playerColor === "black"
          ? [7, 6, 5, 4, 3, 2, 1, 0]
          : [0, 1, 2, 3, 4, 5, 6, 7];

      rows.forEach((row, displayRowIndex) => {
        cols.forEach((col, displayColIndex) => {
          const piece = displayGame.board[row][col];
          const square = document.createElement("button");
          const isTarget = this.targets.some((move) => sameSquare(move.to, { row, col }));

          square.className = "fcw-square";
          square.type = "button";
          square.dataset.row = row;
          square.dataset.col = col;
          square.setAttribute("role", "gridcell");
          square.setAttribute("aria-label", squareName(row, col));

          if ((row + col) % 2) square.classList.add("is-dark");
          if (piece) square.classList.add("has-piece");
          if (this.selected?.row === row && this.selected?.col === col) {
            square.classList.add("is-selected");
          }
          if (isTarget) square.classList.add("is-target");
          if (piece) {
            const pieceColor = colorOf(piece);
            square.innerHTML = `<span class="fcw-piece fcw-piece--${pieceColor}">${pieceGlyphs[piece]}</span>`;
          }
          if (displayColIndex === 0) {
            square.insertAdjacentHTML(
              "beforeend",
              `<span class="fcw-coordinate fcw-rank">${8 - row}</span>`,
            );
          }
          if (displayRowIndex === 7) {
            square.insertAdjacentHTML(
              "beforeend",
              `<span class="fcw-coordinate fcw-file">${String.fromCharCode(97 + col)}</span>`,
            );
          }

          square.addEventListener("click", () => {
            if (this.suppressNextClick) {
              this.suppressNextClick = false;
              return;
            }

            this.chooseSquare(row, col);
          });
          square.addEventListener("pointerdown", (event) => this.startPieceDrag(event, row, col));
          this.boardElement.append(square);
        });
      });

      this.statusElement.textContent = this.statusText();
      this.toggleButton.textContent = this.root.classList.contains("is-minimized") ? "+" : "-";
      this.renderCoach();
      this.sideButtons?.forEach((button) => {
        const isCurrentSide = button.dataset.side === this.playerColor;
        button.hidden = Boolean(this.game.result);
        button.classList.toggle("is-active", isCurrentSide);
        button.setAttribute("aria-pressed", String(isCurrentSide));
      });
      this.footerReviewButton.hidden = !this.game.result || this.reviewStarted;
      this.sideControlsElement.hidden = Boolean(this.game.result) && this.reviewStarted;
      this.sideControlsElement.classList.toggle(
        "is-review",
        Boolean(this.game.result) && !this.reviewStarted,
      );
      this.root.classList.toggle(
        "has-result",
        Boolean(this.game.result) && !this.reviewStarted,
      );
    }

    statusText() {
      if (!this.isAtLatestPosition()) {
        return `reviewing move ${this.historyIndex} / ${this.moveHistory.length}`;
      }
      if (this.game.result) return this.resultLabel();
      if (this.isBotTurn()) return `${this.botColor} is thinking`;
      if (this.game.isInCheck(this.game.turn)) return `${this.game.turn} is in check`;
      return `${this.game.turn} to move`;
    }

    isBotTurn() {
      return this.bot === "tiny" && this.game.turn === this.botColor && !this.game.result;
    }

    isAtLatestPosition() {
      return this.historyIndex === this.positionHistory.length - 1;
    }

    displayGame() {
      if (this.isAtLatestPosition()) return this.game;
      return new ChessGame(this.positionHistory[this.historyIndex] || this.game.fen());
    }

    resultLabel() {
      const result = this.game.result;
      if (result?.startsWith("white wins")) return "White wins";
      if (result?.startsWith("black wins")) return "Black wins";
      return "Draw";
    }

    onKeydown(event) {
      const target = event.target;
      const isTyping =
        target?.closest?.("input, textarea, select") ||
        target?.isContentEditable;

      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

      event.preventDefault();
      if (this.game.result && !this.reviewStarted) return;
      this.reviewPosition(event.key === "ArrowLeft" ? -1 : 1);
    }

    reviewPosition(direction) {
      if (this.positionHistory.length <= 1) return;

      const nextIndex = clamp(
        this.historyIndex + direction,
        0,
        this.positionHistory.length - 1,
      );

      if (nextIndex === this.historyIndex) return;

      window.clearTimeout(this.botTimer);
      this.isBotThinking = false;
      this.historyIndex = nextIndex;
      this.selected = null;
      this.render();

      if (this.isAtLatestPosition()) this.queueBotMove();
    }

    reviewAction(action) {
      if (!this.game.result) return;

      if (action === "start") {
        this.reviewStarted = true;
        this.historyIndex = 0;
        this.selected = null;
        this.render();
        return;
      }

      this.reviewPosition(action === "prev" ? -1 : 1);
    }

    setPlayerColor(color) {
      if (color !== "white" && color !== "black") return;

      this.playerColor = color;
      this.botColor = opposite(color);
      this.reset();
    }

    coachState() {
      if (!this.game.result) {
        return {
          name: "Post-game analysis",
          suggestion: null,
          summary:
            "Play the game out first. Once it ends, use the Left and Right Arrow keys and I will review each move with a short summary of what changed.",
          source: "analysis",
        };
      }

      if (!this.reviewStarted) {
        return {
          name: "Ready to review",
          suggestion: null,
          summary: "Click review when you are ready to step through the moves.",
          source: "result",
        };
      }

      if (this.historyIndex === 0) {
        return {
          name: "Game review",
          suggestion: null,
          summary: "Step through the game one move at a time to see what changed.",
          source: "result",
        };
      }

      return this.moveAnalysisState(this.historyIndex - 1);
    }

    moveAnalysisState(moveIndex) {
      const uci = this.moveHistory[moveIndex];
      const beforeFen = this.positionHistory[moveIndex];
      const afterFen = this.positionHistory[moveIndex + 1];
      const before = new ChessGame(beforeFen);
      const after = new ChessGame(afterFen);
      const move = moveFromUci(before, uci);
      const color = before.turn;
      const moveNumber = Math.floor(moveIndex / 2) + 1;
      const prefix = color === "white" ? `${moveNumber}.` : `${moveNumber}...`;
      const colorLabel = color.charAt(0).toUpperCase() + color.slice(1);
      const bookState = this.bookMoveReviewState(before, moveIndex, uci);

      if (bookState) {
        return {
          name: `Move ${prefix} ${formatMoveLabel(uci)}`,
          suggestion: null,
          summary: `Book move: ${colorLabel} played ${formatMoveLabel(uci)}, a known move in the ${bookState.name}.`,
          source: "book",
        };
      }

      const bestMove = chooseCoachMove(before, color, 2);
      const bestUci = bestMove ? moveToUci(bestMove) : null;
      const playedScore = evaluateGame(after, color);
      const bestScore = bestMove
        ? evaluateGame(gameAfterMove(before, bestMove), color)
        : playedScore;
      const gap = Math.max(0, bestScore - playedScore);
      const danger = move ? replyDangerAfterMove(before, move, color, 1) : null;
      const label = this.moveQualityLabel(gap, danger?.severity || 0, after, color);
      const resultText = after.result ? ` It also reached: ${after.result}.` : "";
      const dangerText =
        danger && danger.text && danger.severity >= 300
          ? ` ${this.reviewDangerText(danger.text)}`
          : "";
      const missedText = this.missedIdea(before, move, bestMove, gap);

      return {
        name: `Move ${prefix} ${formatMoveLabel(uci)}`,
        suggestion: null,
        summary: `${label}: ${colorLabel} played ${formatMoveLabel(uci)}. ${this.moveAnalysisIdea(before, move, after, gap)} ${missedText}${dangerText}${resultText}`.replace(/\s+/g, " ").trim(),
        source: bestUci && bestUci !== uci ? "analysis" : "played",
      };
    }

    bookMoveReviewState(before, moveIndex, uci) {
      const previousMoves = this.moveHistory.slice(0, moveIndex);
      const { book, move: bookMove } = bookMoveFor(before, previousMoves);

      if (!bookMove || moveToUci(bookMove) !== uci) return null;

      const continuation =
        openingBook[this.moveHistory.slice(0, moveIndex + 1).join(" ")];
      const name =
        continuation?.name && continuation.name !== "Starting position"
          ? continuation.name
          : book?.name;

      return { name: name || "opening book" };
    }

    moveQualityLabel(gap, danger, after, color) {
      if (after.result?.startsWith(`${color} wins`)) return "Winning move";
      if (after.result?.startsWith(`${opposite(color)} wins`)) return "Blunder";
      if (danger >= 900 || gap >= 700) return "Blunder";
      if (danger >= 500 || gap >= 350) return "Mistake";
      if (gap >= 150) return "Inaccuracy";
      if (gap >= 60) return "Playable";
      return "Good move";
    }

    moveAnalysisIdea(before, move, after, gap) {
      if (!move) return "I could not reconstruct this move cleanly.";

      const piece = before.board[move.from.row][move.from.col];
      const capture = captureOnMove(before, move);
      const type = piece?.toLowerCase();
      const from = squareLabel(move.from);
      const to = squareLabel(move.to);
      const pieceLabel = pieceName(piece);

      if (after.result) return "The move directly affected the final result.";
      if (after.isInCheck(after.turn)) return "It created forcing pressure by giving check.";
      if (capture) {
        const capturedValue = pieceValues[capture.toLowerCase()] || 0;
        const attackerValue = pieceValues[type] || 0;
        if (capturedValue > attackerValue) {
          return `It wins material: the ${pieceLabel} from ${from} takes a more valuable ${pieceName(capture)} on ${to}.`;
        }
        if (capturedValue === attackerValue) {
          return `It trades pieces on ${to}; the point is whether that trade improves activity or removes a defender.`;
        }
        return `It captures on ${to}, but because the attacker is more valuable, the recapture pattern needs checking.`;
      }
      if (move.castle) return "It improved king safety and connected the rooks.";
      if (move.promotion) return "Promotion changed the material balance immediately.";
      if (gap >= 350) return "The problem is that it let the opponent improve with tempo or win material.";
      if (type === "n" || type === "b") {
        if (isCenterSquare(move.to)) {
          return `It develops the ${pieceLabel} onto a central square, increasing control over both sides of the board.`;
        }
        return `It develops the ${pieceLabel}; now look for whether it attacks something or supports a central break.`;
      }
      if (type === "p") {
        if (isCenterSquare(move.to)) {
          return `It takes central space with a pawn, which can free pieces if the center stays supported.`;
        }
        return `It changes the pawn structure on the ${String.fromCharCode(97 + move.to.col)}-file; check what squares it weakens as well as what it controls.`;
      }
      if (type === "q") {
        return `It brings the queen to ${to}; that is useful only if it creates a threat the opponent cannot answer with development.`;
      }
      if (type === "r") {
        return `It activates the rook toward ${to}; rooks are strongest when the file is open or a target is fixed.`;
      }
      if (type === "k") {
        return `It moves the king to ${to}; king activity helps in endings, but in middlegames it can expose tactics.`;
      }

      return "The important question is whether it improved your worst piece or answered the opponent's threat.";
    }

    missedIdea(before, playedMove, bestMove, gap) {
      if (!playedMove || !bestMove || moveToUci(bestMove) === moveToUci(playedMove)) {
        return "";
      }

      const bestAfter = gameAfterMove(before, bestMove);
      const capture = captureOnMove(before, bestMove);
      const bestPiece = before.board[bestMove.from.row][bestMove.from.col];

      if (bestAfter.result?.startsWith(`${before.turn} wins`)) {
        return ` A decisive tactic was available with ${formatMoveLabel(moveToUci(bestMove))}.`;
      }
      if (bestAfter.isInCheck(bestAfter.turn)) {
        return ` A forcing check was available with ${formatMoveLabel(moveToUci(bestMove))}, so this was a moment to inspect checks before quieter moves.`;
      }
      if (capture && pieceValues[capture.toLowerCase()] >= pieceValues.n) {
        return ` There was a chance to win material with ${formatMoveLabel(moveToUci(bestMove))}, taking a ${pieceName(capture)} on ${squareLabel(bestMove.to)}.`;
      }
      if (gap >= 350) {
        return " A stronger idea was available, likely by answering the opponent's threat more directly.";
      }
      if (gap >= 150 && bestPiece?.toLowerCase() !== before.board[playedMove.from.row][playedMove.from.col]?.toLowerCase()) {
        return " Another piece may have had a more useful job in the position.";
      }

      return "";
    }

    reviewDangerText(text) {
      const cleaned = text
        .replace(/^Careful:\s*/i, "")
        .replace(/^Check this:\s*/i, "")
        .replace(/^Expect\s+/i, "");

      return `The main concern is ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)}`;
    }

    liveCoachState() {
      const { book, move: bookMove } = bookMoveFor(this.game, this.moveHistory);
      const phase = this.gamePhase();
      const threat = this.opponentThreat();
      let source = "engine";
      let suggestion = null;
      let name = this.phaseTitle(phase, book);
      let suggestedMove = null;
      let plan = "";

      if (phase === "opening" && bookMove) {
        suggestedMove = bookMove;
        suggestion = moveToUci(suggestedMove);
        source = "book";
        plan = book.idea;
      } else {
        suggestedMove = chooseCoachMove(this.game, this.game.turn, 3);
        suggestion = suggestedMove ? moveToUci(suggestedMove) : null;
        source = "coach";
        plan = this.planIdea(phase, suggestedMove, threat);
      }
      const warning = this.blunderCheck(suggestedMove);

      return {
        name,
        suggestion,
        threat: threat.text,
        plan,
        warning,
        summary: this.coachSummary({
          name,
          suggestion,
          source,
          threat: threat.text,
          plan,
          warning,
        }),
        source,
      };
    }

    gamePhase() {
      const material = materialSummary(this.game.board);

      if (
        material.pieces <= 10 ||
        material.nonPawnMaterial <= 1_600 ||
        (material.queens === 0 && material.nonPawnMaterial <= 2_600)
      ) {
        return "endgame";
      }

      if (this.moveHistory.length < 12) return "opening";

      return "middlegame";
    }

    phaseTitle(phase, book) {
      if (phase === "opening") return `Opening - ${book?.name || "principles"}`;
      if (phase === "middlegame") return "Middlegame - tactics";
      return "Endgame - conversion";
    }

    phaseIdea(phase, move) {
      if (phase === "opening") return this.openingIdea(move);
      if (phase === "middlegame") return this.tacticalIdea(move);
      return this.endgameIdea(move);
    }

    planIdea(phase, move, threat) {
      if (this.game.isInCheck(this.game.turn)) {
        return "First priority: get out of check, ideally while improving a piece.";
      }
      if (threat.severity >= 700) {
        return "Respect the opponent's threat first, then look for your own active move.";
      }

      return this.phaseIdea(phase, move);
    }

    coachSummary({ name, suggestion, source, threat, plan, warning }) {
      const moveText = suggestion
        ? `I would look at ${formatMoveLabel(suggestion)} (${source})`
        : "There is no clear legal move to recommend";
      const planText = plan.replace(/\.$/, "");
      const warningText = warning.replace(/\.$/, "");
      const safetyText = warning
        ? ` One thing to watch: ${warningText.charAt(0).toLowerCase()}${warningText.slice(1)}.`
        : "";

      return `${name}: ${threat} ${moveText}. ${planText}.${safetyText}`;
    }

    opponentThreat() {
      const us = this.game.turn;
      const opponent = opposite(us);
      const loosePiece = this.loosePieceWarning(us);
      const threats = legalMovesFor(this.game, opponent)
        .map((move) => {
          const capture = captureOnMove(this.game, move);
          const next = gameAfterMoveFor(this.game, move, opponent);
          let score = moveOrderingScore(this.game, move);
          let text = "";

          if (next.result?.startsWith(`${opponent} wins`)) {
            score += 20_000;
            text = `${opponent} has a mating idea with ${formatMoveLabel(moveToUci(move))}.`;
          } else if (next.isInCheck(us)) {
            score += 700;
            text = `${opponent} can give check with ${formatMoveLabel(moveToUci(move))}.`;
          } else if (capture) {
            score += pieceValues[capture.toLowerCase()] * 2;
            text = `${opponent} is eyeing your ${pieceName(capture)} on ${squareName(move.to.row, move.to.col)}.`;
          }

          return { move, score, text };
        })
        .filter((threat) => threat.text)
        .sort((a, b) => b.score - a.score);

      if (threats[0]?.score >= 500) {
        return { text: threats[0].text, severity: threats[0].score };
      }
      if (loosePiece) return loosePiece;

      return {
        text: `${opponent} is not forcing a tactic right now; improve your least active piece or strengthen the center.`,
        severity: 0,
      };
    }

    loosePieceWarning(color) {
      const opponent = opposite(color);
      let loose = null;

      for (let row = 0; row < 8; row += 1) {
        for (let col = 0; col < 8; col += 1) {
          const piece = this.game.board[row][col];
          if (colorOf(piece) !== color || piece.toLowerCase() === "k") continue;

          const square = { row, col };
          const attacked = this.game.isSquareAttacked(square, opponent);
          const defended = this.game.isSquareAttacked(square, color);
          if (!attacked || defended) continue;

          const value = pieceValues[piece.toLowerCase()];
          if (!loose || value > loose.value) {
            loose = { piece, square, value };
          }
        }
      }

      if (!loose || loose.value < pieceValues.n) return null;

      return {
        text: `Your ${pieceName(loose.piece)} on ${squareName(loose.square.row, loose.square.col)} is loose.`,
        severity: loose.value,
      };
    }

    blunderCheck(move) {
      const us = this.game.turn;
      const next = move ? gameAfterMove(this.game, move) : null;

      if (!move) return "No legal move to check.";
      if (next?.result?.startsWith(`${us} wins`)) {
        return "This move ends the game in your favor.";
      }

      return replyDangerAfterMove(this.game, move, us, 2).text;
    }

    openingIdea(move) {
      if (!move) return "Develop pieces, castle, and keep a pawn in the center.";
      if (this.game.board[move.from.row][move.from.col]?.toLowerCase() === "n") {
        return "Develop a knight toward the center before moving the same piece twice.";
      }
      if (this.game.board[move.from.row][move.from.col]?.toLowerCase() === "b") {
        return "Develop a bishop and prepare to castle.";
      }
      if (move.castle) return "Good opening habit: castle before the position opens.";
      return "Follow opening principles: center, development, king safety.";
    }

    tacticalIdea(move) {
      if (!move) return "No legal moves available.";

      const target = move.enPassant
        ? this.game.board[move.from.row][move.to.col]
        : this.game.board[move.to.row][move.to.col];
      const next = gameAfterMove(this.game, move);

      if (next.result) return next.result;
      if (next.isInCheck(next.turn)) return "Forcing move: it gives check.";
      if (target) return `Win material by capturing on ${squareName(move.to.row, move.to.col)}.`;
      if (move.castle) return "Castle to improve king safety and connect the rooks.";
      return "Look for checks, captures, threats, and better squares for your worst piece.";
    }

    endgameIdea(move) {
      if (!move) return "No legal moves available.";

      const piece = this.game.board[move.from.row][move.from.col]?.toLowerCase();
      const target = move.enPassant
        ? this.game.board[move.from.row][move.to.col]
        : this.game.board[move.to.row][move.to.col];

      if (target) return "In the endgame, clean captures often decide the result.";
      if (piece === "k") return "Activate your king: in the endgame it becomes a fighting piece.";
      if (piece === "p") return "Push passed pawns and look for promotion races.";
      return "Trade only when it helps your king, pawns, or conversion plan.";
    }

    renderCoach() {
      if (!this.coachElement) return;

      this.coachElement.hidden =
        !this.coach || (Boolean(this.game.result) && !this.reviewStarted);
      if (this.coachElement.hidden) return;

      const state = this.coachState();

      this.coachOpeningElement.textContent = state.name;
      this.coachSummaryElement.textContent = state.summary;
      this.reviewControls.hidden = !this.game.result;
      this.reviewButtons.forEach((button) => {
        const action = button.dataset.reviewAction;
        const atStart = this.historyIndex === 0;
        const atEnd = this.historyIndex === this.positionHistory.length - 1;

        button.hidden = !this.reviewStarted;
        button.disabled =
          !this.game.result ||
          !this.reviewStarted ||
          (action === "prev" && atStart) ||
          (action === "next" && atEnd);
      });
    }

    recordMove(move) {
      this.moveHistory.push(moveToUci(move));
      this.positionHistory.push(this.game.fen());
      this.historyIndex = this.positionHistory.length - 1;
      if (this.game.result) {
        this.coach = true;
        this.reviewStarted = false;
      }
    }

    chooseSquare(row, col) {
      const piece = this.game.board[row][col];

      if (this.game.result || this.isBotTurn() || !this.isAtLatestPosition()) return;

      if (!this.selected) {
        if (colorOf(piece) !== this.game.turn) return;
        this.selected = { row, col };
        this.render();
        return;
      }

      const from = this.selected;
      const to = { row, col };

      if (sameSquare(from, to)) {
        this.selected = null;
        this.render();
        return;
      }

      const move = this.game.makeMove(from, to);

      if (!move) {
        this.selected = colorOf(piece) === this.game.turn ? to : null;
        this.render();
        return;
      }

      this.selected = null;
      this.recordMove(move);
      this.options.onMove?.({
        from: squareName(from.row, from.col),
        to: squareName(to.row, to.col),
        piece: move.piece,
        captured: move.captured,
        fen: this.game.fen(),
        result: this.game.result,
        turn: this.game.turn,
        by: "player",
      });
      this.render();
      this.queueBotMove();
    }

    startPieceDrag(event, row, col) {
      const piece = this.game.board[row][col];

      if (
        this.game.result ||
        this.isBotTurn() ||
        !this.isAtLatestPosition() ||
        colorOf(piece) !== this.game.turn
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      this.selected = { row, col };
      this.pieceDrag = {
        from: { row, col },
        didMove: false,
        startX: event.clientX,
        startY: event.clientY,
      };

      this.ghost = document.createElement("div");
      this.ghost.className = `fcw-piece-ghost fcw-piece--${colorOf(piece)}`;
      this.ghost.textContent = pieceGlyphs[piece];
      document.body.append(this.ghost);
      this.movePieceDrag(event);
      this.render();
    }

    movePieceDrag(event) {
      if (!this.pieceDrag || !this.ghost) return;

      const distance =
        Math.abs(event.clientX - this.pieceDrag.startX) +
        Math.abs(event.clientY - this.pieceDrag.startY);
      this.pieceDrag.didMove = this.pieceDrag.didMove || distance > 5;
      this.ghost.classList.toggle("is-visible", this.pieceDrag.didMove);
      this.ghost.style.left = `${event.clientX}px`;
      this.ghost.style.top = `${event.clientY}px`;
    }

    stopPieceDrag(event) {
      if (!this.pieceDrag) return;

      const drag = this.pieceDrag;
      this.pieceDrag = null;
      this.ghost?.remove();
      this.ghost = null;
      this.suppressNextClick = true;
      window.setTimeout(() => {
        this.suppressNextClick = false;
      }, 0);

      if (!drag.didMove) return;

      const dropSquare = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest(".fcw-square");

      if (!dropSquare || !this.root.contains(dropSquare)) {
        this.selected = null;
        this.render();
        return;
      }

      this.selected = drag.from;
      this.chooseSquare(Number(dropSquare.dataset.row), Number(dropSquare.dataset.col));
    }

    startShellDrag(event) {
      const rect = this.root.getBoundingClientRect();
      this.isDraggingShell = true;
      this.dragOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      this.root.classList.add("is-dragging");
      this.root.dataset.position = "custom";
      this.root.style.right = "auto";
      this.root.style.bottom = "auto";
      this.moveShell(event);
    }

    moveShell(event) {
      if (!this.isDraggingShell) return;

      const maxX = window.innerWidth - this.root.offsetWidth - 16;
      const maxY = window.innerHeight - this.root.offsetHeight - 16;
      const x = clamp(event.clientX - this.dragOffset.x, 16, maxX);
      const y = clamp(event.clientY - this.dragOffset.y, 16, maxY);

      this.root.style.left = `${x}px`;
      this.root.style.top = `${y}px`;
    }

    stopShellDrag() {
      this.isDraggingShell = false;
      this.root?.classList.remove("is-dragging");
    }

    toggle() {
      this.root.classList.toggle("is-minimized");
      this.render();
    }

    reset() {
      window.clearTimeout(this.botTimer);
      this.game.reset();
      this.moveHistory = [];
      this.positionHistory = [this.game.fen()];
      this.historyIndex = 0;
      this.reviewStarted = false;
      this.coach = false;
      this.selected = null;
      this.isBotThinking = false;
      this.render();
      this.queueBotMove();
    }

    destroy() {
      window.clearTimeout(this.botTimer);
      document.removeEventListener("keydown", this.handleKeydown);
      this.root.remove();
    }

    queueBotMove() {
      window.clearTimeout(this.botTimer);

      if (!this.isBotTurn()) return;

      this.isBotThinking = true;
      this.render();
      this.botTimer = window.setTimeout(() => this.playBotMove(), botMoveDelay);
    }

    playBotMove() {
      if (!this.isBotTurn()) return;

      const { move: bookMove } = bookMoveFor(this.game, this.moveHistory);
      const move = bookMove || chooseTinyBotMove(this.game, this.botColor, this.botDepth);
      this.isBotThinking = false;

      if (!move) {
        this.render();
        return;
      }

      const played = this.game.makeMove(move.from, move.to);
      this.selected = null;
      this.recordMove(move);
      this.options.onMove?.({
        from: squareName(move.from.row, move.from.col),
        to: squareName(move.to.row, move.to.col),
        piece: played?.piece,
        captured: played?.captured,
        fen: this.game.fen(),
        result: this.game.result,
        turn: this.game.turn,
        by: "bot",
      });
      this.render();
    }
  }

  function create(options = {}) {
    return new FloatingChessWidget(options);
  }

  function optionsFromCustomElement(target) {
    const boolAttr = (name, dataName) => {
      const value = target.getAttribute(name) ?? target.dataset[dataName];
      return value == null ? undefined : parseBoolean(value);
    };

    return {
      target,
      title: target.getAttribute("title") || target.dataset.title,
      position: target.getAttribute("position") || target.dataset.position,
      startMinimized: boolAttr("start-minimized", "startMinimized"),
      playerColor: target.getAttribute("player-color") || target.dataset.playerColor,
      bot: target.getAttribute("bot") || target.dataset.bot,
      botColor: target.getAttribute("bot-color") || target.dataset.botColor,
      botDepth: target.getAttribute("bot-depth") || target.dataset.botDepth,
      coach: boolAttr("coach", "coach"),
      boardLight:
        target.getAttribute("board-light") ||
        target.getAttribute("light-square-color") ||
        target.dataset.boardLight ||
        target.dataset.lightSquareColor,
      boardDark:
        target.getAttribute("board-dark") ||
        target.getAttribute("dark-square-color") ||
        target.dataset.boardDark ||
        target.dataset.darkSquareColor,
      fontFamily:
        target.getAttribute("font-family") ||
        target.getAttribute("font") ||
        target.dataset.fontFamily ||
        target.dataset.font,
      size:
        target.getAttribute("size") ||
        target.getAttribute("width") ||
        target.getAttribute("widget-width") ||
        target.dataset.size ||
        target.dataset.width ||
        target.dataset.widgetWidth,
      shadow:
        target.getAttribute("shadow") ||
        target.getAttribute("widget-shadow") ||
        target.dataset.shadow ||
        target.dataset.widgetShadow,
      fen: target.getAttribute("fen") || target.dataset.fen,
    };
  }

  function defineChessElement(tagName) {
    if (!window.customElements || window.customElements.get(tagName)) return;

    window.customElements.define(
      tagName,
      class extends HTMLElement {
        connectedCallback() {
          if (!this.widget) {
            this.widget = create(optionsFromCustomElement(this));
          }
        }

        disconnectedCallback() {
          this.widget?.destroy();
          this.widget = null;
        }
      },
    );
  }

  const api = { create, ChessGame, chooseTinyBotMove };

  window.FloatingChessWidget = api;
  window.MiniChessWidget = api;
  window.PocketChessWidget = api;

  defineChessElement("mini-chess-widget");
  defineChessElement("pocket-chess");

  document.querySelectorAll("[data-floating-chess-widget]").forEach((target) => {
    create({ target });
  });
})();
