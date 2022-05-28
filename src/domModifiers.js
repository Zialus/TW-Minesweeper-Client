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
