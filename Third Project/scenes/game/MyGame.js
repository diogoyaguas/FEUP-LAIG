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

        this.interface = myInterface;
        this.lastUpdate = 0;
    };

    /**
     * Initializes the scene, setting some WebGL defaults
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
        this.clock = new MyClock(this);
        this.room = new MyRoom(this);
        this.AE = new MyAE(this);
        this.FEUP = new MyFEUP(this);

        this.activeCamera = "Front";
        this.activeStyle = "Room";
        this.gameMode = "Human vs Human";
        this.botType = "Easy";

        this.activePlayer = 'w';
        this.pontuation = 0;
        this.activeGameMode = 1;
        this.changedOnce = false;
        this.botPlaying;

        this.setPickEnabled(true);

        this.backupMoves = [];
        this.allMoves = [];
        this.moviePlaying = false;

        this.startTime = 0;
        this.timePassed = 0;
        this.setUpdatePeriod(UPDATE_TIME / 60);

        this.gameStarted = false;
        this.changingPlayer = false;
    };

    /**
     * Initializes the scene's default camera, lights, axis and textures.
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

        this.screenTex = new CGFappearance(this);
        this.screenTex.setAmbient(1, 1, 1, 1);
        this.screenTex.loadTexture('scenes/images/screen-texture.jpg');

        this.whiteWinnerTex = new CGFappearance(this);
        this.whiteWinnerTex.setAmbient(1, 1, 1, 1);
        this.whiteWinnerTex.loadTexture('scenes/images/whiteWinner-texture.png');

        this.blackWinnerTex = new CGFappearance(this);
        this.blackWinnerTex.setAmbient(1, 1, 1, 1);
        this.blackWinnerTex.loadTexture('scenes/images/blackWinner-texture.png');

        this.whiteTurnTex = new CGFappearance(this);
        this.whiteTurnTex.setAmbient(1, 1, 1, 1);
        this.whiteTurnTex.loadTexture('scenes/images/whiteTurn-texture.png');

        this.blackTurnTex = new CGFappearance(this);
        this.blackTurnTex.setAmbient(1, 1, 1, 1);
        this.blackTurnTex.loadTexture('scenes/images/blackTurn-texture.png');

        this.zeroTex = new CGFappearance(this);
        this.zeroTex.setAmbient(1, 1, 1, 1);
        this.zeroTex.loadTexture('scenes/images/zero-texture.png');

        this.oneTex = new CGFappearance(this);
        this.oneTex.setAmbient(1, 1, 1, 1);
        this.oneTex.loadTexture('scenes/images/one-texture.png');

        this.twoTex = new CGFappearance(this);
        this.twoTex.setAmbient(1, 1, 1, 1);
        this.twoTex.loadTexture('scenes/images/two-texture.png');

        this.threeTex = new CGFappearance(this);
        this.threeTex.setAmbient(1, 1, 1, 1);
        this.threeTex.loadTexture('scenes/images/three-texture.png');

        this.fourTex = new CGFappearance(this);
        this.fourTex.setAmbient(1, 1, 1, 1);
        this.fourTex.loadTexture('scenes/images/four-texture.png');

        this.fiveTex = new CGFappearance(this);
        this.fiveTex.setAmbient(1, 1, 1, 1);
        this.fiveTex.loadTexture('scenes/images/five-texture.png');

        this.sixTex = new CGFappearance(this);
        this.sixTex.setAmbient(1, 1, 1, 1);
        this.sixTex.loadTexture('scenes/images/six-texture.png');

        this.sevenTex = new CGFappearance(this);
        this.sevenTex.setAmbient(1, 1, 1, 1);
        this.sevenTex.loadTexture('scenes/images/seven-texture.png');

        this.eightTex = new CGFappearance(this);
        this.eightTex.setAmbient(1, 1, 1, 1);
        this.eightTex.loadTexture('scenes/images/eight-texture.png');

        this.nineTex = new CGFappearance(this);
        this.nineTex.setAmbient(1, 1, 1, 1);
        this.nineTex.loadTexture('scenes/images/nine-texture.png');

        this.minusTex = new CGFappearance(this);
        this.minusTex.setAmbient(1, 1, 1, 1);
        this.minusTex.loadTexture('scenes/images/minus-texture.png');

        this.plusTex = new CGFappearance(this);
        this.plusTex.setAmbient(1, 1, 1, 1);
        this.plusTex.loadTexture('scenes/images/plus-texture.png');

        this.pieceTex = new CGFappearance(this);
        this.pieceTex.setAmbient(1, 1, 1, 1);
        this.pieceTex.loadTexture('scenes/images/black-texture.png');

        this.pieceWhiteTex = new CGFappearance(this);
        this.pieceWhiteTex.setAmbient(1, 1, 1, 1);
        this.pieceWhiteTex.loadTexture('scenes/images/white-texture.jpg');

        this.blackBoxTex = new CGFappearance(this);
        this.blackBoxTex.setAmbient(1, 1, 1, 1);
        this.blackBoxTex.loadTexture('scenes/images/black-pieces.jpg');

        this.whiteBoxTex = new CGFappearance(this);
        this.whiteBoxTex.setAmbient(1, 1, 1, 1);
        this.whiteBoxTex.loadTexture('scenes/images/white-pieces.jpg');

        this.box = new CGFappearance(this);
        this.box.setAmbient(1, 1, 1, 1);
        this.box.loadTexture('scenes/images/wood3.jpg');

        this.barrelTex = new CGFappearance(this);
        this.barrelTex.setAmbient(1, 1, 1, 1);
        this.barrelTex.loadTexture('scenes/images/metal-texture.jpg');

        this.cylTex = new CGFappearance(this);
        this.cylTex.setAmbient(1, 1, 1, 1);
        this.cylTex.loadTexture('scenes/images/aefeup.png');

    };

    /**
     * Animate change of view
     */
    updateViews() {
        var speed = 0.1;
        var increase = 3;

        if (this.activeCamera == "Top") {
            if (this.camera.position[1] < 60)
                this.camera.position[1] += speed * increase;

            if (this.camera.position[2] > 15)
                this.camera.position[2] -= speed * increase;

            if (this.camera.target[1] > -35)
                this.camera.target[1] -= speed * increase;

            if (this.camera.target[2] < 0) this.camera.target[2] += speed * increase;

            this.changedOnce = true;
        } else if (this.activeCamera == "Front" && this.changedOnce) {
            if (this.camera.position[1] > 35)
                this.camera.position[1] -= speed * increase;

            if (this.camera.position[2] < 50)
                this.camera.position[2] += speed * increase;

            if (this.camera.target[1] < -10)
                this.camera.target[1] += speed * increase;

            if (this.camera.target[2] > -10)
                this.camera.target[2] -= speed * increase;

            this.changedOnce = true;
        }
    };

    /**
     * Update time
     */
    update(currTime) {
        if (this.lastUpdate == 0) this.lastUpdate = currTime;

        this.elapsedTime = (currTime - this.lastUpdate) / 1000;
        this.timePassed += this.elapsedTime;

        this.updateViews();
    };

    countdown() {
        return 61 - this.timePassed;
    };

    startGame() {
        this.board = new MyBoard(this);
        this.getPrologRequest('start');
        this.winner = undefined;
        this.timePassed = 0;
        this.pontuation = -1;
        this.activePlayer = 'w';
        this.botPlaying = false;
        this.backupMoves = [];
        this.allMoves = [];
        this.firstUndo = false;
        this.moviePlaying = false;
        this.gameStarted = false;

        if (this.gameMode == "Human vs Human")
            this.activeGameMode = 1;
        else if (this.gameMode == "Human vs Bot")
            this.activeGameMode = 2;
        else if (this.gameMode == "Bot vs Bot") {
            this.activeGameMode = 3;
            this.botPlaying = true;
        }

    };

    undo() {

        if (this.activeGameMode == 1) {

            if (this.backupMoves.length > 1) {

                if (this.firstUndo) {

                    this.allMoves.push(this.allMoves[this.allMoves.length-2]);
                    this.backupMoves.pop();
                    this.board.recreate(this.backupMoves[this.backupMoves.length - 1]);
                    this.firstUndo = false;
                    this.board.changePlayers();
                }

            }
        }
    }

    playMovie() {

        if (!this.moviePlaying) {
            this.board = new MyBoard(this);
            this.getPrologRequest('start');
            this.winner = undefined;
            this.timePassed = 5;
            this.lastTime = 0;
            this.pontuation = -1;
            this.activePlayer = 'w';
            this.botPlaying = false;
            this.moviePlaying = true;
            this.allMoves.reverse();
        } else {
            this.moviePlaying = false;
            this.startGame();
        }
    }

    logPicking() {
        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {

                        var pickID = this.pickResults[i][1];

                        if (this.board.selectedCell == null) {

                            this.getPrologRequest(this.pickingPrologRequest("validateMove", pickID));

                        } else if (this.board.selectedCell != null) {

                            var symbol;
                            if (pickID < 39)
                                symbol = "C";
                            else
                                symbol = "L";
                            var index = pickID % 19;
                            var direction;

                            var selectedCell = this.board.getCell(symbol, index);

                            if (pickID < 20)
                                direction = 'U';
                            else if (pickID >= 20 && pickID < 39)
                                direction = 'D';
                            else if (pickID >= 39 && pickID < 58)
                                direction = 'R';
                            else if (pickID >= 58 && pickID < 77)
                                direction = 'L';

                            if (this.board.selectedCell == selectedCell && this.board.direction == direction) {
                                this.board.selectedCell = null;
                                this.getPrologRequest(this.pickingPrologRequest("movePiece", pickID));
                            } else this.getPrologRequest(this.pickingPrologRequest("validateMove", pickID));
                        }
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    pickingPrologRequest(func, pickID) {

        var pickingPrologRequest = func + "(";
        pickingPrologRequest += this.board.prologBoard;
        pickingPrologRequest += ",";
        pickingPrologRequest += this.activePlayer;
        pickingPrologRequest += ",";
        if (pickID < 39)
            pickingPrologRequest += "'C'";
        else
            pickingPrologRequest += "'L'";
        pickingPrologRequest += ",";
        var index = pickID % 19;
        if (index == 0) index = 19;
        pickingPrologRequest += index;
        pickingPrologRequest += ",";

        if (pickID < 20)
            pickingPrologRequest += "'U')";
        else if (pickID >= 20 && pickID < 39)
            pickingPrologRequest += "'D')";
        else if (pickID >= 39 && pickID < 58)
            pickingPrologRequest += "'R')";
        else if (pickID >= 58 && pickID < 77)
            pickingPrologRequest += "'L')";

        return pickingPrologRequest;

    }

    getValuePrologRequest() {

        var valuePrologRequest = "getValue(";
        valuePrologRequest += this.board.prologBoard;
        valuePrologRequest += ",";
        valuePrologRequest += this.activePlayer;
        valuePrologRequest += ")";
        this.getPrologRequest(valuePrologRequest);
    }

    winnerPrologRequest() {

        var winnerPrologRequest = "checkGameOver(";
        winnerPrologRequest += this.board.prologBoard;
        winnerPrologRequest += ")";
        this.getPrologRequest(winnerPrologRequest);
    }

    botMovePrologRequest() {

        var botPrologRequest = "botMove(";
        botPrologRequest += this.board.prologBoard;
        botPrologRequest += ",";
        botPrologRequest += this.activePlayer;
        botPrologRequest += ",";
        if (this.botType == "Easy")
            botPrologRequest += 1;
        else if (this.botType == "Smart")
            botPrologRequest += 2;
        botPrologRequest += ")";
        this.getPrologRequest(botPrologRequest);
    }

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        var board = this.board;
        var game = this;

        if (requestString == undefined) return;

        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString,
            true);

        request.onload = onSuccess || function (data) {
            var response = data.target.response;

            if (requestString == "start") {
                console.log("'start'. Reply: " + response);
                board.create(response);
                game.allMoves.push(response);
                game.backupMoves.push(response);
                game.gameStarted = true;

            } else if (requestString.includes("validateMove")) {
                console.log("'validateMove'. Reply: " + response);

                if (response == "true") {

                    game.clock.alarmAppearance = game.clock.greenAlarmAppearance;
                    setTimeout(() => game.clock.alarmAppearance = game.clock.normalAlarmAppearance, 1000);

                    var comma = requestString.indexOf("'");
                    var symbol = requestString.charAt(comma + 1);
                    var index;
                    var direction;

                    if (requestString.charAt(comma + 5) == ',') {
                        index = requestString.charAt(comma + 4);
                        direction = requestString.charAt(comma + 7);
                    } else {
                        index = requestString.charAt(comma + 4) + requestString.charAt(comma + 5);
                        direction = requestString.charAt(comma + 8);
                    }

                    board.selectedCell = board.getCell(symbol, index);
                    board.direction = direction;

                } else if (response == "false") {
                    game.clock.alarmAppearance = game.clock.redAlarmAppearance;
                    setTimeout(() => game.clock.alarmAppearance = game.clock.normalAlarmAppearance, 1000);
                }
            } else if (requestString.includes("movePiece")) {
                response = response.replace(/empty/g, 0);
                console.log("'movePiece'. Reply: " + response);

                board.recreate(response);
                game.allMoves.push(response);
                game.backupMoves.push(response);
                board.changePlayers();
                console.log(board.auxCells);
                game.firstUndo = true;

                if (game.activeGameMode == 2 && game.winner == undefined) game.botPlaying = true;

            } else if (requestString.includes("getValue")) {
                console.log("'getValue'. Reply: " + response);

                game.pontuation = response;

            } else if (requestString.includes("botMove")) {
                response = response.replace(/empty/g, 0);
                console.log("'botMove'. Reply: " + response);

                if (game.winner == undefined) {

                    board.recreate(response);
                    board.changePlayers();

                    if (game.activeGameMode == 3) game.botPlaying = true;
                }

            } else if (requestString.includes("checkGameOver")) {
                console.log("'Winner'. Reply: " + response);

                if (response == 'undefined')
                    game.winner = undefined;
                else game.winner = response;

                game.changingPlayer = false;
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

        if (this.gameStarted && !this.changingPlayer && this.winner == undefined) {

            if (this.activeGameMode != 3 && !this.botPlaying)
                this.logPicking();

            if (this.activeGameMode != 1 && this.botPlaying) {
                this.getPrologRequest(this.botMovePrologRequest());
                this.botPlaying = false;
            }

        }

        if (this.moviePlaying && Math.round(this.timePassed) % 2 == 0 && Math.round(this.timePassed) != this.lastTime) {

            this.lastTime = Math.round(this.timePassed);
            if (this.allMoves.length != 0) {
                this.board.recreate(this.allMoves.pop());
            }
        }

        // Clear image and depth buffer every time we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        // Initialize Model-View matrix as identity (no transformation)
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to
        // the origin
        this.applyViewMatrix();

        // Update all lights used
        this.lights[0].update();
        this.lights[1].update();

        this.rotate(Math.PI / 2, 1, 0, 0);

        if (this.gameStarted) {
            this.board.display();
            if (!this.moviePlaying) {
                this.clock.display();
            }
        }

        if (this.activeStyle == "Room") {
            this.room.display();
        } else if (this.activeStyle == "AE") {
            this.AE.display();
        } else if (this.activeStyle == "FEUP") {
            this.FEUP.display();
        }
    };
}