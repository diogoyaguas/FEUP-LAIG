var DEGREE_TO_RAD = Math.PI / 180;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.views = {};
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initDefaults();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
    }

    /**
     * Initializes the scene's default camera, lights and axis.
     */
    initDefaults() {

        this.axis = new CGFaxis(this);

        this.camera = new CGFcamera(0.4, 0.1, 500,
            vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        this.initAxis();
        this.initViews();
        this.initAmbient();
        this.initLights();

        this.interface.addLightsGroup(this.graph.lights);
        this.interface.addViewsGroup(this.views);

        this.sceneInited = true;
    }

    /**
     * Initializes the scene axis with the values read from the XML file.
     */
    initAxis() {

        this.axis = new CGFaxis(this, this.graph.axisLength);
    }

    /**
     * Initializes the scene views with the values read from the XML file.
     */
    initViews() {

        var views = this.graph.views;

        // Reads the views from the scene graph.
        for (var id in views) {
            var view = views[id];

            if (view.type == "perspective") {

                var position = vec3.fromValues(view[3][0], view[3][1], view[3][2]);
                var target = vec3.fromValues(view[4][0], view[4][1], view[4][2]);
                var fov = DEGREE_TO_RAD * (view[2]), near = view[0], far = view[1];
                this.views[id] = new CGFcamera(fov, near, far, position, target);

            } else if (view.type == "ortho") {

                var position = vec3.fromValues(view[6][0], view[6][1], view[6][2]);
                var target = vec3.fromValues(view[7][0], view[7][1], view[7][2]);
                var up = vec3.fromValues(0, 1, 0);
                var near = view[0], far = view[1], left = view[2], rigth = view[3], top = view[4], bottom = view[5];
                this.views[id] = new CGFcameraOrtho(left, rigth, bottom, top, near, far, position, target, up)
            }
        }

        this.camera = this.views[this.graph.default];
        this.interface.setActiveCamera(this.camera);
    }

    selectView(id) {
        this.camera = this.views[id];
        this.interface.setActiveCamera(this.camera);
    }

    /**
    * Initializes the scene ambient with the values read from the XML file.
    */
    initAmbient() {

        this.setGlobalAmbientLight(this.graph.globalAmbient[0], this.graph.globalAmbient[1], this.graph.globalAmbient[2], this.graph.globalAmbient[3]);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                //lights are predefined in cgfscene
                this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);

                if (light.type === "spot") {
                    var target = light[5];
                    var angle = light[6];
                    var exponent = light[7];

                    this.lights[i].setSpotCutOff(angle);
                    this.lights[i].setSpotExponent(exponent);
                    this.lights[i].setSpotDirection(target[0] - light[1][0], target[1] - light[1][1], target[3] - light[1][2]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }

    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    }
                    else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();
        }
        else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}