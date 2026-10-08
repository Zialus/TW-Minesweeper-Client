import { getRequiredElement } from './helpers';

export function showHonorTable() {
  getRequiredElement('quadro_honra').style.display = 'block';
  getRequiredElement('mostrar_honra').style.display = 'none';
  getRequiredElement('esconder_honra').style.display = 'inline';
}

export function hideHonorTable() {
  getRequiredElement('quadro_honra').style.display = 'none';
  getRequiredElement('mostrar_honra').style.display = 'inline';
  getRequiredElement('esconder_honra').style.display = 'none';
}

export function logOut() {
  getRequiredElement('log_in').style.display = 'block';
  getRequiredElement('log_out').style.display = 'none';
  getRequiredElement('menu').style.display = 'none';
  getRequiredElement('jogo').style.display = 'none';
  getRequiredElement('progresso').style.display = 'none';
  getRequiredElement('quadro_honra').style.display = 'none';
  return false;
}

export function errorMessage(mensagem: string) {
  console.log('Sending error message to player');
  getRequiredElement('error_message').textContent = mensagem;
  return false;
}

export function playerWon() {
  getRequiredElement('message_to_player').textContent = 'GANHASTE!!';
}

export function playerLost() {
  getRequiredElement('message_to_player').textContent = 'PERDESTE!!';
}

export function clearMessage() {
  getRequiredElement('message_to_player').textContent = '';
}

export function cleanHonor() {
  getRequiredElement('honorlist').textContent = '';
}

export function showWhosTurn(turn: string) {
  getRequiredElement('whos_turn').textContent = `É o turno do jogador: ${turn}`;
}

export function clearWhosTurn() {
  getRequiredElement('whos_turn').textContent = '';
}

export function updatePlayersStats(
  username: string,
  p_bombs: number,
  opponent: string,
  op_bombs: number,
) {
  getRequiredElement('player_stats').textContent =
    `Jogador ${username} encontrou : ${p_bombs} bombas`;
  getRequiredElement('opponent_stats').textContent =
    `Adversario ${opponent} encontrou : ${op_bombs} bombas`;
  return false;
}

export function cleanError() {
  getRequiredElement('error_message').textContent = '';
  return false;
}

export function playerLoggedIn(username: string) {
  getRequiredElement('message_to_player').textContent =
    `${username} logged in!`;
  return false;
}

export function playerIsWaiting(username: string) {
  console.log('bom dia');
  const message = getRequiredElement('message_to_player');
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
  getRequiredElement('message_to_player').textContent =
    `${username} has given up waiting...`;
  return false;
}

export function showSair() {
  getRequiredElement('sair').style.display = 'inline';
}

export function hideGameMode() {
  getRequiredElement('dificuldade').style.display = 'none';
  getRequiredElement('modo').style.display = 'none';
}

export function showGameMode() {
  getRequiredElement('dificuldade').style.display = 'inline';
  getRequiredElement('modo').style.display = 'inline';
}

export function clearTable() {
  getRequiredElement('tab').textContent = '';
}
