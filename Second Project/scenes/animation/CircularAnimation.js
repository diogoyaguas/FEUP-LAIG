var DEGREE_TO_RAD = Math.PI / 180;

/**
 * CircularAnimation
 * @constructor
 */
/**
 * Creates a circular animation
 * 
 * @class CircularAnimation
 * @extends {Animation}
 */
class CircularAnimation extends Animation {
  /**
   * Creates an instance of CircularAnimation.
   * @param {any} scene where the animation will be applied
   * @param {any} id  the animation ID
   * @param {any} center  the center
   * @param {any} radius the radius of the the circle which will be used for this animation
   * @param {any} initialAngle the angle of the object it must be facing of, in degrees
   * @param {any} rotationAngle the angle the object must rotate, in degrees(can be greater than 360) 
   * @param {any} time the time of this circular animation 
   * 
   * @memberOf CircularAnimation
   */
  constructor(scene, id, center, radius, initialAngle, rotationAngle, time) {
    super(scene, id);

    this.center = center;
    this.radius = radius;
    this.initialAngle = initialAngle;
    this.rotationAngle = rotationAngle;

    this.totalTime = 0;
    this.movementTime = time;
  }

/**
 * Updates the values of the object (its angle and its new coordinates)

 * @param {any} currentTime the time value passed from the scene, used to animate this object.
 * 
 * @memberOf CircularAnimation
 */
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