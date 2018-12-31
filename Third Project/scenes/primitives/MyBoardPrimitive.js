/**
 * Creates a board game
 *
 * @class MyBoard
 */
class MyBoardPrimitive extends CGFobject {

    constructor(scene) {
        super(scene);

        this.scene = scene;
        this.board = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.setAppearance();

    };

    setAppearance() {

        this.boardAppearance = new CGFappearance(this.scene);
        this.boardAppearance.setAmbient(1, 1, 1, 1);
        this.boardAppearance.setSpecular(1, 1, 1, 1);
        this.boardAppearance.setDiffuse(1, 1, 1, 1);
        this.boardAppearance.setShininess(true);

    };

    display() {
        if (this.startingTime == undefined)
            this.startingTime = this.scene.elapsedTime;

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.translate(-2.5, -17.5, 0);
        this.scene.scale(19, 19, 19);
        this.boardAppearance.setTexture(this.scene.boardTex.texture);
        this.boardAppearance.apply();
        this.board.setSAndT(1, 1);
        this.board.display();
        this.scene.popMatrix();
    }

}