/**
 * Animation
 * @constructor
 */
/**
* Creates an animation
 * 
 * @class Animation
 */
class Animation {
    /**
     * Creates an instance of Animation.
     * @param {any} scene where the animation will be applied
     * @param {any} id  the animation ID
     * 
     * @memberOf Animation
     */
    constructor(scene, id) {
        this.scene = scene;
        this.id = id;
        this.transformationMatrix = mat4.create();
        this.axis = [0,1,0];
        this.ended = false; 
    }
/**
 * 
 * apply the animation
 * 
 * @memberOf Animation
 */
    apply() {

        this.scene.multMatrix(this.transformationMatrix);
    }
}