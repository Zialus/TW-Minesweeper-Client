window.onload = function () {
  const apiUrl = "https://tw-minesweeper-server.herokuapp.com/";

  //-------------------------MISC VARIABLES-----------------------------------------------------//
  let rows; // nº of rows
  let cols; // nº of columns
  let mines; // nº of mines
  const table = document.getElementById("tab"); // html table where the game matrix will be displayed
  let matrix; // Matrix with "mine information" of each cell
  let visited; // Matrix with information about visited state of cells
  let mines_counter; // Counts how many mines have been "found"
  let realBomb; // Pair of coordinates of the bomb that made the player lose the game
  let timer; // Javascript timer
  let timeElapsed = 0; // Time elapsed since the game began
  let firstclick = true; // Stores the state of the current click ( Whether it is the first one or not)
  let game_over = false; // Stores the state of the current game ( Whether it is over or not)
  let points; // Stores the score of the player in the multiplayer mode
  let username = "Default User"; // Set a default value in case a username isn't picked
  let password; // Stores the password
  let difc; // Stores the game dificulty
  let acorde = false;

  //-------------------------VARIAVEIS PARA LIDAR COM AUDIO-------------------------------------//
  const bomb_audio = new Audio("./music/explosion.wav");
  bomb_audio.muted = true;
  const victory_audio = new Audio("./music/victory.m4a");
  victory_audio.muted = true;
  const defeat_audio = new Audio("./music/gameover.m4a");
  defeat_audio.muted = true;
  const turn_audio = new Audio("./music/turn.mp3");
  turn_audio.muted = true;

  //-------------------------VARIAVEIS PARA LIDAR COM ESTADO DO JOGO MP-------------------------//
  const our_group = 4;
  let gameId;
  let gameKey;
  let opponent; // nome do jogador adversario
  let turn; // nome do jogador a quem pertence o turno actual
  let p_bombs = 0; // quantidade de bombas econtradas pelo jogador
  let op_bombs = 0; // quantidade de bombas econtradas pelo adversario
  let sse;

  //------------------------ARRAYS PARA GUARDAR QUADRO DE HONRA --------------------------------//
  const begHonor = []; // Stores Hi-Scores for the Beginner dificulty
  const intHonor = []; // Stores Hi-Scores for the Intermediate dificulty
  const expHonor = []; // Stores Hi-Scores for the Expert dificulty

  let begHonorMP = []; // Stores Hi-Scores for the Beginner dificulty for the MultiPlayer Mode
  let intHonorMP = []; // Stores Hi-Scores for the Intermediate dificulty for the MultiPlayer Mode
  let expHonorMP = []; // Stores Hi-Scores for the Expert dificulty for the MultiPlayer Mode

  localStorageGetAll();

  let currentHonor = begHonor; // In which Honor Table should the Hi-Score of the current game be stored
  let showHonor = begHonor; // Which Honor Table should be shown

  document.getElementById("difHonra").onchange = refreshHonra;

  document.getElementById("difHonraMP").onchange = refreshHonraMP;

  document.getElementById("validate").onclick = validateGame;

  document.getElementById("iniciar").onclick = startGame;

  document.getElementById("encerrar").onclick = endGame;

  document.getElementById("log_out").onclick = logOut;

  document.getElementById("mute_audio").onclick = changeAudio;

  document.getElementById("mostrar_honra").onclick = showHonorTable;

  document.getElementById("esconder_honra").onclick = hideHonorTable;

  document.getElementById("sair").onclick = leaveMP;

  document.getElementById("honraSP").onclick = switchHonraSP;

  document.getElementById("honraMP").onclick = switchHonraMP;

  function changeAudio() {
    if (document.getElementById("mute_audio").value === "Sound OFF") unmute();
    else if (document.getElementById("mute_audio").value === "Sound ON") mute();
  }

  function mute() {
    console.log("MUTED!!");
    document.getElementById("mute_audio").value = "Sound OFF";
    turn_audio.muted = true;
    victory_audio.muted = true;
    defeat_audio.muted = true;
    bomb_audio.muted = true;
    return false;
  }

  function unmute() {
    console.log("UNMUTED!!");
    document.getElementById("mute_audio").value = "Sound ON";
    turn_audio.muted = false;
    victory_audio.muted = false;
    defeat_audio.muted = false;
    bomb_audio.muted = false;
    return false;
  }

  function switchHonraSP() {
    document.getElementById("difHonra").style.display = "inline";
    document.getElementById("difHonraMP").style.display = "none";
    refreshHonra();
    return false;
  }

  function switchHonraMP() {
    document.getElementById("difHonra").style.display = "none";
    document.getElementById("difHonraMP").style.display = "inline";
    refreshHonraMP();
    return false;
  }

  //------------------------------------------------------ MULTIPLAYER FUNCTIONS ----------------------------------------------------------------//

  // console.log(xhr.readyState + "-----" + xhr.status);

  function notify(r, c) {
    console.log("ENTROU NO NOTIFY");

    const xhr = new XMLHttpRequest();

    const value = JSON.stringify({
      name: username,
      game: gameId,
      key: gameKey,
      row: r,
      col: c,
    });

    xhr.open("post", `${apiUrl}notify`, true);
    xhr.setRequestHeader("Content-Type", 'application/json; charset="utf-8"');
    xhr.send(value);

    xhr.onreadystatechange = function () {
      console.log(`${xhr.readyState}-----${xhr.status}`);
      if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        if (res.error !== undefined) {
          console.log(`res.error : ${res.error}`);
          errorMessage("Posição já destapada, DUMMY!!");
          setTimeout(cleanError, 2000);
        } else {
          updateMP();
        }
      }
    };
  }

  function canvas_explode(r, c) {
    const elemento = `${r}#${c}`;
    const canvas = document.getElementById(elemento);
    const ctx = canvas.getContext("2d");

    let frame = 0;
    let setIntID;
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
    img.src = "explosion.png";
  }

  function burstMP(cell, player) {
    const r = cell[0] - 1; // (0,0) vs (1,1)
    const c = cell[1] - 1; // (0,0) vs (1,1)
    const value = cell[2];

    if (value === -1) {
      bomb_audio.play();
      canvas_explode(r, c);
      decreaseMines();
      if (player === opponent) {
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/bombdeath.gif");
      } else {
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/bombrevealed.gif");
      }

      if (player === username) {
        p_bombs++;
      } else {
        op_bombs++;
      }
      updatePlayersStats();
    } else {
      chooseAndSetPicture(r, c, value);
    }
  }

  function endGameMP() {
    clearInterval(timer);
    game_over = true;
    showGameMode();
    document.getElementById("iniciar").style.display = "inline";
    return false;
  }

  function updateMP() {
    sse.onmessage = function (event) {
      const msg = JSON.parse(event.data);
      if (msg.error === undefined) {
        //houve uma jogada
        if (msg.move !== undefined) {
          const cells = msg.move.cells;

          //destapa as células
          for (let i = 0; i < cells.length; i++) {
            const player = msg.move.name;
            burstMP(cells[i], player);
          }

          //jogo acaba
          if (msg.winner !== undefined) {
            event.target.close();
            if (msg.winner === opponent) {
              playerLost();
              defeat_audio.play();
            } else {
              playerWon();
              victory_audio.play();
            }

            endGameMP();
            getScore();
          }
        }

        if (msg.turn !== undefined) {
          turn = msg.turn;
          if (turn === username) turn_audio.play();
          showWhosTurn();
        }
      }
      //ERRO
      else {
        console.log(`msg.error : ${msg.error}`);
        errorMessage(msg.error);
        setTimeout(cleanError, 2000);
      }
    };
  }

  function leaveMP() {
    console.log("Im LEAVING!!!");

    const value = JSON.stringify({
      name: username,
      game: gameId,
      key: gameKey,
    });

    const xhttp = new XMLHttpRequest();

    xhttp.open("post", `${apiUrl}leave`, true);
    xhttp.setRequestHeader("Content-Type", 'application/json; charset="utf-8"');
    xhttp.send(value);

    xhttp.onreadystatechange = function () {
      console.log(`${xhttp.readyState}-----${xhttp.status}`);
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        const res = JSON.parse(xhttp.responseText);
        if (res.error !== undefined) {
          console.log(`res.error : ${res.error}`);
          errorMessage(res.error);
          setTimeout(cleanError, 2000);
        }
      }
    };

    playerNotWaiting();
    showGameMode();

    document.getElementById("sair").style.display = "none";
    document.getElementById("iniciar").style.display = "inline";
    return false;
  }

  function getScore() {
    console.log("ENTROU NO SCORE!");

    const value = JSON.stringify({
      name: username,
      level: difc,
    });

    const xhr = new XMLHttpRequest();

    xhr.open("post", `${apiUrl}score`, true);
    xhr.setRequestHeader("Content-Type", 'application/json; charset="utf-8"');
    xhr.send(value);

    xhr.onreadystatechange = function () {
      console.log(`${xhr.readyState}-----${xhr.status}`);
      if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        if (res.error !== undefined) {
          console.log(`res.error : ${res.error}`);
          errorMessage(res.error);
          setTimeout(cleanError, 2000);
        } else {
          points = res.score;
          showScore();
        }
      }
    };

    return false;
  }

  function showScore() {
    if (points === undefined) {
      document.getElementById("score").innerHTML = "";
    } else {
      document.getElementById(
        "score"
      ).innerHTML = `A tua pontuação neste modo de jogo é ${points}`;
    }
  }

  function cleanScore() {
    document.getElementById("score").innerHTML = "";
  }

  function refreshHonraMP() {
    console.log("Refresh the list MultiPlayer!");

    document.getElementById("honorlist").innerHTML = "";

    const honor_value = document.getElementById("difHonraMP").value;

    const value = JSON.stringify({
      level: honor_value,
    });

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      console.log(`${xhr.readyState}-----${xhr.status}`);
      if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        if (res.error !== undefined) {
          console.log(`res.error : ${res.error}`);
          errorMessage(res.error);
          setTimeout(cleanError, 2000);
        } else {
          console.log("Getting all the rankings!");
          const ranking = res.ranking;

          switch (honor_value) {
            case "beginner":
              begHonorMP = ranking;
              break;
            case "intermediate":
              intHonorMP = ranking;
              break;
            case "expert":
              expHonorMP = ranking;
              break;
            default:
          }

          switch (honor_value) {
            case "beginner":
              showHonor = begHonorMP;
              break;
            case "intermediate":
              showHonor = intHonorMP;
              break;
            case "expert":
              showHonor = expHonorMP;
              break;
            default:
          }

          for (let i = 0; i < showHonor.length; i++) {
            const node = document.createElement("li");
            const textnode = document.createTextNode(
              ` ${item.name} ${item.score}`
            );
            node.appendChild(textnode);
            document.getElementById("honorlist").appendChild(node);
          }
        }
      }
    };
    xhr.open("post", `${apiUrl}ranking`, true);
    xhr.setRequestHeader("Content-Type", 'application/json; charset="utf-8"');
    xhr.send(value);
  }

  function initMP() {
    console.log("initMP");

    sse = new EventSource(
      `${apiUrl}update?name=${username}&game=${gameId}&key=${gameKey}`
    );
    sse.onmessage = function (event) {
      const res = JSON.parse(event.data);

      //SUCCESS
      if (res.error === undefined) {
        clearMessage();
        opponent = res.opponent;
        turn = res.turn;
        if (turn === username) turn_audio.play();
        showWhosTurn();

        console.log(`Oponente: ${opponent} | Turno: ${turn}`);
        document.getElementById("sair").style.display = "none";

        // O jogo começou

        timer = setInterval(updateTimer, 1000);
        setTabuleiroMP_CanvasMode();

        document.getElementById("jogo").style.display = "block";
        document.getElementById("progresso").style.display = "block";
        updatePlayersStats();
        updateMP();

        console.log(`Oponente: ${opponent} | Turno: ${turn}`);

        // pedir próximo update
        updateMP();
      }

      //ERROR
      else {
        console.log(`res.error : ${res.error}`);
        errorMessage(res.error);
        setTimeout(cleanError, 2000);

        event.target.close();
      }
    };
  }

  function setTabuleiroMP() {
    for (let i = 0; i < rows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < cols; j++) {
        const cell = row.insertCell();
        cell.innerHTML = "<img alt='blankCell' src='./imgs/blank.gif'/>";
        cell.onclick = makeCellLeftClickHandlerMP();
        //cell.oncontextmenu = makeCellRightClickHandlerMP();
      }
    }
  }

  function setTabuleiroMP_CanvasMode() {
    for (let i = 0; i < rows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < cols; j++) {
        const cell = row.insertCell();

        cell.innerHTML = "<img alt='blankCell' src='./imgs/blank.gif'/>";

        const canvas = document.createElement("canvas");
        canvas.width = 20;
        canvas.height = 20;
        const name_dat_canvas = `${i}#${j}`;
        canvas.setAttribute("id", name_dat_canvas);
        cell.appendChild(canvas);

        cell.onclick = makeCellLeftClickHandlerMP();
        //cell.oncontextmenu = makeCellRightClickHandlerMP();
      }
    }
  }

  function makeCellLeftClickHandlerMP() {
    return function () {
      if (turn === username) {
        //My Turn
        const col = this.cellIndex;
        const row = this.parentNode.rowIndex;
        const print = `Left Clicked on (${row},${col})`;
        console.log(print);
        if (!game_over) {
          //positions start at (1,1) instead of (0,0) on Rui's server
          notify(row + 1, col + 1);
        } else {
          console.log("Game is already Over!");
        }
      } else {
        if (!game_over) {
          //Not my Turn
          console.log("NOT MY TURN");
          errorMessage("AINDA NAO PODES JOGAR!!!");
          setTimeout(cleanError, 2000);
        } else {
          console.log("Game is already Over!");
        }
      }
    };
  }

  function joinGame() {
    console.log("Lets join a game!");
    playerIsWaiting();

    const value = JSON.stringify({
      name: username,
      pass: password,
      level: difc,
      group: our_group,
    });

    const xhr = new XMLHttpRequest();

    xhr.open("post", `${apiUrl}join`, true);
    xhr.setRequestHeader("Content-Type", 'application/json; charset="utf-8"');
    xhr.send(value);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const resposta = JSON.parse(xhr.responseText);
        if (resposta.error !== undefined) {
          console.log(`res.error : ${resposta.error}`);
          errorMessage(resposta.error);
          setTimeout(cleanError, 2000);
        } else {
          // Create multiplayer game
          gameId = resposta.game;
          gameKey = resposta.key;
          console.log(`GameID e Key: ${gameId} ----- ${gameKey}`);

          initMP();
        }
      }
    };
  }

  // ----------------------------------------------------- SINGLE PLAYER ------------------------------------------------------------------ //

  function showHonorTable() {
    document.getElementById("quadro_honra").style.display = "block";
    document.getElementById("mostrar_honra").style.display = "none";
    document.getElementById("esconder_honra").style.display = "inline";
  }

  function hideHonorTable() {
    document.getElementById("quadro_honra").style.display = "none";
    document.getElementById("mostrar_honra").style.display = "inline";
    document.getElementById("esconder_honra").style.display = "none";
  }

  function logOut() {
    document.getElementById("log_in").style.display = "block";
    document.getElementById("log_out").style.display = "none";
    document.getElementById("menu").style.display = "none";
    document.getElementById("jogo").style.display = "none";
    document.getElementById("progresso").style.display = "none";
    document.getElementById("quadro_honra").style.display = "none";
    return false;
  }

  function errorMessage(mensagem) {
    console.log("Sending error message to player");
    document.getElementById("error_message").innerHTML = mensagem;
    return false;
  }

  function cleanError() {
    document.getElementById("error_message").innerHTML = "";
    return false;
  }

  function playerLoggedIn() {
    document.getElementById(
      "message_to_player"
    ).innerHTML = `${username} logged in!`;
    return false;
  }

  function playerIsWaiting() {
    console.log("bom dia");
    document.getElementById(
      "message_to_player"
    ).innerHTML = `<p>${username} está a espera dum adversário...</p><img src='./imgs/waiting.svg' alt='waiting...' />`;
    return false;
  }

  function playerNotWaiting() {
    console.log("bom dia");
    document.getElementById(
      "message_to_player"
    ).innerHTML = `${username} has given up waiting...`;
    return false;
  }

  function validateGame() {
    serverLogin();
    return false;
  }

  function serverLogin() {
    const username_html = document.getElementById("username").value;
    if (username_html !== "") {
      username = username_html;
    }
    password = document.getElementById("password").value;

    const value = JSON.stringify({
      name: username,
      pass: password,
    });

    const xhr = new XMLHttpRequest();

    xhr.open("post", `${apiUrl}register`, true);
    xhr.setRequestHeader("Content-Type", 'application/json; charset="utf-8"');
    xhr.send(value);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const resposta = JSON.parse(xhr.responseText);
        if (resposta.error !== undefined) {
          console.log(resposta.error);
          errorMessage(resposta.error);
          setTimeout(cleanError, 2000);
        } else {
          playerLoggedIn();
          console.log("Logged in!");
          document.getElementById("log_in").style.display = "none";
          document.getElementById("mute_audio").style.display = "inline";
          document.getElementById("log_out").style.display = "block";
          document.getElementById("menu").style.display = "block";
          document.getElementById("jogo").style.display = "block";
          document.getElementById("progresso").style.display = "block";
        }
      }
    };
  }

  function showSair() {
    document.getElementById("sair").style.display = "inline";
  }

  function hideGameMode() {
    document.getElementById("dificuldade").style.display = "none";
    document.getElementById("modo").style.display = "none";
  }

  function showGameMode() {
    document.getElementById("dificuldade").style.display = "inline";
    document.getElementById("modo").style.display = "inline";
  }

  function startGame() {
    getAndSetDificulty(); // Collects information about dificulty

    if (document.getElementsByName("modo")[0].value === "2 Players") {
      console.log("2 Players Mode");

      getScore();
      hideGameMode();
      showSair();
      p_bombs = 0;
      op_bombs = 0;
      joinGame();
      //clearMessage();
      clearTable();
      visitedFalse(); // Fills the visited matrix with false
      game_over = false;
      firstclick = true;
      document.getElementById("iniciar").style.display = "none";
      //  document.getElementById("encerrar").style.display = "inline";
      timeElapsed = 0;
      document.getElementById(
        "tempo"
      ).innerHTML = `Tempo decorrido: ${timeElapsed}`;
      document.getElementById(
        "numero_minas"
      ).innerHTML = `Minas restantes:${mines_counter}`;
    } else if (document.getElementsByName("modo")[0].value === "1 Player") {
      console.log("1 Player Mode");

      hideGameMode();
      cleanScore();
      clearMessage();
      clearTable();
      visitedFalse(); // Fills the visited matrix with false
      game_over = false;
      firstclick = true;
      document.getElementById("iniciar").style.display = "none";
      document.getElementById("encerrar").style.display = "inline";
      timeElapsed = 0;
      document.getElementById(
        "tempo"
      ).innerHTML = `Tempo decorrido: ${timeElapsed}`;
      document.getElementById(
        "numero_minas"
      ).innerHTML = `Minas restantes:${mines_counter}`;
      generateGameMatrix(); // Generates Matrix with correct size
      placeMines(); // Places mines on the matrix
      setTabuleiroCanvas(); // Generates HTML Table based on the information on the matrix
    }

    return false;
  }

  function endGame() {
    clearMatrix();
    document.getElementById("encerrar").style.display = "none";
    document.getElementById("iniciar").style.display = "inline";
    clearInterval(timer);
    game_over = true;
    showGameMode();
    return false;
  }

  function clearTable() {
    document.getElementById("tab").innerHTML = "";
  }

  function clearMatrix() {
    matrix.length = 0;
  }

  function getAndSetDificulty() {
    difc = document.getElementById("dificuldade").value;
    console.log(`ola ${difc}`);
    switch (difc) {
      case "beginner":
        console.log("asdfasdlfasgdf");
        rows = 9;
        cols = 9;
        mines = 10;
        mines_counter = mines;
        break;
      case "intermediate":
        rows = 16;
        cols = 16;
        mines = 40;
        mines_counter = mines;
        break;
      case "expert":
        rows = 16;
        cols = 30;
        mines = 99;
        mines_counter = mines;
        break;
      default:
    }

    changeHonor();
  }

  function changeHonor() {
    switch (difc) {
      case "beginner":
        currentHonor = begHonor;
        break;
      case "intermediate":
        currentHonor = intHonor;
        break;
      case "expert":
        currentHonor = expHonor;
        break;
      default:
    }
  }

  function generateGameMatrix() {
    matrix = new Array(rows);
    for (let i = 0; i < rows; i++) {
      matrix[i] = new Array(cols);
    }
    // Fills all the cells with zeros
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        matrix[i][j] = 0;
      }
    }
  }

  function makeCellLeftClickHandler() {
    return function () {
      const col = this.cellIndex;
      const row = this.parentNode.rowIndex;
      const print = `Left Clicked on (${row},${col})`;
      console.log(print);
      if (!game_over) {
        leftClick(row, col);
      } else {
        console.log("Game is already Over!");
      }
    };
  }

  function makeCellRightClickHandler() {
    return function () {
      const col = this.cellIndex;
      const row = this.parentNode.rowIndex;
      const print = `Right Clicked on (${row},${col})`;
      console.log(print);
      if (!game_over) {
        rightClick(row, col);
      } else {
        console.log("Game is already Over!");
      }
      return false;
    };
  }

  function makeAcordeHandler() {
    return function () {
      acorde = true;
      console.log("MOUSE_IS_DOWN_MOFO!!");
    };
  }

  function setTabuleiroCanvas() {
    for (let i = 0; i < rows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < cols; j++) {
        const cell = row.insertCell();

        cell.innerHTML = "<img alt='blankCell' src='./imgs/blank.gif'/>";

        const canvas = document.createElement("canvas");
        canvas.width = 20;
        canvas.height = 20;
        const name_dat_canvas = `${i}#${j}`;
        canvas.setAttribute("id", name_dat_canvas);
        cell.appendChild(canvas);

        cell.onclick = makeCellLeftClickHandler();
        //cell.onmousedown = makeAcordeHandler();
        cell.oncontextmenu = makeCellRightClickHandler();
      }
    }
  }

  function setTabuleiro() {
    for (let i = 0; i < rows; i++) {
      const row = table.insertRow();
      for (let j = 0; j < cols; j++) {
        const cell = row.insertCell();
        cell.innerHTML = "<img alt='blankCell' src='./imgs/blank.gif'/>";
        cell.onclick = makeCellLeftClickHandler();
        //cell.onmousedown = makeAcordeHandler();
        cell.oncontextmenu = makeCellRightClickHandler();
      }
    }
  }

  function placeMines() {
    let placedMines = 0;

    while (placedMines !== mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      if (matrix[r][c] !== -1) {
        // if theres no mine, place mine
        matrix[r][c] = -1;
        placedMines++;

        // up
        if (validPos(r, c - 1) && matrix[r][c - 1] !== -1) {
          matrix[r][c - 1]++;
        }
        // down
        if (validPos(r, c + 1) && matrix[r][c + 1] !== -1) {
          matrix[r][c + 1]++;
        }
        // left
        if (validPos(r - 1, c) && matrix[r - 1][c] !== -1) {
          matrix[r - 1][c]++;
        }
        // right
        if (validPos(r + 1, c) && matrix[r + 1][c] !== -1) {
          matrix[r + 1][c]++;
        }
        // left up
        if (validPos(r - 1, c - 1) && matrix[r - 1][c - 1] !== -1) {
          matrix[r - 1][c - 1]++;
        }
        // right up
        if (validPos(r + 1, c - 1) && matrix[r + 1][c - 1] !== -1) {
          matrix[r + 1][c - 1]++;
        }
        // left down
        if (validPos(r - 1, c + 1) && matrix[r - 1][c + 1] !== -1) {
          matrix[r - 1][c + 1]++;
        }
        // right down
        if (validPos(r + 1, c + 1) && matrix[r + 1][c + 1] !== -1) {
          matrix[r + 1][c + 1]++;
        }
      }
    }

    console.log("----Cheats----START----");
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (matrix[i][j] === -1) {
          console.log(`${i} ${j}`);
        }
      }
    }
    console.log("----Cheats----END-----");
  }

  function visitedFalse() {
    visited = new Array(rows);

    for (let i = 0; i < rows; i++) {
      visited[i] = new Array(cols);
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        visited[i][j] = false;
      }
    }
  }

  function leftClick(r, c) {
    if (visited[r][c] === false) {
      if (firstclick && matrix[r][c] === -1) {
        console.log("Shuffle Bombs!");
        dealWithFirstClick(r, c);
      } else if (firstclick) {
        firstclick = false;
        timer = setInterval(updateTimer, 1000);
      }

      if (
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .getAttribute("src") === "./imgs/blank.gif"
      ) {
        if (matrix[r][c] === -1) {
          //Game OVER!!!
          console.log("You're dead!");
          playerLost();
          defeat_audio.play();
          realBomb = {
            x: r,
            y: c,
          };
          showBombs();
          showRealBomb(realBomb);
          endGame();
        } else {
          burst(r, c);
        }
      }
    } else {
      console.log("You've been here already!");
    }
  }

  function megaBurst(r, c) {
    if (validPos(r - 1, c) && visited[r - 1][c] === false) {
      leftClick(r - 1, c);
    }

    if (validPos(r + 1, c) && visited[r + 1][c] === false) {
      leftClick(r + 1, c);
    }

    if (validPos(r, c - 1) && visited[r][c - 1] === false) {
      leftClick(r, c - 1);
    }

    if (validPos(r, c + 1) && visited[r][c + 1] === false) {
      leftClick(r, c + 1);
    }

    if (validPos(r - 1, c - 1) && visited[r - 1][c - 1] === false) {
      leftClick(r - 1, c - 1);
    }

    if (validPos(r - 1, c + 1) && visited[r - 1][c + 1] === false) {
      leftClick(r - 1, c + 1);
    }

    if (validPos(r + 1, c - 1) && visited[r + 1][c - 1] === false) {
      leftClick(r + 1, c - 1);
    }

    if (validPos(r + 1, c + 1) && visited[r + 1][c + 1] === false) {
      leftClick(r + 1, c + 1);
    }
  }

  function burst(r, c) {
    if (
      table.rows[r].cells[c]
        .getElementsByTagName("img")[0]
        .setAttribute("src", "./imgs/flag.png")
    ) {
      increaseMines();
    }

    if (matrix[r][c] === 0) {
      chooseAndSetPicture(r, c, 0);
      visited[r][c] = true;

      if (validPos(r - 1, c) && visited[r - 1][c] === false) {
        burst(r - 1, c);
      }

      if (validPos(r + 1, c) && visited[r + 1][c] === false) {
        burst(r + 1, c);
      }

      if (validPos(r, c - 1) && visited[r][c - 1] === false) {
        burst(r, c - 1);
      }

      if (validPos(r, c + 1) && visited[r][c + 1] === false) {
        burst(r, c + 1);
      }

      if (validPos(r - 1, c - 1) && visited[r - 1][c - 1] === false) {
        burst(r - 1, c - 1);
      }

      if (validPos(r - 1, c + 1) && visited[r - 1][c + 1] === false) {
        burst(r - 1, c + 1);
      }

      if (validPos(r + 1, c - 1) && visited[r + 1][c - 1] === false) {
        burst(r + 1, c - 1);
      }

      if (validPos(r + 1, c + 1) && visited[r + 1][c + 1] === false) {
        burst(r + 1, c + 1);
      }
    } else {
      visited[r][c] = true;
      const m = matrix[r][c];
      chooseAndSetPicture(r, c, m);
    }

    if (checkWin()) {
      victory_audio.play();

      alert(`YOU WON with the time of ${timeElapsed} seconds`);
      const player = {
        uname: username,
        score: timeElapsed,
      };

      addToArray(player, currentHonor);
      localStorageInsert(difc);

      playerWon();
      endGame();
    }
  }

  function chooseAndSetPicture(r, c, n) {
    switch (n) {
      case 0:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open0.gif");
        break;
      case 1:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open1.gif");
        break;
      case 2:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open2.gif");
        break;
      case 3:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open3.gif");
        break;
      case 4:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open4.gif");
        break;
      case 5:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open5.gif");
        break;
      case 6:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open6.gif");
        break;
      case 7:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open7.gif");
        break;
      case 8:
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/open8.gif");
        break;
      default:
    }
  }

  function updateTimer() {
    timeElapsed += 1;
    document.getElementById(
      "tempo"
    ).innerHTML = `Tempo decorrido: ${timeElapsed}`;
  }

  function decreaseMines() {
    mines_counter -= 1;
    document.getElementById(
      "numero_minas"
    ).innerHTML = `Minas restantes:${mines_counter}`;
  }

  function increaseMines() {
    mines_counter += 1;
    document.getElementById(
      "numero_minas"
    ).innerHTML = `Minas restantes:${mines_counter}`;
  }

  function validPos(r, c) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
  }

  function checkWin() {
    console.log("ola");
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (matrix[i][j] !== -1 && visited[i][j] === false) {
          return false;
        }
      }
    }
    return true;
  }

  function rightClick(r, c) {
    if (acorde === true) {
      console.log("ACORDE ACTIVATION!!!!!!!!");
      megaBurst(r, c);
    }

    if (visited[r][c] === false) {
      if (
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .getAttribute("src") === "./imgs/blank.gif"
      ) {
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/flag.png");
        decreaseMines();
      } else if (
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .getAttribute("src") === "./imgs/flag.png"
      ) {
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/questionmark.png");
        increaseMines();
      } else if (
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .getAttribute("src") === "./imgs/questionmark.png"
      ) {
        table.rows[r].cells[c]
          .getElementsByTagName("img")[0]
          .setAttribute("src", "./imgs/blank.gif");
      }
    }
  }

  function showBombs() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c] === -1) {
          table.rows[r].cells[c]
            .getElementsByTagName("img")[0]
            .setAttribute("src", "./imgs/bombrevealed.gif");
        }
      }
    }
  }

  function showRealBomb(o) {
    const r = o.x;
    const c = o.y;
    table.rows[r].cells[c]
      .getElementsByTagName("img")[0]
      .setAttribute("src", "./imgs/bombdeath.gif");
  }

  // -------------------------------- MENSAGENS PARA O JOGADOR E TAL --------------------------------------------------- //

  function playerWon() {
    document.getElementById("message_to_player").innerHTML = "GANHASTE!!";
  }

  function playerLost() {
    document.getElementById("message_to_player").innerHTML = "PERDESTE!!";
  }

  function clearMessage() {
    document.getElementById("message_to_player").innerHTML = "";
  }

  function showWhosTurn() {
    document.getElementById(
      "whos_turn"
    ).innerHTML = `É o turno do jogador: ${turn}`;
  }

  function clearWhosTurn() {
    document.getElementById("whos_turn").innerHTML = "";
  }

  function updatePlayersStats() {
    document.getElementById(
      "player_stats"
    ).innerHTML = `Jogador ${username} encontrou : ${p_bombs} bombas`;
    document.getElementById(
      "opponent_stats"
    ).innerHTML = `Adversario ${opponent} encontrou : ${op_bombs} bombas`;
    return false;
  }

  function addToArray(o, a) {
    let i = 0;
    while (i < a.length && o.score > a[i].score) {
      i++;
    }

    a.splice(i, 0, o);
    console.log(`----------${o.uname} ${o.score}-------`);
  }

  function dealWithFirstClick(r, c) {
    matrix[r][c] = newValue(r, c);
    decreaseSurroundingCells(r, c);
    const t = newPos(r, c);
    matrix[t.x][t.y] = -1;
    increaseSurroundingCells(t.x, t.y);
    firstclick = false;
    timer = setInterval(updateTimer, 1000);
  }

  function newPos(r, c) {
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
  }

  function newValue(x, y) {
    let aux = 0;
    if (validPos(x - 1, y) && matrix[x - 1][y] === -1) {
      aux++;
    }
    if (validPos(x, y - 1) && matrix[x][y - 1] === -1) {
      aux++;
    }
    if (validPos(x + 1, y) && matrix[x + 1][y] === -1) {
      aux++;
    }
    if (validPos(x, y + 1) && matrix[x][y + 1] === -1) {
      aux++;
    }
    if (validPos(x - 1, y - 1) && matrix[x - 1][y - 1] === -1) {
      aux++;
    }
    if (validPos(x + 1, y - 1) && matrix[x + 1][y - 1] === -1) {
      aux++;
    }
    if (validPos(x + 1, y + 1) && matrix[x + 1][y + 1] === -1) {
      aux++;
    }
    if (validPos(x - 1, y + 1) && matrix[x - 1][y + 1] === -1) {
      aux++;
    }
    return aux;
  }

  function decreaseSurroundingCells(x, y) {
    if (validPos(x - 1, y) && matrix[x - 1][y] !== -1) {
      matrix[x - 1][y]--;
    }
    if (validPos(x, y - 1) && matrix[x][y - 1] !== -1) {
      matrix[x][y - 1]--;
    }
    if (validPos(x + 1, y) && matrix[x + 1][y] !== -1) {
      matrix[x + 1][y]--;
    }
    if (validPos(x, y + 1) && matrix[x][y + 1] !== -1) {
      matrix[x][y + 1]--;
    }
    if (validPos(x - 1, y - 1) && matrix[x - 1][y - 1] !== -1) {
      matrix[x - 1][y - 1]--;
    }
    if (validPos(x + 1, y - 1) && matrix[x + 1][y - 1] !== -1) {
      matrix[x + 1][y - 1]--;
    }
    if (validPos(x + 1, y + 1) && matrix[x + 1][y + 1] !== -1) {
      matrix[x + 1][y + 1]--;
    }
    if (validPos(x - 1, y + 1) && matrix[x - 1][y + 1] !== -1) {
      matrix[x - 1][y + 1]--;
    }
  }

  function increaseSurroundingCells(x, y) {
    if (validPos(x - 1, y) && matrix[x - 1][y] !== -1) {
      matrix[x - 1][y]++;
    }
    if (validPos(x, y - 1) && matrix[x][y - 1] !== -1) {
      matrix[x][y - 1]++;
    }
    if (validPos(x + 1, y) && matrix[x + 1][y] !== -1) {
      matrix[x + 1][y]++;
    }
    if (validPos(x, y + 1) && matrix[x][y + 1] !== -1) {
      matrix[x][y + 1]++;
    }
    if (validPos(x - 1, y - 1) && matrix[x - 1][y - 1] !== -1) {
      matrix[x - 1][y - 1]++;
    }
    if (validPos(x + 1, y - 1) && matrix[x + 1][y - 1] !== -1) {
      matrix[x + 1][y - 1]++;
    }
    if (validPos(x + 1, y + 1) && matrix[x + 1][y + 1] !== -1) {
      matrix[x + 1][y + 1]++;
    }
    if (validPos(x - 1, y + 1) && matrix[x - 1][y + 1] !== -1) {
      matrix[x - 1][y + 1]++;
    }
  }

  // ----------------------------------------------------- GENERAL FUNCTIONS ----------------------------------------------- //

  function localStorageInsert(difc) {
    if (difc === "beginner") {
      localStorage.setItem("beginner", JSON.stringify(begHonor));
    } else if (difc === "intermediate") {
      localStorage.setItem("intermediate", JSON.stringify(intHonor));
    } else {
      localStorage.setItem("expert", JSON.stringify(expHonor));
    }
  }

  function localStorageGet(difc, honorToChange) {
    let tmp = [];
    const pointerHonor = honorToChange;
    console.log("getting some scores from storage!");

    if (difc === "beginner") {
      tmp = JSON.parse(localStorage.getItem("beginner"));
    } else if (difc === "intermediate") {
      tmp = JSON.parse(localStorage.getItem("intermediate"));
    } else {
      tmp = JSON.parse(localStorage.getItem("expert"));
    }

    if (tmp !== null) {
      for (let i = 0; i < tmp.length; i++) {
        pointerHonor.push(tmp[i]);
      }
    }
  }

  function localStorageGetAll() {
    let tmp;
    console.log("Getting all scores from storage!");

    tmp = JSON.parse(localStorage.getItem("beginner"));
    if (tmp !== null) {
      for (let i = 0; i < tmp.length; i++) {
        begHonor.push(tmp[i]);
      }
    }

    tmp = JSON.parse(localStorage.getItem("intermediate"));
    if (tmp !== null) {
      for (let i = 0; i < tmp.length; i++) {
        intHonor.push(tmp[i]);
      }
    }

    tmp = JSON.parse(localStorage.getItem("expert"));
    if (tmp !== null) {
      for (let i = 0; i < tmp.length; i++) {
        expHonor.push(tmp[i]);
      }
    }
  }

  function cleanHonor() {
    document.getElementById("honorlist").innerHTML = "";
  }

  function refreshHonra() {
    console.log("Refreshing the honor list!");
    cleanHonor();
    const honor_value = document.getElementById("difHonra").value;

    switch (honor_value) {
      case "beginner":
        showHonor = begHonor;
        break;
      case "intermediate":
        showHonor = intHonor;
        break;
      case "expert":
        showHonor = expHonor;
        break;
      default:
    }

    for (let i = 0; i < showHonor.length; i++) {
      const node = document.createElement("li");
      const textnode = document.createTextNode(` ${item.uname} ${item.score}`);
      node.appendChild(textnode);
      document.getElementById("honorlist").appendChild(node);
    }
  }
}; //Fim
