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

        this.initialTime = undefined;
        this.movementTime = time;
    }

    
    update(currentTime) {

        if (this.initialTime == undefined)
            this.initialTime = currentTime;

        var actualTime;

        if (this.initialTime == 0)
            actualTime = currentTime;
        else
            actualTime = currentTime - this.initialTime;

        var currentAngle = this.initialAngle + this.speed * this.movementTime;
        var radToDegree = 180 / Math.PI; 
        var xyz = [];

        xyz[0] = this.center[0];
        xyz[1] = this.center[1];
        xyz[2] = this.center[2];
        mat4.translate(this.transformationMatrix, this.transformationMatrix, xyz);

        mat4.rotate(this.transformationMatrix, this.transformationMatrix, currentAngle * radToDegree, this.axis);

        xyz[0] = this.radius
        xyz[1] = 0;
        xyz[2] = 0;
        mat4.translate(this.transformationMatrix, this.transformationMatrix, xyz);

        if (currentAngle * radToDegree < this.initialAngle + this.rotationAngle) {
            this.movementTime = actualTime;
        } else {
            this.ended = true;
        }
    }
}