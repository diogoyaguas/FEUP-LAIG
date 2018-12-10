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

    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera
     * and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initDefaults();

        this.enableTextures(true);

        this.gl.clearColor(0, 0, 0, 1.0);
        this.gl.clearDepth(10000.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.board = new MyBoard(this);

        this.activeCamera = "Front";
        this.activeStyle = "Room";
        this.gameMode = "Human vs Human";
        this.botType = "Easy";

    };

    /**
     * Initializes the scene's default camera, lights and axis.
     */
    initDefaults() {

        this.axis = new CGFaxis(this);

        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15),
            vec3.fromValues(0, 0, 0));

        this.initLights();
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

    update(currTime) {

        if (this.lastUpdate == 0) this.lastUpdate = currTime;

        this.elapsedTime = (currTime - this.lastUpdate) / 1000;

        this.lastUpdate = currTime;
    };

    countdown() {
        return 61 - (this.elapsedTime - this.lastMoveTime);
    }

    setCountdown() {
        this.lastMoveTime = this.elapsedTime;
    }

    startGame() {
        this.board = new Board(this);
        this.getPrologRequest('start');
        this.activePlayer = 1;
        this.activeBot = 1;
        this.backupPlays = [];
        this.moviePlays = [];
        this.botInPlay = false;
        this.botPlaying = false;
        this.isPlayingMovie = false;
        this.lastMoveTime = this.elapsedTime;
        
        this.board.selectedCell = null;
        this.board.destinationCell = null;
        this.selectedMoveAnimation = undefined;
        this.removedMoveAnimation = undefined;
        
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

    display() {

        var winner = this.board.winner();

        if (!this.changingPlayer && !this.botPlaying && this.activeGameMode != 3 && winner == 'No')
            this.logPicking();

        if (this.botPlaying) {
            if (this.selectedMoveAnimation == undefined && this.removedMoveAnimation == undefined) {
                this.botPlay("pieceSelection");
                this.botPlaying = false;
            }
        }

        this.clearPickRegistration();

        // Clear image and depth buffer every time we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Update all lights used
        this.lights[0].update();

        if (this.gameStarted) {
            this.board.display();

            if (!this.isPlayingMovie)
                this.timer.display();
        }

        if (this.activeBackground == "Room")
            this.room.display();
        else if (this.activeBackground == "AE")
            this.AE.display();
        else if (this.activeBackground == "FEUP")
            this.beach.display();
    }

}