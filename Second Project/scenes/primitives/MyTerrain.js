/**
 * MyTerrain
 * @constructor
 */
/**
 * Creates and draws the terrain
 * 
 * @class MyTerrain
 * @extends {Plane}
 */
class MyTerrain extends Plane {
/**
 * Creates an instance of MyTerrain.
 * @param {any} scene 
 * @param {any} idTexture 
 * @param {any} idHeightMap 
 * @param {any} parts 
 * @param {any} heightscale 
 * 
 * @memberOf MyTerrain
 */
    constructor(scene, idTexture, idHeightMap, parts, heightscale){
        
        super(scene, parts, heightscale);

        this.scene = scene;
        this.heightmap = this.scene.graph.textures[idHeightMap];
        this.colormap = this.scene.graph.textures[idTexture];
        
        this.terrainShader = new CGFshader(this.scene.gl, "scenes/shaders/shader.vert", "scenes/shaders/shader.frag");
        this.terrainShader.setUniformsValues({heightmap: 1,colormap: 2});

    }
    /**
     * 
     * Displays the terrain in the scene.
     * Overwrites the default display function to include the display of more than one element
     * 
     * @memberOf MyTerrain
     */
    display(){

        this.scene.setActiveShader(this.terrainShader);
        this.heightmap.bind(1);
        this.colormap.bind(2);
        
        super.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}