var particlePool = [];
var particleMax = 500;



function MainMenu(){
  this.sButton = null;
  this.mButton = null;

  // State
  // Not decided  = 0
  // Singleplayer = 1
  // Multiplayer  = 2
  this.state = 0;

  this.init = function(roomWidth, roomHeight){
    var butWid = 300;
    var butHei = 80;

    var midRoomX = (roomWidth/2);
    var midRoomY = (roomHeight/2);

    this.sButton = new Button(midRoomX - butWid/2, midRoomY - butHei*2, butWid, butHei);
    this.mButton = new Button(midRoomX - butWid/2, midRoomY + butHei*2, butWid, butHei);

    this.sButton.label = "Local Multiplayer";
    this.mButton.label = "Online Multiplayer";
    this.sButton.subLabel = "Play in the same computer";
    this.mButton.subLabel = "Play in a server";
  }

  this.update = function(dt){
    this.sButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    this.mButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);

    if(this.sButton.clicked){
      this.state = 1;
    } else if (this.mButton.clicked){
      this.state = 2;
    }
  }

  this.draw = function(){
    this.sButton.draw();
    this.mButton.draw();
  }
}

function LoginMenu(){
  this.buttons = [];
  this.spaceButton = null;
  this.deleteButton = null;
  this.enterButton = null;
  this.dotButton = null;

  this.connectButton = null;
  this.usernameButton = null;
  this.adressButton = null;

  this.editState = 0;

  this.username = "";
  this.adress = "";



  // ASCII 48-90
  // AlphaNumeric
  this.init = function(){
    var butWid = 50;
    var butHei = 50;
    var butSpace = 4;

    var x = (roomWidth/2) - 5*(butWid+butSpace);
    var y = (roomHeight/2) - 2*(butHei+butSpace);
    var xx = 0;
    var yy = 0;

    var butColor = new Color(60, 60, 60);

    for(var i = 0; i < 36; i++){
      var column = i%10;
      var row = Math.floor(i/10);
      xx = column*(butWid+butSpace) + x;
      yy = row*(butHei+butSpace) + y;
      var but = new Button(xx, yy, butWid, butHei);
      var charVal = 48 + ((i>9) ? i+7:i);
      but.label = String.fromCharCode(charVal);
      but.boxColor = butColor.copy();
      this.buttons.push(but);
    }


    xx += butWid+butSpace;


    this.spaceButton = new Button(xx, yy, butWid, butHei);
    this.spaceButton.label = "";
    this.spaceButton.boxColor = butColor.copy();

    xx += butWid+butSpace;

    this.dotButton = new Button(xx, yy, butWid, butHei);
    this.dotButton.label = ".";
    this.dotButton.boxColor = butColor.copy();

    xx += butWid+butSpace;


    this.deleteButton = new Button(xx, yy, butWid, butHei);
    this.deleteButton.label = "Del";
    this.deleteButton.boxColor = new Color(100, 60, 60);

    xx += butWid+butSpace;


    this.enterButton = new Button(xx, yy, butWid, butHei);
    this.enterButton.label = "Ok";
    this.enterButton.boxColor = new Color(60, 100, 60);

    yy += 100;

    this.confirmButton = new Button(roomWidth/2, yy, 200, butHei);
    this.confirmButton.label = "Join Server";
    this.confirmButton.boxColor = butColor.copy();

    this.usernameButton = new Button(roomWidth*0.5 - 250, y - 100, 200, butHei);
    this.usernameButton.subLabel = "Username";

    this.adressButton = new Button(roomWidth*0.5 + 50, y - 100, 200, butHei);
    this.adressButton.subLabel = "Ip Adress";

  }

  this.deleteChar = function(){
    if(this.state == 1){
      if(this.username.length > 0){
        this.username = this.username.slice(0, -1);
      }
    } else if (this.state == 2){
      if(this.adress.length > 0){
        this.adress = this.adress.slice(0, -1);
      }
    }
  }

  this.addLetter = function(char){
    if(this.state == 1){
      this.username += char;
    }
  }

  this.addNumber = function(char){
    if(this.state == 1){
      this.username += char;
    } else if (this.state == 2){
      this.adress += char;
    }
  }

  this.addAlphaNum = function(charVal){
    if(this.state == 1){
      this.username += String.fromCharCode(charVal);
    } else if (this.state == 2){
      if(charVal < 65){
        this.adress += String.fromCharCode(charVal);
      }
    }
  }

  this.addSpace = function(){
    if(this.state == 1){
      this.username += " ";
    }
  }

  this.addDot = function(){
    if(this.state == 1){
      this.username += ".";
    } else if (this.state == 2){
      this.adress += ".";
    }
  }

  this.put = function(text){
    if(this.state == 1){
      this.username += text;
    } else if (this.state == 2){
      this.adress += text;
    }
  }

  this.paste = async function(){
    try {
         const text = await navigator.clipboard.readText();
         console.log('Clipboard contents:', text);
         this.put(text);
     } catch (error) {
         console.error('Failed to read clipboard:', error);
     }
  }



  this.directInput = function(){

    if(input.keyState[KeyCodes.Control][0] && input.keyState[KeyCodes.KeyV][1]){
      this.paste();
      return;
    }

    if(input.keyState[KeyCodes.Backspace][1]){
      this.deleteChar();
    }

    // Numbers
    for(var i = 0; i < 10; i++){
      var keyCode  = i+48;
      if(input.keyState[keyCode][1]){
        this.addNumber(i.toString());
      }
    }

    // Letters
    for(var i = 0; i < 26; i++){
      var keyCode  = i+65;
      if(input.keyState[keyCode][1]){
        this.addLetter(String.fromCharCode(keyCode));
      }
    }

    if(input.keyState[KeyCodes.Space][1]){
      this.addSpace();
    }

    if(input.keyState[KeyCodes.Period][1]){
      this.addDot();
    }
  }


  this.update = function(){



    this.directInput();



    for(var i = 0; i < 36; i++){
        this.buttons[i].update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
        var charVal = 48 + ((i>9) ? i+7:i);

        if(this.buttons[i].clicked){
          this.addAlphaNum(charVal);
        }
    }

    this.spaceButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    if(this.spaceButton.clicked){
      this.addSpace();
    }

    this.dotButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    if(this.dotButton.clicked){
      this.addDot();
    }

    this.deleteButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    if(this.deleteButton.clicked){
      this.deleteChar();
    }

    this.enterButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    if(this.enterButton.clicked){
      this.state = 0;
    }

    this.confirmButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    if(this.confirmButton.clicked){
      this.state = 3;
    }

    this.usernameButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    if(this.usernameButton.clicked){
      this.state = 1;
    }
    this.adressButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    if(this.adressButton.clicked){
      this.state = 2;
    }






    this.usernameButton.label = this.username;
    this.adressButton.label = this.adress;
  }

  this.draw = function(){
    for(var i = 0; i < 36; i++){
        this.buttons[i].draw();
    }
    this.spaceButton.draw();
    this.dotButton.draw();
    this.deleteButton.draw();
    this.enterButton.draw();

    this.confirmButton.draw();
    this.usernameButton.draw();
    this.adressButton.draw();
  }
}

