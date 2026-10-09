import { getRequiredElement } from './helpers';

export function showHonorTable() {
  getRequiredElement('quadro_honra', HTMLElement).style.display = 'block';
  getRequiredElement('mostrar_honra', HTMLElement).style.display = 'none';
  getRequiredElement('esconder_honra', HTMLElement).style.display = 'inline';
}

export function hideHonorTable() {
  getRequiredElement('quadro_honra', HTMLElement).style.display = 'none';
  getRequiredElement('mostrar_honra', HTMLElement).style.display = 'inline';
  getRequiredElement('esconder_honra', HTMLElement).style.display = 'none';
}

export function logOut() {
  getRequiredElement('log_in', HTMLElement).style.display = 'block';
  getRequiredElement('log_out', HTMLElement).style.display = 'none';
  getRequiredElement('menu', HTMLElement).style.display = 'none';
  getRequiredElement('jogo', HTMLElement).style.display = 'none';
  getRequiredElement('progresso', HTMLElement).style.display = 'none';
  getRequiredElement('quadro_honra', HTMLElement).style.display = 'none';
  return false;
}

export function errorMessage(mensagem: string) {
  console.log('Sending error message to player');
  getRequiredElement('error_message', HTMLElement).textContent = mensagem;
  return false;
}

export function playerWon() {
  getRequiredElement('message_to_player', HTMLElement).textContent =
    'GANHASTE!!';
}

export function playerLost() {
  getRequiredElement('message_to_player', HTMLElement).textContent =
    'PERDESTE!!';
}

export function clearMessage() {
  getRequiredElement('message_to_player', HTMLElement).textContent = '';
}

export function cleanHonor() {
  getRequiredElement('honorlist', HTMLElement).textContent = '';
}

export function showWhosTurn(turn: string) {
  getRequiredElement('whos_turn', HTMLElement).textContent =
    `É o turno do jogador: ${turn}`;
}

export function clearWhosTurn() {
  getRequiredElement('whos_turn', HTMLElement).textContent = '';
}

export function updatePlayersStats(
  username: string,
  p_bombs: number,
  opponent: string,
  op_bombs: number,
) {
  getRequiredElement('player_stats', HTMLElement).textContent =
    `Jogador ${username} encontrou : ${p_bombs} bombas`;
  getRequiredElement('opponent_stats', HTMLElement).textContent =
    `Adversario ${opponent} encontrou : ${op_bombs} bombas`;
  return false;
}

export function cleanError() {
  getRequiredElement('error_message', HTMLElement).textContent = '';
  return false;
}

export function playerLoggedIn(username: string) {
  getRequiredElement('message_to_player', HTMLElement).textContent =
    `${username} logged in!`;
  return false;
}

export function playerIsWaiting(username: string) {
  console.log('bom dia');
  const message = getRequiredElement('message_to_player', HTMLElement);
  const paragraph = document.createElement('p');
  paragraph.textContent = `${username} está a espera dum adversário...`;
  const image = document.createElement('img');
  image.src = 'static/imgs/waiting.svg';
  image.alt = 'waiting...';
  message.replaceChildren(paragraph, image);
  return false;
}

export function playerNotWaiting(username: string) {
  console.log('bom dia');
  getRequiredElement('message_to_player', HTMLElement).textContent =
    `${username} has given up waiting...`;
  return false;
}

export function showSair() {
  getRequiredElement('sair', HTMLElement).style.display = 'inline';
}

export function hideGameMode() {
  getRequiredElement('dificuldade', HTMLElement).style.display = 'none';
  getRequiredElement('modo', HTMLElement).style.display = 'none';
}

export function showGameMode() {
  getRequiredElement('dificuldade', HTMLElement).style.display = 'inline';
  getRequiredElement('modo', HTMLElement).style.display = 'inline';
}

export function clearTable() {
  getRequiredElement('tab', HTMLElement).textContent = '';
}
