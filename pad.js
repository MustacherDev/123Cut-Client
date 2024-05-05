
function lineToPoints(line){
  var rotVec = new Vector2D(line.length*0.5*Math.cos(line.angle), line.length*0.5*Math.sin(line.angle));
  var posVec = new Vector2D(line.x, line.y);
  return {p1: posVec.subtract(rotVec), p2: posVec.add(rotVec)};
}




function Pad(x,y){
  this.x = x;
  this.y = y;
  this.length = 100;
  this.angle = 10;
  this.radius = 10;

  this.hspd = 0;
  this.vspd = 0;

  this.colliding = false;
  this.closestPoint = new Vector2D(0,0);

  this.name = "";

  this.charge = 0;

  this.hue = 0;

  this.id = -1;

  this.draw = function(){
    var extents = lineToPoints(this);

    var alphaColor = "hsla(" + this.hue + ", 100%, 50%, 0.5)";
    var closestColor = "hsla(" + this.hue + ", 100%, 20%, 1)";


    ctx.fillStyle = alphaColor;

    ctx.beginPath();
    ctx.arc(extents.p1.x, extents.p1.y, this.radius, this.angle + Math.PI/2, this.angle + Math.PI + Math.PI/2);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(extents.p2.x, extents.p2.y, this.radius, this.angle - Math.PI/2, this.angle + Math.PI - Math.PI/2);
    ctx.fill();
    ctx.closePath();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle+Math.PI);
    ctx.fillRect(-this.length/2, -this.radius, this.length, this.radius*2);

    var pullDist = this.radius *4;

    ctx.fillRect(-this.length/2, this.radius + pullDist*(this.charge/100), this.length, this.radius/2);

    var len = this.length*0.8;


    var totalBars = 10;
    var bars = totalBars* (this.charge/100);
    var wholeBars = Math.floor(bars);

    var hei = pullDist/totalBars;
    var i = 0;
    for(; i < wholeBars; i++){
      ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
      if(i % 2 == 0){
        ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
      }
      ctx.fillRect(-len/2, -(i+1)*hei + this.radius + pullDist*(this.charge/100), len, hei);
    }

    ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
    if(i % 2 == 0){
      ctx.fillStyle = "rgba(50, 50, 50, 0.5)";
    }
    var endHei = hei*(bars - wholeBars);
    ctx.fillRect(-len/2, this.radius, len, endHei);

    ctx.font = '14px Arial'; // font size and family
    // Set the fill color
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = closestColor;
    ctx.fillText(this.name, 0, 0); // fillText to fill the text
    ctx.rotate(-this.angle-Math.PI);
    ctx.translate(-this.x, -this.y);

    ctx.fillStyle = closestColor;
    ctx.beginPath();
    ctx.arc(this.closestPoint.x, this.closestPoint.y, this.radius/4, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();



  }

  this.update = function () {

  }
}




function PadRotator(ang, player, pad){
  this.angle = ang;

  this.angleMin = -Math.PI/8;
  this.angleMax = 9*Math.PI/8;

  this.x = roomWidth/2;
  this.y = roomHeight/2;
  this.radius = roomHeight/2.2;

  this.id = -1;
  this.player = player;
  this.pad = pad;

  this.angSpd = 0.02;
  this.chargeSpd = 2;

  this.update = function(dt, isMultiplayer){
    if(this.player != null && !isMultiplayer){

      if(this.pad.charge <= 0){
        if(this.player.keybinder.input[KeyMap.Left][0]){
          this.angle += this.angSpd*dt;
        }

        if(this.player.keybinder.input[KeyMap.Right][0]){
          this.angle -= this.angSpd*dt;
        }
      }

      if(this.player.keybinder.input[KeyMap.Down][0]){
        this.pad.charge += this.chargeSpd*dt;
      } else {
        if(this.pad.charge > 0){
          this.pad.charge -= 8*dt;
        }
      }

      this.pad.charge = Math.min(this.pad.charge, 100);
    }

    this.angle = Math.max(Math.min(this.angle, this.angleMax), this.angleMin);

    this.pad.x = this.x + Math.cos(this.angle)*this.radius;
    this.pad.y = this.y + Math.sin(this.angle)*this.radius;
    this.pad.angle = this.angle + Math.PI/2;
  }

  this.draw = function(){

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.fillRect(0, -3, this.radius - this.pad.radius, 6);
    ctx.rotate(-this.angle);
    ctx.translate(-this.x, -this.y);


    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 8, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 5, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
  }
}