function LobbyMenu(){
  this.readyButton = null;

  this.ready = false;
  this.change = false;

  this.init = function(){
    this.readyButton = new Button(roomWidth - 200, roomHeight - 150, 100, 50);
    this.readyButton.label = "Ready";
    this.readyButton.boxColor = new Color(100, 200, 100);
  }

  this.update = function(dt){
    this.change = false;
    this.readyButton.update(input.mouseX, input.mouseY, input.mouseState[0][0], input.mouseState[0][1]);
    if(this.readyButton.clicked){
      this.ready = !this.ready;
      this.change = true;
    }
  }

  this.draw = function(players){
    this.readyButton.draw();


    var hudWid = 100;
    var hudHei = 50;
    var hudSpace = 10;

    var startX = (roomWidth/2) - ((hudWid+hudSpace)*2);
    var startY = 40;

    for(var i = 0; i < players.length; i++){
      var col = i%4;
      var row = Math.floor(i/4);

      var xx = startX + col * (hudWid+hudSpace);
      var yy = startY + row * (hudHei+hudSpace);

      ctx.fillStyle = "hsl(" + players[i].hue + ", 100%, 50%)";
      ctx.fillRect(xx, yy, hudWid, hudHei);
      ctx.fillStyle = "rgb(255, 255, 255)";
      ctx.font = "Arial 12px";
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(players[i].name, xx+5, yy+5);

      var readyText = (players[i].ready == true) ? "Ready":"Not Ready";
      ctx.fillText(readyText, xx+5, yy+5+17)
    }
  }
}

