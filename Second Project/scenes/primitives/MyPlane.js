/**
 * Plane
 * @constructor
 */
class Plane extends CGFobject {
  constructor(scene, uDivs, vDivs) {
    super(scene);
    this.uDivs = uDivs;
    this.vDivs = vDivs;
    this.controlPoints = [];
    this.degree1 = 1;
    this.degree2 = 1;
    this.initControlPoints();
    this.defineNurb();
  }

  initControlPoints() {
    this.controlPoints = [
      [
        [0.5, 0.0, -0.5, 1],
        [0.5, 0.0, 0.5, 1],
      ],
      [ 
        [-0.5, 0.0, -0.5, 1],
        [-0.5, 0.0, 0.5, 1],
      ]

    ];
  }

  defineNurb() {
    var nurbSurface =
        new CGFnurbsSurface(this.degree1, this.degree2, this.controlPoints);

    this.nurbObject =
        new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, nurbSurface);
  }

  display() { this.nurbObject.display(); }
}