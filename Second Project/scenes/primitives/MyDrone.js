/**
 * MyDrone
 * @constructor
 */
class MyDrone extends CGFobject {
  constructor(scene) {
    super(scene);

    this.controlPoints();

    this.startMaterials();

    this.bodyTop = new Patch(this.scene, 3, 3, 5, 5, this.bodyPointsTop);
    this.bodyBottom = new Patch(this.scene, 3, 3, 5, 5, this.bodyPointsBottom);
    this.arm = new MyCylinder2(this.scene, 0.5, 0.5, 1.7, 32, 64);
    this.helixBody = new MyCylinder(this.scene, 0.5, 0.15, 1, 32, 64);
    this.helixTip = new MyCylinder(this.scene, 0.1, 0.05, 0.5, 32, 64);
    this.helixTop = new Plane(this.scene, 25, 25);
  };

  controlPoints() {
    this.bodyPointsBottom = [
      [1, 1, 0],
      [0, 0, 0],
      [1, -1, 0],

      [0, 0.5, 0],
      [0, 0, 2],
      [0, -0.5, 0],

      [-1, 1, 0],
      [0, 0, 0],
      [-1, -1, 0]

    ];

    this.bodyPointsTop = [

      [-1, 1, 0],
      [0, 0, 0],
      [-1, -1, 0],

      [0, 0.5, 0],
      [0, 0, -2],
      [0, -0.5, 0],

      [1, 1, 0],
      [0, 0, 0],
      [1, -1, 0]

    ];
  }

  startMaterials() {
    this.redAppearence = new CGFappearance(this.scene);
    this.redAppearence.setAmbient(0.3, 0.3, 0.3, 1);
    this.redAppearence.setDiffuse(0.9, 0.9, 0.9, 1);
    this.redAppearence.setSpecular(0.1, 0.1, 0.1, 1);
    this.redAppearence.setShininess(10);
    this.redAppearence.loadTexture("scenes/images/red.jpg");

    this.greyAppearence = new CGFappearance(this.scene);
    this.greyAppearence.setAmbient(0.3, 0.3, 0.3, 1);
    this.greyAppearence.setDiffuse(0.9, 0.9, 0.9, 1);
    this.greyAppearence.setSpecular(0.1, 0.1, 0.1, 1);
    this.greyAppearence.setShininess(10);
    this.greyAppearence.loadTexture("scenes/images/dark-grey.jpg");
  }

  display() {
    this.scene.pushMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((Math.PI / 2), 1, 0, 0);
    this.redAppearence.apply();
    this.bodyTop.display();
    this.bodyBottom.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((Math.PI / 4), 0, 1, 0);
    this.scene.scale(0.2, 0.2, 1);
    this.greyAppearence.apply();
    this.arm.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((Math.PI / 4) * 3, 0, 1, 0);
    this.scene.scale(0.2, 0.2, 1);
    this.greyAppearence.apply();
    this.arm.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((-Math.PI / 4), 0, 1, 0);
    this.scene.scale(0.2, 0.2, 1);
    this.greyAppearence.apply();
    this.arm.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((Math.PI / 4) * -3, 0, 1, 0);
    this.scene.scale(0.2, 0.2, 1);
    this.greyAppearence.apply();
    this.arm.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((Math.PI / 2), 1, 0, 0);
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.translate(2.5, 2.5, -0.5);
    this.helixBody.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((Math.PI / 2), 1, 0, 0);
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.translate(-2.5, -2.5, -0.5);
    this.helixBody.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((Math.PI / 2), 1, 0, 0);
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.translate(2.5, -2.5, -0.5);
    this.helixBody.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate((Math.PI / 2), 1, 0, 0);
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.translate(-2.5, 2.5, -0.5);
    this.helixBody.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.rotate((-Math.PI / 2), 1, 0, 0);
    this.scene.translate(2.5, 2.5, 0.5);
    this.redAppearence.apply();
    this.helixTip.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.rotate((-Math.PI / 2), 1, 0, 0);
    this.scene.translate(-2.5, 2.5, 0.5);
    this.redAppearence.apply();
    this.helixTip.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.rotate((-Math.PI / 2), 1, 0, 0);
    this.scene.translate(2.5, -2.5, 0.5);
    this.redAppearence.apply();
    this.helixTip.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.5, 0.5, 0.5);
    this.scene.rotate((-Math.PI / 2), 1, 0, 0);
    this.scene.translate(-2.5, -2.5, 0.5);
    this.redAppearence.apply();
    this.helixTip.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.1, 1, 1)
    this.scene.translate(12.5, 0.51, 1.25);
    this.greyAppearence.apply();
    this.helixTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.1, 1, 1)
    this.scene.translate(-12.5, 0.51, 1.25);
    this.greyAppearence.apply();
    this.helixTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.1, 1, 1)
    this.scene.translate(12.5, 0.51, -1.25);
    this.greyAppearence.apply();
    this.helixTop.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.scale(0.1, 1, 1)
    this.scene.translate(-12.5, 0.51, -1.25);
    this.greyAppearence.apply();
    this.helixTop.display();
    this.scene.popMatrix();

    this.scene.popMatrix();
  }
}