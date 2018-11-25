/**
 * MyWater
 * @constuctor
 */
class MyWater extends Plane {
  constructor(scene, idTexture, idWavemap, parts, heightscale, texscale) {

    super(scene, parts, parts);

    this.scene = scene;

    this.time = 0;
    this.heightscale = heightscale;
    this.texscale = texscale;

    this.ocean = this.scene.graph.textures[idTexture];
    this.wavemap = this.scene.graph.textures[idWavemap];

    this.waterShader = new CGFshader(this.scene.gl, "scenes/shaders/ocean.vert",
                                     "scenes/shaders/ocean.frag");
    this.waterShader.setUniformsValues({uSampler2: 1});
    this.waterShader.setUniformsValues({uSampler: 0});
    this.waterShader.setUniformsValues({heightScale: this.heightscale});
    this.waterShader.setUniformsValues({texscale: this.texscale});
  }

  display() {
    this.scene.setActiveShader(this.waterShader);

    this.wavemap.bind(0);
    this.ocean.bind(1);

    super.display();    

    this.ocean.unbind(1);
    this.wavemap.unbind(0);

    this.scene.setActiveShader(this.scene.defaultShader);
  }

  update(currTime) {

    this.time += currTime;
    this.waterShader.setUniformsValues({timeFactor: this.time});

  }
}