function searchById(id, list){
  for(var i = 0; i < list.length; i++){
    if(list[i].id === id){
      return i;
    }
  }
  return -1;
}

function getObjectById(id, list){
  var ind = searchById(id, list);
  if(ind != -1) return list[ind];
  return null;
}


const GameStates = {
    Menu: 0,
    PlayerConfig: 1,
    MultiplayerLogin: 2,
    Singleplayer: 3,
    Multiplayer: 4,
    MultiplayerLobby: 5
};

function Game(){
  this.roomWidth = roomWidth;
  this.roomHeight = roomHeight;

  this.ball = new Ball(canvas.width/2,canvas.height -100);
  this.mofo = new Mofo(canvas.width/2,canvas.height -100, new Color(0,0,0));

  this.playerList = [];
  this.padList = [];
  this.padRotList = [];

  this.state = GameStates.Menu;

  this.mainMenu = new MainMenu();
  this.loginMenu = new LoginMenu();
  this.lobbyMenu = new LobbyMenu();

  this.restarting = false;
  this.restartTimer = 0;

  this.connected = false;
  this.server = null;
  this.clientId = null;

  this.searchById = function(id, list){
    return searchById(id, list);
  }

  this.getObjectById = function(id, list){
    return getObjectById(id, list);
  }

  this.playerById = function(id){
    return this.searchById(id, this.playerList);
  }

  this.padById = function(id){
    return this.searchById(id, this.padList);
  }

  this.padRotById = function(id){
    return this.searchById(id, this.padRotList);
  }


  this.createNewPlayer = function(name, hue, id, padId, padRotId){
    var player = new Player(id);
    player.name = name;
    player.hue = hue;

    var pad = new Pad((this.roomWidth -100)/2, this.roomHeight -100);
    pad.hue = hue;
    pad.name = name;
    pad.id = padId;
    this.padList.push(pad);

    var padRot = new PadRotator((Math.PI*2/this.padList.length), player, pad);
    padRot.id = padRotId;
    this.padRotList.push(padRot);

    player.padId = pad.id;
    player.padRotId = padRot.id;

    this.playerList.push(player);
  }

  this.deletePlayer = function(id){
    var playerInd = this.playerById(id);
    if(playerInd == -1) return;

    var padId = this.playerList[playerInd].padId;
    var padRotId = this.playerList[playerInd].padRotId;

    this.playerList.splice(playerInd, 1);

    var padInd = this.padById(padId);
    if(padInd != -1) this.padList.splice(padInd, 1);

    var padRotInd = this.padRotById(padRotId);
    if(padRotInd != -1) this.padRotList.splice(padRotInd, 1);
  }

  this.reset = function(){
    this.playerList = [];
    this.padList = [];
    this.padRotList = [];
  }


  this.disconnect = function(){
    this.reset();
    this.state = 0;
    this.connected = false;
  }

  this.connect = function(ip){
    this.reset();

    this.server = new WebSocket(ip);

    this.server.onopen = () => {

      this.connected = true;
      console.log('Connected to the server');

      this.server.onmessage = (event) => {

        var data = JSON.parse(event.data);
        //
        switch(data.type){

          // Starts Match
          // Changes Game State
          case 'ReceiveOwnId':
            this.clientId = data.id;
            this.server.send(JSON.stringify({clientId:this.clientId, type:'login', username:this.loginMenu.username}));
            console.log("Received " + event.data);
            break;

          case 'MatchUpdate':
            switch(data.state){
              case 0:

                break;

              case 1:

                break;

              case 4:
                this.state = 4;
                break;
            }
            break;

          case 'PlayerUpdate':
            this.playerList[this.playerById(data.id)].ready = data.ready;
            break;

          // Creates Player, Pad and PadRot
          case 'PlayerCreate':
            this.createNewPlayer(data.name, data.hue, data.id, data.padId, data.padRotId);
            console.log("Received " + event.data);
            break;

          // Deletes Player, Pad and PadRot
          case 'PlayerDelete':
            this.deletePlayer(data.id);
            console.log("Received " + event.data);
            break;

          // Updates Player Score when new score
          case 'ScoreUpdate':

            break;

          // Updates Objects
          case 'ObjectUpdate':
            switch(data.object){
              case 'pad':
                this.padList[this.padById(data.id)].charge = data.charge;
                break;

              case 'padRot':
                this.padRotList[this.padRotById(data.id)].angle = data.angle;
                break;

              case 'player':
                this.playerList[this.playerById(data.id)].ready = data.ready;
                this.playerList[this.playerById(data.id)].score = data.score;
                break;

              case 'ball':
                this.ball.x = data.x;
                this.ball.y = data.y;
                this.ball.hspd = data.hspd;
                this.ball.vspd = data.vspd;
                this.ball.state = data.state;
                break;
            }

          case 'BallEvent':
            console.log("Received " + event.data);
            switch(data.state){
              case 'Exploded':
                this.ball.explode();
                break;

              case 'Frozen':
                this.ball.freeze();
                break;

              case 'Extinguished':
                this.ball.extinguish();
                break;

              case 'Reset':
                this.ball.reset();
                break;
            }
            break;
        }
      };

      // WebSocket onclose event
     this.server.onclose = function(event) {
         console.log('WebSocket connection closed:', event.code, event.reason);
         this.disconnect();
     };

     // WebSocket onerror event
     this.server.onerror = function(error) {
         console.error('WebSocket error:', error);
         this.disconnect();
     };

      this.initMultiplayerLobby();
      this.state = 5;
    };
  }

  this.update = function(dt){
    switch(this.state){
      case 0:
        this.updateMenu(dt);
        break;

      case 1:
        this.updatePlayerConfig(dt);
        break;

      case 2:
        this.updateMultiplayerLogin(dt);
        if(this.loginMenu.state == 3){
          this.loginMenu.state = 0;

          if(this.loginMenu.adress == ""){
            this.connect('ws://localhost:8080');
          } else {
            this.connect("ws://" + this.loginMenu.adress + ":8080");
          }
        }
        break;

      case 3:
        this.updateSingleplayer(dt);
        break;

      case 4:
        this.updateMultiplayer(dt);
        break;

      case 5:
        this.updateMultiplayerLobby(dt);
        break;
    }
  }

  this.draw = function(){
    switch(this.state){
      case 0:
        this.drawMenu();
        break;

      case 1:
        this.drawPlayerConfig();
        break;

      case 2:
        this.drawMultiplayerLogin();
        break;

      case 3:
        this.drawSingleplayer();
        break;

      case 4:
        this.drawMultiplayer();
        break;

      case 5:
        this.drawMultiplayerLobby();
        break;
    }
  }



  // Main Menu

  this.initMenu = function(roomWidth, roomHeight){
    this.mainMenu.init(roomWidth, roomHeight);
  }

  this.updateMenu = function(dt){
    this.mainMenu.update(dt);
    if(this.mainMenu.state == 1){
      this.initConfigMenu();
    } else if (this.mainMenu.state == 2){
      this.state = 2;
      this.initLoginMenu();
    }
  }

  this.drawMenu = function(){
    this.mainMenu.draw();
  }



  // Multiplayer Lobby
  this.initMultiplayerLobby = function(){
    this.lobbyMenu.init();
  }

  this.updateMultiplayerLobby = function(dt){
    this.lobbyMenu.update(dt);
    if(this.lobbyMenu.change){
      this.server.send(JSON.stringify({clientId:this.clientId, type:'ready', state:this.lobbyMenu.ready}));
    }
  }

  this.drawMultiplayerLobby = function(){
    this.lobbyMenu.draw(this.playerList);
  }



  // Multiplayer Login Menu
  this.initLoginMenu = function(){
    this.loginMenu.init();
  }

  this.updateMultiplayerLogin = function(dt){
    this.loginMenu.update();
  }

  this.drawMultiplayerLogin = function(){
    this.loginMenu.draw();
  }


  this.initConfigMenu = function(){
    this.initSingleplayer(exampleGame(3));
  }



  // Singleplayer
  this.initSingleplayer = function(players){

    this.state = GameStates.Singleplayer;

    this.playerList = [];
    this.padList = [];
    this.padRotList = [];

    this.ball = new Ball(canvas.width/2,canvas.height -100);
    this.mofo = new Mofo(canvas.width/2, canvas.height/2, new Color(0,0,0));

    for(var player of players){
      this.playerList.push(player);
    }

    for(var i = 0; i < this.playerList.length; i++){
      var pad = new Pad((this.roomWidth -100)/2, this.roomHeight -100);
      pad.hue = Math.floor(i*360/3);
      pad.name = this.playerList[i].name;
      pad.id = i;
      this.playerList[i].padId = pad.id;
      this.padList.push(pad);
    }

    for(var i = 0; i < this.playerList.length; i++){
      var padRot = new PadRotator((Math.PI*2/this.padList.length)*i, this.playerList[i], this.padList[i]);
      padRot.id = i;
      this.playerList[i].padRotId = padRot.id;
      this.padRotList.push(padRot);
    }
  }

  this.updateSingleplayer = function(dt){
    this.mofo.x = this.ball.x;
    this.mofo.y = this.ball.y;
    this.mofo.update(dt);

    for(const player of this.playerList){
      player.update();
    }

    for(const padRot of this.padRotList){
      padRot.update(dt);
    }

    for(const pad of this.padList){
      pad.update();
    }

    this.ball.update(dt, this.padList);

    if(!this.restarting){
      if(this.ball.state > 3){
        if(this.ball.state == BallStates.Exploded){
          var loserPad = this.ball.colliderList[0];
          var winnerPad = this.ball.colliderList[1];

          for(var player of this.playerList){
            if(player.padId == loserPad){
              //loserPlayer = player;
              console.log("Loser: " + player.name + " Id:" + player.id );
            } else if(player.padId == winnerPad){
              player.score += 2;
              console.log("Winner: " + player.name + " Id:" + player.id );
              //winnerPlayer = player;
            } else {
              console.log("Other: " + player.name + " Id:" + player.id );
              player.score += 1;
            }
          }



          this.restarting = true;
          this.restartTimer = 100;
        } else if(this.ball.state == BallStates.Extinguished){
          this.restarting = true;
          this.restartTimer = 100;
        } else if(this.ball.state == BallStates.Frozen){
          var loserPad = this.ball.colliderList[0];

          for(const player of this.playerList){
            if(player.padId != loserPad){
              //loserPlayer = player;
            } else {
              player.score += 1;
            }
          }

          this.restarting = true;
          this.restartTimer = 100;
        }
      }
    }

    if(this.restarting){
      this.restartTimer -= dt;
      if(this.restartTimer <= 0){
        this.restarting = false;
        this.ball.reset();
      }
    }

    // Particle System
    arrLength = particlePool.length;
    for(let i = 0; i < arrLength; i++){
      let part = particlePool[i];
      if(part.active){
        part.update(dt);
      } else {
        // Remove inactive objects
        particlePool.splice(i, 1);
        i--;
        arrLength--;
      }
    }
  }

  this.drawSingleplayer = function(){
    //this.mofo.draw();

    for(const padRot of this.padRotList){
      padRot.draw();
    }

    for(const pad of this.padList){
      pad.draw();
    }

    this.ball.draw();

    // Particle System
    for(let i = 0; i < particlePool.length; i++){
      particlePool[i].draw();
    }

    this.drawScores();
  }

  this.drawScores = function(){
    let fontSize = 18;
    ctx.font = "Arial " + Math.floor(fontSize) + "px";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    for(var i = 0; i < this.playerList.length; i++){
      const player = this.playerList[i];
      ctx.fillStyle = "hsla(" + player.hue + ", 100%, 50%, 1)";
      ctx.fillText(player.score + " [ " + player.name + " ]", 10, 10 + i*fontSize*1.2);
    }
  }



  // Multiplayer
  this.updateMultiplayer = function(dt){

    var ownPlayer = this.playerList[this.playerById(this.clientId)];
    var ownPadRot = this.padRotList[this.padRotById(ownPlayer.padRotId)];
    var ownPad = this.padList[this.padById(ownPlayer.padId)];

    if(ownPad.charge <= 0){
      if(input.keyState[KeyCodes.ArrowLeft][0]){
        ownPadRot.angle += ownPadRot.angSpd*dt;
      }

      if(input.keyState[KeyCodes.ArrowRight][0]){
        ownPadRot.angle -= ownPadRot.angSpd*dt;
      }
    }

    if(input.keyState[KeyCodes.ArrowDown][0]){
      ownPad.charge += ownPadRot.chargeSpd*dt;
    } else {
      if(ownPad.charge > 0){
        ownPad.charge -= 8*dt;
      }
    }

    this.mofo.x = this.ball.x;
    this.mofo.y = this.ball.y;
    this.mofo.update(dt);




    for(const padRot of this.padRotList){
      padRot.update(dt, true);
    }

    for(const pad of this.padList){
      pad.update();
    }

    this.ball.update(dt, this.padList, true);

    // Particle System
    arrLength = particlePool.length;
    for(let i = 0; i < arrLength; i++){
      let part = particlePool[i];
      if(part.active){
        part.update(dt);
      } else {
        // Remove inactive objects
        particlePool.splice(i, 1);
        i--;
        arrLength--;
      }
    }



    this.server.send(JSON.stringify({clientId: this.clientId, type:'update', padAng:ownPadRot.angle, padCharge:ownPad.charge}));
  }

  this.drawMultiplayer = function(){
    this.drawSingleplayer();
  }
}



