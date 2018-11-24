var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATION_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];
        this.counter = 0;
        this.different = false;

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {

        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbientNode(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATION_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> block.
     * @param {Scene Node} sceneNode
     */
    parseScene(sceneNode) {

        this.idRoot = this.reader.getString(sceneNode, 'root');
        this.axisLength = this.reader.getFloat(sceneNode, 'axis_length');

        if (this.idRoot == null) {
            this.onXMLError("no root defined for scene'");
        }

        if (!(this.axisLength != null && !isNaN(this.axisLength))) {
            this.axisLength = 1;
            this.onXMLMinorError("unable to parse value for axis length; assuming 'axis_length = 1'");
        }

        this.log("Parsed scene block");

        return null;

    }

    /**
     * Parses the <views> block.
     * @param {Views Node} viewsNode
     */
    parseViews(viewsNode) {

        this.views = [];
        var error;

        this.default = this.reader.getString(viewsNode, 'default');

        if (this.default == null) {
            this.onXMLError("no ID defined for default view");
        }

        var children = viewsNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for (i = 0; i < children.length; i++) {
            if (nodeNames[i] == "perspective") {
                error = this.parsePerspective(i, children);
                if (error != null)
                    this.onXMLError("unable to parse perspective'");
            } else if (nodeNames[i] == "ortho") {
                error = this.parseOrtho(i, children);
                if (error != null)
                    this.onXMLError("unable to parse ortho'");
            } else this.onXMLMinorError("inapropriate tag name in views");
        }

        this.log("Parsed views block");

        return null;
    }

    /**
     * Parses the <perspective> block.
     *  @param {Perpective index} perspectiveIndex
     *  @param {Children of Views} children
     */
    parsePerspective(perspectiveIndex, children) {

        // Retrieves the perspective.
        if (perspectiveIndex != -1) {

            this.perspectiveId = this.reader.getString(children[perspectiveIndex], 'id');

            if (this.views[this.perspectiveId] != null)
                this.onXMLError("perspective's ID repeated");


            if (this.perspectiveId == null) {
                this.onXMLError("no ID defined for perspective");
            }

            var near = this.reader.getFloat(children[perspectiveIndex], 'near');
            var far = this.reader.getFloat(children[perspectiveIndex], 'far');
            var angle = this.reader.getFloat(children[perspectiveIndex], 'angle');

            if (near == null || isNaN(near) || near <= 0) {
                near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            } else if (far == null || isNaN(far)) {
                far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            } else if (angle == null || isNaN(angle)) {
                near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            }

            if (near >= far)
                this.onXMLMinorError("'near' must be smaller than 'far'");

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[perspectiveIndex].children;

            // Specifications for the current position and target.
            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            var position, target;
            var fromIndex = newNodeNames.indexOf("from");
            if (fromIndex != -1) {

                position = this.parseXYZ(grandChildren[fromIndex]);

            } else this.onXMLError("position undefined'");

            var targetIndex = newNodeNames.indexOf("to");
            if (targetIndex != -1) {

                target = this.parseXYZ(grandChildren[targetIndex]);

            } else this.onXMLError("target undefined'");

            this.views[this.perspectiveId] = [near, far, angle, position, target];
            this.views[this.perspectiveId].type = "perspective";

            this.log("Parsed perspective");

            return null;

        }

        return -1;

    }

    /**
     * Parses the <ortho> block.
     *  @param {Ortho index} orthoIndex
     *  @param {Children of Views} children
     */
    parseOrtho(orthoIndex, children) {

        // Retrieves the ortho.
        if (orthoIndex != -1) {

            var orthoId = this.reader.getString(children[orthoIndex], 'id');

            if (this.views[orthoId] != null)
                this.onXMLError("ortho's ID repeated");

            if (orthoId == null) {
                this.onXMLError("no ID defined for ortho'");
            }

            var near = this.reader.getFloat(children[orthoIndex], 'near');
            var far = this.reader.getFloat(children[orthoIndex], 'far');
            var left = this.reader.getFloat(children[orthoIndex], 'left');
            var rigth = this.reader.getFloat(children[orthoIndex], 'right');
            var top = this.reader.getFloat(children[orthoIndex], 'top');
            var bottom = this.reader.getFloat(children[orthoIndex], 'bottom');

            if (near == null || near <= 0 || isNaN(near)) {
                near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            } else if (far == null || isNaN(far)) {
                far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            } else if (left == null || isNaN(left)) {
                left = 5;
                this.onXMLMinorError("unable to parse value for left plane; assuming 'left = 5'");
            } else if (rigth == null || isNaN(rigth)) {
                rigth = 5;
                this.onXMLMinorError("unable to parse value for rigth plane; assuming 'rigth = 5'");
            } else if (top == null || isNaN(top)) {
                top = 5;
                this.onXMLMinorError("unable to parse value for top plane; assuming 'top = 5'");
            } else if (bottom == null || isNaN(bottom)) {
                bottom = 5;
                this.onXMLMinorError("unable to parse value for bottom plane; assuming 'bottom = 5'");
            } else if (near >= far)
                this.onXMLMinorError("'near' must be smaller than 'far'");

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[orthoId].children;

            // Specifications for the current position and target.
            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            var position, target;
            var fromIndex = newNodeNames.indexOf("from");
            if (fromIndex != -1) {

                position = this.parseXYZ(grandChildren[fromIndex]);

            } else this.onXMLError("position undefined'");

            var targetIndex = newNodeNames.indexOf("to");
            if (targetIndex != -1) {

                target = this.parseXYZ(grandChildren[targetIndex]);

            } else this.onXMLError("target undefined'");

            this.views[orthoId] = [near, far, left, rigth, top, bottom, position, target];
            this.views[orthoId].type = "ortho";

            this.log("Parsed ortho");

            return null;
        }

        return -1;
    }

    /**
     * Parses the <ambient> block.
     *  @param {Ambient Node} ambientNode
     */
    parseAmbientNode(ambientNode) {

        var children = ambientNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for (i = 0; i < children.length; i++) {
            if (nodeNames[i] == "ambient") {
                this.ambient = this.parseRGBA(children[i], "ambient")
                if (this.ambient == null)
                    this.onXMLError("unable to parse ambient'");
            } else if (nodeNames[i] == "background") {
                this.background = this.parseRGBA(children[i], "ambient")
                if (this.background == null)
                    this.onXMLError("unable to parse background'");
            } else return "Inapropriate tag name in ambient";
        }

        this.globalAmbient = this.ambient;

        this.log("Parsed ambient block");

        return null;

    }

    /**
     * Parses the <lights> block.
     *  @param {Lights Node} lightsNode
     */
    parseLights(lightsNode) {

        this.lights = [];

        var error;

        var children = lightsNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for (var i = 0; i < children.length; i++) {
            if (nodeNames[i] == "omni") {
                error = this.parseOmni(i, children);
                if (error != null)
                    this.onXMLError("unable to parse omni'");
            } else if (nodeNames[i] == "spot") {
                error = this.parseSpot(i, children);
                if (error != null)
                    this.onXMLError("unable to parse spot'");
            } else return "Inapropriate tag name in lights";

        }

        this.log("Parsed lights block");

        return null;
    }

    /**
     * Parses the <omni> block
     *  @param {Omni index} OmniIndex
     *  @param {Children of Lights} children
     */
    parseOmni(omniIndex, children) {

        var error;

        // Retrieves the omni.
        if (omniIndex != -1) {

            var omniId = this.reader.getString(children[omniIndex], 'id');

            if (this.lights[omniId] != null)
                this.onXMLMinorError("omni's ID repeated");

            if (omniId == null) {
                this.onXMLMinorError("no ID defined for omni");
            }

            var enabled = this.reader.getBoolean(children[omniIndex], 'enabled');
            if (enabled != 0 && enabled != 1) {
                this.onXMLMinorError("no enabled defined for omni");
            }

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[omniIndex].children;

            for (var i = 0; i < grandChildren.length; i++)
                newNodeNames.push(grandChildren[i].nodeName);

            for (var i = 0; i < grandChildren.length; i++) {
                if (newNodeNames[i] == "location") {
                    error = this.parseLocation(i, grandChildren);
                    if (error != null)
                        return error;

                } else if (newNodeNames[i] == "ambient") {
                    this.ambient = this.parseRGBA(grandChildren[i], "ambient")
                    if (this.ambient == null)
                        this.onXMLError("unable to parse ambient'");

                } else if (newNodeNames[i] == "diffuse") {
                    this.diffuse = this.parseRGBA(grandChildren[i], "diffuse");
                    if (this.diffuse == null)
                        this.onXMLError("unable to parse diffuse'");

                } else if (newNodeNames[i] == "specular") {
                    this.specular = this.parseRGBA(grandChildren[i], "specular");
                    if (this.specular == null)
                        this.onXMLError("unable to parse specular'");

                } else return "Inapropriate tag name in omni";
            }

            this.lights[omniId] = [enabled, this.location, this.ambient, this.diffuse, this.specular];
            this.lights[omniId].type = "omni";

            this.log("Parsed omni");

            return null;
        }

        return -1;

    }

    /**
     * Parses the <spot> block
     *  @param {Spot index} spotIndex
     *  @param {Children of Lights} children
     */
    parseSpot(spotIndex, children) {

        var error;

        // Retrieves the spot.
        if (spotIndex != -1) {

            var spotId = this.reader.getString(children[spotIndex], 'id');

            if (this.lights[spotId] != null)
                this.onXMLError("spot's ID repeated");

            if (spotId == null) {
                this.onXMLError("no ID defined for spot'");
            }

            var enabled = this.reader.getBoolean(children[spotIndex], 'enabled');
            if (enabled != 0 && enabled != 1) {
                enabled = 1;
                this.onXMLMinorError("no enabled defined for spot, assuming enabled = 1");
            }

            var angle = this.reader.getFloat(children[spotIndex], 'angle');
            if (angle == null || isNaN(angle)) {
                angle = 45;
                this.onXMLMinorError("no angle defined for spot, assuming angle = 45");
            }

            var exponent = this.reader.getFloat(children[spotIndex], 'exponent');
            if (isNaN(exponent)) {
                exponent = 1;
                this.onXMLMinorError("no exponent defined for spot, assuming exponent = 1;");
            }

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[spotIndex].children;

            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            for (var i = 0; i < grandChildren.length; i++) {

                if (newNodeNames[i] == "location") {
                    error = this.parseLocation(i, grandChildren);
                    if (error != null)
                        return error;

                } else if (newNodeNames[i] == "target") {
                    this.target = this.parseXYZ(grandChildren[i]);
                    if (this.target == null)
                        this.onXMLError("unable to parse target'");

                } else if (newNodeNames[i] == "ambient") {
                    this.ambient = this.parseRGBA(grandChildren[i], "ambient")
                    if (this.ambient == null)
                        this.onXMLError("unable to parse ambient'");

                } else if (newNodeNames[i] == "diffuse") {
                    this.diffuse = this.parseRGBA(grandChildren[i], "diffuse");
                    if (this.diffuse == null)
                        this.onXMLError("unable to parse diffuse'");

                } else if (newNodeNames[i] == "specular") {
                    this.specular = this.parseRGBA(grandChildren[i], "specular");
                    if (this.specular == null)
                        this.onXMLError("unable to parse specular'");

                } else return "Inapropriate tag name in spot";

            }

            this.lights[spotId] = [enabled, this.location, this.ambient, this.diffuse, this.specular, this.target, angle, exponent];
            this.lights[spotId].type = "spot";

            this.log("Parsed spot");

            return null;
        }

        return -1;

    }

    /**
     * Parses the <location> component
     *  @param {Location index} locationIndex
     *  @param {Children of Omni and Spot} children
     */
    parseLocation(locationIndex, grandChildren) {

        // Retrieves the location.
        if (locationIndex != -1) {

            this.location = this.parseXYZ(grandChildren[locationIndex]);

            var w = this.reader.getFloat(grandChildren[locationIndex], 'w');

            if (!(w != null || !isNaN(w))) {
                w = 25;
                this.onXMLMinorError("w value not properly defined, assuming w = 25");
            } else
                this.location[3] = w;

            return null;
        }

        return -1;
    }

    /**
     * Parses the <textures> block.
     * @param {Textures Node} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;
        var nodeNames = [];
        this.textures = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
            }

            var textureID = this.reader.getString(children[i], "id");

            if (textureID == null)
                this.onXMLError("no ID defined for texture");

            if (this.textures[textureID] != null)
                this.onXMLError("ID must be unique for each texture");

            var textureFile = this.reader.getString(children[i], "file");

            if (textureFile == null)
                this.onXMLError("No file defined for texture");

            var texture = new CGFtexture(this.scene, textureFile);

            this.textures[textureID] = texture;
        }

        this.log("Parsed textures");
    }

    /**
     * Parses the <materials> block.
     * @param {Materials Node} materialsNode
     */
    parseMaterials(materialsNode) {

        this.materials = [];

        var children = materialsNode.children;

        for (var j = 0; j < children.length; j++) {

            // Retrieves the materials.
            var materialsId = this.reader.getString(children[j], 'id');
            if (materialsId == null) {
                this.onXMLError("no ID defined for materials");
            }


            if (this.materials[materialsId] != null)
                this.onXMLError("materials' ID must be different");

            var shininess = this.reader.getFloat(children[j], 'shininess');
            if (shininess == null || shininess < 0 || isNaN(shininess)) {
                this.shininess = 10.0
                this.onXMLMinorError("no valid shininess value, assuming shininess = 10");
            }

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[j].children;

            for (var k = 0; k < grandChildren.length; k++) {
                newNodeNames.push(grandChildren[k].nodeName);
            }

            for (var i = 0; i < grandChildren.length; i++) {

                if (newNodeNames[i] == "emission") {
                    this.materialEmission = this.parseRGBA(grandChildren[i]);
                    if (this.materialEmission == null)
                        this.onXMLError("unable to parse emission'");

                } else if (newNodeNames[i] == "ambient") {
                    this.ambient = this.parseRGBA(grandChildren[i], "ambient")
                    if (this.ambient == null)
                        this.onXMLError("unable to parse ambient'");

                } else if (newNodeNames[i] == "diffuse") {
                    this.diffuse = this.parseRGBA(grandChildren[i], "diffuse");
                    if (this.diffuse == null)
                        this.onXMLError("unable to parse diffuse'");

                } else if (newNodeNames[i] == "specular") {
                    this.specular = this.parseRGBA(grandChildren[i], "specular");
                    if (this.specular == null)
                        this.onXMLError("unable to parse specular'");

                } else return "Inapropriate tag name in materials";

            }

            this.materials[materialsId] = new CGFappearance(this.scene);
            this.materials[materialsId].setShininess(shininess);
            this.materials[materialsId].setEmission(this.materialEmission[0], this.materialEmission[1], this.materialEmission[2], this.materialEmission[3]);
            this.materials[materialsId].setAmbient(this.ambient[0], this.ambient[1], this.ambient[2], this.ambient[3]);
            this.materials[materialsId].setDiffuse(this.diffuse[0], this.diffuse[1], this.diffuse[2], this.diffuse[3]);
            this.materials[materialsId].setSpecular(this.specular[0], this.specular[1], this.specular[2], this.specular[3]);

            this.log("Parsed material");

        }

        this.log("Parsed materials block");

        return null;

    }

    /**
     * Parses the <transformations> block.
     * @param {Transformations Node} transformationsNode
     */
    parseTransformations(transformationsNode) {

        this.transformations = [];

        var children = transformationsNode.children;

        // Retrieves the transformations.
        for (var j = 0; j < children.length; j++) {
            if (children[j].nodeName != "transformation") {
                this.onXMLError("unknown tag <" + children[j].nodeName + ">");
            }

            this.transformationsId = this.reader.getString(children[j], 'id');

            if (this.transformationsId == null) {
                this.onXMLError("no ID defined for transformations");
            }

            if (this.transformations[this.transformationsId] != null)
                this.onXMLError("transformations ID must be different");

            this.transformations[this.transformationsId] = mat4.create();

            var grandChildren = children[j].children;

            for (var i = 0; i < grandChildren.length; i++) {

                switch (grandChildren[i].nodeName) {
                    case "translate":
                        var xyz = this.parseXYZ(grandChildren[i]);

                        mat4.translate(this.transformations[this.transformationsId], this.transformations[this.transformationsId],
                            xyz);

                        break;

                    case "scale":
                        var xyz = this.parseXYZ(grandChildren[i]);

                        mat4.scale(this.transformations[this.transformationsId], this.transformations[this.transformationsId],
                            xyz);

                        break;

                    case "rotate":

                        var axis = this.reader.getString(grandChildren[i], "axis"),
                            angle = this.reader.getFloat(grandChildren[i], "angle");
                        var vec = vec3.create();

                        switch (axis) {
                            case "x":
                                vec3.set(vec, 1, 0, 0);
                                break;

                            case "y":
                                vec3.set(vec, 0, 1, 0);
                                break;

                            case "z":
                                vec3.set(vec, 0, 0, 1);
                                break;

                            default:
                                this.log("Error in axis");
                        }

                        if (axis == null || angle == null)
                            return transformationErrorTag + "Rotation not properly defined";

                        mat4.rotate(this.transformations[this.transformationsId], this.transformations[this.transformationsId],
                            angle * DEGREE_TO_RAD, vec);

                        break;
                }

            }

            this.log("Parsed transformation");

        }

        this.log("Parsed transformations block");

        return null;

    }

    /**
     * Parses the animations node
     * @param {Animations Node} animationsNode
     */
    parseAnimations(animationNode) {

        var children = animationNode.children;
        var error;
        this.animations = [];

        if (children.length == 0) {

            this.log("Animations block empty");
            return null;
        }

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for (var i = 0; i < children.length; i++) {
            if (nodeNames[i] == "linear") {
                error = this.parseLinear(i, children);
                if (error != null) this.onXMLError("unable to parse linear'");
            } else if (nodeNames[i] == "circular") {
                error = this.parseCircular(i, children);
                if (error != null) this.onXMLError("unable to parse circular'");
            } else
                return "Inapropriate tag name in animations";
        }

        this.log("Parsed animations block");

        return null;
    }


    parseLinear(linearIndex, children) {

        var error;

        // Retrieves the linear.
        if (linearIndex != -1) {

            var linearId = this.reader.getString(children[linearIndex], 'id');

            if (this.animations[linearId] != null)
                this.onXMLError("linear's ID repeated");

            if (linearId == null) {
                this.onXMLError("no ID defined for linear'");
            }

            var span = this.reader.getFloat(children[linearIndex], 'span');
            if (span <= 0) {
                span = 5;
                this.onXMLMinorError("no span defined for linear, assuming span = 5");
            }

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[linearIndex].children;

            if (grandChildren.length < 2) {
                this.onXMLError("there must be at least two control points");
            }

            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            var controlPoint = [];

            for (var i = 0; i < grandChildren.length; i++) {

                if (newNodeNames[i] == "controlpoint") {
                    controlPoint[i] = this.parseXYZ(grandChildren[i]);
                } else return "Inapropriate tag name in control point";

            }

            this.animations[linearId] = new LinearAnimation(this.scene, linearId, span, controlPoint);
            this.animations[linearId].type = "linear";

            this.log("Parsed linear animation");

            return null;
        }

        return -1;
    }

    parseCircular(circularIndex, children) {

        var error;

        // Retrieves the circular.
        if (circularIndex != -1) {

            var circularId = this.reader.getString(children[circularIndex], 'id');

            if (this.animations[circularId] != null)
                this.onXMLError("circular's ID repeated");

            if (circularId == null) {
                this.onXMLError("no ID defined for cirular'");
            }

            var span = this.reader.getFloat(children[circularIndex], 'span');
            if (span <= 0) {
                span = 5;
                this.onXMLMinorError("no span defined for circular, assuming span = 5");
            }

            var center = this.reader.getVector3(children[circularIndex], 'center');

            var radius = this.reader.getFloat(children[circularIndex], 'radius');
            if (radius <= 0) {
                radius = 1;
                this.onXMLMinorError("no radius defined for circular, assuming radius = 1");
            }

            var startang = this.reader.getFloat(children[circularIndex], 'startang');
            if (startang == null || isNaN(startang)) {
                startang = 45;
                this.onXMLMinorError("no start angle defined for circular, assuming start angle = 45");
            }

            var rotang = this.reader.getFloat(children[circularIndex], 'rotang');
            if (rotang == null || isNaN(rotang)) {
                rotang = 90;
                this.onXMLMinorError("no rotation angle defined for circular, assuming start angle = 90");
            }

            this.animations[circularId] = new CircularAnimation(this.scene, circularId, center, radius, startang, rotang, span);
            this.animations[circularId].type = "circular";

            this.log("Parsed circular animation");

            return null;
        }

        return -1;
    }

    /**
     * Parses the primitives node
     * @param {Primitives Node} primitivesNode
     */
    parsePrimitives(primitivesNode) {
        var children = primitivesNode.children;

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            } else {

                var error = this.parsePrimitive(children[i]);
                if (error != null)
                    this.onXMLError("unable to parse primitive");
            }

        }

        this.log("Parsed primitives");

    }

    /**
     * Processes a single primitive block
     * @param {Single Primitive Node} primitiveBlock
     */
    parsePrimitive(primitiveBlock) {

        var primitiveID = this.reader.getString(primitiveBlock, "id");
        var build;

        if (this.nodes[primitiveID] != null)
            return "ID must be unique for each primitive (conflict: ID = " + primitiveID + ")";

        var children = primitiveBlock.children;

        if (children.length == 0)
            return "At least one primitive object must be declared";

        switch (children[0].nodeName) {
            case "rectangle":
                build = new MyRectangle(this.scene, this.reader.getFloat(children[0], "x1"),
                    this.reader.getFloat(children[0], "y1"), this.reader.getFloat(children[0], "x2"),
                    this.reader.getFloat(children[0], "y2"));
                break;

            case "triangle":

                build = new MyTriangle(this.scene, this.reader.getFloat(children[0], "x1"), this.reader.getFloat(children[0], "y1"), this.reader.getFloat(children[0], "z1"),
                    this.reader.getFloat(children[0], "x2"), this.reader.getFloat(children[0], "y2"), this.reader.getFloat(children[0], "z2"),
                    this.reader.getFloat(children[0], "x3"), this.reader.getFloat(children[0], "y3"), this.reader.getFloat(children[0], "z3"));
                break;

            case "cylinder":
                build = new MyCylinder(this.scene, this.reader.getFloat(children[0], "base"),
                    this.reader.getFloat(children[0], "top"), this.reader.getFloat(children[0], "height"),
                    this.reader.getFloat(children[0], "slices"), this.reader.getFloat(children[0], "stacks"));

                break;

            case "sphere":
                build = new MySphere(this.scene, this.reader.getFloat(children[0], "radius"), this.reader.getFloat(children[0], "slices"),
                    this.reader.getFloat(children[0], "stacks"));
                break;

            case "torus":
                build = new MyTorus(this.scene, this.reader.getFloat(children[0], "inner"),
                    this.reader.getFloat(children[0], "outer"), this.reader.getFloat(children[0], "slices"),
                    this.reader.getFloat(children[0], "loops"));
                break;

            case "plane":
                build = new Plane(this.scene, this.reader.getFloat(children[0], "npartsU"),
                    this.reader.getFloat(children[0], "npartsV"));
                break;

            case "patch":
                build = this.parsePatch(children[0]);
                break;
            
            case "cylinder2":
                build = new MyCylinder2(this.scene, this.reader.getFloat(children[0], "base"),
                    this.reader.getFloat(children[0], "top"), this.reader.getFloat(children[0], "height"),
                    this.reader.getFloat(children[0], "slices"), this.reader.getFloat(children[0], "stacks"));
                break;

            case "drone":
                build = new MyDrone(this.scene);
                break;

            default:
                return "Tag not identified on primitive " + primitiveID;
        }

        this.nodes[primitiveID] = new MyNode(build, primitiveID);
        this.nodes[primitiveID].read = false;

    }

    /**
     * Processes the patch node
     * @param {Patch node} pacthNode
     */
    parsePatch(pacthNode) {

        var npointsU = this.reader.getFloat(pacthNode, "npointsU");
        var npointsV = this.reader.getFloat(pacthNode, "npointsV");
        var npartsU = this.reader.getFloat(pacthNode, "npartsU");
        var npartsV = this.reader.getFloat(pacthNode, "npartsV");

        var newNodeNames = [];
        var grandChildren = pacthNode.children;

            if (grandChildren.length < 2) {
                this.onXMLError("there must be at least two control points");
            }

            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            var controlPoint = [];

            for (var i = 0; i < grandChildren.length; i++) {

                if (newNodeNames[i] == "controlpoint") {
                    controlPoint[i] = this.parseXYZ(grandChildren[i]);
                } else return "Inapropriate tag name in control point";

            }
        
        var build = new Patch(this.scene, npointsU, npointsV, npartsU, npartsV, controlPoint);

        return build;
    }

    /**
     * Processes the components node
     * @param {Components node} componentsNode
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;
        var componentID;

        //First pass - Merely add them to the list
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            componentID = this.reader.getString(children[i], "id");

            if (this.nodes[componentID] != null) {
                this.onXMLMinorError("ID must be unique for each component/primitive (conflict: ID = " + componentID + "), adding -comp to Id");
                componentID = componentID + "-comp";
            }
            this.nodes[componentID] = new MyNode(null, componentID);
        }

        if (this.nodes[this.idRoot] == null)
            return "Root element isn't present in components";
        else
            this.root = this.nodes[this.idRoot];

        //Second pass - analyze & parse remaining details

        for (var i = 0; i < children.length; i++) {
            var error = this.parseComponent(children[i]);

            if (error != null)
                return error;
        }

        this.log("Parsed components");
    }

    /**
     * Processes a single component block
     * @param {Single Component Node} componentBlock
     */
    parseComponent(componentBlock) {
        var children = componentBlock.children;
        var nodeNames = [];

        var tranformationMatrix, animationList = [],
            materialList = [],
            textureSpecs = [],
            childrenList = [];
        var componentID = this.reader.getString(componentBlock, "id");
        if (this.nodes[(componentID + "-comp")] != null) {
            componentID = componentID + "-comp";
        }

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var index = nodeNames.indexOf("transformation");

        if (index == null)
            return "No transformation tag present in component " + componentID;

        if (typeof(tranformationMatrix = this.parseComponentTransformation(children[index], componentID)) == "string")
            return tranformationMatrix;

        var index = nodeNames.indexOf("animations");

        if (index == null)
            return "No animations tag present in component " + componentID;

        if (typeof(animationList = this.parseComponentAnimations(children[index], componentID)) == "string")
            return animationList;

        index = nodeNames.indexOf("materials");

        if (index == null)
            return "No materials tag present in component " + componentID;

        if (typeof(materialList = this.parseComponentMaterials(children[index], componentID)) == "string")
            return materialList;

        index = nodeNames.indexOf("texture");

        if (index == null)
            return "No texture tag present in component: " + componentID;

        if (typeof(textureSpecs = this.parseComponentTexture(children[index], componentID)) == "string")
            return textureSpecs;

        index = nodeNames.indexOf("children");

        if (index == null)
            return "No children tag present in component: " + componentID;

        if (typeof(childrenList = this.parseComponentChildren(children[index], componentID)) == "string")
            return childrenList;

        this.nodes[componentID].read = false;
    }

    /**
     * Parses the children block in a component.
     * @param {Component's children block} componentChildrenBlock
     * @param {Component's ID} componentID
     */
    parseComponentChildren(componentChildrenBlock, componentID) {
        var children = componentChildrenBlock.children;

        if (children.length == 0)
            return "Component " + componentID + ": At least one child must be declared";

        var childrenID, childrenList = [];

        for (var i = 0; i < children.length; i++) {
            childrenID = this.reader.getString(children[i], "id");

            if (this.nodes[childrenID] == null)
                return "Component " + componentID + ": Children " + childrenID + " not previously declared";

            childrenList.push(childrenID);
        }

        this.nodes[componentID].children = childrenList;
    }

    /**
     * Parses the animations block in a component.
     * @param {Component's children block} componentChildrenBlock
     * @param {Component's ID} componentID
     */
    parseComponentAnimations(componentAnimationBlock, componentID) {
        var children = componentAnimationBlock.children;

        var childrenID, animationList = [];

        for (var i = 0; i < children.length; i++) {
            childrenID = this.reader.getString(children[i], "id");

            if (this.animations[childrenID] == null)
                return "Component " + componentID + ": Animation " + childrenID + " not previously declared";

            animationList.push(this.animations[childrenID]);
        }

        this.nodes[componentID].animation = animationList;
    }

    /**
     * Parses the transformation block of a component.
     * @param {Component's tranformation block} componentTransformationBlock
     * @param {Component's ID} componentID
     */
    parseComponentTransformation(componentTransformationBlock, componentID) {
        var children = componentTransformationBlock.children;
        var transformationMatrix, xyz;

        for (var i = 0; i < children.length; i++) {
            switch (children[i].nodeName) {
                case "transformationref":
                    var transformationID = this.reader.getString(children[i], "id");

                    if (this.transformations[transformationID] == null)
                        return "Component " + componentID + ": Transformation " + transformationID +
                            " not defined previously";
                    else {
                        if (i == 0)
                            transformationMatrix = this.transformations[transformationID];
                        else
                            mat4.mul(transformationMatrix, transformationMatrix, this.transformations[transformationID]);
                    }


                    break;

                case "translate":

                    if (i == 0)
                        transformationMatrix = mat4.create();

                    xyz = this.parseXYZ(children[i]);

                    if (typeof xyz == "string")
                        return transformationErrorTag + xyz;
                    else
                        mat4.translate(transformationMatrix, transformationMatrix, xyz);

                    break;

                case "scale":

                    if (i == 0)
                        transformationMatrix = mat4.create();

                    xyz = this.parseXYZ(children[i]);

                    if (typeof xyz == "string")
                        return transformationErrorTag + xyz;
                    else
                        mat4.scale(transformationMatrix, transformationMatrix, xyz);

                    break;

                case "rotate":

                    if (i == 0)
                        transformationMatrix = mat4.create();

                    var axis = this.reader.getString(children[i], "axis"),
                        angle = this.reader.getFloat(children[i], "angle");

                    switch (axis) {
                        case "x":
                            axis = [1, 0, 0];
                            break;

                        case "y":
                            axis = [0, 1, 0];
                            break;

                        case "z":
                            axis = [0, 0, 1];
                            break;

                        default:
                            return "Component " + componentID + ": Axis not defined";
                    }

                    if (axis == null || angle == null)
                        return transformationErrorTag + "Rotation not properly defined";

                    mat4.rotate(transformationMatrix, transformationMatrix, angle * DEGREE_TO_RAD, axis);

                    break;

                default:
                    return "Component " + componentID + ": Transformation error";
            }

        }
        this.nodes[componentID].transformations = transformationMatrix;
    }

    /**
     * Parses the materials block in a component.
     * @param {Component's materials block} componentMaterialsBlock
     * @param {Component's ID} componentID
     */
    parseComponentMaterials(componentMaterialsBlock, componentID) {

        var children = componentMaterialsBlock.children;
        var materialID, materialList = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            materialID = this.reader.getString(children[i], "id");

            if (materialID == "inherit")
                materialList.push(materialID);
            else {
                if (this.materials[materialID] == null)
                    return "Component " + componentID + ": Material " + materialID + " not defined previously";
                else
                    materialList.push(this.materials[materialID]);
            }
        }

        this.nodes[componentID].materials = materialList;
    }

    /**
     * Parses the texture tag of a component.
     * @param {Component's texture tag} componentTextureTag
     * @param {Component's id} componentID
     */
    parseComponentTexture(componentTextureTag, componentID) {

        var textureID = this.reader.getString(componentTextureTag, "id");
        var textureSpecs = [];

        if (textureID == "inherit" || (textureID == "none"))
            textureSpecs[0] = textureID;
        else {
            if (this.textures[textureID] == null)
                this.onXMLMinorError("Component " + componentID + ": Texture " + textureID + " not previously defined");
            else
                textureSpecs[0] = this.textures[textureID];
        }

        if (textureID != "none" && this.reader.hasAttribute(componentTextureTag, "length_s") && this.reader.hasAttribute(componentTextureTag, "length_t")) {

            textureSpecs[1] = this.reader.getFloat(componentTextureTag, "length_s");
            textureSpecs[2] = this.reader.getFloat(componentTextureTag, "length_t");

        }

        this.nodes[componentID].texture = textureSpecs;

    }

    /**
     * Returns the XYZ values from a tag
     * @param {Tag containing the XYZ values} tag
     */
    parseXYZ(tag) {

        var xyz = [];

        xyz.push(this.reader.getFloat(tag, "x"));
        xyz.push(this.reader.getFloat(tag, "y"));
        xyz.push(this.reader.getFloat(tag, "z"));

        if (xyz[0] == null || xyz[1] == null || xyz[2] == null) {
            xyz[0] = 0.5;
            xyz[1] = 0.5;
            xyz[2] = 0.5;
            onXMLMinorError("XYZ values not properly defined, assuming values = 0.5");
        } else if (isNaN(xyz[0]) || isNaN(xyz[1]) || isNaN(xyz[2])) {
            xyz[0] = 0.5;
            xyz[1] = 0.5;
            xyz[2] = 0.5;
            onXMLMinorError("XYZ values not properly defined, assuming values = 0.5");
        } else
            return xyz;
    }


    /**
     * Retrieves RGBA components from a generic tag
     * @param {Tag containing RGBA components} tag
     */
    parseRGBA(tag) {

        var colorArray = [];

        //R
        var r = this.reader.getFloat(tag, 'r');

        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)) {
            r = 0.5
            onXMLMinorError("XYZ values not properly defined, assuming r = 0.5");
        }

        // G
        var g = this.reader.getFloat(tag, 'g');

        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1)) {
            g = 0.5
            onXMLMinorError("XYZ values not properly defined, assuming r = 0.5");
        }

        // B
        var b = this.reader.getFloat(tag, 'b');

        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1)) {
            b = 0.5
            onXMLMinorError("XYZ values not properly defined, assuming r = 0.5");
        }

        // A
        var a = this.reader.getFloat(tag, 'a');

        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)) {
            a = 0.5
            onXMLMinorError("XYZ values not properly defined, assuming r = 0.5");
        }

        colorArray[0] = r;
        colorArray[1] = g;
        colorArray[2] = b;
        colorArray[3] = a;

        return colorArray;
    }

    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }
    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        this.displayGraph(this.idRoot, this.nodes[this.idRoot].texture[0], this.nodes[this.idRoot].materials, this.nodes[this.idRoot].texture[1], this.nodes[this.idRoot].texture[0]);
        for (var keys in this.nodes) {
            this.nodes[keys].read = false;

        }
    }

    /**
     * Displays a node
     * @param {Node's ID} nodeID
     * @param {Texture associated} textureInit
     * @param {Material associated} materialInit
     */
    displayGraph(nodeID, textureInit, materialInit, length_s, length_t) {
        var texture, material = materialInit;
        var node;

        if (nodeID != null)
            node = this.nodes[nodeID];
        else
            this.log("Error in node ID");

        this.scene.pushMatrix();

        if (node.materials.length != 0) {

            node.materialIndex = this.counter % node.materials.length;

            switch (node.materials[node.materialIndex]) {
                case "inherit":
                    material = materialInit;
                    break;

                default:
                    material = node.materials[node.materialIndex];
            }

        }

        if (node.texture.length != 0) {

            switch (node.texture[0]) {
                case "inherit":
                    if (textureInit == "none") {
                        texture = textureInit;
                        material.setTexture(null);
                        break;
                    }
                    texture = textureInit;
                    material.setTexture(texture);
                    break;

                case "none":
                    texture = textureInit;
                    material.setTexture(null);
                    break;

                default:
                    texture = node.texture[0];
                    material.setTexture(texture);

                    break;
            }
        }

        if (material != null) {

            material.apply();

        }

        if (node.build != null) {

            node.build.texture = node.texture;
        }

        if (node.transformations != null) {
            this.scene.multMatrix(node.transformations);
        }

        if (node.animation != null) {
            for (var k = 0; k < node.animation.length; k++) {

                if(k > 0) {
                    if(node.animation[k-1].ended == true){
                        node.animation[k].apply();
                    }
                } else node.animation[0].apply();
            }
        }

        for (var i = 0; i < node.children.length; i++) {

            var name = node.children[i];
            var comp = name + "-comp";

            if (node.texture.length == 3) {

                length_s = node.texture[1];
                length_t = node.texture[2];

            }

            if (this.nodes[comp] != null && this.nodes[name].read == false) {
                this.nodes[name].read = true;
                name = comp;

            }

            this.displayGraph(name, texture, material, length_s, length_t);

        }

        if (node.build != null) {

            if ((node.build instanceof MyRectangle || node.build instanceof MyTriangle) && node.texture != null) {

                if (!this.different)
                    node.build.setSAndT(length_s, length_t);
            }

            node.build.display();
        }

        this.different = true;

        this.scene.popMatrix();
    }
}