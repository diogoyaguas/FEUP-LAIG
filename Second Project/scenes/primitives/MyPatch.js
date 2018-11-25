/**
 * Patch
 * @constructor
 */
/**
* Creates a patch
 * 
 * @class Patch
 * @extends {CGFobject}
 */
class Patch extends CGFobject {
  /**
   * Creates an instance of Patch.
   * @param {any} scene 
   * @param {any} npointsU 
   * @param {any} npointsV 
   * @param {any} npartsU 
   * @param {any} npartsV 
   * @param {any} controlpoints 
   * 
   * @memberOf Patch
   */
  constructor(scene, npointsU, npointsV, npartsU, npartsV, controlpoints) {
    super(scene);

    this.npointsU = npointsU;
    this.npointsV = npointsV;
    this.npartsU = npartsU;
    this.npartsV = npartsV;
    this.controlpoints = controlpoints;

    var degree1 = this.npointsU - 1;
    var degree2 = this.npointsV - 1;
    this.controlVertexes = [];

    this.defineVertices();

    var nurbSurface = new CGFnurbsSurface(degree1, degree2, this.controlVertexes);
    this.nurbObject = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, nurbSurface);
  }
/**
 * 
 * 
 * 
 * @memberOf Patch
 */
  defineVertices() {

    var k = 0;

    for (var i = 1; i <= this.npointsU; i++) {
      var contVSubSet = [];
      for (var j = 1; j <= this.npointsV; j++) {
        var controlPoint  = this.controlpoints[k];
        controlPoint.push(1);
        contVSubSet.push(controlPoint);
        k++;
      }
      this.controlVertexes.push(contVSubSet);
    }
  }
/**
 * 
 * Displays the surface in the scene.
 * 
 * @memberOf Patch
 */
  display() { 
 
    this.nurbObject.display(); }
}