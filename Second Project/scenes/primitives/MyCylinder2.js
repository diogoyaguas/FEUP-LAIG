/**
 * MyCylinder2
 * @constructor
 */
/**
 * Creates and draws a primitive of cylinder2 type given the parameters.
 * 
 * @class MyCylinder2
 * @extends {CGFobject}
 */
class MyCylinder2 extends CGFobject {
    /**
     * Creates an instance of MyCylinder2.
     * @param {any} scene 
     * @param {any} baseRadius 
     * @param {any} topRadius 
     * @param {any} height 
     * @param {any} slices 
     * @param {any} stacks 
     * 
     * @memberOf MyCylinder2
     */
    constructor(scene, baseRadius, topRadius, height, slices, stacks) {
        super(scene);

        this.base = baseRadius;
        this.top = topRadius;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        var degreeU = 1;
        var degreeV = 8;

        this.cylinder = null;

        this.controlvertexes = [
            [
                [0.0, -this.base, 0.0, 1],
                [-this.base, -this.base, 0.0, 0.707],
                [-this.base, 0.0, 0.0, 1],
                [-this.base, this.base, 0.0, 0.707],
                [0.0, this.base, 0.0, 1],
                [this.base, this.base, 0.0, 0.707],
                [this.base, 0.0, 0.0, 1],
                [this.base, -this.base, 0.0, 0.707],
                [0.0, -this.base, 0.0, 1]                       
            ],
            [
                [0.0, -this.top, this.height, 1],
                [-this.top, -this.top, this.height, 0.707],
                [-this.top, 0.0, this.height, 1],
                [-this.top, this.top, this.height, 0.707],
                [0.0, this.top, this.height, 1],
                [this.top, this.top, this.height, 0.707],
                [this.top, 0.0, this.height, 1],
                [this.top, -this.top, this.height, 0.707],
                [0.0, -this.top, this.height, 1]                       
            ]
        ];

        this.defineNurb(degreeU, degreeV, this.controlvertexes);
    };
/**
 * 
 * 
 * @param {any} degreeU 
 * @param {any} degreeV 
 * @param {any} controlvertexes 
 * 
 * @memberOf MyCylinder2
 */
    defineNurb(degreeU, degreeV, controlvertexes) {

        var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlvertexes);
        var nurbObject = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);

        this.cylinder = nurbObject;
    }
/**
 * 
 * 
 * 
 * @memberOf MyCylinder2
 */
    display(){
        this.cylinder.display();
    }

}