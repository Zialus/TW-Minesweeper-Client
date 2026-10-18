import { describe, expect, it } from 'vitest';
import {
  checkWin,
  decreaseSurroundingCells,
  increaseSurroundingCells,
  newPos,
  newValue,
  validPos,
} from './board';

const grid = (rows: number, cols: number, value = 0) =>
  Array.from({ length: rows }, () => Array<number>(cols).fill(value));

describe('checkWin', () => {
  const visitedGrid = (rows: number, cols: number, value: boolean) =>
    Array.from({ length: rows }, () => Array<boolean>(cols).fill(value));

  it('is false while a non-mine cell is unvisited', () => {
    const m = grid(2, 2);
    m[0][0] = -1;
    const v = visitedGrid(2, 2, true);
    v[1][1] = false;
    expect(checkWin(m, v)).toBe(false);
  });

  it('is true when every non-mine cell is visited', () => {
    const m = grid(2, 2);
    m[0][0] = -1;
    const v = visitedGrid(2, 2, true);
    v[0][0] = false;
    expect(checkWin(m, v)).toBe(true);
  });
});

describe('validPos', () => {
  it('accepts positions inside the board', () => {
    const m = grid(3, 4);
    expect(validPos(m, 0, 0)).toBe(true);
    expect(validPos(m, 2, 3)).toBe(true);
  });

  it('rejects positions outside the board', () => {
    const m = grid(3, 4);
    expect(validPos(m, -1, 0)).toBe(false);
    expect(validPos(m, 0, -1)).toBe(false);
    expect(validPos(m, 3, 0)).toBe(false);
    expect(validPos(m, 0, 4)).toBe(false);
  });
});

describe('newValue', () => {
  it('counts the mines around a cell', () => {
    const m = grid(3, 3);
    m[0][0] = -1;
    m[0][1] = -1;
    m[2][2] = -1;
    expect(newValue(m, 1, 1)).toBe(3);
  });

  it('handles corners without reading out of bounds', () => {
    const m = grid(2, 2);
    m[1][1] = -1;
    expect(newValue(m, 0, 0)).toBe(1);
  });

  it('returns 0 when there are no adjacent mines', () => {
    expect(newValue(grid(3, 3), 1, 1)).toBe(0);
  });
});

describe('newPos', () => {
  it('returns a non-mine cell outside the clicked row and column', () => {
    const m = grid(3, 3);
    m[0][0] = -1;
    expect(newPos(m, 0, 0)).toEqual({ x: 1, y: 1 });
  });

  it('skips mines', () => {
    const m = grid(3, 3);
    m[1][1] = -1;
    expect(newPos(m, 0, 0)).toEqual({ x: 1, y: 2 });
  });

  it('throws when no position is available', () => {
    expect(() => newPos(grid(2, 2, -1), 0, 0)).toThrow(
      'No available position for the relocated mine',
    );
  });
});

describe('surrounding cells in every direction', () => {
  const corners: Array<[number, number]> = [
    [0, 0],
    [2, 2],
  ];

  it('newValue counts all 8 neighbours', () => {
    const m = grid(3, 3, -1);
    m[1][1] = 0;
    expect(newValue(m, 1, 1)).toBe(8);
  });

  it('newValue ignores out-of-bounds neighbours', () => {
    for (const [x, y] of corners) {
      const m = grid(3, 3, -1);
      m[x][y] = 0;
      expect(newValue(m, x, y)).toBe(3);
    }
  });

  it('increase/decrease touch all 8 non-mine neighbours', () => {
    const m = grid(3, 3, 1);
    increaseSurroundingCells(m, 1, 1);
    expect(m).toEqual([
      [2, 2, 2],
      [2, 1, 2],
      [2, 2, 2],
    ]);
    decreaseSurroundingCells(m, 1, 1);
    expect(m).toEqual(grid(3, 3, 1));
  });

  it('increase/decrease skip all 8 mine neighbours', () => {
    const m = grid(3, 3, -1);
    m[1][1] = 0;
    increaseSurroundingCells(m, 1, 1);
    decreaseSurroundingCells(m, 1, 1);
    expect(m).toEqual([
      [-1, -1, -1],
      [-1, 0, -1],
      [-1, -1, -1],
    ]);
  });

  it('increase/decrease ignore out-of-bounds neighbours', () => {
    for (const [x, y] of corners) {
      const m = grid(3, 3, 1);
      increaseSurroundingCells(m, x, y);
      decreaseSurroundingCells(m, x, y);
      expect(m).toEqual(grid(3, 3, 1));
    }
  });
});

describe('increase/decreaseSurroundingCells', () => {
  it('increments non-mine neighbours only', () => {
    const m = grid(3, 3, 1);
    m[0][0] = -1;
    increaseSurroundingCells(m, 1, 1);
    expect(m[0][0]).toBe(-1);
    expect(m[1][1]).toBe(1);
    expect(m[0][1]).toBe(2);
    expect(m[2][2]).toBe(2);
  });

  it('decrements non-mine neighbours only', () => {
    const m = grid(3, 3, 2);
    m[2][2] = -1;
    decreaseSurroundingCells(m, 1, 1);
    expect(m[2][2]).toBe(-1);
    expect(m[1][1]).toBe(2);
    expect(m[0][0]).toBe(1);
  });

  it('does not go out of bounds at the edges', () => {
    const m = grid(2, 2, 1);
    expect(() => increaseSurroundingCells(m, 0, 0)).not.toThrow();
    expect(m).toEqual([
      [1, 2],
      [2, 2],
    ]);
  });
});
