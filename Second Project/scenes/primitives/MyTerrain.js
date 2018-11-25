/**
 * MyTerrain
 * @constuctor
 */
class MyTerrain extends Plane {

    constructor(scene, idTexture, idHeightMap, parts, heightscale){
        
        super(scene, parts, heightscale);

        this.scene = scene;
        this.heightmap = this.scene.graph.textures[idHeightMap];
        this.colormap = this.scene.graph.textures[idTexture];
        
        this.terrainShader = new CGFshader(this.scene.gl, "scenes/shaders/shader.vert", "scenes/shaders/shader.frag");
        this.terrainShader.setUniformsValues({heightmap: 1,colormap: 2});

        this.plane = new Plane(this.scene, parts, heightscale);

    }
    
    display(){

        this.scene.setActiveShader(this.terrainShader);
        this.terrainShader.setUniformsValues({heightmap:1,colormap: 2});
        this.heightmap.bind(1);
        this.colormap.bind(2);
        this.plane.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}