var UPDATE_TIME = 1000;

/**
 * Game class, representing the scene that is to be rendered.
 */
class Game extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface
     */
    constructor(myInterface) {
        super();

        this.texture = null;
        this.appearance = null;
        this.surfaces = [];
        this.translations = [];
        this.lastUpdate = 0;

        this.interface = myInterface;
    };

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera
     * and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.initDefaults();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.board = new MyBoard(this);
        //this.clock = new MyClock(this);
        this.room = new MyRoom(this);
        this.AE = new MyAE(this);
        this.FEUP = new MyFEUP(this);

        this.activeCamera = "Front";
        this.activeStyle = "Room";
        this.gameMode = "Human vs Human";
        this.botType = "Easy";

        this.activePlayer = 1;
        this.activeBot = 1;
        this.activeGameMode = 1;
        this.changedOnce = false;
        this.isPlayingMovie = false;

        this.getPrologRequest('start');

        this.setPickEnabled(true);

        this.startTime = 0;
        this.setUpdatePeriod(UPDATE_TIME / 60);
        this.lastMoveTime = 0;

        this.selectedMoveAnimation;

        this.backupCoords = [];
        this.selCoords = [];
        this.backupPlays = [];
        this.moviePlays = [];
        this.incounter = 0;

        this.gameStarted = false;
        this.changingPlayer = false;

        /// BOT VARIABLES //
        this.botSelectedLine;
        this.botSelectedColumn;
        this.botPlaying;
        this.botInPlay = false;

    };

    /**
     * Initializes the scene's default camera, lights and axis.
     */
    initDefaults() {

        this.axis = new CGFaxis(this);

        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(8, 35, 50),
            vec3.fromValues(8, -10, -10));

        this.interface.setActiveCamera(this.camera);

        this.setGlobalAmbientLight(0.1, 0.1, 0.1, 1.0);
        this.gl.clearColor(0.075, 0.125, 0.150, 1.0);

        this.initLights();

        this.initTextures();
    };

    /**
     * Initializes the scene's lights.
     */
    initLights() {
        this.lights[0].setPosition(1, 1, 1, 1);
        this.lights[0].setAmbient(0.1, 0.1, 0.1, 1);
        this.lights[0].setDiffuse(0.9, 0.9, 0.9, 1);
        this.lights[0].setSpecular(0, 0, 0, 1);
        this.lights[0].enable();
        this.lights[0].update();

        this.lights[1].setPosition(5, 5, 5, 5);
        this.lights[1].setAmbient(0.3, 0.3, 0.3, 1);
        this.lights[1].setDiffuse(1, 1, 1, 1);
        this.lights[1].setSpecular(0, 0, 0, 1);
        this.lights[1].enable();
        this.lights[1].update();
    };

    initTextures() {

        this.tableTex = new CGFappearance(this);
        this.tableTex.setAmbient(1, 1, 1, 1);
        this.tableTex.loadTexture('scenes/images/wood-texture.jpg');

        this.superbockTex = new CGFappearance(this);
        this.superbockTex.setAmbient(1, 1, 1, 1);
        this.superbockTex.loadTexture('scenes/images/superbock-texture.jpg');

        this.windowTex = new CGFappearance(this);
        this.windowTex.setAmbient(1, 1, 1, 1);
        this.windowTex.loadTexture('scenes/images/window-texture.jpg');

        this.wallTex = new CGFappearance(this);
        this.wallTex.setAmbient(1, 1, 1, 1);
        this.wallTex.loadTexture('scenes/images/blue-grey-texture.jpg');

        this.clockTex = new CGFappearance(this);
        this.clockTex.setAmbient(1, 1, 1, 1);
        this.clockTex.loadTexture('scenes/images/silver-texture.jpg');

        this.pinkTex = new CGFappearance(this);
        this.pinkTex.setAmbient(1, 1, 1, 1);
        this.pinkTex.loadTexture('scenes/images/pink-texture.jpg');

        this.FEUPTex = new CGFappearance(this);
        this.FEUPTex.setAmbient(1, 1, 1, 1);
        this.FEUPTex.loadTexture('scenes/images/feup-texture.jpg');

        this.greyTex = new CGFappearance(this);
        this.greyTex.setAmbient(1, 1, 1, 1);
        this.greyTex.loadTexture('scenes/images/grey-texture.jpg');

        this.boardTex = new CGFappearance(this);
        this.boardTex.setAmbient(1, 1, 1, 1);
        this.boardTex.loadTexture('scenes/images/board-texture.png');

    };

    /**
     * Animate change of view
     */
    updateViews() {
        var speedOne = 0.1;
        var speedTwo = 0.12;
        var speedThree = 0.04;
        var increase = 3;

        if (this.activeCamera == "Top") {
            if (this.camera.position[1] < 60)
                this.camera.position[1] += speedOne * increase;

            if (this.camera.position[2] > 20)
                this.camera.position[2] -= speedTwo * increase;

            if (this.camera.target[1] > -35)
                this.camera.target[1] -= speedOne * increase;

            if (this.camera.target[2] < 0)
                this.camera.target[2] += speedThree * increase;

            this.changedOnce = true;
        } else if (this.activeCamera == "Front" && this.changedOnce) {
            if (this.camera.position[1] > 35)
                this.camera.position[1] -= speedOne * increase;

            if (this.camera.position[2] < 50)
                this.camera.position[2] += speedTwo * increase;

            if (this.camera.target[1] < -10)
                this.camera.target[1] += speedOne * increase;

            if (this.camera.target[2] > -10)
                this.camera.target[2] -= speedThree * increase;

            this.changedOnce = true;
        }
    };

    /**
     * Update time
     */
    update(currTime) {
        if (this.lastUpdate == 0) this.lastUpdate = currTime;

        this.elapsedTime = (currTime - this.lastUpdate) / 1000;

        this.lastUpdate = currTime;
        this.updateViews();
    };

    countdown() {
        return 61 - (this.elapsedTime - this.lastMoveTime);
    };

    setCountdown() {
        this.lastMoveTime = this.elapsedTime;
    };

    startGame() {
        this.board = new MyBoard(this);
        this.getPrologRequest('start');
        this.activePlayer = 1;
        this.activeBot = 1;
        this.backupPlays = [];
        this.moviePlays = [];
        this.botInPlay = false;
        this.botPlaying = false;
        this.isPlayingMovie = false;
        this.lastMoveTime = this.elapsedTime;

        this.selectedMoveAnimation = undefined;

        if (this.gameMode == "Human vs Human")
            this.activeGameMode = 1;
        else if (this.gameMode == "Human vs Bot")
            this.activeGameMode = 2;
        else if (this.gameMode == "Bot vs Bot") {
            this.activeGameMode = 3;
            this.first = true;
        }

        this.gameStarted = true;
    };

    undo() {
        if (this.activeGameMode == 1) {
            if (this.backupPlays.length > 0) {
                this.board.undoAnimation = new CircularAnimation(
                    this, "BoardRotation", [0, 0, 0], 0, 0, 180, 1);

                var selcoords = this.selCoords[this.selCoords.length - 1];
                var finalselcoords = [selcoords, [0, 0, 0]];

                this.board.backAnimation = new LinearAnimation(
                    this, "id", this.board.animationSpeed, finalselcoords);

                if (this.activePlayer == 1)
                    this.activePlayer = 2;
                else
                    this.activePlayer = 1;
            }
        }
    };

    playMovie() {
        if (!this.isPlayingMovie && this.activeGameMode != 3) {
            this.board = new MyBoard(this);
            this.getPrologRequest('start');
            this.activePlayer = 1;
            this.activeBot = 1;
            this.backupPlays = [];
            this.botInPlay = false;
            this.botPlaying = false;

            this.board.selectedCell = null;
            this.board.destinationCell = null;
            this.selectedMoveAnimation = undefined;

            this.activeGameMode = 3;
            this.isPlayingMovie = true;
            this.moviePlays.reverse();
        } else {
            this.isPlayingMovie = false;
            this.startGame();
        }
    };

    /*botPlay(botState) {
        if (botState == "selection") {

            if (this.activeGameMode == 3 && this.activeBot == 1)
                var botSelectionRequest = "secondSelection(";
            else
                var botSelectionRequest = "botSelection(";

            botSelectionRequest += this.board.prologBoard;
            botSelectionRequest += ")";

            this.getPrologRequest(botSelectionRequest);
        } else if (botState == "pieceDestination") {

            if (this.activeGameMode == 3 && this.activeBot == 1)
                var botDestinationRequest = "secondDestination(";
            else
                var botDestinationRequest = "botDestination(";

            botDestinationRequest += this.board.prologBoard;
            botDestinationRequest += ",";
            botDestinationRequest += this.botSelectedLine;
            botDestinationRequest += ",";
            botDestinationRequest += this.botSelectedColumn;
            botDestinationRequest += ")";

            this.getPrologRequest(botDestinationRequest);
        } else if (botState == "botMovePiece") {
            if (!this.isPlayingMovie) {
                var movePrologRequest = "moveBot(";
                movePrologRequest += this.board.prologBoard;
                movePrologRequest += ","
                movePrologRequest += this.botSelectedLine;
                movePrologRequest += ","
                movePrologRequest += this.botSelectedColumn;
                movePrologRequest += ","
                movePrologRequest += this.botDestinationLine;
                movePrologRequest += ","
                movePrologRequest += this.botDestinationColumn;
                movePrologRequest += ","
                movePrologRequest += this.roundsWithoutCapture;
                movePrologRequest += ")"

                this.board.selectedCell = this.board.cells[this.botSelectedColumn
    - 1][this.botSelectedLine - 1];
                this.board.destinationCell =
    this.board.cells[this.botDestinationColumn - 1][this.botDestinationLine - 1];

                this.moviePlays.push(new MoviePlay(this.board.selectedCell.x,
    this.board.selectedCell.y, this.board.destinationCell.x,
    this.board.destinationCell.y));

                this.botInPlay = true;

                this.board.pieceMoveAnimation();

                this.board.selectedCell = null;

                this.getPrologRequest(movePrologRequest);
            } else {
                if (this.moviePlays.length > 0) {
                    var lastMove = this.moviePlays[this.moviePlays.length - 1];

                    if (this.incounter % 2 == 0) {
                        var sx = 9 - lastMove.sx;
                        var sy = 9 - lastMove.sy;
                        var dx = 9 - lastMove.dx;
                        var dy = 9 - lastMove.dy;
                    } else {
                        var sx = lastMove.sx;
                        var sy = lastMove.sy;
                        var dx = lastMove.dx;
                        var dy = lastMove.dy;
                    }

                    var movePrologRequest = "moveBot(";
                    movePrologRequest += this.board.prologBoard;
                    movePrologRequest += ","
                    movePrologRequest += sx;
                    movePrologRequest += ","
                    movePrologRequest += sy;
                    movePrologRequest += ","
                    movePrologRequest += dx;
                    movePrologRequest += ","
                    movePrologRequest += dy;
                    movePrologRequest += ","
                    movePrologRequest += this.roundsWithoutCapture;
                    movePrologRequest += ")"

                    this.board.selectedCell = this.board.cells[sy - 1][sx - 1];
                    this.board.destinationCell = this.board.cells[dy - 1][dx - 1];

                    this.moviePlays.pop();
                    this.incounter++;

                    console.log(this.board.selectedCell);
                    console.log(this.board.destinationCell);

                    this.botInPlay = true;

                    this.board.pieceMoveAnimation();

                    this.board.selectedCell = null;

                    this.getPrologRequest(movePrologRequest);
                }
            }
        }
    };*/

    logPicking() {
        if (!this.pickMode) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var objId = this.pickResults[i][1];

                        if (objId > 38)
                            objId -= 38;

                        var cell = this.board.getCell(objId);

                        if (this.board.selectedCell == null && cell.pieceType != 0) {
                            var pickingPrologRequest = "validatePieceSelection(";
                            pickingPrologRequest += this.activePlayer;
                            pickingPrologRequest += ","
                            pickingPrologRequest += this.board.prologBoard;
                            pickingPrologRequest += ","
                            pickingPrologRequest += cell.x;
                            pickingPrologRequest += ","
                            pickingPrologRequest += cell.y;
                            pickingPrologRequest += ","

                            if (cell.pieceType == 3 || cell.pieceType == 4)
                                pickingPrologRequest += "true)";
                            else
                                pickingPrologRequest += "false)";

                            this.getPrologRequest(pickingPrologRequest);

                        } else if (this.board.selectedCell != null) {
                            if (this.board.selectedCell == cell) {
                                this.board.selectedCell = null;
                                this.board.possibleCells = [];
                            } else {
                                var pickingPrologRequest = "validateDestinySelection(";
                                pickingPrologRequest += this.activePlayer;
                                pickingPrologRequest += ","
                                pickingPrologRequest += this.board.prologBoard;
                                pickingPrologRequest += ","
                                pickingPrologRequest += this.board.selectedCell.x;
                                pickingPrologRequest += ","
                                pickingPrologRequest += cell.x;
                                pickingPrologRequest += ","
                                pickingPrologRequest += this.board.selectedCell.y;
                                pickingPrologRequest += ","
                                pickingPrologRequest += cell.y;
                                pickingPrologRequest += ","

                                if (this.board.selectedCell.pieceType == 3 || this.board.selectedCell.pieceType == 4)
                                    pickingPrologRequest += "true)";
                                else
                                    pickingPrologRequest += "false)";

                                this.getPrologRequest(pickingPrologRequest);
                            }
                        }
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        var board = this.board;
        var game = this;
        var linear = this.linear;

        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString,
            true);

        request.onload = onSuccess || function (data) {
            var response = data.target.response;

            if (requestString == "start") {
                console.log("'start'. Reply: " + response);

                board.create(response);
            } else if (requestString.includes("movePiece")) {
                console.log("'movePiece'. Reply: " + response);

                board.recreate(response);

                if (game.activeGameMode == 2) game.botPlaying = true;
            } else if (requestString.includes("botMove")) {
                console.log("'botMove'. Reply: " + response);

                game.botSelectedSymbol = response.charAt(0)

                if (response.charAt(3) == '-') {
                    game.botSelectedIndex = response.charAt(2);
                    game.botSelectedDirection = response.charAt(4);
                } else {
                    game.botSelectedIndex = response.charAt(2) + response.charAt(3);
                    game.botSelectedDirection = response.charAt(5);
                }

            } else if (requestString.includes("checkGameOver")) {
                console.log("'Winner'. Reply: " + response);

                game.winner = response;
            }
        };

        request.onerror = onError || function () {
            console.log("error");
        };

        request.setRequestHeader(
            'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    };

    display() {

        var winner;

        if (!this.changingPlayer && !this.botPlaying && this.activeGameMode != 3 && winner == 'No')
            this.logPicking();

        if (this.botPlaying) {
            if (this.selectedMoveAnimation == undefined) {
                this.botPlay("pieceSelection");
                this.botPlaying = false;
            }
        }

        this.clearPickRegistration();

        // Clear image and depth buffer every time we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to
        // the origin
        this.applyViewMatrix();

        // Update all lights used
        this.lights[0].update();
        this.lights[1].update();

        this.pushMatrix();

        this.rotate(Math.PI / 2.0, 1, 0, 0);

        if (this.gameStarted) {
            this.board.display();
            //if (!this.isPlayingMovie) this.clock.display();
        }

        if (this.activeStyle == "Room") {
            this.room.display();
        } else if (this.activeStyle == "AE") {
            this.AE.display();
        } else if (this.activeStyle == "FEUP") {
            this.FEUP.display();
        }

        this.popMatrix();
    };
}