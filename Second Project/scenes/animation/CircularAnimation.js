var DEGREE_TO_RAD = Math.PI / 180;

/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation {
  constructor(scene, id, center, radius, initialAngle, rotationAngle, time) {
    super(scene, id);

    this.center = center;
    this.radius = radius;
    this.initialAngle = initialAngle;
    this.rotationAngle = rotationAngle;

    this.totalTime = 0;
    this.movementTime = time;
  }


  update(currentTime) {

    if (!this.ended) {

      if (this.totalTime > this.movementTime) {

        this.ended = true;
      }

      mat4.identity(this.transformationMatrix);
      mat4.translate(this.transformationMatrix, this.transformationMatrix,
                     [this.center[0], this.center[1], this.center[2]]);

      this.totalTime += currentTime;

      var angle = (this.totalTime / this.movementTime) * this.rotationAngle;
      angle += this.initialAngle;

      mat4.rotateY(this.transformationMatrix, this.transformationMatrix,
                   angle * DEGREE_TO_RAD);
      mat4.translate(this.transformationMatrix, this.transformationMatrix,
                     [this.radius, 0, 0]);
    }
  }
}