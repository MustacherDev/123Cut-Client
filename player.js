// The input Object

const KeyMap = {
  Left: 0,
  Up: 1,
  Right: 2,
  Down: 3,
  Space: 4,
  Total: 5
};

function Keybinder(){
  this.inputMap = [0,0,0,0,0];
  this.input = [[false, false, false],
                [false, false, false],
                [false, false, false],
                [false, false, false],
                [false, false, false]];

  this.init = function(keybindings){
    this.inputMap = [];
    this.input = [];

    for(var i = 0; i < KeyMap.Total; i++){
      this.inputMap.push(keybindings[i]);

      this.input.push([false, false, false]);
    }
  }

  this.update = function(){
    for(var i = 0; i < KeyMap.Total; i++){
        this.input[i][0] = input.keyState[this.inputMap[i]][0];
        this.input[i][1] = input.keyState[this.inputMap[i]][1];
        this.input[i][2] = input.keyState[this.inputMap[i]][2];
    }
  }
}

function Player(id){
  this.id = id;
  this.name = "";
  this.ready = false;
  this.hue = 0;

  this.score = 0;

  this.padRotId = 0;
  this.padId = 0;

  this.multiplayer = false;

  this.keybinder = new Keybinder();

  this.initKeybinder = function(keybindings){
    this.keybinder.init(keybindings);
  }

  this.update = function(dt){
    if(!this.multiplayer){
      this.keybinder.update();
    }
  }
}
