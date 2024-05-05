// Mofo
function Mofo(x, y, color){
  this.x = x;
  this.y = y;
  this.rastro = [];
  this.rastroMax = 2000;
  this.stepSize = 4;
  this.mofoSize = 3;
  this.color = color;

  // Mosca
  this.update = function(dt){
    this.x += Math.random()*this.stepSize*2 -this.stepSize;
    this.y += Math.random()*this.stepSize*2 -this.stepSize;

    this.rastro.push(this.x);
    this.rastro.push(this.y);

    if(this.rastro.length > this.rastroMax){
      this.rastro.shift();
      this.rastro.shift();
    }
  }



  this.draw = function(){
    for(var i = 0; i < this.rastro.length/2; i++){
      var alpha = i/(this.rastro.length/2);
      this.color.a = alpha;
      ctx.fillStyle = this.color.toCSS();
      ctx.fillRect(this.rastro[i*2], this.rastro[1+ i*2], this.mofoSize, this.mofoSize);
    }
  }
}
