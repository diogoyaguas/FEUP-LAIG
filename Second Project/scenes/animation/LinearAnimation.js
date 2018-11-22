/**
 * LinearAnimation
 * @constructor
 */
class LinearAnimation extends Animation {
    constructor(scene, id, time, points) {
        super(scene, id);
        
        this.time = time;
        this.points = points;
        this.totalDistance = 0;
        this.distanceBetweenPoints = [];
        this.vector = [];

        for (var i = 0; i < points.length - 1; i++) {
            this.totalDistance += vec3.dist(vec3.fromValues(points[i][0], points[i][1], points[i][2]), vec3.fromValues(points[i + 1][0], points[i + 1][1], points[i + 1][2]));
            this.distanceBetweenPoints.push(this.totalDistance);
            this.vector[i] = [points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1], points[i + 1][2] - points[i][2]];
        }

        this.speed = this.totalDistance / this.time;
        this.initialTime = undefined;
        this.previousAngle = 0;
    }

    update(currentTime) {

        if(!this.ended) {

            if (this.initialTime == undefined)
                this.initialTime = currentTime;

            var actualTime;

            if (this.initialTime == 0)
                actualTime = currentTime;
            else
                actualTime = currentTime - this.initialTime;

            if (actualTime > this.time) {
                actualTime = this.time;
                this.ended = true;
            }

            this.currentDistance = this.speed * actualTime;

            var division = 0;

            while(this.currentDistance > this.distanceBetweenPoints[division] && division < this.distanceBetweenPoints.length)
                division++;

            var p1 = this.points[division];
            var p2 = this.points[division + 1];

            var distanceFromLastDivision = this.distanceBetweenPoints[division - 1];
            if (division == 0)
                distanceFromLastDivision = 0;

            var currentDistanceFromLastDivision = this.currentDistance - distanceFromLastDivision;
            var currentTotalDistanceFromLastDivision = this.distanceBetweenPoints[division] - distanceFromLastDivision
            var incrementMovement = currentDistanceFromLastDivision / currentTotalDistanceFromLastDivision;

            var product = vec3.dot(this.vector[division + 1], [0,1,0]);
            var cos = product / this.distanceBetweenPoints[division + 1];

            var rotationAngle = Math.acos(cos);

            var xyz = [];

            xyz[0] = (p2[0] - p1[0]) * incrementMovement + p1[0];
            xyz[1] = (p2[1] - p1[1]) * incrementMovement + p1[1];
            xyz[2] = (p2[2] - p1[2]) * incrementMovement + p1[2];

            mat4.translate(this.transformationMatrix, this.transformationMatrix, xyz);
            mat4.rotate(this.transformationMatrix, this.transformationMatrix, rotationAngle, this.axis);
        }
    }
}