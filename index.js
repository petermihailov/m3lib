'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var PATTERNS = [{ mustHave: [{ row: 0, col: 1 }, { row: 0, col: 2 }], needOne: [{ row: 0, col: -1 }, { row: -1, col: 0 }, { row: 1, col: 0 }] }, { mustHave: [{ row: 0, col: -1 }, { row: 0, col: -2 }], needOne: [{ row: 0, col: 1 }, { row: -1, col: 0 }, { row: 1, col: 0 }] }, { mustHave: [{ row: 1, col: 0 }, { row: 2, col: 0 }], needOne: [{ row: -1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }] }, { mustHave: [{ row: -1, col: 0 }, { row: -2, col: 0 }], needOne: [{ row: 1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 1 }] }, { mustHave: [{ row: 0, col: -1 }, { row: 0, col: 1 }], needOne: [{ row: -1, col: 0 }, { row: 1, col: 0 }] }, { mustHave: [{ row: -1, col: 0 }, { row: 1, col: 0 }], needOne: [{ row: 0, col: -1 }, { row: 0, col: 1 }] }];


var forEach = function forEach(grid, cb) {
  for (var row = 0; row < grid.length; row++) {
    for (var col = 0; col < grid[row].length; col++) {
      cb({ row: row, col: col }, grid[row][col]);
    }
  }
};

var copyGrid = function copyGrid(grid) {
  return grid.map(function (row) {
    return [].concat(_toConsumableArray(row));
  });
};

var getRandomPiece = function getRandomPiece(types) {
  return {
    type: Math.floor(Math.random() * types) + 1
  };
};

var getPiece = exports.getPiece = function getPiece(grid, coord) {
  var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { row: 0, col: 0 };

  var row = grid[coord.row + offset.row];

  return row && row[coord.col + offset.col];
};

var isNeighbor = exports.isNeighbor = function isNeighbor(c1, c2) {
  var dr = c1.row - c2.row;
  var dc = c1.col - c2.col;

  return Boolean(
  // if vertical neighbors
  Math.abs(dr) <= 1 &&
  // if horizontal neighbors
  Math.abs(dc) <= 1 &&
  // cross pieces are not neighbors
  Math.abs(dr + dc) === 1);
};

var isEqualType = exports.isEqualType = function isEqualType(grid, c1, c2) {
  var p1 = getPiece(grid, c1);
  var p2 = getPiece(grid, c2);

  return Boolean(p1 && p2 && p1.type === p2.type);
};

var getMoves = exports.getMoves = function getMoves(grid) {
  var moves = [];

  forEach(grid, function (coord) {
    PATTERNS.forEach(function (pattern) {
      var type = void 0;

      var checkPossibleMatch = pattern.mustHave.every(function (offset) {
        var piece = getPiece(grid, coord, offset);

        if (piece) {
          if (type === undefined) {
            type = piece.type;
          }

          return type === piece.type;
        }
      });

      if (checkPossibleMatch) {
        return pattern.needOne.forEach(function (offset) {
          var coord2 = { row: coord.row + offset.row, col: coord.col + offset.col };
          var piece = getPiece(grid, coord2);

          if (piece && type === piece.type) {
            moves.push({ from: coord, to: coord2 });
          }
        });
      }
    });
  });

  return moves;
};

var getMatches = exports.getMatches = function getMatches(grid) {
  var matches = [];

  // find horizontal matches
  for (var row = 0; row < grid.length; row++) {
    var matchLength = 1;
    var colLength = grid[row].length;

    for (var col = 0; col < colLength; col++) {
      var check = false;

      if (col === colLength - 1) {
        check = true;
      } else {
        var p1 = getPiece(grid, { row: row, col: col });
        var p2 = getPiece(grid, { row: row, col: col }, { row: 0, col: 1 });

        if (p1 && p2 && p1.type === p2.type) {
          matchLength += 1;
        } else {
          check = true;
        }
      }

      if (check) {
        if (matchLength >= 3) {
          matches.push({
            row: row,
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
  for (var _col = 0; _col < grid[0].length; _col++) {
    var rowLength = grid.length;
    var _matchLength = 1;

    for (var _row = 0; _row < rowLength; _row++) {
      var _check = false;

      if (_row === grid.length) {
        _check = true;
      } else {
        var _p = getPiece(grid, { row: _row, col: _col });
        var _p2 = getPiece(grid, { row: _row, col: _col }, { row: 1, col: 0 });

        if (_p && _p2 && _p.type === _p2.type) {
          _matchLength += 1;
        } else {
          _check = true;
        }
      }

      if (_check) {
        if (_matchLength >= 3) {
          matches.push({
            row: _row + 1 - _matchLength,
            col: _col,
            length: _matchLength,
            horizontal: false
          });
        }

        _matchLength = 1;
      }
    }
  }

  return matches;
};

var removeMatches = exports.removeMatches = function removeMatches(grid, matches) {
  var gridCopy = copyGrid(grid);

  matches.forEach(function (match) {
    if (match.horizontal) {
      for (var i = 0; i < match.length; i++) {
        gridCopy[match.row][match.col + i] = null;
      }
    } else {
      for (var _i = 0; _i < match.length; _i++) {
        gridCopy[match.row + _i][match.col] = null;
      }
    }
  });

  return gridCopy;
};

var swap = exports.swap = function swap(grid, move) {
  var gridCopy = copyGrid(grid);

  gridCopy[move.to.row][move.to.col] = grid[move.from.row][move.from.col];
  gridCopy[move.from.row][move.from.col] = grid[move.to.row][move.to.col];

  return gridCopy;
};

var applyGravity = exports.applyGravity = function applyGravity(grid) {
  var gravity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'down';

  var gridCopy = copyGrid(grid);

  var offset = {
    up: { col: 0, row: 1 },
    down: { col: 0, row: -1 },
    left: { col: 1, row: 0 },
    right: { col: -1, row: 0 }
  };

  forEach(grid, function (_ref) {
    var row = _ref.row,
        col = _ref.col;

    var move = {
      from: { row: row, col: col },
      to: {
        row: row + offset[gravity].row,
        col: col + offset[gravity].col
      }
    };

    var p1 = getPiece(gridCopy, move.from);
    var p2 = getPiece(gridCopy, move.to);

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

var fillVoid = exports.fillVoid = function fillVoid(grid, types) {
  var gridCopy = copyGrid(grid);

  forEach(gridCopy, function (_ref2, piece) {
    var row = _ref2.row,
        col = _ref2.col;

    if (piece === null) {
      gridCopy[row][col] = getRandomPiece(types);
    }
  });

  return gridCopy;
};

var createLevel = exports.createLevel = function createLevel(_ref3) {
  var rows = _ref3.rows,
      cols = _ref3.cols,
      types = _ref3.types;

  var grid = [];

  var loop = function loop() {
    for (var row = 0; row < rows; row++) {
      grid[row] = [];

      for (var col = 0; col < cols; col++) {
        grid[row][col] = getRandomPiece(types);
      }
    }
  };

  while (getMoves(grid).length === 0 || getMatches(grid).length > 0) {
    loop();
  }

  return grid;
};
