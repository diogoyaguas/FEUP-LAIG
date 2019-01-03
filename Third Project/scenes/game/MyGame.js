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
        this.pontuation;
        this.activeBot = 1;
        this.activeGameMode = 1;
        this.changedOnce = false;
        this.isPlayingMovie = false;

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
        this.pieceTex.loadTexture('scenes/images/black-texture.jpg');
        
        this.pieceWhiteTex = new CGFappearance(this);
        this.pieceWhiteTex.setAmbient(1, 1, 1, 1);
        this.pieceWhiteTex.loadTexture('scenes/images/white-texture.jpg');
        
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
        this.pontuation = 1;
        this.activePlayer = 'w';
        this.activeBot = 'b';
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

                if (this.activePlayer == 'w')
                    this.activePlayer = 'b';
                else
                    this.activePlayer = 'w';
            }
        }
    };

    playMovie() {
        if (!this.isPlayingMovie && this.activeGameMode != 3) {
            this.board = new MyBoard(this);
            this.getPrologRequest('start');
            this.activePlayer = 'w';
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
                            var selectedCell = this.board.getCell(symbol, index);
                            if (this.board.selectedCell == selectedCell) {
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

    getPrologRequest(requestString, onSuccess, onError, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        var board = this.board;
        var game = this;

        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString,
            true);

        request.onload = onSuccess || function (data) {
            var response = data.target.response;

            if (requestString == "start") {
                console.log("'start'. Reply: " + response);

                board.create(response);

            } else if (requestString.includes("validateMove")) {
                console.log("'validateMove'. Reply: " + response);

                if (response == "true") {
                    var comma = requestString.indexOf("'");
                    var symbol = requestString.charAt(comma + 1);
                    var index;
                    if (requestString.charAt(comma + 5) == ',') {
                        index = requestString.charAt(comma + 4);
                    } else index = requestString.charAt(comma + 4) + requestString.charAt(comma + 5);
                    board.selectedCell = board.getCell(symbol, index);
                }
            } else if (requestString.includes("movePiece")) {
                response = response.replace(/empty/g, 0);
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
	
	    if (!this.changingPlayer && !this.botPlaying && this.activeGameMode != 3)
		this.logPicking();
	
	    if (this.botPlaying) {
		if (this.selectedMoveAnimation == undefined && this.removedMoveAnimation == undefined) {
			this.botPlay("pieceSelection");
			this.botPlaying = false;
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


        this.rotate(Math.PI / 2.0, 1, 0, 0);

        if (this.gameStarted) {
            this.board.display();
            if (!this.isPlayingMovie) this.clock.display();
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