export function showHonorTable() {
  document.getElementById('quadro_honra').style.display = 'block';
  document.getElementById('mostrar_honra').style.display = 'none';
  document.getElementById('esconder_honra').style.display = 'inline';
}

export function hideHonorTable() {
  document.getElementById('quadro_honra').style.display = 'none';
  document.getElementById('mostrar_honra').style.display = 'inline';
  document.getElementById('esconder_honra').style.display = 'none';
}

export function logOut() {
  document.getElementById('log_in').style.display = 'block';
  document.getElementById('log_out').style.display = 'none';
  document.getElementById('menu').style.display = 'none';
  document.getElementById('jogo').style.display = 'none';
  document.getElementById('progresso').style.display = 'none';
  document.getElementById('quadro_honra').style.display = 'none';
  return false;
}

export function errorMessage(mensagem) {
  console.log('Sending error message to player');
  document.getElementById('error_message').innerHTML = mensagem;
  return false;
}

export function playerWon() {
  document.getElementById('message_to_player').innerHTML = 'GANHASTE!!';
}

export function playerLost() {
  document.getElementById('message_to_player').innerHTML = 'PERDESTE!!';
}

export function clearMessage() {
  document.getElementById('message_to_player').innerHTML = '';
}

export function cleanHonor() {
  document.getElementById('honorlist').innerHTML = '';
}

export function showWhosTurn(turn) {
  document.getElementById(
    'whos_turn',
  ).innerHTML = `É o turno do jogador: ${turn}`;
}

export function clearWhosTurn() {
  document.getElementById('whos_turn').innerHTML = '';
}

export function updatePlayersStats(username, p_bombs, opponent, op_bombs) {
  document.getElementById(
    'player_stats',
  ).innerHTML = `Jogador ${username} encontrou : ${p_bombs} bombas`;
  document.getElementById(
    'opponent_stats',
  ).innerHTML = `Adversario ${opponent} encontrou : ${op_bombs} bombas`;
  return false;
}

export function cleanError() {
  document.getElementById('error_message').innerHTML = '';
  return false;
}

export function playerLoggedIn(username) {
  document.getElementById(
    'message_to_player',
  ).innerHTML = `${username} logged in!`;
  return false;
}

export function playerIsWaiting(username) {
  console.log('bom dia');
  document.getElementById(
    'message_to_player',
  ).innerHTML = `<p>${username} está a espera dum adversário...</p><img src='static/imgs/waiting.svg' alt='waiting...' />`;
  return false;
}

export function playerNotWaiting(username) {
  console.log('bom dia');
  document.getElementById(
    'message_to_player',
  ).innerHTML = `${username} has given up waiting...`;
  return false;
}

export function showSair() {
  document.getElementById('sair').style.display = 'inline';
}

export function hideGameMode() {
  document.getElementById('dificuldade').style.display = 'none';
  document.getElementById('modo').style.display = 'none';
}

export function showGameMode() {
  document.getElementById('dificuldade').style.display = 'inline';
  document.getElementById('modo').style.display = 'inline';
}

export function clearTable() {
  document.getElementById('tab').innerHTML = '';
}
