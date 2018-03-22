// @flow
import type {
  Level,
  Grid,
  Gravity,
  Piece,
  Coord,
  Move,
  Match,
  Pattern
} from './m3.types'

const PATTERNS: Array<Pattern> = [
  {mustHave: [{row: 0, col: 1}, {row: 0, col: 2}], needOne: [{row: 0, col: -1}, {row: -1, col: 0}, {row: 1, col: 0}]},
  {mustHave: [{row: 0, col: -1}, {row: 0, col: -2}], needOne: [{row: 0, col: 1}, {row: -1, col: 0}, {row: 1, col: 0}]},
  {mustHave: [{row: 1, col: 0}, {row: 2, col: 0}], needOne: [{row: -1, col: 0}, {row: 0, col: -1}, {row: 0, col: 1}]},
  {mustHave: [{row: -1, col: 0}, {row: -2, col: 0}], needOne: [{row: 1, col: 0}, {row: 0, col: -1}, {row: 0, col: 1}]},
  {mustHave: [{row: 0, col: -1}, {row: 0, col: 1}], needOne: [{row: -1, col: 0}, {row: 1, col: 0}]},
  {mustHave: [{row: -1, col: 0}, {row: 1, col: 0}], needOne: [{row: 0, col: -1}, {row: 0, col: 1}]}
];

const forEach = (grid: Grid, cb: (Coord, ?Piece) => any): void => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      cb({row, col}, grid[row][col]);
    }
  }
};

const copyGrid = (grid: Grid): Grid => grid.map((row) => [...row]);

const getRandomPiece = (types: number): Piece => ({
  type: Math.floor(Math.random() * types) + 1
});

export const getPiece = (grid: Grid, coord: Coord, offset?: Coord = {row: 0, col: 0}): Piece | void => {
  const row = grid[coord.row + offset.row];

  return row && row[coord.col + offset.col];
};

export const isNeighbor = (c1: Coord, c2: Coord): boolean => Math.abs((c1.row - c2.row) + (c1.col - c2.col)) === 1;

export const isEqualType = (grid: Grid, c1: Coord, c2: Coord): boolean => {
  const p1 = getPiece(grid, c1);
  const p2 = getPiece(grid, c2);

  return Boolean(p1 && p2 && p1.type === p2.type);
};

export const getMoves = (grid: Grid): Array<Move> => {
  const moves = [];

  forEach(grid, (coord) => {
    PATTERNS.forEach((pattern) => {
      let type;

      const checkPossibleMatch = pattern.mustHave.every((offset) => {
        const piece = getPiece(grid, coord, offset);

        if (piece) {
          if (type === undefined) {
            type = piece.type;
          }

          return type === piece.type;
        }
      });

      if (checkPossibleMatch) {
        return pattern.needOne.forEach((offset) => {
          const coord2 = {row: coord.row + offset.row, col: coord.col + offset.col};
          const piece = getPiece(grid, coord2);

          if (piece && type === piece.type) {
            moves.push({from: coord, to: coord2});
          }
        })
      }
    })
  });

  return moves;
};

export const getMatches = (grid: Grid): Array<Match> => {
  const matches = [];

  // find horizontal matches
  for (let row = 0; row < grid.length; row++) {
    let matchLength = 1;
    const colLength = grid[row].length;

    for (let col = 0; col < colLength; col++) {
      let check = false;

      if (row === colLength - 1) {
        check = true;
      } else {
        const p1 = getPiece(grid, {row, col});
        const p2 = getPiece(grid, {row, col}, {row: 0, col: 1});

        if (p1 && p2 && p1.type === p2.type) {
          matchLength += 1;
        } else {
          check = true;
        }
      }

      if (check) {
        if (matchLength >= 3) {
          matches.push({
            row,
            col: col + 1 - matchLength,
            length: matchLength,
            horizontal: true
          });
        }

        matchLength = 1;
      }
    }
  }

  // find vertical matches
  for (let col = 0; col < grid[0].length; col++) {
    const rowLength = grid.length;
    let matchLength = 1;

    for (let row = 0; row < rowLength; row++) {
      let check = false;

      if (row === grid.length - 1) {
        check = true;
      } else {
        const p1 = getPiece(grid, {row, col});
        const p2 = getPiece(grid, {row, col}, {row: 1, col: 0});

        if (p1 && p2 && p1.type === p2.type) {
          matchLength += 1;
        } else {
          check = true;
        }
      }

      if (check) {
        if (matchLength >= 3) {
          matches.push({
            row: row + 1 - matchLength,
            col,
            length: matchLength,
            horizontal: false
          });
        }

        matchLength = 1;
      }
    }
  }

  return matches;
};

export const removeMatches = (grid: Grid, matches: Array<Match>): Grid => {
  const gridCopy = copyGrid(grid);

  matches.forEach((match) => {
    if (match.horizontal) {
      for (let i = 0; i < match.length; i++) {
        gridCopy[match.row][match.col + i] = null;
      }
    } else {
      for (let i = 0; i < match.length; i++) {
        gridCopy[match.row + i][match.col] = null;
      }
    }
  });

  return gridCopy;
};

export const swap = (grid: Grid, move: Move): Grid => {
  const gridCopy = copyGrid(grid);

  gridCopy[move.to.row][move.to.col] = grid[move.from.row][move.from.col];
  gridCopy[move.from.row][move.from.col] = grid[move.to.row][move.to.col];

  return gridCopy;
};

export const applyGravity = (grid: Grid, gravity: Gravity = 'down'): Grid => {
  let gridCopy = copyGrid(grid);

  const offset = {
    up: {col: 0, row: 1},
    down: {col: 0, row: -1},
    left: {col: 1, row: 0},
    right: {col: -1, row: 0}
  };

  forEach(grid, ({row, col}) => {
    const move = {
      from: {row, col},
      to: {
        row: row + offset[gravity].row,
        col: col + offset[gravity].col
      }
    };

    let p1 = getPiece(gridCopy, move.from);
    let p2 = getPiece(gridCopy, move.to);

    while (p1 === null && p2) {
      gridCopy = swap(gridCopy, move);

      move.from = Object.assign({}, move.to);
      move.to = {
        row: move.from.row + offset[gravity].row,
        col: move.from.col + offset[gravity].col
      };

      p1 = getPiece(gridCopy, move.from);
      p2 = getPiece(gridCopy, move.to);
    }
  });

  return gridCopy;
};

export const fillVoid = (grid: Grid, types: number): Grid => {
  const gridCopy = copyGrid(grid);

  forEach(gridCopy, ({row, col}, piece) => {
    if (piece === null) {
      gridCopy[row][col] = getRandomPiece(types);
    }
  });

  return gridCopy;
};

export const createLevel = ({rows, cols, types}: Level): Grid => {
  const grid = [];

  const loop = () => {
    for (let row = 0; row < rows; row++) {
      grid[row] = [];

      for (let col = 0; col < cols; col++) {
        grid[row][col] = getRandomPiece(types);
      }
    }
  };

  while (getMoves(grid).length === 0 || getMatches(grid).length > 0) {
    loop();
  }

  return grid;
};
