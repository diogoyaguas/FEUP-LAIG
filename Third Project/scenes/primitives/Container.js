/**
 * MyCylinder
 * @constructor
 */
/**
 * Creates and draws a primitive of cylinder type given the parameters.
 * A cylinder is composed of its side and its optional bottom/top.
 * 
 * @class MyCylinder
 * @extends {CGFobject}
 */
class Container extends CGFobject {
    /**
     * Creates an instance of MyCylinder.
     * @param {any} scene 
     * @param {any} baseRadius 
     * @param {any} topRadius 
     * @param {any} height 
     * @param {any} slices 
     * @param {any} stacks 
     * 
     * @memberOf MyCylinder
     */
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
        this.torus = new MyTorus(scene, 1,5,20,10);
        // first creates the cylinder side
        this.top = new CylinderTop(scene, topRadius, slices);
        this.base = new CylinderTop(scene, baseRadius, slices);
        this.setAppearance();
    };
    setAppearance() {
		
		this.boxAppearance = new CGFappearance(this.scene);
        this.boxAppearance.setAmbient(1, 1, 1, 1);
        this.boxAppearance.setSpecular(1, 1, 1, 1);
        this.boxAppearance.setDiffuse(1, 1, 1, 1);
        this.boxAppearance.setShininess(true);

    };
/**
 * Displays the cylinder in the scene.
 * Overwrites the default display function to include the display of more than one element
 * 
 * @memberOf MyCylinder
 */
    display() {

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.6);
        this.scene.scale(1, 1, 1);
        this.top.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, 0.2);
        this.scene.scale(0.1, 0.1, 0.5);
        this.boxAppearance.setTexture(this.scene.barrelTex.texture);
		this.boxAppearance.apply();
        this.torus.display();
        this.scene.popMatrix();

  

    };

};