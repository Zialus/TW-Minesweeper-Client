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
  getRequiredElement('error_message').innerHTML = mensagem;
  return false;
}

export function playerWon() {
  getRequiredElement('message_to_player').innerHTML = 'GANHASTE!!';
}

export function playerLost() {
  getRequiredElement('message_to_player').innerHTML = 'PERDESTE!!';
}

export function clearMessage() {
  getRequiredElement('message_to_player').innerHTML = '';
}

export function cleanHonor() {
  getRequiredElement('honorlist').innerHTML = '';
}

export function showWhosTurn(turn: string) {
  getRequiredElement('whos_turn').innerHTML = `É o turno do jogador: ${turn}`;
}

export function clearWhosTurn() {
  getRequiredElement('whos_turn').innerHTML = '';
}

export function updatePlayersStats(
  username: string,
  p_bombs: number,
  opponent: string,
  op_bombs: number,
) {
  getRequiredElement('player_stats').innerHTML =
    `Jogador ${username} encontrou : ${p_bombs} bombas`;
  getRequiredElement('opponent_stats').innerHTML =
    `Adversario ${opponent} encontrou : ${op_bombs} bombas`;
  return false;
}

export function cleanError() {
  getRequiredElement('error_message').innerHTML = '';
  return false;
}

export function playerLoggedIn(username: string) {
  getRequiredElement('message_to_player').innerHTML = `${username} logged in!`;
  return false;
}

export function playerIsWaiting(username: string) {
  console.log('bom dia');
  getRequiredElement('message_to_player').innerHTML =
    `<p>${username} está a espera dum adversário...</p><img src='static/imgs/waiting.svg' alt='waiting...' />`;
  return false;
}

export function playerNotWaiting(username: string) {
  console.log('bom dia');
  getRequiredElement('message_to_player').innerHTML =
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
  getRequiredElement('tab').innerHTML = '';
}
