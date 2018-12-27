/**
 * Creates a board game
 *
 * @class MyBoard
 */
class MyBoardPrimitive extends CGFobject {

    constructor(scene) {
        super(scene);

        this.scene = scene;
        this.unpoped = true;
    };

    displayCells() {
        var counter = 0;

        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                this.scene.pushMatrix();

                this.scene.scale(2, 2, 2);
                this.scene.rotate(-Math.PI / 2, 1, 0, 0);
                this.scene.translate(0.5 + i, 0, 0.5 + j);
                this.scene.registerForPick(counter + 1, this.scene.board.cells[i][j]); // Registers cell for picking 
                counter++;

                if (i % 2 == 0)
                    if (j % 2 == 0)
                        this.scene.whiteColor.apply();
                    else
                        this.scene.blackColor.apply();
                else
                if (j % 2 == 0)
                    this.scene.blackColor.apply();
                else
                    this.scene.whiteColor.apply();

                if (this.scene.board.possibleCells != null)
                    if (this.scene.board.possibleCells.includes(this.scene.board.cells[i][j]))
                        this.scene.greenColor.apply();

                this.scene.board.cells[i][j].plane.display();

                this.scene.popMatrix();
            }
        }
    }

    displayPieces() {
        var counter = 361;

        for (var i = 0; i < 19; i++) {
            for (var j = 0; j < 19; j++) {
                var cell = this.scene.board.cells[i][j];

                if (cell.pieceType == 1 || cell.pieceType == 2) {
                    this.scene.pushMatrix();

                    this.scene.rotate(-Math.PI, 1, 0, 0);
                    this.scene.translate(0.5, -2 * j - 2, 0);
                    this.scene.scale(0.05, 0.05, 0.05);

                    this.scene.registerForPick(counter + 1, this.scene.stone);
                    counter++;

                    if (this.scene.board.selectedCell == this.scene.board.cells[i][j])
                        this.scene.greenColor.apply();
                    else if (cell.pieceType == 2)
                        this.scene.redColor.apply();
                    else
                        this.scene.blueColor.apply();

                    if (this.scene.board.pieceBeingMovedX == cell.x && this.scene.board.pieceBeingMovedY == cell.y) {
                        this.scene.selectedMoveAnimation.animate(this.scene.elapsedTime);
                        this.scene.rotate(this.scene.board.pieceBeingMovedAngle, 0, 1, 0);
                    }

                    if (this.scene.board.returnAnimation != undefined) {
                        if (this.scene.backupPlays[this.scene.backupPlays.length - 1].movable == false)
                            this.scene.board.returnAnimation.ended = true;

                        if (this.scene.board.undoAnimation == undefined) {
                            if (!this.scene.board.returnAnimation.ended || !this.scene.board.backAnimation.ended) {
                                if (this.unpoped && this.scene.backupPlays[this.scene.backupPlays.length - 1].movable != false) {
                                    if (this.scene.backupPlays[this.scene.backupPlays.length - 1].player == 1)
                                        this.leftoversOne.pop();
                                    else
                                        this.leftoversTwo.pop();

                                    this.unpoped = false;
                                }


                                if (this.scene.backupPlays[this.scene.backupPlays.length - 1].x2 == cell.x && this.scene.backupPlays[this.scene.backupPlays.length - 1].y2 == cell.y)
                                    this.scene.board.returnAnimation.animate(this.scene.elapsedTime);

                                if (this.scene.backupPlays[this.scene.backupPlays.length - 1].x1 == cell.x && this.scene.backupPlays[this.scene.backupPlays.length - 1].y1 == cell.y) {
                                    this.scene.board.backAnimation.animate(this.scene.elapsedTime);
                                    this.scene.rotate(-this.scene.backupPlays[this.scene.backupPlays.length - 1].angle, 0, 1, 0);
                                }
                            } else {
                                this.unpoped = true;
                                this.scene.backupPlays.pop();
                                this.scene.backupCoords.pop();
                                this.scene.moviePlays.pop();
                                this.scene.selCoords.pop();
                                this.scene.board.returnAnimation = undefined;
                                this.scene.board.backAnimation = undefined;
                            }
                        }
                    }

                    this.scene.translate(i * 40, 0, 0);
                    this.scene.stone.display();

                    this.scene.popMatrix();
                } else {
                    counter++;
                }
            }
        }
    }

    display() {
        if (this.startingTime == undefined)
            this.startingTime = this.scene.elapsedTime;

        this.scene.pushMatrix();

        this.scene.translate(8, 8, 0);

        if (this.scene.board.circular != undefined) {
            this.scene.board.circular.update(this.scene.elapsedTime);
        }

        if (this.scene.board.undoAnimation != undefined) {
            if (this.scene.board.undoAnimation.ended) {
                var reverseBoard = this.scene.board.rotatePrologBoard(this.scene.backupPlays[this.scene.backupPlays.length - 1].backupBoard);
                this.scene.board.create(reverseBoard);
                this.scene.board.undoAnimation = undefined;
            } else
                this.scene.board.undoAnimation.update(this.scene.elapsedTime);
        }

        this.scene.translate(-8, -8, 0);

        if (this.scene.elapsedTime - this.startingTime > 0.2) {
            this.displayCells();
            this.displayPieces();
        }

        this.scene.popMatrix();
    }

}