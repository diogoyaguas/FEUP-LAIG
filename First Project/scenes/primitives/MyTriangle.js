/**
 * MyTriangle
 * @constructor
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
		super(scene);
		this.p1 = [x1, y1, z1];
		this.p2 = [x2, y2, z2];
		this.p3 = [x3, y3, z3];

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [
			this.p1[0], this.p1[1], this.p1[2],
			this.p2[0], this.p2[1], this.p2[2],
			this.p3[0], this.p3[1], this.p3[2]
		];

		// defines the normals
		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		// defines the indices
		this.indices = [
			0,
			1,
			2
		];

		// defines the texture coordinates
		var a = Math.sqrt((this.p3[0] - this.p2[0]) * (this.p3[0] - this.p2[0]) +
			(this.p3[1] - this.p2[1]) * (this.p3[1] - this.p2[1]) +
			(this.p3[2] - this.p2[2]) * (this.p3[2] - this.p2[2]));
		var b = Math.sqrt((this.p1[0] - this.p3[0]) * (this.p1[0] - this.p3[0]) +
			(this.p1[1] - this.p3[1]) * (this.p1[1] - this.p3[1]) +
			(this.p1[2] - this.p3[2]) * (this.p1[2] - this.p3[2]));
		var c = Math.sqrt((this.p2[0] - this.p1[0]) * (this.p2[0] - this.p1[0]) +
			(this.p2[1] - this.p1[1]) * (this.p2[1] - this.p1[1]) +
			(this.p2[2] - this.p1[2]) * (this.p2[2] - this.p1[2]));

		var beta = Math.acos((a * a - b * b + c * c) / (2 * a * c));

		this.texCoords = [
			0, 0,
			c, 0,
			c - a * (a * a - b * b + c * c) / (2 * a * c), -a * Math.sin(beta)
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};

	setSAndT(s, t) {

		this.a = Math.sqrt(Math.pow(this.p1[0] - this.p3[0], 2) +
			Math.pow(this.p1[1] - this.p3[1], 2) +
			Math.pow(this.p1[2] - this.p3[2], 2));

		this.b = Math.sqrt(Math.pow(this.p2[0] - this.p1[0], 2) +
			Math.pow(this.p2[1] - this.p1[1], 2) +
			Math.pow(this.p2[2] - this.p1[2], 2));

		this.c = Math.sqrt(Math.pow(this.p3[0] - this.p2[0], 2) +
			Math.pow(this.p3[1] - this.p2[1], 2) +
			Math.pow(this.p3[2] - this.p2[2], 2));

		this.cosBeta = (Math.pow(this.a, 2) - Math.pow(this.b, 2) + Math.pow(this.c, 2)) / (2 * this.a * this.c);

		this.beta = Math.acos(this.cosBeta);

		this.texCoords = [

			(this.c - this.a * Math.cos(this.beta)) / s,
			1 - (this.a * Math.sin(this.beta)) / t,
			0, 1 / t, this.c / s,
			1 / t

		];

		this.updateTexCoordsGLBuffers();
	}

};