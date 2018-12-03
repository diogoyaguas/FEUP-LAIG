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
    

}