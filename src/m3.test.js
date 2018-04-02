import * as m3 from './m3';

test('swap pieces', () => {
  const cases = [
    {
      grid: [
        [{type: 1}, {type: 0}]
      ],
      move: {
        from: {row: 0, col: 0},
        to: {row: 0, col: 1}
      },
      expected: [
        [{type: 0}, {type: 1}],
      ]
    }
  ];

  cases.forEach((c) => expect(m3.swap(c.grid, c.move)).toEqual(c.expected));
});

describe('get piece', () => {
  const grid = [[{type: 1}]];

  const tests = [
    {
      name: 'piece exists',
      coord: {row: 0, col: 0},
      expected: {'type': 1}
    },
    {
      name: 'piece not exists (no exists row)',
      coord: {row: 1, col: 0},
      expected: undefined
    },
    {
      name: 'piece not exists (no exists col)',
      coord: {row: 0, col: 1},
      expected: undefined
    }
  ];

  tests.forEach((t) => test(t.name, () => expect(m3.getPiece(grid, t.coord)).toEqual(t.expected)));
});

describe('check equal pieces', () => {
  const coords = [
    {
      row: 0,
      col: 0
    }, {
      row: 0,
      col: 1
    }
  ];

  const cases = [
    {
      name: 'pieces are equal',
      grid: [
        [{type: 0}, {type: 0}]
      ],
      expected: true
    },
    {
      name: 'pieces are not equal',
      grid: [
        [{type: 1}, {type: 0}]
      ],
      expected: false
    },
    {
      name: 'pieces are not equal with undefined',
      grid: [
        [{type: 0}]
      ],
      expected: false
    }
  ];

  cases.forEach((c) => test(c.name, () => expect(m3.isEqualType(c.grid, coords[0], coords[1])).toEqual(c.expected)));
});

describe('check if pieces are neighbors', () => {
  const cases = [
    {
      name: 'neighbor on the top',
      coords: [
        {
          row: 1,
          col: 0
        }, {
          row: 0,
          col: 0
        }
      ],
      expected: true
    },
    {
      name: 'neighbor on the bottom',
      coords: [
        {
          row: 0,
          col: 0
        }, {
          row: 1,
          col: 0
        }
      ],
      expected: true
    },
    {
      name: 'neighbor on the left',
      coords: [
        {
          row: 0,
          col: 1
        }, {
          row: 0,
          col: 0
        }
      ],
      expected: true
    },
    {
      name: 'neighbor on the right',
      coords: [
        {
          row: 0,
          col: 0
        }, {
          row: 0,
          col: 1
        }
      ],
      expected: true
    },
    {
      name: 'pieces are not neighbors',
      coords: [
        {
          row: 0,
          col: 0
        }, {
          row: 1,
          col: 1
        }
      ],
      expected: false
    },
    {
      name: 'himself is not a neighbor',
      coords: [
        {
          row: 0,
          col: 1
        }, {
          row: 0,
          col: 1
        }
      ],
      expected: false
    },
    {
      name: 'cross pieces are not neighbors',
      coords: [
        {
          row: 0,
          col: 1
        }, {
          row: 2,
          col: 0
        }
      ],
      expected: false
    },
  ];

  cases.forEach((c) => test(c.name, () => expect(m3.isNeighbor(c.coords[0], c.coords[1])).toEqual(c.expected)));
});

describe('get moves', () => {
  const cases = [
    {
      name: 'moves to center',
      grid: [
        [{type: 0}, {type: 1}, {type: 0}],
        [{type: 1}, {type: 0}, {type: 1}],
        [{type: 0}, {type: 1}, {type: 0}]
      ],
      expect: [
        {'from': {'row': 0, 'col': 1}, 'to': {'row': 1, 'col': 1}},
        {'from': {'row': 1, 'col': 0}, 'to': {'row': 1, 'col': 1}},
        {'from': {'row': 1, 'col': 1}, 'to': {'row': 0, 'col': 1}},
        {'from': {'row': 1, 'col': 1}, 'to': {'row': 2, 'col': 1}},
        {'from': {'row': 1, 'col': 1}, 'to': {'row': 1, 'col': 0}},
        {'from': {'row': 1, 'col': 1}, 'to': {'row': 1, 'col': 2}},
        {'from': {'row': 1, 'col': 2}, 'to': {'row': 1, 'col': 1}},
        {'from': {'row': 2, 'col': 1}, 'to': {'row': 1, 'col': 1}}
      ]
    },
    {
      name: 'vertical moves',
      grid: [
        [{type: 0}, {type: 1}],
        [{type: 1}, {type: 0}],
        [{type: 1}, {type: 0}],
        [{type: 0}, {type: 1}]
      ],
      expect: [
        {'from': {'row': 0, 'col': 0}, 'to': {'row': 0, 'col': 1}},
        {'from': {'row': 0, 'col': 1}, 'to': {'row': 0, 'col': 0}},
        {'from': {'row': 3, 'col': 0}, 'to': {'row': 3, 'col': 1}},
        {'from': {'row': 3, 'col': 1}, 'to': {'row': 3, 'col': 0}}
      ]
    },
    {
      name: 'horizontal moves',
      grid: [
        [{type: 0}, {type: 1}, {type: 1}, {type: 0}],
        [{type: 1}, {type: 0}, {type: 0}, {type: 1}]
      ],
      expect: [
        {'from': {'row': 0, 'col': 0}, 'to': {'row': 1, 'col': 0}},
        {'from': {'row': 0, 'col': 3}, 'to': {'row': 1, 'col': 3}},
        {'from': {'row': 1, 'col': 0}, 'to': {'row': 0, 'col': 0}},
        {'from': {'row': 1, 'col': 3}, 'to': {'row': 0, 'col': 3}}
      ]
    },
    {
      name: 'no moves',
      grid: [
        [{type: 0}, {type: 1}, {type: 0}]
      ],
      expect: []
    }
  ];

  cases.forEach((c) => test(c.name, () => expect(m3.getMoves(c.grid)).toEqual(c.expect)));
});

