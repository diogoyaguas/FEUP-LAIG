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

        this.newCells = [];

        this.cellsCreated = false;

        this.selectedCell = null;
        this.possibleCells = [];

        this.prologBoard = "";

        this.board = new MyBoardPrimitive(this.scene);

        this.circular = new CircularAnimation(this.scene, "BoardRotation", [0, 0, 0], 0, 0, 180, 3);
        this.undoAnimation = undefined;
        this.returnAnimation = undefined;

    };

    create(prologBoard) {

        prologBoard = prologBoard.replace(/[,]|[#[]|]/g, "");

        var counter = 0;
        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                var x = i + 1;
                var y = j + 1;
                var pieceType = prologBoard.charAt(counter);

                this.cells[j][i] = new Cell(new CGFplane(this.scene), x, y, pieceType);

                counter++;
            }
        }

        counter = 0;

        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                this.cells[i][j].num = counter + 1;
                counter++;
            }
        }

        this.cellsCreated = true;
    }

    display() {

        this.board.display();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.translate(-2.5, -17.5, 0);
        this.scene.scale(19, 19, 19);
        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                this.cells[i][j].plane.display();
            }
        }
        this.scene.popMatrix();

    };

    recreate(prologBoard) {

        this.newCells = [19];

        for (var i = 0; i < 8; i++) {
            this.newCells[i] = [19];
        }

        prologBoard = prologBoard.replace(/[,]|[#[]|]/g, "");

        var counter = 0;
        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                var x = i + 1;
                var y = j + 1;
                var pieceType = prologBoard.charAt(counter);

                this.newCells[j][i] = new Cell(new CGFplane(this.scene), x, y, pieceType);

                counter++;
            }
        }

        counter = 0;

        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                this.newCells[i][j].num = counter + 1;
                counter++;
            }
        }

        if (this.scene.activeGameMode == 3)
            this.cellsCreated = true;
    };

    getCell(number) {
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (this.cells[i][j].num == number)
                    return this.cells[i][j];
            }
        }

        return -1;
    }

}