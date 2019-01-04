/**
 * MySphere
 * @constructor
 */
/**
 * Creates a sphere
 * 
 * @class MySphere
 * @extends {CGFobject}
 */
class Piece extends CGFobject {
    /**
     * Creates an instance of MySphere.
     * @param {any} scene 
     * @param {any} radius 
     * @param {any} slices 
     * @param {any} stacks 
     * 
     * @memberOf MySphere
     */
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    };
/**
 * Initiates all the values (vertices, normals, indices and texture coordinates for the sphere primitive).
 * Overwrites the default initBuffers function.
 * 
 * @memberOf MySphere
 */
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.unslicedTextCoords = [];

        for (var i = 0, verticesLength = this.vertices.length; i <= this.slices; i++) {
            for (var j = 0; j <= this.stacks; j++ , verticesLength++) {
                var x = Math.sin(j * Math.PI / this.stacks) * Math.cos(i * 2 * Math.PI / this.slices);
                var y = Math.sin(j * Math.PI / this.stacks) * Math.sin(i * 2 * Math.PI / this.slices);
                var z = Math.cos(j * Math.PI / this.stacks);

                // defines the vertices	
                this.vertices.push(x * this.radius, y * this.radius, z * this.radius);

                // defines the normals
                this.normals.push(x, y, z);

                // defines the indices
                if (i > 0 && j > 0) {
                    this.indices.push(verticesLength - this.stacks - 1, verticesLength - 1, verticesLength - this.stacks - 2, verticesLength - 1, verticesLength - 2, verticesLength - this.stacks - 2);
                }

                // defines the texture coordinates
                this.unslicedTextCoords.push(0.5 + 0.5 * x, 0.5 - 0.5 * y);

                this.texCoords = this.unslicedTextCoords.slice();
            }

        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };

};