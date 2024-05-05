
function ballLineCollision(ball, line){
  var points = lineToPoints(line);
  var ballPoint = new Vector2D(ball.x, ball.y);

  var lineVec = points.p2.subtract(points.p1);
  var ballVec = ballPoint.subtract(points.p1);

  var closestPointDist2LineP1 = lineVec.dot(ballVec);

  if(line.length == 0) return;

  var pointPerc = max(min(closestPointDist2LineP1/line.length, 1), 0);
  var closestPoint = points.p1.add(lineVec.multiplyScalar(pointPerc));

  var dist = ballPoint.subtract(closestPoint).magnitude();

  if(dist < ball.radius){
    return true;
  }

  return false;
}

function ballCapsuleCollision(ball, capsule){
  var points = lineToPoints(capsule);
  var ballPoint = new Vector2D(ball.x, ball.y);

  var lineVec = points.p2.subtract(points.p1);
  var ballVec = ballPoint.subtract(points.p1);


  // Calculate the projection of the ballVec onto the lineVec
  var t = ballVec.dot(lineVec) / lineVec.dot(lineVec);

  // Clamp t to the range [0, 1] to ensure the closest point lies on the line segment
  t = Math.max(0, Math.min(t, 1));

  var closestPoint = points.p1.add(lineVec.multiplyScalar(t));
  var dist = ballPoint.subtract(closestPoint).magnitude();

  if(dist < ball.radius + capsule.radius){
    return {collided: true, point: closestPoint, padVec: lineVec};
  }

  return {collided: false, point: closestPoint, padVec: lineVec};
}

function ballCapsuleCollisionResolution(ball, padNormal, closestPoint, radius, elasticity, boostForce){
  var ballCenter = new Vector2D(ball.x, ball.y);
  var ballVec =  ballCenter.subtract(closestPoint);

  var dist = ballVec.magnitude();
  var distDif = (ball.radius + radius) - dist;

  var sepNormal = ballVec.multiplyScalar(1/dist);
  var sepVec = sepNormal.multiplyScalar(distDif);

  ball.x += sepVec.x;
  ball.y += sepVec.y;

  var spdVec = new Vector2D(ball.hspd, ball.vspd);

  if(spdVec.dot(sepNormal) > 0){
    return false;
  }

  var reflectSpd = spdVec.add(sepNormal.multiplyScalar(spdVec.dot(sepNormal)).subtract(spdVec).multiplyScalar(2));

  if(padNormal.dot(ballVec) <= 0){
    ball.hspd = -reflectSpd.x*elasticity;
    ball.vspd = -reflectSpd.y*elasticity;

    return false;
  }

  var boostVec = padNormal.multiplyScalar(boostForce*40);

  ball.hspd = boostVec.x -reflectSpd.x*elasticity*(1-boostForce);
  ball.vspd = boostVec.y -reflectSpd.y*elasticity*(1-boostForce);

  return true;
}