describe('get matches', () => {
  const cases = [
    {
      name: 'get horizontal and vertical matches',
      grid: [
        [{type: 0}, {type: 1}, {type: 0}],
        [{type: 1}, {type: 1}, {type: 1}],
        [{type: 0}, {type: 1}, {type: 0}],
      ],
      expected: [
        {'row': 1, 'col': 0, 'length': 3, 'horizontal': true},
        {'row': 0, 'col': 1, 'length': 3, 'horizontal': false},
      ]
    },
    {
      name: 'get more than 3 vertical match',
      grid: [
        [{type: 1}],
        [{type: 1}],
        [{type: 1}],
        [{type: 1}]
      ],
      expected: [
        {'row': 0, 'col': 0, 'length': 4, 'horizontal': false}
      ]
    },
    {
      name: 'get more than 3 horizontal match',
      grid: [
        [{type: 5}, {type: 1}, {type: 1}, {type: 4}, {type: 5}, {type: 4}],
        [{type: 5}, {type: 1}, {type: 3}, {type: 1}, {type: 4}, {type: 1}],
        [{type: 4}, {type: 3}, {type: 3}, {type: 5}, {type: 3}, {type: 1}],
        [{type: 5}, {type: 1}, {type: 1}, {type: 2}, {type: 1}, {type: 4}],
        [{type: 5}, {type: 4}, {type: 2}, {type: 1}, {type: 3}, {type: 3}],
        [{type: 4}, {type: 5}, {type: 3}, {type: 3}, {type: 3}, {type: 1}]
      ],
      expected: [
        {'row': 5, 'col': 2, 'length': 3, 'horizontal': true}
      ]
    },
    {
      name: 'no matches',
      grid: [
        [{type: 1}, {type: 1}, {type: 0}]
      ],
      expected: []
    }
  ];

  cases.forEach((c) => test(c.name, () => expect(m3.getMatches(c.grid)).toEqual(c.expected)));
});

describe('remove matches', () => {
  const cases = [
    {
      name: 'remove horizontal and vertical matches',
      grid: [
        [{type: 1}, {type: 1}, {type: 1}],
        [{type: 0}, {type: 1}, {type: 0}],
        [{type: 0}, {type: 1}, {type: 0}]
      ],
      matches: [
        {'row': 0, 'col': 0, 'length': 3, 'horizontal': true},
        {'row': 0, 'col': 1, 'length': 3, 'horizontal': false},
      ],
      expected: [
        [null, null, null],
        [{type: 0}, null, {type: 0}],
        [{type: 0}, null, {type: 0}]
      ]
    },
    {
      name: 'remove empty matches',
      grid: [
        [{type: 1}, {type: 1}, {type: 1}],
        [{type: 0}, {type: 1}, {type: 0}],
        [{type: 0}, {type: 1}, {type: 0}]
      ],
      matches: [],
      expected: [
        [{type: 1}, {type: 1}, {type: 1}],
        [{type: 0}, {type: 1}, {type: 0}],
        [{type: 0}, {type: 1}, {type: 0}]
      ]
    }
  ];

  cases.forEach((c) => {
    test(c.name, () => expect(m3.removeMatches(c.grid, c.matches)).toEqual(c.expected));
  });
});

describe('apply gravity', () => {
  const grid = [
    [{type: 1}, null],
    [null, {type: 1}]
  ];

  const cases = [
    {
      name: 'pieces to up',
      gravity: 'up',
      expected: [
        [{'type': 1}, {'type': 1}],
        [null, null]
      ]
    },
    {
      name: 'pieces to down',
      gravity: 'down',
      expected: [
        [null, null],
        [{'type': 1}, {'type': 1}]
      ]
    },
    {
      name: 'pieces to left',
      gravity: 'left',
      expected: [
        [{'type': 1}, null],
        [{'type': 1}, null]
      ]
    },
    {
      name: 'pieces to right',
      gravity: 'right',
      expected: [
        [null, {'type': 1}],
        [null, {'type': 1}]
      ]
    },
  ];

  cases.forEach((c) => test(c.name, () => expect(m3.applyGravity(grid, c.gravity)).toEqual(c.expected)));
});

describe('fill void', () => {
  const grid = [
    [{type: 1}, null],
    [{type: 1}, {type: 1}]
  ];

  const types = 5;

  test('no void pieces', () => expect(m3.fillVoid(grid, types)).not.toEqual(expect.arrayContaining([null])));
});

describe('create level', () => {
  const grid = m3.createLevel({
    rows: 6,
    cols: 6,
    types: 5
  });

  test('grid does not contain matches', () => expect(m3.getMatches(grid)).toEqual([]));
  test('grid has available moves', () => expect(m3.getMoves(grid)).not.toHaveLength(0));
});
