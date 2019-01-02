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

                this.cells[i][j] = new Cell(null, x, y, pieceType, counter + 1);

                counter++;
            }
        }

        this.cellsCreated = true;

        console.log(this.cells);
    }

    display() {

        this.board.display();

    };

    recreate(prologBoard) {

        this.newCells = [19];

        for (var i = 0; i < 19; i++) {
            this.newCells[i] = [19];
        }

        prologBoard = prologBoard.replace(/[,]|[#[]|]/g, "");

        var counter = 0;
        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                var x = i + 1;
                var y = j + 1;
                var pieceType = prologBoard.charAt(counter);

                this.newCells[i][j] = new Cell(new CGFplane(this.scene), x, y, pieceType, counter + 1);

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