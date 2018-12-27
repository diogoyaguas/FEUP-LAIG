/**
 * MyRectangle
 * @constructor
 */
/**
 * Creates arectangle
 * 
 * @class MyRectangle
 * @extends {CGFobject}
 */
class MyRoom extends CGFobject {

    /**
     * Creates an instance of MyRectangle.
     * @param {any} scene 
     * 
     */
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.point1 = [0, 0];
        this.point2 = [1, 1];
        this.trunk = new MyRectangle(this.scene, this.point1, this.point2);
        this.table = new MyRectangle(this.scene, this.point1, this.point2);
        this.wall = new MyRectangle(this.scene, this.point1, this.point2);
    };

    display() {
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-16, -6, 0);
        this.scene.scale(16, 4, 1);
        this.trunk.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(-28, -4, -0.1);
        this.scene.scale(40, 25, 0);
        this.table.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(-10, -7, -12);
        this.scene.scale(25, 28, 0);
        this.table.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-12, -10, -6);
        this.scene.scale(45, 30, 0);
        this.wall.display();
        this.scene.popMatrix();
    
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(-10, -20, -28);
        this.scene.scale(45, 30, 0);
        this.wall.display();
        this.scene.popMatrix();
    };
};


