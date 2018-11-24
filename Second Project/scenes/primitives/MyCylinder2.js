/**
 * MyCylinder2
 * @constructor
 */
class MyCylinder2 extends CGFobject {
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

    defineNurb(degreeU, degreeV, controlvertexes) {

        var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, controlvertexes);
        var nurbObject = new CGFnurbsObject(this.scene, this.stacks, this.slices, nurbsSurface);

        this.cylinder = nurbObject;
    }

    display(){
        this.cylinder.display();
    }

}