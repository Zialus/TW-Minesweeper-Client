export type Matrix = number[][];

export function validPos(matrix: Matrix, r: number, c: number) {
  return r >= 0 && r < matrix.length && c >= 0 && c < matrix[0].length;
}

export function checkWin(matrix: Matrix, visited: boolean[][]) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  console.log('ola');
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] !== -1 && visited[i][j] === false) {
        return false;
      }
    }
  }
  return true;
}

export function newPos(matrix: Matrix, r: number, c: number) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrix[i][j] !== -1 && i !== r && j !== c) {
        return {
          x: i,
          y: j,
        };
      }
    }
  }
  throw new Error('No available position for the relocated mine');
}

export function newValue(matrix: Matrix, x: number, y: number) {
  let aux = 0;
  if (validPos(matrix, x - 1, y) && matrix[x - 1][y] === -1) {
    aux++;
  }
  if (validPos(matrix, x, y - 1) && matrix[x][y - 1] === -1) {
    aux++;
  }
  if (validPos(matrix, x + 1, y) && matrix[x + 1][y] === -1) {
    aux++;
  }
  if (validPos(matrix, x, y + 1) && matrix[x][y + 1] === -1) {
    aux++;
  }
  if (validPos(matrix, x - 1, y - 1) && matrix[x - 1][y - 1] === -1) {
    aux++;
  }
  if (validPos(matrix, x + 1, y - 1) && matrix[x + 1][y - 1] === -1) {
    aux++;
  }
  if (validPos(matrix, x + 1, y + 1) && matrix[x + 1][y + 1] === -1) {
    aux++;
  }
  if (validPos(matrix, x - 1, y + 1) && matrix[x - 1][y + 1] === -1) {
    aux++;
  }
  return aux;
}

export function decreaseSurroundingCells(matrix: Matrix, x: number, y: number) {
  if (validPos(matrix, x - 1, y) && matrix[x - 1][y] !== -1) {
    matrix[x - 1][y]--;
  }
  if (validPos(matrix, x, y - 1) && matrix[x][y - 1] !== -1) {
    matrix[x][y - 1]--;
  }
  if (validPos(matrix, x + 1, y) && matrix[x + 1][y] !== -1) {
    matrix[x + 1][y]--;
  }
  if (validPos(matrix, x, y + 1) && matrix[x][y + 1] !== -1) {
    matrix[x][y + 1]--;
  }
  if (validPos(matrix, x - 1, y - 1) && matrix[x - 1][y - 1] !== -1) {
    matrix[x - 1][y - 1]--;
  }
  if (validPos(matrix, x + 1, y - 1) && matrix[x + 1][y - 1] !== -1) {
    matrix[x + 1][y - 1]--;
  }
  if (validPos(matrix, x + 1, y + 1) && matrix[x + 1][y + 1] !== -1) {
    matrix[x + 1][y + 1]--;
  }
  if (validPos(matrix, x - 1, y + 1) && matrix[x - 1][y + 1] !== -1) {
    matrix[x - 1][y + 1]--;
  }
}

export function increaseSurroundingCells(matrix: Matrix, x: number, y: number) {
  if (validPos(matrix, x - 1, y) && matrix[x - 1][y] !== -1) {
    matrix[x - 1][y]++;
  }
  if (validPos(matrix, x, y - 1) && matrix[x][y - 1] !== -1) {
    matrix[x][y - 1]++;
  }
  if (validPos(matrix, x + 1, y) && matrix[x + 1][y] !== -1) {
    matrix[x + 1][y]++;
  }
  if (validPos(matrix, x, y + 1) && matrix[x][y + 1] !== -1) {
    matrix[x][y + 1]++;
  }
  if (validPos(matrix, x - 1, y - 1) && matrix[x - 1][y - 1] !== -1) {
    matrix[x - 1][y - 1]++;
  }
  if (validPos(matrix, x + 1, y - 1) && matrix[x + 1][y - 1] !== -1) {
    matrix[x + 1][y - 1]++;
  }
  if (validPos(matrix, x + 1, y + 1) && matrix[x + 1][y + 1] !== -1) {
    matrix[x + 1][y + 1]++;
  }
  if (validPos(matrix, x - 1, y + 1) && matrix[x - 1][y + 1] !== -1) {
    matrix[x - 1][y + 1]++;
  }
}
