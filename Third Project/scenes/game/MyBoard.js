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

        this.newCells;

        this.cellsCreated = false;

        this.selectedCell = null;
        this.destinationCell = null;
        this.possibleCells = [];

        this.prologBoard = "";

        this.pieceBeingMovedX = null;
        this.pieceBeingMovedY = null;
        this.pieceBeingMovedAngle = null;

        this.animationSpeed = 60;

        this.circular = new CircularAnimation(this.scene, "BoardRotation", [0, 0, 0], 0, 0, 180, 3);
        this.undoAnimation = undefined;
        this.returnAnimation = undefined;
        this.botBotOne = true;

    };

    create(prologBoard) {
        this.prologBoard = prologBoard;

        this.prologBoard = this.rotatePrologBoard(this.prologBoard);

        prologBoard = this.prologBoard;

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

    rotatePrologBoard(prologBoard) {
        var x1 = prologBoard.substring(2, 17).split("").reverse().join("");
        var x2 = prologBoard.substring(20, 35).split("").reverse().join("");
        var x3 = prologBoard.substring(38, 53).split("").reverse().join("");
        var x4 = prologBoard.substring(56, 71).split("").reverse().join("");
        var x5 = prologBoard.substring(74, 89).split("").reverse().join("");
        var x6 = prologBoard.substring(92, 107).split("").reverse().join("");
        var x7 = prologBoard.substring(110, 125).split("").reverse().join("");
        var x8 = prologBoard.substring(128, 143).split("").reverse().join("");

        return "[[" + x8 + "],[" + x7 + "],[" + x6 + "],[" + x5 + "],[" + x4 + "],[" + x3 + "],[" + x2 + "],[" + x1 + "]]";
    }

    getCell(number) {
        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                if (this.cells[i][j].num == number)
                    return this.cells[i][j];
            }
        }

        return -1;
    }

    display() {

    };

    winner() {
        if (this.scene.countdown() < 0)
            if (this.scene.activePlayer == 1)
                return "Black";
            else if (this.scene.activePlayer == 2)
            return "White";

        var foundBlack = false;
        var foundWhite = false;

        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                if (this.cells[i][j] == undefined)
                    return "undefined";

                if (this.cells[i][j] != undefined && this.cells[i][j].pieceType == 3)
                    foundWhite = true;

                if (this.cells[i][j] != undefined && this.cells[i][j].pieceType == 4)
                    foundBlack = true;
            }
        }

        if (!foundBlack)
            return "White";
        else if (!foundWhite)
            return "Black";
        else
            return "No";
    }
}