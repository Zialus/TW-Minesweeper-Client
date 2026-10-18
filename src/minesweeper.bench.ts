/// <reference types="vite/client" />
import { beforeAll, describe, test } from 'vitest';
import indexHtml from './index.html?raw';
import { getRequiredElement, type Dificulty } from './helpers';
import { seededRandom, silenceConsole } from './benchUtils';

silenceConsole();

let table: HTMLTableElement;
let modeSelect: HTMLSelectElement;
let difficultySelect: HTMLSelectElement;
let startButton: HTMLInputElement;
let giveUpButton: HTMLInputElement;

function startSinglePlayerGame(difficulty: Dificulty) {
  // Seed mine placement so every iteration plays the exact same board.
  Math.random = seededRandom(1234);
  modeSelect.value = '1 Player';
  difficultySelect.value = difficulty;
  startButton.click();
}

function allCells(): HTMLTableCellElement[] {
  return Array.from(table.rows).flatMap((row) => Array.from(row.cells));
}

const difficulties: Dificulty[] = ['beginner', 'intermediate', 'expert'];

// Full game flows are heavy under CodSpeed's CPU simulation, so give them
// more time than the default 60s test timeout.
const timeout = 300_000;

describe('single player game', () => {
  beforeAll(async () => {
    window.alert = () => undefined;
    // Load the real page markup and boot the game like the browser would.
    document.body.innerHTML =
      /<body>([\s\S]*)<\/body>/.exec(indexHtml)?.[1] ?? '';
    await import('./minesweeper');
    (window.onload as () => void)();

    table = getRequiredElement('tab', HTMLTableElement);
    modeSelect = getRequiredElement('modo', HTMLSelectElement);
    difficultySelect = getRequiredElement('dificuldade', HTMLSelectElement);
    startButton = getRequiredElement('iniciar', HTMLInputElement);
    giveUpButton = getRequiredElement('encerrar', HTMLInputElement);
  });

  test(
    'start game (board generation + rendering)',
    { timeout },
    async ({ bench }) => {
      await bench.compare(
        ...difficulties.map((difficulty) =>
          bench(difficulty, () => {
            startSinglePlayerGame(difficulty);
            giveUpButton.click();
          }),
        ),
      );
    },
  );

  test(
    'play game (left click every cell until over)',
    { timeout },
    async ({ bench }) => {
      await bench.compare(
        ...difficulties.map((difficulty) =>
          bench(difficulty, () => {
            startSinglePlayerGame(difficulty);
            for (const cell of allCells()) {
              cell.click();
            }
            giveUpButton.click();
          }),
        ),
      );
    },
  );
});
