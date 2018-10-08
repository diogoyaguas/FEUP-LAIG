/**
 * MyCylinder
 * @constructor
 */
class MyCylinder extends CGFobject {
    constructor(scene, baseRadius, topRadius, height, slices, stacks) {
        super(scene);
        this.scene = scene;
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.baseRadius = baseRadius;
        this.topRadius = topRadius;

        this.cylinderSide = null;
        this.base = null;
        this.top = null;

        // first creates the cylinder side
        this.cylinderSide = new CylinderSide(scene, height, baseRadius, topRadius, stacks, slices);

        // then creates the base and the top
        this.top = new CylinderTop(scene, topRadius, slices);
        this.base = new CylinderTop(scene, baseRadius, slices);
    };

    display() {
        // displays the side first
        this.cylinderSide.display();

        // displays the top 
        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.top.display();
        this.scene.popMatrix();

        // displays the base 
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.base.display();
        this.scene.popMatrix();

    };

};