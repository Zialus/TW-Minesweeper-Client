import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { addToArray, canvas_explode } from './helpers';

describe('addToArray', () => {
  it('should iterate through array until finding correct insertion position', () => {
    // Arrange
    const array = [
      { uname: 'charlie', score: 100 },
      { uname: 'eve', score: 50 },
      { uname: 'alice', score: 200 },
    ];
    const newPlayer = { uname: 'david', score: 120 };

    // Act
    addToArray(newPlayer, array);

    // Assert
    expect(array).toEqual([
      { uname: 'charlie', score: 100 },
      { uname: 'eve', score: 50 },
      { uname: 'david', score: 120 },
      { uname: 'alice', score: 200 },
    ]);
  });
});

describe('canvas_explode', () => {
  // Store original Image before mocking (needs let for afterEach access)
  const originalImage = global.Image;

  beforeEach(() => {
    // Create a canvas element in the DOM for testing
    const canvas = document.createElement('canvas');
    canvas.id = '2#3';
    canvas.width = 25;
    canvas.height = 25;

    // Mock the 2d context for the canvas
    const mockCtx = {
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    };
    Object.defineProperty(canvas, 'getContext', {
      value: vi.fn(() => mockCtx),
    });

    document.body.appendChild(canvas);

    // Mock setInterval to track calls
    vi.useFakeTimers();

    // Mock Image constructor to capture onload
    global.Image = vi.fn(function (this: HTMLImageElement) {
      Object.defineProperty(this, 'src', {
        set(this: HTMLImageElement) {
          // Simulate the image load
          const onload = this.onload;
          if (onload) {
            onload.call(this, new Event('load'));
          }
        },
      });
    }) as unknown as typeof Image;
  });

  afterEach(() => {
    // Restore Image to original
    global.Image = originalImage;

    // Restore real timers
    vi.useRealTimers();

    // Clean up the canvas element
    const canvas = document.getElementById('2#3');
    if (canvas) {
      canvas.remove();
    }
  });

  it('should set up animation by creating Image and setting src to trigger animation', () => {
    // Arrange
    const setIntervalSpy = vi.spyOn(global, 'setInterval');

    // Act
    canvas_explode(2, 3);

    // Advance timers
    vi.runAllTimers();

    // Assert - setInterval should be called to start animation
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 150);
  });
});
