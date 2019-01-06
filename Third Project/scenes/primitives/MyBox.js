let d = Math.PI / 180;

/**
 * MyBox
 * @constructor
 */
class MyBox extends CGFobject
{
	constructor(scene)
	{
		super(scene);
		this.pieceB = new MySphere(this.scene,1, 32, 64);
		this.pieceW = new MySphere(this.scene,1, 32, 64);
		
		this.quad = new MyCube(this.scene);
		this.top = new MyCube(this.scene);
		this.setAppearance();
	};

	setAppearance() {

        this.pieceAppearance = new CGFappearance(this.scene);
        this.pieceAppearance.setAmbient(1, 1, 1, 1);
        this.pieceAppearance.setSpecular(1, 1, 1, 1);
        this.pieceAppearance.setDiffuse(1, 1, 1, 1);
        this.pieceAppearance.setShininess(true);

        this.pieceWhiteAppearance = new CGFappearance(this.scene);
        this.pieceWhiteAppearance.setAmbient(1, 1, 1, 1);
        this.pieceWhiteAppearance.setSpecular(1, 1, 1, 1);
        this.pieceWhiteAppearance.setDiffuse(1, 1, 1, 1);
		this.pieceWhiteAppearance.setShininess(true);
		
		this.boxAppearance = new CGFappearance(this.scene);
        this.boxAppearance.setAmbient(1, 1, 1, 1);
        this.boxAppearance.setSpecular(1, 1, 1, 1);
        this.boxAppearance.setDiffuse(1, 1, 1, 1);
        this.boxAppearance.setShininess(true);

    };
	display()
	{

		this.scene.pushMatrix();
		this.scene.rotate(180 * d, 1, 0, 0);
		this.scene.translate(0,0,-0.2);
		this.scene.scale(1,1,0.02);
		this.top.display();
		this.scene.popMatrix();

		// front face
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.scene.scale(1.1,1.1,0.1);
		this.boxAppearance.setTexture(this.scene.box.texture);
		this.boxAppearance.apply();
		this.quad.display();
		this.scene.popMatrix();

		// top face
		this.scene.pushMatrix();
		this.scene.rotate(-90 * d, 1, 0, 0);
		this.scene.translate(0, -0.5, 0.5);
		this.scene.scale(1.1,1.1,0.1);
		this.quad.display();
		this.scene.popMatrix();

		// back face
		this.scene.pushMatrix();
		this.scene.rotate(-90 * d, 1, 0, 0);
		this.scene.translate(0, -0.5, -0.5);
		this.scene.scale(1.1,1.1,0.1);
		this.quad.display();
		this.scene.popMatrix();

		// right face
		this.scene.pushMatrix();
		this.scene.rotate(-90 * d, 0, 1, 0);
		this.scene.translate(0.5, 0, 0.5);
		this.scene.scale(1.1,1,0.1);
		this.quad.display();
		this.scene.popMatrix();

		// left face
		this.scene.pushMatrix();
		this.scene.rotate(90 * d, 0, 1, 0);
		this.scene.translate(-0.5, 0, 0.5);
		this.scene.scale(1.1,1,0.1);
		this.quad.display();
		this.scene.popMatrix();

	/*	for(var i = 0; i < 10; i++){
			for(var j = 0; j < 5; j++){
				for(var k = 0.35; k < 5; k++){
			this.scene.pushMatrix();
			this.scene.rotate(Math.PI / 2, 1, 0, 0);
			this.scene.translate(0.2*k, 0.1*i, 0.2*j);
			this.scene.translate(-0.46,0,-0.405);
			this.scene.scale(0.1, 0.05, 0.1);
        	this.pieceAppearance.setTexture(this.scene.pieceTex.texture);
        	this.pieceAppearance.apply();
        	this.pieceB.display();
			this.scene.popMatrix();
			}
		}
	}*/

	
	


	};
};