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
        this.pickingLetters = [19];
        this.pickingNumbers = [19];

        for (var i = 0; i < 19; i++) {

            this.cells[i] = [19];
        }

        this.newCells = [];
        this.newPickingLetters = [];
        this.newPickingNumbers = [];

        this.cellsCreated = false;

        this.selectedCell = null;
        this.possibleCells = [];

        this.prologBoard = "";

        this.board = new MyBoardPrimitive(this.scene);

        this.pieceB = new MySphere(this.scene, 1, 32, 64);
        this.pieceW = new MySphere(this.scene, 1, 32, 64);

        this.undoAnimation = undefined;
        this.returnAnimation = undefined;

        this.setAppearance();

    };

    create(prologBoard) {

        this.prologBoard = prologBoard.replace(/0/g, "empty");
        prologBoard = prologBoard.replace(/[,]|[#[]|]/g, "");

        var counter = 0;
        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                var x = 19 - i;
                var y = j + 1;
                var pieceType = prologBoard.charAt(counter);

                this.cells[i][j] = new Cell(null, x, y, pieceType, counter + 1);

                counter++;
            }
        }

        counter = 0;
        for (var j = 0; j < 19; j++) {
            var x = 0;
            var y = j + 1;

            this.pickingNumbers[j] = new Cell(new CGFplane(this.scene), x, y, null, counter + 1);

            counter++;
        }

        counter = 0;
        for (var i = 0; i < 19; i++) {
            var x = i + 1;
            var y = 0;

            this.pickingLetters[i] = new Cell(new CGFplane(this.scene), x, y, null, counter + 1);

            counter++;
        }

        this.cellsCreated = true;

    };

    recreate(prologBoard) {

        this.newCells = [19];

        for (var i = 0; i < 19; i++) {
            this.newCells[i] = [19];
        }

        this.prologBoard = prologBoard.replace(/0/g, "empty");
        prologBoard = prologBoard.replace(/[,]|[#[]|]/g, "");

        var counter = 0;
        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                var x = 19 - i;
                var y = j + 1;
                var pieceType = prologBoard.charAt(counter);

                this.newCells[i][j] = new Cell(new CGFplane(this.scene), x, y, pieceType, counter + 1);

                counter++;
            }
        }

        counter = 0;
        for (var j = 0; j < 19; j++) {
            var x = 0;
            var y = j + 1;

            this.newPickingNumbers[j] = new Cell(new CGFplane(this.scene), x, y, null, counter + 1);

            counter++;
        }

        counter = 0;
        for (var i = 0; i < 19; i++) {
            var x = i + 1;
            var y = 0;

            this.newPickingLetters[i] = new Cell(new CGFplane(this.scene), x, y, null, counter + 1);

            counter++;
        }

        this.cells = this.newCells;
        this.pickingLetters = this.newPickingLetters;
        this.pickingNumbers = this.newPickingNumbers;

        if (this.scene.activeGameMode == 3)
            this.cellsCreated = true;
    };

    getCell(symbol, index) {

        if (symbol == "C") {
            return this.pickingLetters[index - 1];
        } else if (symbol == "L")
            return this.pickingNumbers[index - 1];

        return -1;
    };

    setAppearance() {

        this.pieceAppearance = new CGFappearance(this.scene);
        this.pieceAppearance.setAmbient(1, 1, 1, 1);
        this.pieceAppearance.setSpecular(1, 1, 1, 1);
        this.pieceAppearance.setDiffuse(1, 1, 1, 1);
        this.pieceAppearance.setShininess(true);

        this.pieceWhiteAppearance = new CGFappearance(this.scene);
        this.pieceWhiteAppearance.setAmbient(1, 1, 1, 1);
        this.pieceWhiteAppearance.setSpecular(1, 1, 1, 1);
        this.pieceWhiteAppearance.setDiffuse(1, 1, 1, 1);
        this.pieceWhiteAppearance.setShininess(true);

    };

    display() {

        if (this.cellsCreated) {
            for (var i = 0; i < 19; i++) {
                this.scene.pushMatrix();
                this.scene.scale(0.8, 1, 2);
                this.scene.translate(-1.1 + i * 1.1, -0.9, -0.03);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.registerForPick(i + 1, this.pickingLetters[i].plane);
                if (this.scene.pickMode == true)
                    this.pickingLetters[i].plane.display();
                this.scene.popMatrix();
            }

            for (var i = 0; i < 19; i++) {
                this.scene.pushMatrix();
                this.scene.scale(0.8, 1, 2);
                this.scene.translate(-1.1 + i * 1.1, 16.8, -0.03);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.registerForPick(i + 20, this.pickingLetters[i].plane);
                if (this.scene.pickMode == true)
                    this.pickingLetters[i].plane.display();
                this.scene.popMatrix();
            }

            for (var i = 0; i < 19; i++) {
                this.scene.pushMatrix();
                this.scene.scale(1, 0.8, 1);
                this.scene.rotate(-Math.PI / 2, 0, 0, 1);
                this.scene.translate(-20 + i * 1.1, -1.8, -0.1);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.registerForPick(i + 39, this.pickingNumbers[i].plane);
                if (this.scene.pickMode == true)
                    this.pickingNumbers[i].plane.display();
                this.scene.popMatrix();
            }

            for (var i = 0; i < 19; i++) {
                this.scene.pushMatrix();
                this.scene.scale(1, 0.8, 1);
                this.scene.rotate(-Math.PI / 2, 0, 0, 1);
                this.scene.translate(-20 + i * 1.1, 15.8, -0.1);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.registerForPick(i + 58, this.pickingNumbers[i].plane);
                if (this.scene.pickMode == true)
                    this.pickingNumbers[i].plane.display();
                this.scene.popMatrix();
            }

            this.scene.clearPickRegistration();

            for (var i = 0; i < 19; i++) {
                for (var j = 0; j < 19; j++) {

                    var pieceType = this.cells[i][j].pieceType;
                    var pieceX = this.cells[i][j].x - 1;
                    var pieceY = this.cells[i][j].y - 1;

                    if (pieceType != 0) {

                        this.scene.pushMatrix();
                        this.scene.rotate(Math.PI / 2, 1, 0, 0);
                        this.scene.translate(-0.95 + 0.875 * pieceY, -0.13, -0.1 - 0.875 * pieceX);
                        this.scene.scale(0.45, 0.2, 0.45);
                        if (pieceType == 'b') {
                            this.pieceAppearance.setTexture(this.scene.pieceTex.texture);
                            this.pieceAppearance.apply();
                            this.pieceB.display();
                        } else if (pieceType == 'w') {
                            this.pieceWhiteAppearance.setTexture(this.scene.pieceWhiteTex.texture);
                            this.pieceWhiteAppearance.apply();
                            this.pieceW.display();
                        }

                        this.scene.popMatrix();
                        this.board.display();
                    }

                }
            }
        }

    };

    changePlayers() {
        if (this.scene.activePlayer == 'w')
            this.scene.activePlayer = 'b';
        else
            this.scene.activePlayer = 'w';

        this.scene.getValuePrologRequest();
        this.scene.winnerPrologRequest();

    };

}