export interface Player {
  name?: string;
  uname?: string;
  score: number;
}

export type Dificulty = 'beginner' | 'intermediate' | 'expert';

export const isDificulty = (value: string): value is Dificulty =>
  value === 'beginner' || value === 'intermediate' || value === 'expert';

export function canvas_explode(r: number, c: number) {
  const elemento = `${r}#${c}`;
  const canvas = getRequiredElement(elemento, HTMLCanvasElement);
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error(`Canvas (#${elemento}) does not support 2D rendering`);
  }
  const ctx: CanvasRenderingContext2D = context;

  let frame = 0;
  let setIntID: ReturnType<typeof setInterval>;
  const img = new Image();

  function animate(context: CanvasRenderingContext2D) {
    context.clearRect(0, 0, 25, 25);
    if (frame === 13) {
      clearInterval(setIntID);
      return;
    }
    context.drawImage(img, 39 * frame, 0, 39, 38, 0, 0, 25, 25);
    frame++;
  }

  img.onload = function () {
    setIntID = setInterval(() => animate(ctx), 150);
  };
  img.src = 'static/imgs/explosion.png';
}

export function addToArray(o: Player, a: Player[]) {
  let i = 0;
  while (i < a.length && o.score > a[i].score) {
    i++;
  }

  a.splice(i, 0, o);
  console.log(`----------${o.uname} ${o.score}-------`);
}

export function getRequiredElement<T extends HTMLElement>(
  id: string,
  constructor: new () => T,
): T {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Missing element (#${id})`);
  }

  if (!(element instanceof constructor)) {
    throw new Error(`Element (#${id}) is not a ${constructor.name}`);
  }

  return element;
}
