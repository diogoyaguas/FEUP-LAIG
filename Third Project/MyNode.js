/**
 * My Node class
 */
class MyNode {
    /**
     * Creates an instance of MyNode.
     * @param {any} [build=null] 
     * @param {any} id 
     * @param {any} [children=[]] 
     * @param {any} [transformations=null] 
     * @param {any} [texture=[]] 
     * @param {any} [materials=[]] 
     * 
     * @memberOf MyNode
     */
    constructor(build = null, id, children = [], transformations = null, texture = [], materials = []) {
        this.id = id;
        this.build = build;
        this.children = children;
        this.texture = texture;
        this.materials = materials;
        this.transformations = transformations;
        this.materialIndex = 0;
    }

}