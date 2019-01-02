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


    }

    display() {
        for (var i = 0; i < 19; i++) {
            this.scene.pushMatrix();
            this.scene.scale(0.8, 1, 2);
            this.scene.translate(-1.1+i*1.1, -0.9, -0.03);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(i+1, this.pickingLetters[i]);
            if(this.scene.pickMode == true)
                this.pickingLetters[i].plane.display();
            this.scene.popMatrix();
        }


        for (var i = 0; i < 19; i++) {
            this.scene.pushMatrix();
            this.scene.scale(0.8, 1, 2);
            this.scene.translate(-1.1+i*1.1, 16.8, -0.03);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(i+1, this.pickingLetters[i]);
            if(this.scene.pickMode == true)
                this.pickingLetters[i].plane.display();
            this.scene.popMatrix();
        }

        for (var i = 0; i < 19; i++) {
            this.scene.pushMatrix();
            this.scene.scale(1, 0.8, 1);
            this.scene.rotate(-Math.PI/2,0,0,1);
            this.scene.translate(-20+i*1.1, -1.8, -0.1);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(i + 1, this.pickingNumbers[i]);
            if(this.scene.pickMode == true)
                this.pickingNumbers[i].plane.display();
            this.scene.popMatrix();
        }

        for (var i = 0; i < 19; i++) {
            this.scene.pushMatrix();
            this.scene.scale(1, 0.8, 1);
            this.scene.rotate(-Math.PI/2,0,0,1);
            this.scene.translate(-20+i*1.1, 15.8, -0.1);
            this.scene.rotate(-Math.PI/2,1,0,0);
            this.scene.registerForPick(i + 1, this.pickingNumbers[i]);
            if(this.scene.pickMode == true)
                this.pickingNumbers[i].plane.display();
            this.scene.popMatrix();
        }

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