import { describe, test } from 'vitest';
import * as helpers from './helpers';
import type { Player } from './helpers';
import { seededRandom, silenceConsole } from './benchUtils';

silenceConsole();

// Bind the functions locally so module export getters do not add overhead
// to the measured loops.
const { addToArray, getRequiredElement, isDificulty } = helpers;

function makeHonorTable(size: number): Player[] {
  const random = seededRandom(42);
  const table: Player[] = [];
  for (let i = 0; i < size; i++) {
    table.push({ uname: `player_${i}`, score: Math.floor(random() * 1000) });
  }
  return table.sort((a, b) => a.score - b.score);
}

describe('addToArray', () => {
  const scores = Array.from({ length: 100 }, (_, i) => i * 10);

  test('insert 100 scores into an honor table', async ({ bench }) => {
    const small = makeHonorTable(10);
    const large = makeHonorTable(1_000);

    await bench.compare(
      bench('10-entry honor table', () => {
        const table = small.slice();
        for (const score of scores) {
          addToArray({ uname: 'bench', score }, table);
        }
      }),
      bench('1000-entry honor table', () => {
        const table = large.slice();
        for (const score of scores) {
          addToArray({ uname: 'bench', score }, table);
        }
      }),
    );
  });
});

describe('isDificulty', () => {
  const values = ['beginner', 'intermediate', 'expert', 'impossible', ''];

  test('validate difficulty strings', async ({ bench }) => {
    await bench('1000 validations', () => {
      for (let i = 0; i < 1_000; i++) {
        isDificulty(values[i % values.length] ?? '');
      }
    }).run();
  });
});

describe('getRequiredElement', () => {
  const ids = Array.from({ length: 100 }, (_, i) => `element_${i}`);

  test('lookup elements by id', async ({ bench }) => {
    document.body.innerHTML = ids
      .map((id) => `<div id="${id}"><span>${id}</span></div>`)
      .join('');

    await bench('100 lookups', () => {
      for (const id of ids) {
        getRequiredElement(id, HTMLDivElement);
      }
    }).run();
  });
});
