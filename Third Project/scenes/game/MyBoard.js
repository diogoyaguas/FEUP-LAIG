/**
 * Creates a board game
 *
 * @class MyBoard
 */
class MyBoard {
    /**
     * Creates an instance of MyBoard.
     * @param {any} scene
     *
     * @memberOf MyBoard
     */
    constructor(scene) {
        this.scene = scene;

        this.cells = [19];

        for (var i = 0; i < 19; i++) {
            this.cells[i] = [19];
        }
    };

    display() {

    };
}