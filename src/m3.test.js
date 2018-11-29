const M3 = require('./m3');

test('swap pieces', () => {
  const tests = [
    {
      m3: new M3({
        width: 2,
        height: 1,
        grid: [{ type: 1 }, { type: 0 }],
      }),
      expected: [{ type: 0 }, { type: 1 }],
      move: {
        from: { y: 0, x: 0 },
        to: { y: 0, x: 1 },
      },
    },
  ];

  tests.forEach(({ m3, move, expected }) => {
    m3.swap(move);
    expect(m3.grid).toEqual(expected);
  });
});

describe('get piece', () => {
  const m3 = new M3({ grid: [{ type: 1 }], width: 1, height: 1 });

  const tests = [
    {
      name: 'piece exists',
      coord: { y: 0, x: 0 },
      expected: { type: 1 },
    },
    {
      name: 'piece not exists (no exists row)',
      coord: { y: 1, x: 0 },
      expected: undefined,
    },
    {
      name: 'piece not exists (no exists col)',
      coord: { y: 0, x: 1 },
      expected: undefined,
    },
  ];

  tests.forEach(({ name, coord, expected }) => {
    test(name, () => expect(m3.getPiece(coord)).toEqual(expected));
  });
});

describe('check if pieces are neighbors', () => {
  const m3 = new M3();
  const tests = [
    {
      name: 'neighbor on the top',
      coords: [{ y: 1, x: 0 }, { y: 0, x: 0 }],
      expected: true,
    },
    {
      name: 'neighbor on the bottom',
      coords: [{ y: 0, x: 0 }, { y: 1, x: 0 }],
      expected: true,
    },
    {
      name: 'neighbor on the left',
      coords: [{ y: 0, x: 1 }, { y: 0, x: 0 }],
      expected: true,
    },
    {
      name: 'neighbor on the right',
      coords: [{ y: 0, x: 0 }, { y: 0, x: 1 }],
      expected: true,
    },
    {
      name: 'pieces are not neighbors',
      coords: [{ y: 0, x: 0 }, { y: 1, x: 1 }],
      expected: false,
    },
    {
      name: 'himself is not a neighbor',
      coords: [{ y: 0, x: 1 }, { y: 0, x: 1 }],
      expected: false,
    },
    {
      name: 'cross pieces are not neighbors',
      coords: [{ y: 0, x: 1 }, { y: 2, x: 0 }],
      expected: false,
    },
  ];

  tests.forEach(({ name, coords, expected }) =>
    test(name, () => {
      expect(m3.isNeighbor(coords[0], coords[1])).toEqual(expected);
    }),
  );
});

