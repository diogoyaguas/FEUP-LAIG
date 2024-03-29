/**
 * LinearAnimation
 * @constructor
 */
/**
 * Creates a linear animation
 * 
 * @class LinearAnimation
 * @extends {Animation}
 */
class LinearAnimation extends Animation {
  /**
   * Creates an instance of LinearAnimation.
   * @param {any} scene where the animation will be applied
   * @param {any} id the animation ID
   * @param {any} time the time of this linear animation 
   * @param {any} points all the control points used for this linear animation
   * 
   * @memberOf LinearAnimation
   */
  constructor(scene, id, time, points) {
    super(scene, id);

    this.movementTime = time;
    this.points = points;
    this.totalDistance = 0;
    this.currentDistance = 0;
    this.previousAngle = 0;
    this.distanceFromInitialPoint = [];
    this.distanceBetweenPoints = [];

    for (var i = 0; i < points.length - 1; i++) {
      var distance =
          vec3.dist(vec3.fromValues(points[i][0], points[i][1], points[i][2]),
                    vec3.fromValues(points[i + 1][0], points[i + 1][1],
                                    points[i + 1][2]));
      this.totalDistance += distance;
      this.distanceFromInitialPoint.push(this.totalDistance);
      this.distanceBetweenPoints.push(distance);
    }

    this.speed = this.totalDistance / this.movementTime;
  }
/**
 * Updates the values of the object (its angle and its new coordinates)
 * 
 * @param {any} currentTime the time value passed from the scene, used to animate this object.
 * 
 * @memberOf LinearAnimation
 */
  update(currentTime) {
    if (!this.ended) {
      if (this.currentDistance > this.totalDistance) {
        this.ended = true;
      }

      mat4.identity(this.transformationMatrix);
      this.currentDistance += this.speed * currentTime;
      var initTranslation = [0, 0, 0];

      // find current segment
      var i = 0;

      while (this.currentDistance > this.distanceFromInitialPoint[i] &&
             i < this.distanceFromInitialPoint.length - 1) {
        initTranslation = this.points[i + 1];
        i++;
      }
      mat4.translate(this.transformationMatrix, this.transformationMatrix,
                     initTranslation);

      // get control points from current segment
      var p1 = this.points[i];
      var p2 = this.points[i + 1];

      // calculate displacement and apply translation
      var relativeDistance;
      if (i == 0) {
        relativeDistance =
            ((this.currentDistance) / (this.distanceBetweenPoints[i]));
      } else {
        relativeDistance =
            ((this.currentDistance - this.distanceFromInitialPoint[i - 1]) /
             this.distanceBetweenPoints[i]);
      }

      mat4.translate(this.transformationMatrix, this.transformationMatrix, [
        (p2[0] - p1[0]) * relativeDistance,
        (p2[1] - p1[1]) * relativeDistance,
        (p2[2] - p1[2]) * relativeDistance
      ]);

      // calculate rotation angle and apply rotation
      var angle = this.calculateAngle(p1, p2);

      mat4.rotate(this.transformationMatrix, this.transformationMatrix, angle,
                  [0, 1, 0]);
    }
  }
/**
 * Calculates the angle of this linear animation
 * 
 * @param {any} p1 starting point
 * @param {any} p2 finishing point
 * @returns 
 * 
 * @memberOf LinearAnimation
 */
  calculateAngle(p1, p2) {
    var subtractedPoints = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
    var vector1 = [0, 0, 1];

    var vMag1 = 1;

    var vMag2 = Math.sqrt(subtractedPoints[0] * subtractedPoints[0] +
                          subtractedPoints[1] * subtractedPoints[1] +
                          subtractedPoints[2] * subtractedPoints[2]);

    var v1 = [vector1[0] / vMag1, vector1[1] / vMag1, vector1[2] / vMag1];
    var v2 = [
      subtractedPoints[0] / vMag2,
      subtractedPoints[1] / vMag2,
      subtractedPoints[2] / vMag2
    ];

    var dotProduct = (v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]);

    var angle = Math.acos(dotProduct / (vMag1 * vMag2));

    return angle;
  }
}