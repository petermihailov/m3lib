// @flow
import type {
  Grid,
  Gravity,
  Piece,
  Coord,
  Move,
  Match,
  Pattern,
} from './m3.types';

(function(root: any, factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS
    module.exports = factory();
  } else {
    // Browser
    root.m3 = factory();
  }
})(this, () => {
  class M3 {
    grid: Grid;
    gravity: Gravity;
    width: number;
    height: number;
    typesCount: number;
    patterns: Array<Pattern>;

    constructor({
      grid = [],
      height = 6,
      width = 6,
      typesCount = 5,
      gravity = 'down',
    } = {}) {
      this.grid = grid;
      this.width = width;
      this.height = height;
      this.gravity = gravity;
      this.typesCount = typesCount;
      this.patterns = [
        {
          mustHave: [{ y: 0, x: 1 }, { y: 0, x: 2 }],
          needOne: [{ y: 0, x: -1 }, { y: -1, x: 0 }, { y: 1, x: 0 }],
        },
        {
          mustHave: [{ y: 0, x: -1 }, { y: 0, x: -2 }],
          needOne: [{ y: 0, x: 1 }, { y: -1, x: 0 }, { y: 1, x: 0 }],
        },
        {
          mustHave: [{ y: 1, x: 0 }, { y: 2, x: 0 }],
          needOne: [{ y: -1, x: 0 }, { y: 0, x: -1 }, { y: 0, x: 1 }],
        },
        {
          mustHave: [{ y: -1, x: 0 }, { y: -2, x: 0 }],
          needOne: [{ y: 1, x: 0 }, { y: 0, x: -1 }, { y: 0, x: 1 }],
        },
        {
          mustHave: [{ y: 0, x: -1 }, { y: 0, x: 1 }],
          needOne: [{ y: -1, x: 0 }, { y: 1, x: 0 }],
        },
        {
          mustHave: [{ y: -1, x: 0 }, { y: 1, x: 0 }],
          needOne: [{ y: 0, x: -1 }, { y: 0, x: 1 }],
        },
      ];
    }

    // helpers

    setGrid(grid: Grid) {
      this.grid = grid;
    }

    coordToIdx({ y, x }: Coord) {
      const idx = y * this.width + x;
      if (y !== Math.floor(idx / this.width)) return -1;

      return idx;
    }

    idxToCoord(idx: number) {
      const y = Math.floor(idx / this.width);
      const x = idx % this.width;

      return { y, x };
    }

    forEach(cb: (Coord, Piece, number) => any) {
      this.grid.forEach((piece, idx) => {
        cb(this.idxToCoord(idx), this.grid[idx], idx);
      });
    }

    generateRandomPiece(): Piece {
      return {
        type: Math.floor(Math.random() * this.typesCount) + 1,
      };
    }

    isNeighbor(c1: Coord, c2: Coord): boolean {
      const dr = c1.y - c2.y;
      const dc = c1.x - c2.x;

      return Boolean(
        // if vertical are neighbors
        Math.abs(dr) <= 1 &&
          // if horizontal are neighbors
          Math.abs(dc) <= 1 &&
          // cross pieces are not neighbors
          Math.abs(dr + dc) === 1,
      );
    }

    // Methods

    getPiece(coord: Coord, offset?: Coord = { y: 0, x: 0 }): ?Piece {
      const idx = this.coordToIdx({
        y: coord.y + offset.y,
        x: coord.x + offset.x,
      });

      if (~idx) return this.grid[idx];
    }

    getMoves(): Array<Move> {
      const moves = [];

      this.forEach(coord => {
        this.patterns.forEach(pattern => {
          let type;

          const checkPossibleMatch = pattern.mustHave.every(offset => {
            const piece = this.getPiece(coord, offset);

            if (piece) {
              if (type === undefined) {
                type = piece.type;
              }

              return type === piece.type;
            }
          });

          if (checkPossibleMatch) {
            return pattern.needOne.forEach(offset => {
              const coord2 = { y: coord.y + offset.y, x: coord.x + offset.x };
              const piece = this.getPiece(coord2);

              if (piece && type === piece.type) {
                moves.push({ from: coord, to: coord2 });
              }
            });
          }
        });
      });

      return moves;
    }

    getMatches(): Array<Match> {
      const matches = [];

      // find horizontal matches
      for (let y = 0; y < this.height; y++) {
        let type = null;
        let matchLength = 1;

        for (let x = 0; x < this.width; x++) {
          let check = false;

          if (x === this.width - 1) {
            check = true;
          } else {
            const p1 = this.getPiece({ y, x });
            const p2 = this.getPiece({ y, x }, { y: 0, x: 1 });

            if (p1 && p2 && p1.type === p2.type) {
              type = p1.type;
              matchLength += 1;
            } else {
              check = true;
            }
          }

          if (check) {
            if (matchLength >= 3) {
              matches.push({
                y,
                x: x + 1 - matchLength,
                type,
                length: matchLength,
                horizontal: true,
              });
            }

            type = null;
            matchLength = 1;
          }
        }
      }

      // find vertical matches
      for (let x = 0; x < this.width; x++) {
        let type = null;
        let matchLength = 1;

        for (let y = 0; y < this.height; y++) {
          let check = false;

          if (y === this.height) {
            check = true;
          } else {
            const p1 = this.getPiece({ y, x });
            const p2 = this.getPiece({ y, x }, { y: 1, x: 0 });

            if (p1 && p2 && p1.type === p2.type) {
              type = p1.type;
              matchLength += 1;
            } else {
              check = true;
            }
          }

          if (check) {
            if (matchLength >= 3) {
              matches.push({
                y: y + 1 - matchLength,
                x,
                type,
                length: matchLength,
                horizontal: false,
              });
            }

            type = null;
            matchLength = 1;
          }
        }
      }

      return matches;
    }

    removeMatches(matches: Array<Match>) {
      matches.forEach(match => {
        if (match.horizontal) {
          for (let i = 0; i < match.length; i++) {
            const idx = this.coordToIdx({
              y: match.y,
              x: match.x + i,
            });

            if (~idx) this.grid[idx] = null;
          }
        } else {
          for (let i = 0; i < match.length; i++) {
            const idx = this.coordToIdx({
              y: match.y + i,
              x: match.x,
            });

            if (~idx) this.grid[idx] = null;
          }
        }
      });
    }

    swap(move: Move) {
      const to = this.grid[this.coordToIdx(move.to)];

      this.grid[this.coordToIdx(move.to)] = this.grid[
        this.coordToIdx(move.from)
      ];
      this.grid[this.coordToIdx(move.from)] = to;
    }

    applyGravity() {
      const offset = {
        up: { x: 0, y: 1 },
        down: { x: 0, y: -1 },
        left: { x: 1, y: 0 },
        right: { x: -1, y: 0 },
      };

      this.forEach(({ y, x }) => {
        const move = {
          from: { y, x },
          to: {
            y: y + offset[this.gravity].y,
            x: x + offset[this.gravity].x,
          },
        };

        let p1 = this.getPiece(move.from);
        let p2 = this.getPiece(move.to);

        while (p1 === null && p2) {
          this.swap(move);

          move.from = {...move.to};
          move.to = {
            y: move.from.y + offset[this.gravity].y,
            x: move.from.x + offset[this.gravity].x,
          };

          p1 = this.getPiece(move.from);
          p2 = this.getPiece(move.to);
        }
      });
    }

    fillVoid() {
      this.forEach((_, piece, idx) => {
        if (piece === null) {
          this.grid[idx] = this.generateRandomPiece();
        }
      });
    }

    createLevel() {
      const create = () => {
        const grid = [];
        for (let idx = 0; idx < this.width * this.height; idx++) {
          grid[idx] = this.generateRandomPiece();
        }

        this.setGrid(grid);
      };

      while (this.getMoves().length === 0 || this.getMatches().length > 0) {
        create();
      }
    }
  }

  return M3;
});
