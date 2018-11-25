/**
 * MyWater
 * @constructor
 */
/**
 * Creates the water
 * 
 * @class MyWater
 * @extends {Plane}
 */
class MyWater extends Plane {
  constructor(scene, idTexture, idWavemap, parts, heightscale, texscale) {

    super(scene, parts, parts);

    this.scene = scene;

    this.time = 0;
    this.heightscale = heightscale;

    this.ocean = this.scene.graph.textures[idTexture];
    this.wavemap = this.scene.graph.textures[idWavemap];

    this.waterShader = new CGFshader(this.scene.gl, "scenes/shaders/ocean.vert",
                                     "scenes/shaders/ocean.frag");
    this.waterShader.setUniformsValues({uSampler2: 1});
    this.waterShader.setUniformsValues({heightScale: this.heightscale});
  }

  display() {
    this.scene.setActiveShader(this.waterShader);

    this.wavemap.bind(0);
    this.ocean.bind(1);

    super.display();    

    this.wavemap.unbind(1);
    this.ocean.unbind(0);

    this.scene.setActiveShader(this.scene.defaultShader);
  }

  update(currTime) {

    this.time += currTime*0.005;
    this.waterShader.setUniformsValues({timeFactor: this.time});

  }
}