function exampleGame(playerNum){

  const nicknames = [
  "Buddy",
  "Sparky",
  "Sunshine",
  "Champ",
  "Sunny",
  "Peaches",
  "Ace",
  "Angel",
  "Blaze",
  "Bubbles",
  "Captain",
  "Cookie",
  "Dizzy",
  "Frosty",
  "Giggles",
  "Jazz",
  "Lucky",
  "Marshmallow",
  "Ninja",
  "Pumpkin",
  "Rocky",
  "Shadow",
  "Scooter",
  "Squirt",
  "Tiger",
  "Whiskers",
  "Wizard",
  "Ziggy",
  "Boomer",
  "Cinnamon",
  "Doodle",
  "Fizzy",
  "Jellybean",
  "Mischief",
  "Muffin",
  "Pepper",
  "Rascal",
  "Snickerdoodle",
  "Twinkle",
  "Waffles",
  "Whisper",
  "Zippy",
  "Comet",
  "Doodlebug",
  "Fluffy",
  "Honey",
  "Pebbles",
  "Sizzle",
  "Snoopy",
  "Sprout",
  "Tinker",
  "Whisper",
  "Bumblebee",
  "Dynamo",
  "Gizmo",
  "Jelly",
  "Noodle",
  "Peanut",
  "Scooter",
  "Snuggles",
  "Starlight",
  "Thunder",
  "Wiggles",
  "Zoomer"
];

  var playerList = [];
  var playerNumber = Math.max(Math.min(playerNum, 4), 1);
  var keymaps = [
    [KeyCodes.KeyA, KeyCodes.KeyW, KeyCodes.KeyD, KeyCodes.KeyS, KeyCodes.KeyQ],
    [KeyCodes.ArrowLeft, KeyCodes.ArrowUp, KeyCodes.ArrowRight, KeyCodes.ArrowDown, KeyCodes.Control],
    [KeyCodes.KeyJ, KeyCodes.KeyI, KeyCodes.KeyL, KeyCodes.KeyK, KeyCodes.KeyU],
    [KeyCodes.Numpad4, KeyCodes.Numpad8,KeyCodes.Numpad6,KeyCodes.Numpad5,KeyCodes.Numpad9]];

  for(var i = 0; i < playerNumber; i++){
    var player = new Player(i);
    player.initKeybinder(keymaps[i]);
    player.name = nicknames[Math.floor(Math.random() * nicknames.length)];

    playerList.push(player);
  }

  return playerList;
}

var game = new Game();
game.initMenu(roomWidth, roomHeight);

const TICK_RATE = 1000 / 60; // Target tick rate (60 ticks per second)
let lastTick = Date.now();

function step(){

  const now = Date.now();
  const deltaTime = now - lastTick; // Time elapsed since last tick
  lastTick = now;

  // Fundo Branco
  ctx.fillStyle = 'white';
  ctx.fillRect(0,0, canvas.width, canvas.height);

  game.update(deltaTime/15);
  game.draw();

  input.update();




  requestAnimationFrame(step)
}

step();
