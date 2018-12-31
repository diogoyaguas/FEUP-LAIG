/**
 * MyFEUP
 * @constructor
 */
/**
 * Creates a room
 * 
 * @class MyFEUP
 * @extends {CGFobject}
 */
class MyFEUP extends CGFobject {

    /**
     * Creates an instance of MyFEUP.
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
        this.scene.translate(7, -5, -2);
        this.scene.scale(12.5, 2.5, 4);
        this.roomAppearance.setTexture(this.scene.clockTex.texture);
        this.roomAppearance.apply();
        this.clock.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.translate(-27.5, -33, -0.1);
        this.scene.scale(70, 40, 0);
        this.roomAppearance.setTexture(this.scene.greyTex.texture);
        this.roomAppearance.apply();
        this.table.setSAndT(1, 1);
        this.table.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.translate(-27.5, 0, -6);
        this.scene.scale(70, 40, 0);
        this.roomAppearance.setTexture(this.scene.FEUPTex.texture);
        this.roomAppearance.apply();
        this.wall.setSAndT(1, 1);
        this.wall.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    };
};