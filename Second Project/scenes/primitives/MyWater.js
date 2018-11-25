/**
 * MyWater
 * @constuctor
 */
class MyWater extends Plane {
    constructor(scene, idTexture, idWavemap, parts, heightscale, texscale){
        
        super(scene, parts, heightscale);
        
        this.scene = scene;

        this.ocean = this.scene.graph.textures[idTexture];
        this.wavemap = this.scene.graph.textures[idWavemap];

        this.waterShader = new CGFshader(this.scene.gl, "scenes/shaders/ocean.vert", "scenes/shaders/texture1.frag");
        this.waterShader.setUniformsValues({date:Date.now(),colormap: 2});

        this.plane = new Plane(this.scene, parts, heightscale);

    }

    display(){
        
        this.scene.setActiveShader(this.waterShader);
        let factor = Math.sin(Date.now() * 0.00001) * 20;
        this.waterShader.setUniformsValues({factor:factor,colormap: 2});
        this.wavemap.bind(1);
        this.ocean.bind(2);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}