describe('get moves', () => {
  const tests = [
    {
      name: 'moves to center',
      m3: new M3({
        width: 3,
        height: 3,
        grid: [
          { type: 0 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
        ],
      }),
      expected: [
        { from: { y: 0, x: 1 }, to: { y: 1, x: 1 } },
        { from: { y: 1, x: 0 }, to: { y: 1, x: 1 } },
        { from: { y: 1, x: 1 }, to: { y: 0, x: 1 } },
        { from: { y: 1, x: 1 }, to: { y: 2, x: 1 } },
        { from: { y: 1, x: 1 }, to: { y: 1, x: 0 } },
        { from: { y: 1, x: 1 }, to: { y: 1, x: 2 } },
        { from: { y: 1, x: 2 }, to: { y: 1, x: 1 } },
        { from: { y: 2, x: 1 }, to: { y: 1, x: 1 } },
      ],
    },
    {
      name: 'vertical moves',
      m3: new M3({
        width: 2,
        height: 4,
        grid: [
          { type: 0 },
          { type: 1 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
          { type: 0 },
          { type: 1 },
        ],
      }),
      expected: [
        { from: { y: 0, x: 0 }, to: { y: 0, x: 1 } },
        { from: { y: 0, x: 1 }, to: { y: 0, x: 0 } },
        { from: { y: 3, x: 0 }, to: { y: 3, x: 1 } },
        { from: { y: 3, x: 1 }, to: { y: 3, x: 0 } },
      ],
    },
    {
      name: 'horizontal moves',
      m3: new M3({
        width: 4,
        height: 2,
        grid: [
          { type: 0 },
          { type: 1 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
          { type: 0 },
          { type: 1 },
        ],
      }),
      expected: [
        { from: { y: 0, x: 0 }, to: { y: 1, x: 0 } },
        { from: { y: 0, x: 3 }, to: { y: 1, x: 3 } },
        { from: { y: 1, x: 0 }, to: { y: 0, x: 0 } },
        { from: { y: 1, x: 3 }, to: { y: 0, x: 3 } },
      ],
    },
    {
      name: 'no moves',
      m3: new M3({
        width: 3,
        height: 1,
        grid: [{ type: 0 }, { type: 1 }, { type: 0 }],
      }),
      expected: [],
    },
  ];

  tests.forEach(({ name, m3, expected }) =>
    test(name, () => {
      expect(m3.getMoves()).toEqual(expected);
    }),
  );
});

describe('get matches', () => {
  const tests = [
    {
      name: 'get horizontal and vertical matches',
      m3: new M3({
        width: 3,
        height: 3,
        grid: [
          { type: 0 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 1 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
        ],
      }),
      expected: [
        { y: 1, x: 0, length: 3, type: 1, horizontal: true },
        { y: 0, x: 1, length: 3, type: 1, horizontal: false },
      ],
    },
    {
      name: 'get more than 3 vertical match',
      m3: new M3({
        width: 1,
        height: 4,
        grid: [{ type: 1 }, { type: 1 }, { type: 1 }, { type: 1 }],
      }),
      expected: [{ y: 0, x: 0, length: 4, type: 1, horizontal: false }],
    },
    {
      name: 'get more than 3 horizontal match',
      m3: new M3({
        width: 6,
        height: 6,
        grid: [
          { type: 5 },
          { type: 1 },
          { type: 1 },
          { type: 4 },
          { type: 5 },
          { type: 4 },
          { type: 5 },
          { type: 1 },
          { type: 3 },
          { type: 1 },
          { type: 4 },
          { type: 1 },
          { type: 4 },
          { type: 3 },
          { type: 3 },
          { type: 5 },
          { type: 3 },
          { type: 1 },
          { type: 5 },
          { type: 1 },
          { type: 1 },
          { type: 2 },
          { type: 1 },
          { type: 4 },
          { type: 5 },
          { type: 4 },
          { type: 2 },
          { type: 1 },
          { type: 3 },
          { type: 3 },
          { type: 4 },
          { type: 5 },
          { type: 3 },
          { type: 3 },
          { type: 3 },
          { type: 1 },
        ],
      }),
      expected: [{ y: 5, x: 2, length: 3, type: 3, horizontal: true }],
    },
    {
      name: 'no matches',
      m3: new M3({
        width: 3,
        height: 1,
        grid: [{ type: 1 }, { type: 1 }, { type: 0 }],
      }),
      expected: [],
    },
  ];

  tests.forEach(({ name, m3, expected }) =>
    test(name, () => {
      expect(m3.getMatches()).toEqual(expected);
    }),
  );
});
describe('remove matches', () => {
  const tests = [
    {
      name: 'remove horizontal and vertical matches',
      m3: new M3({
        width: 3,
        height: 3,
        grid: [
          { type: 1 },
          { type: 1 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
        ],
      }),
      matches: [
        { y: 0, x: 0, length: 3, horizontal: true },
        { y: 0, x: 1, length: 3, horizontal: false },
      ],
      expected: [
        null,
        null,
        null,
        { type: 0 },
        null,
        { type: 0 },
        { type: 0 },
        null,
        { type: 0 },
      ],
    },
    {
      name: 'remove empty matches',
      m3: new M3({
        width: 3,
        height: 3,
        grid: [
          { type: 1 },
          { type: 1 },
          { type: 1 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
          { type: 0 },
          { type: 1 },
          { type: 0 },
        ],
      }),
      matches: [],
      expected: [
        { type: 1 },
        { type: 1 },
        { type: 1 },
        { type: 0 },
        { type: 1 },
        { type: 0 },
        { type: 0 },
        { type: 1 },
        { type: 0 },
      ],
    },
  ];

  tests.forEach(({ name, m3, matches, expected }) => {
    m3.removeMatches(matches);
    test(name, () => expect(m3.grid).toEqual(expected));
  });
});

describe('apply gravity', () => {
  const tests = [
    {
      name: 'pieces to up',
      m3: new M3({
        gravity: 'up',
        width: 2,
        height: 2,
        grid: [{ type: 1 }, null, null, { type: 1 }],
      }),
      expected: [{ type: 1 }, { type: 1 }, null, null],
    },
    {
      name: 'pieces to down',
      m3: new M3({
        gravity: 'down',
        width: 2,
        height: 2,
        grid: [{ type: 1 }, null, null, { type: 1 }],
      }),
      expected: [null, null, { type: 1 }, { type: 1 }],
    },
    {
      name: 'pieces to left',
      m3: new M3({
        gravity: 'left',
        width: 2,
        height: 2,
        grid: [{ type: 1 }, null, null, { type: 1 }],
      }),
      expected: [{ type: 1 }, null, { type: 1 }, null],
    },
    {
      name: 'pieces to right',
      m3: new M3({
        gravity: 'right',
        width: 2,
        height: 2,
        grid: [{ type: 1 }, null, null, { type: 1 }],
      }),
      expected: [null, { type: 1 }, null, { type: 1 }],
    },
  ];

  tests.forEach(({ name, m3, expected }) =>
    test(name, () => {
      m3.applyGravity();
      expect(m3.grid).toEqual(expected);
    }),
  );
});

describe('fill void', () => {
  const m3 = new M3({
    grid: [{ type: 1 }, null, { type: 1 }, { type: 1 }],
  });

  m3.fillVoid();

  test('no void pieces', () =>
    expect(m3.grid).not.toEqual(expect.arrayContaining([null])));
});

describe('create level', () => {
  const m3 = new M3();
  m3.createLevel();

  test('grid does not contain matches', () =>
    expect(m3.getMatches()).toEqual([]));
  test('grid has available moves', () =>
    expect(m3.getMoves()).not.toHaveLength(0));
});
