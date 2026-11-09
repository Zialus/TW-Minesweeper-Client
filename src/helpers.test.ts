import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  addToArray,
  canvas_explode,
  getRequiredElement,
  isDificulty,
} from './helpers';

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

  it('should insert into an empty array', () => {
    const player = { uname: 'david', score: 250 };
    const players: (typeof player)[] = [];

    addToArray(player, players);

    expect(players).toEqual([player]);
  });

  it('should place equal scores before existing entries', () => {
    const existing = { uname: 'charlie', score: 250 };
    const player = { uname: 'david', score: 250 };
    const players = [existing];

    addToArray(player, players);

    expect(players).toEqual([player, existing]);
  });
});

describe('isDificulty', () => {
  it.each(['beginner', 'intermediate', 'expert'])(
    'accepts %s',
    (difficulty) => {
      expect(isDificulty(difficulty)).toBe(true);
    },
  );

  it('rejects unknown difficulties', () => {
    expect(isDificulty('advanced')).toBe(false);
  });
});

describe('getRequiredElement', () => {
  afterEach(() => {
    document.body.replaceChildren();
  });

  it('returns an element matching the requested constructor', () => {
    const input = document.createElement('input');
    input.id = 'required-input';
    document.body.appendChild(input);

    expect(getRequiredElement('required-input', HTMLInputElement)).toBe(input);
  });

  it('throws when the element is missing', () => {
    expect(() => {
      getRequiredElement('missing-element', HTMLInputElement);
    }).toThrow('Missing element (#missing-element)');
  });

  it('throws when the element does not match the requested constructor', () => {
    const div = document.createElement('div');
    div.id = 'required-div';
    document.body.appendChild(div);

    expect(() => {
      getRequiredElement('required-div', HTMLInputElement);
    }).toThrow('Element (#required-div) is not a HTMLInputElement');
  });
});

describe('canvas_explode', () => {
  // Store original Image before mocking (needs let for afterEach access)
  const originalImage = global.Image;
  const images: HTMLImageElement[] = [];
  const mockContext = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
  };

  beforeEach(() => {
    images.length = 0;

    // Create a canvas element in the DOM for testing
    const canvas = document.createElement('canvas');
    canvas.id = '2#3';
    canvas.width = 25;
    canvas.height = 25;

    // Mock the 2d context for the canvas
    mockContext.clearRect.mockClear();
    mockContext.drawImage.mockClear();
    Object.defineProperty(canvas, 'getContext', {
      configurable: true,
      value: vi.fn(() => mockContext),
    });

    document.body.appendChild(canvas);

    // Mock setInterval to track calls
    vi.useFakeTimers();

    // Mock Image constructor to capture onload
    global.Image = class extends originalImage {
      private imageSource = '';

      constructor() {
        super();
        images.push(this);
        this.onload = null;
      }

      override get src() {
        return this.imageSource;
      }

      override set src(value: string) {
        this.imageSource = value;
        this.onload?.(new Event('load'));
      }
    };
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

  it('should draw all frames and stop the animation', () => {
    const setIntervalSpy = vi.spyOn(global, 'setInterval');

    canvas_explode(2, 3);
    vi.advanceTimersByTime(14 * 150);

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 150);
    expect(images[0].src).toBe('static/imgs/explosion.png');
    expect(mockContext.drawImage).toHaveBeenNthCalledWith(
      1,
      images[0],
      0,
      0,
      39,
      38,
      0,
      0,
      25,
      25,
    );
    expect(mockContext.drawImage).toHaveBeenNthCalledWith(
      13,
      images[0],
      39 * 12,
      0,
      39,
      38,
      0,
      0,
      25,
      25,
    );
    expect(mockContext.drawImage).toHaveBeenCalledTimes(13);
    expect(mockContext.clearRect).toHaveBeenCalledTimes(14);

    vi.advanceTimersByTime(150);
    expect(mockContext.clearRect).toHaveBeenCalledTimes(14);
  });

  it('throws when the canvas has no 2D context', () => {
    const canvas = document.getElementById('2#3');
    Object.defineProperty(canvas, 'getContext', {
      configurable: true,
      value: vi.fn(() => null),
    });

    expect(() => {
      canvas_explode(2, 3);
    }).toThrow('Canvas (#2#3) does not support 2D rendering');
  });
});
