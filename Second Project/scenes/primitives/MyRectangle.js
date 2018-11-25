/**
 * MyRectangle
 * @constructor
 */
/**
 * Creates arectangle
 * 
 * @class MyRectangle
 * @extends {CGFobject}
 */
class MyRectangle extends CGFobject {
    /**
     * Creates an instance of MyRectangle.
     * @param {any} scene 
     * @param {any} x1 
     * @param {any} y1 
     * @param {any} x2 
     * @param {any} y2 
     * 
     * @memberOf MyRectangle
     */
    constructor(scene, x1, y1, x2, y2) {
        super(scene);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

        this.initBuffers();
    };
/**
*  Initiates all the values (vertices, normals, indices and texture coordinates for the rectangle primitive).
 * Overwrites the default initBuffers function. 
 * 
 * @memberOf MyRectangle
 */
    initBuffers() {
        this.vertices = [
            this.x1, this.y1, 0,
            this.x2, this.y1, 0,
            this.x1, this.y2, 0,
            this.x2, this.y2, 0,
        ];

        // defines the normals
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
        ];

        // defines the indices
        this.indices = [
            0, 1, 2,
            3, 2, 1,
        ];

        // defines the texture coordinates
        this.texCoords = [
            0, 0,
            (this.x2 - this.x1), 0,
            0, (this.y1 - this.y2),
            (this.x2 - this.x1), (this.y1 - this.y2),

        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
/**
 * 
 * Amplify the texture of the primitive given its values.
 * @param lenghtS the length along S 
 * @param lenghtT the length along T
 * 
 * @memberOf MyRectangle
 */
    setSAndT(s, t) {

        let c = this.x2 - this.x1;
        var h = this.y2 - this.y1;

        this.texCoords = [
            0, h / t,
            c / s, h / t,
            0, 0,
            c / s, 0,
        ];

        this.updateTexCoordsGLBuffers();
    }

};