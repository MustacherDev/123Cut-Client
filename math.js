
class Vector2D {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  // Addition of two vectors
  add(vector) {
    return new Vector2D(this.x + vector.x, this.y + vector.y);
  }

  // Subtraction of two vectors
  subtract(vector) {
    return new Vector2D(this.x - vector.x, this.y - vector.y);
  }

  // Scalar multiplication
  multiplyScalar(scalar) {
    return new Vector2D(this.x * scalar, this.y * scalar);
  }

  // Magnitude (length) of the vector
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Normalization (converting to unit vector)
  normalize() {
    const mag = this.magnitude();
    if (mag === 0) {
      return new Vector2D();
    }
    return new Vector2D(this.x / mag, this.y / mag);
  }

  // Dot product of two vectors
  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  // Cross product of two vectors (only z-component in 2D)
  cross(vector) {
    return this.x * vector.y - this.y * vector.x;
  }

  // Angle between two vectors (in radians)
  angle(vector) {
    return Math.atan2(this.cross(vector), this.dot(vector));
  }

  // Rotate the vector by a given angle (in radians)
  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector2D(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  // Clone the vector
  clone() {
    return new Vector2D(this.x, this.y);
  }

  // Set the vector's components
  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  // Reset the vector's components to zero
  zero() {
    this.x = 0;
    this.y = 0;
    return this;
  }
}

// Convert radians to degrees
function rad2deg(radians) {
  return radians * (180 / Math.PI);
}

// Convert degrees to radians
function deg2rad(degrees) {
  return degrees * (Math.PI / 180);
}
