import { Player } from "./minesweeper";

export function canvas_explode(r: number, c: number) {
  const elemento = `${r}#${c}`;
  const canvas = document.getElementById(elemento);
  const ctx = canvas.getContext('2d');

  let frame = 0;
  let setIntID: NodeJS.Timeout;
  const img = new Image();

  function animate() {
    ctx.clearRect(0, 0, 25, 25);
    if (frame === 13) {
      clearInterval(setIntID);
      return;
    }
    ctx.drawImage(img, 39 * frame, 0, 39, 38, 0, 0, 25, 25);
    frame++;
  }

  img.onload = function () {
    setIntID = setInterval(animate, 150);
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
