/**
 * MyAE
 * @constructor
 */
/**
 * Creates a room
 * 
 * @class MyAE
 * @extends {CGFobject}
 */
class MyAE extends CGFobject {

    /**
     * Creates an instance of MyAE.
     * @param {any} scene 
     * 
     */
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.clock = new MyCube(this.scene);
        this.table = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.wall = new MyRectangle(this.scene, 0, 0, 1, 1);

        this.setAppearance();
    };

    setAppearance() {

        this.roomAppearance = new CGFappearance(this.scene);
        this.roomAppearance.setAmbient(1, 1, 1, 1);
        this.roomAppearance.setSpecular(1, 1, 1, 1);
        this.roomAppearance.setDiffuse(1, 1, 1, 1);
        this.roomAppearance.setShininess(true);

    };

    display() {

        this.scene.pushMatrix();

        this.scene.pushMatrix();
        this.scene.translate(7, -5, 0);
        this.scene.scale(12.5, 2.5, 7.5);
        this.roomAppearance.setTexture(this.scene.clockTex.texture);
        this.roomAppearance.apply();
        this.clock.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(-12, -33, -0.1);
        this.scene.scale(40, 40, 0);
        this.roomAppearance.setTexture(this.scene.superbockTex.texture);
        this.roomAppearance.apply();
        this.table.setSAndT(1, 1);
        this.table.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(-10, -7, -12);
        this.scene.scale(40, 50, 0);
        this.roomAppearance.setTexture(this.scene.windowTex.texture);
        this.roomAppearance.apply();
        this.wall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-12, -10, -6);
        this.scene.scale(40, 50, 0);
        this.roomAppearance.setTexture(this.scene.windowTex.texture);
        this.roomAppearance.apply();
        this.wall.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.scene.translate(-5, -33, -28);
        this.scene.scale(50, 40, 0);
        this.roomAppearance.setTexture(this.scene.windowTex.texture);
        this.roomAppearance.apply();
        this.wall.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    };
};