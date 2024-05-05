
const BallStates = {
  Cold: 0,
  Normal: 1,
  Warm: 2,
  Burning: 3,
  Exploded: 4,
  Extinguished: 5,
  Frozen: 6
}


function Ball(x, y){
  this.x = x;
  this.y = y;

  this.hspd = 1;
  this.vspd = -1;
  this.maxSpd = 8;

  this.radius = 20;

  this.colliderList = [-1, -1];
  this.colliding = false;

  this.state = BallStates.Cold;

  this.freezePartTimer = 0;
  this.extinguishedPartTimer = 0;
  this.burningPartTimer = 0;
  this.active = true;

  this.wallTouches = 0;


  this.drawDirection = function(){
    ctx.fillStyle = "rgb(0,0,0)";
    var ang = -(new Vector2D(this.hspd, this.vspd)).angle(new Vector2D(1, 0));
    ctx.translate(this.x, this.y);
    ctx.rotate(ang);
    ctx.fillRect(0, -2, this.radius*4, 4);
    ctx.rotate(-ang);
    ctx.translate(-this.x, -this.y);
  }

  this.draw = function () {
    var color = "rgb(0,0,0)";
    switch(this.state){
      case 0:
        color = "rgb(0,0,200)";
        break;
      case 1:
        color = "rgb(0,200,0)";
        break;
      case 2:
        color = "rgb(200,200,0)";
        break;
      case 3:
        color = "rgb(200,0,0)";
        break;

      case 4:
        color = "rgb(0,0,0)";
        break;

      case 5:
        color = "rgb(127,88,88)";
        break;

      case 6:
        color = "rgb(120,176,176)";
        break;

    }

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }


  this.explode = function(){
    snd_explosion.play();
    this.state = BallStates.Exploded;

    for(var i = 0; i < 100; i++){
      if(particlePool.length >= particleMax){
          break;
      }
      var particle = new Particle(this.x, this.y, 400);
      var ang = Math.random()*Math.PI*2;
      var spd = Math.random()*10;
      particle.spd.x = Math.cos(ang)*spd;
      particle.spd.y = Math.sin(ang)*spd;
      particle.acc.y = 0.2;
      particle.radius = 2 + Math.random()*2;
      particlePool.push(particle);
    }
    this.active = false;
  }

  this.freeze = function(){
    this.state = BallStates.Frozen;
    snd_freeze.play();
    this.active = false;
  }

  this.extinguish = function(){
    this.state = BallStates.Extinguished;
    snd_fireExtinguished.play();

    for(var i = 0; i < 10; i++){
      if(particlePool.length >= particleMax){
          break;
      }
      var particle = new Particle(this.x, this.y, 400);
      var ang = Math.random()*Math.PI*2;
      var spd = Math.random()*1;
      particle.spd.x = Math.cos(ang)*spd;
      particle.spd.y = Math.sin(ang)*spd;
      particle.acc.y = -0.1;
      particle.radius = 2 + Math.random()*2;
      particlePool.push(particle);
    }
    this.active = false;
  }



  this.reset = function(){
    this.active = true;
    this.x = roomWidth/2;
    this.y = roomHeight/2;
    this.wallTouches = 0;
    this.hspd = 0;
    this.vspd = -10;
    this.state = 0;
    this.colliderList = [-1, -1];
    this.freezePartTimer = 0;
    this.extinguishedPartTimer = 0;
    this.burningPartTimer = 0;
  }

  this.update = function (dt, padList, isMultiplayer) {

    if(this.state == BallStates.Frozen){
      this.freezePartTimer += 0.1*dt;
      for(var i = 0; i < Math.floor(this.freezePartTimer); i++){
        if(particlePool.length >= particleMax){
          this.freezePartTimer = 0;
          break;
        }
        var particle = new Particle(this.x, this.y, 400);
        var ang = Math.random()*Math.PI*2;
        var spd = Math.random()*1;
        particle.spd.x = Math.cos(ang)*spd;
        particle.spd.y = Math.sin(ang)*spd;
        particle.acc.y = 0;
        particle.radAcc = 0.1;
        particle.tanAcc = 0.2;
        particle.radius = 2 + Math.random()*2;

        var blueness = Math.floor(Math.random()*80);

        particle.color = new Color(255 - blueness, 255 - blueness, 255);
        particlePool.push(particle);

        this.freezePartTimer--;
      }
    } else if (this.state == BallStates.Extinguished){
      this.extinguishedPartTimer += 0.2*dt;
      for(var i = 0; i < Math.floor(this.extinguishedPartTimer); i++){
        if(particlePool.length >= particleMax){
            break;
        }
        var particle = new Particle(this.x, this.y, 400);
        var ang = Math.random()*Math.PI*2;
        var spd = Math.random()*1;
        particle.spd.x = Math.cos(ang)*spd;
        particle.spd.y = Math.sin(ang)*spd;
        particle.acc.y = -0.1;
        particle.radius = 2 + Math.random()*2;
        particlePool.push(particle);
        this.extinguishedPartTimer--;
      }
    } else if (this.state == BallStates.Burning){
      this.burningPartTimer += 0.4*dt;
      for(var i = 0; i < Math.floor(this.burningPartTimer); i++){
        if(particlePool.length >= particleMax){
            break;
        }
        var particle = new Particle(this.x, this.y, 400);
        var ang = Math.random()*Math.PI*2;
        var spd = Math.random();
        particle.spd.x = Math.cos(ang)*spd;
        particle.spd.y = Math.sin(ang)*spd;
        particle.acc.y = -0.05;
        particle.radAcc = 0.02;
        particle.tanAcc = 0.02;
        particle.radius = 2 + Math.random()*2;

        var hue = Math.floor(Math.random()*50);

        particle.color = Color.fromHSL(hue, 100, 50);
        particlePool.push(particle);
        this.burningPartTimer--;
      }
    }

    if(!this.active && !isMultiplayer) return;

    // Verifica se a bola atingiu as paredes do canvas
    if (this.x > roomWidth - this.radius){
      this.hspd = -this.hspd; // Inverte a direção horizontal
      this.x = roomWidth - this.radius;
      this.wallTouches++;
    }
    if(this.x < this.radius) {
      this.hspd = -this.hspd; // Inverte a direção horizontal
      this.x = this.radius;
      this.wallTouches++;
    }

    if (this.y > roomHeight - this.radius) {
      this.vspd = -this.vspd; // Inverte a direção vertical
      this.y = roomHeight - this.radius;
      this.wallTouches++;
    }

    if(this.y  < this.radius){
      this.vspd = -this.vspd; // Inverte a direção vertical
      this.y = this.radius;
      this.wallTouches++;
    }


    if(this.wallTouches > 3){
      if(this.state == BallStates.Burning){
        this.extinguish();
      } else if (this.state != BallStates.Exploded && this.state != BallStates.Frozen ){
        if(this.wallTouches > 8){
          this.freeze();
        }
      }
    }

    this.colliding = false;

    for(var i = 0; i < padList.length; i++){
      var pad = padList[i];

      var collisionInfo = ballCapsuleCollision(this, pad);

      if(collisionInfo.collided){
        this.wallTouches = 0;

        var padNormal = collisionInfo.padVec.normalize().rotate(Math.PI/2);
        var result = ballCapsuleCollisionResolution(this, padNormal, collisionInfo.point, pad.radius, 1.5, pad.charge/100);

        var sameCollider = false;

        if(this.colliderList[0] == pad.id){
          sameCollider = true;
        }

        if(!sameCollider){
          if(this.state == BallStates.Burning){
            this.colliderList[1] = this.colliderList[0];
            this.colliderList[0] = pad.id;
            this.explode();
            break;
          }
        }

        snd_hit.play();

        if(result){
          pad.charge = 0;

          if(!sameCollider){
            this.colliderList[1] = this.colliderList[0];
            this.colliderList[0] = pad.id;
            this.state += 1;
          }
        }
        break;
      }
    }

    this.vspd += 0.08 * dt;

    this.vspd *= Math.pow(0.996, dt);
    this.hspd *= Math.pow(0.996, dt);

    this.vspd = Math.max(Math.min(this.vspd, this.maxSpd), -this.maxSpd);
    this.hspd = Math.max(Math.min(this.hspd, this.maxSpd), -this.maxSpd);

    this.x += this.hspd * dt;
    this.y += this.vspd * dt;
  }
}
