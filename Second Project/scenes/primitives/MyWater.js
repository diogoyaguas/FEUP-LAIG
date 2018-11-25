/**
 * MyWater
 * @constuctor
 */
class MyWater extends Plane {
    constructor(scene, idTexture, idWavemap, parts, heightscale, texscale){
        
        super(scene, parts, parts);
        
        this.scene = scene;

        this.ocean = this.scene.graph.textures[idTexture];
        this.wavemap = this.scene.graph.textures[idWavemap];
        let scale=texscale*Date.now();
        this.waterShader = new CGFshader(this.scene.gl, "scenes/shaders/ocean.vert", "scenes/shaders/shader.frag");
        this.waterShader.setUniformsValues({scale,colormap: 2});

    }

    display(){
        
        this.scene.setActiveShader(this.waterShader);
        let factor = Math.sin(Date.now() * 0.00001) * 20;
        this.waterShader.setUniformsValues({factor:factor,colormap: 2});
        this.wavemap.bind(1);
        this.ocean.bind(2);

        super.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}