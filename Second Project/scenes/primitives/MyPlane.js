/**
 * Plane
 * @constructor
 */
/**
 * Creates a plane
 * 
 * @class Plane
 * @extends {CGFobject}
 */
class Plane extends CGFobject {
  /**
   * Creates an instance of Plane.
   * @param {any} scene 
   * @param {any} uDivs 
   * @param {any} vDivs 
   * 
   * @memberOf Plane
   */
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
/**
 * 
 * Initiates control points
 * 
 * @memberOf Plane
 */
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
/**
 * 
 * Defins nurbs surface and nurb object
 * 
 * @memberOf Plane
 */
  defineNurb() {
    var nurbSurface =
        new CGFnurbsSurface(this.degree1, this.degree2, this.controlPoints);

    this.nurbObject =
        new CGFnurbsObject(this.scene, this.uDivs, this.vDivs, nurbSurface);
  }
/**
 * 
 * Displays the plane in the scene. 
 * 
 * @memberOf Plane
 */
  display() { this.nurbObject.display(); }
}