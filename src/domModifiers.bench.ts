/// <reference types="vite/client" />
import { beforeAll, describe, test } from 'vitest';
import indexHtml from './index.html?raw';
import {
  clearMessage,
  cleanError,
  errorMessage,
  hideGameMode,
  hideHonorTable,
  logOut,
  playerIsWaiting,
  playerLoggedIn,
  showGameMode,
  showHonorTable,
  showWhosTurn,
  updatePlayersStats,
} from './domModifiers';
import { silenceConsole } from './benchUtils';

silenceConsole();

describe('domModifiers', () => {
  beforeAll(() => {
    // Load the real page markup so every element the UI helpers expect exists.
    document.body.innerHTML =
      /<body>([\s\S]*)<\/body>/.exec(indexHtml)?.[1] ?? '';
  });

  test('UI state updates', async ({ bench }) => {
    await bench.compare(
      bench('toggle honor table and game mode', () => {
        for (let i = 0; i < 50; i++) {
          showHonorTable();
          hideHonorTable();
          hideGameMode();
          showGameMode();
        }
      }),
      bench('multiplayer status updates', () => {
        for (let i = 0; i < 50; i++) {
          playerLoggedIn('alice');
          playerIsWaiting('alice');
          showWhosTurn(i % 2 === 0 ? 'alice' : 'bob');
          updatePlayersStats('alice', i, 'bob', 50 - i);
          clearMessage();
        }
      }),
      bench('error message and log out', () => {
        for (let i = 0; i < 50; i++) {
          errorMessage('Something went wrong');
          cleanError();
          logOut();
        }
      }),
    );
  });
});
