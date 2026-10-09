import { getRequiredElement } from './helpers';

export function showHonorTable() {
<<<<<<< HEAD
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
=======
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
>>>>>>> origin/master
  return false;
}

export function errorMessage(mensagem: string) {
  console.log('Sending error message to player');
<<<<<<< HEAD
  getRequiredElement('error_message').textContent = mensagem;
=======
  getRequiredElement('error_message', HTMLElement).innerHTML = mensagem;
>>>>>>> origin/master
  return false;
}

export function playerWon() {
<<<<<<< HEAD
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
=======
  getRequiredElement('message_to_player', HTMLElement).innerHTML = 'GANHASTE!!';
}

export function playerLost() {
  getRequiredElement('message_to_player', HTMLElement).innerHTML = 'PERDESTE!!';
}

export function clearMessage() {
  getRequiredElement('message_to_player', HTMLElement).innerHTML = '';
}

export function cleanHonor() {
  getRequiredElement('honorlist', HTMLElement).innerHTML = '';
}

export function showWhosTurn(turn: string) {
  getRequiredElement('whos_turn', HTMLElement).innerHTML =
    `É o turno do jogador: ${turn}`;
}

export function clearWhosTurn() {
  getRequiredElement('whos_turn', HTMLElement).innerHTML = '';
>>>>>>> origin/master
}

export function updatePlayersStats(
  username: string,
  p_bombs: number,
  opponent: string,
  op_bombs: number,
) {
<<<<<<< HEAD
  getRequiredElement('player_stats').textContent =
    `Jogador ${username} encontrou : ${p_bombs} bombas`;
  getRequiredElement('opponent_stats').textContent =
=======
  getRequiredElement('player_stats', HTMLElement).innerHTML =
    `Jogador ${username} encontrou : ${p_bombs} bombas`;
  getRequiredElement('opponent_stats', HTMLElement).innerHTML =
>>>>>>> origin/master
    `Adversario ${opponent} encontrou : ${op_bombs} bombas`;
  return false;
}

export function cleanError() {
<<<<<<< HEAD
  getRequiredElement('error_message').textContent = '';
=======
  getRequiredElement('error_message', HTMLElement).innerHTML = '';
>>>>>>> origin/master
  return false;
}

export function playerLoggedIn(username: string) {
<<<<<<< HEAD
  getRequiredElement('message_to_player').textContent =
=======
  getRequiredElement('message_to_player', HTMLElement).innerHTML =
>>>>>>> origin/master
    `${username} logged in!`;
  return false;
}

export function playerIsWaiting(username: string) {
  console.log('bom dia');
<<<<<<< HEAD
  const message = getRequiredElement('message_to_player');
  const paragraph = document.createElement('p');
  paragraph.textContent = `${username} está a espera dum adversário...`;
  const image = document.createElement('img');
  image.src = 'static/imgs/waiting.svg';
  image.alt = 'waiting...';
  message.replaceChildren(paragraph, image);
=======
  getRequiredElement('message_to_player', HTMLElement).innerHTML =
    `<p>${username} está a espera dum adversário...</p><img src='static/imgs/waiting.svg' alt='waiting...' />`;
>>>>>>> origin/master
  return false;
}

export function playerNotWaiting(username: string) {
  console.log('bom dia');
<<<<<<< HEAD
  getRequiredElement('message_to_player').textContent =
=======
  getRequiredElement('message_to_player', HTMLElement).innerHTML =
>>>>>>> origin/master
    `${username} has given up waiting...`;
  return false;
}

export function showSair() {
<<<<<<< HEAD
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
=======
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
  getRequiredElement('tab', HTMLElement).innerHTML = '';
>>>>>>> origin/master
}
