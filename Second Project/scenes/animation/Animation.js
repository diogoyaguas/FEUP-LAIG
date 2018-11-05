/**
 * Animation
 * @constructor
 */
class Animation {
    constructor(scene, id) {
        this.scene = scene;
        this.id = id;
        this.transformationMatrix = mat4.create();
        this.axis = [0,1,0];
        this.ended = false; 
    }

    update(currentTime) {

    }

    apply() {

        this.scene.multMatrix(this.transformationMatrix);
    }
}