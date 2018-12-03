/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

 /**
  *  Initializes the scene
  * 
  * @param {any} application 
  * @returns 
  * 
  * @memberOf MyInterface
  */
    init(application) {
        super.init(application);

        this.gui = new dat.GUI();

        this.initKeys();

        return true;
    }
/**
 * 
 *  Adds lights group.
 * 
 * @param {any} lights 
 * 
 * @memberOf MyInterface
 */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }
/**
 * 
 *  Adds views group.
 * 
 * @param {any} views 
 * 
 * @memberOf MyInterface
 */
    addViewsGroup(views) {

        var group = this.gui.addFolder("Views");
        group.open();

        const cameraIdArray = Object.keys(views);
        this.currentCameraId = this.scene.graph.default;

        group.add(this, 'currentCameraId', cameraIdArray).name('Camera').onChange(val => this.scene.selectView(val));
    }
/**
 * 
 * Inits scene keys
 * 
 * @memberOf MyInterface
 */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        if (event.code === "KeyM") {
            this.scene.graph.counter++;
        }
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

}