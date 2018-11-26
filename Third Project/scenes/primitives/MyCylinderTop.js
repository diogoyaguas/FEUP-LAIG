/**
 * MyCylinderTop
 * @constructor
 */
/**
 * Creates a cylinder top
 * 
 * @class CylinderTop
 * @extends {CGFobject}
 */
class CylinderTop extends CGFobject {
    /**
     * Creates an instance of CylinderTop.
     * @param {any} scene 
     * @param {any} radius 
     * @param {any} slices 
     * 
     * @memberOf CylinderTop
     */
    constructor(scene, radius, slices) {

        super(scene);

        this.radius = radius; // given by mother cylinder as a parameter (either top or bottom)
        this.slices = slices; // same as mother cylinder

        this.initBuffers();
    };
/**
 * Initiates all the values (vertices, normals, indices and texture coordinates for the cylinder top/bottom)
 * Overwrites the default initBuffers function.
 * 
 * @memberOf CylinderTop
 */
    initBuffers() {

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.unslicedTextCoords = [];

        for (var i = 0, indicesFactor = 9; i < this.slices; i++ , indicesFactor += 9) {
            var x1 = Math.cos(2 * Math.PI / this.slices * i);
            var x2 = Math.cos(2 * Math.PI / this.slices * (i + 1));
            var y1 = Math.sin(2 * Math.PI / this.slices * i);
            var y2 = Math.sin(2 * Math.PI / this.slices * (i + 1));

            // defines the vertices
            this.vertices.push(x1 * this.radius, y1 * this.radius, 0);
            this.vertices.push(x2 * this.radius, y2 * this.radius, 0);
            this.vertices.push(0, 0, 0);

            // defines the normals
            this.normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1);

            // defines the indices
            this.indices.push((indicesFactor / 3) - 3, (indicesFactor / 3) - 2, (indicesFactor / 3) - 1);

            // defines the texture coordinates
            this.unslicedTextCoords.push(0.5 + (x1 / 2), 0.5 - (y1 / 2));
            this.unslicedTextCoords.push(0.5 + (x2 / 2), 0.5 - (y2 / 2));
            this.unslicedTextCoords.push(0.5, 0.5);
            this.texCoords = this.unslicedTextCoords.slice();
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};