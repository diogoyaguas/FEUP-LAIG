var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATION_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

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
                    return error;
            } else if (nodeNames[i] == "ortho") {
                error = this.parseOrtho(i, children);
                if (error != null)
                    return error;
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

                position = this.getXYZ(grandChildren[fromIndex]);

            } else this.onXMLError("position undefined'");

            var targetIndex = newNodeNames.indexOf("to");
            if (targetIndex != -1) {

                target = this.getXYZ(grandChildren[targetIndex]);

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

            this.orthoId = this.reader.getString(children[orthoIndex], 'id');

            if (this.views[this.orthoId] != null)
                this.onXMLError("ortho's ID repeated");

            if (this.orthoId == null) {
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

            grandChildren = children[perspectiveIndex].children;

            // Specifications for the current position and target.
            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            var position, target;
            var fromIndex = newNodeNames.indexOf("from");
            if (fromIndex != -1) {

                position = this.getXYZ(grandChildren[fromIndex]);

            } else this.onXMLError("position undefined'");

            var targetIndex = newNodeNames.indexOf("to");
            if (targetIndex != -1) {

                target = this.getXYZ(grandChildren[targetIndex]);

            } else this.onXMLError("target undefined'");

            this.views[this.orthoId] = [near, far, left, rigth, top, bottom, position, target];
            this.views[this.orthoId].type = "ortho";

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
        var error;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for (i = 0; i < children.length; i++) {
            if (nodeNames[i] == "ambient") {
                error = this.parseAmbient(i, children);
                if (error != null)
                    return error;
            } else if (nodeNames[i] == "background") {
                error = this.parseBackground(i, children);
                if (error != null)
                    return error;
            } else return "Inapropriate tag name in ambient";
        }

        this.globalAmbient = this.ambient;

        this.log("Parsed ambient block");

        return null;

    }

	/**
	 * Parses the <ambient> component
	 *  @param {Ambient index} ambientIndex
	 *  @param {Children of Ambient, Omni, Spot and Material} children
	 */
    parseAmbient(ambientIndex, children) {

        // Retrieves the ambient.
        this.ambient = [];
        if (ambientIndex != -1) {

            this.ambient = this.retrieveColor(children[ambientIndex], "ambient")

            return null;

        }

        return -1;
    }

	/**
	 * Parses the <background> component
	 *  @param {Background index} backgroundIndex
	 *  @param {Children of Ambient} children
	 */
    parseBackground(backgroundIndex, children) {

        // Retrieves the background.
        this.background = [];
        if (backgroundIndex != -1) {

            this.background = this.retrieveColor(children[backgroundIndex], "background")

            return null;

        }

        return -1;
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
                    return error;
            } else if (nodeNames[i] == "spot") {
                error = this.parseSpot(i, children);
                if (error != null)
                    return error;
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
                    error = this.parseAmbient(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "diffuse") {
                    error = this.parseDiffuse(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "specular") {
                    error = this.parseSpecular(i, grandChildren);
                    if (error != null)
                        return error;
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
                    error = this.parseTarget(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "ambient") {
                    error = this.parseAmbient(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "diffuse") {
                    error = this.parseDiffuse(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "specular") {
                    error = this.parseSpecular(i, grandChildren);
                    if (error != null)
                        return error;
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

            this.location = this.getXYZ(grandChildren[locationIndex]);

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
	 * Parses the <diffuse> component
	 * @param {Diffuse index} DiffuseIndex
	 * @param {Children of Omni, Spot and Material} children
	 */
    parseDiffuse(diffuseIndex, grandChildren) {

        // Retrieves the diffuse.
        if (diffuseIndex != -1) {

            this.diffuse = this.retrieveColor(grandChildren[diffuseIndex], "diffuse");

            return null;

        }

        return -1;
    }

	/**
	 * Parses the <specular> component
	 * @param {Specular index} specularIndex
	 * @param {Children of Omni, Spot and Material} children
	 */
    parseSpecular(specularIndex, grandChildren) {

        // Retrieves the specular.
        if (specularIndex != -1) {

            this.specular = this.retrieveColor(grandChildren[specularIndex], "specular");

            return null;

        }

        return -1;
    }

	/**
	 * Parses the <target> component
	 * @param {Target index} targetIndex
	 * @param {Children of Spot} children
	 */
    parseTarget(targetIndex, grandChildren) {

        // Retrieves the target.
        if (targetIndex != -1) {

            this.target = this.getXYZ(grandChildren[targetIndex]);

            return null;

        }

        return null;
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

        var error;

        var children = materialsNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for (i = 0; i < children.length; i++) {

            // Retrieves the materials.
            var materialsIndex = nodeNames.indexOf("material");
            if (materialsIndex != -1) {

                var materialsId = this.reader.getString(children[materialsIndex], 'id');
                if (materialsId == null) {
                    this.onXMLError("no ID defined for materials");
                }

                if (this.materials[materialsId] != null)
                    this.onXMLError("materials' ID must be different");

                var shininess = this.reader.getFloat(children[materialsIndex], 'shininess');
                if (shininess == null || shininess <= 0 || isNaN(shininess)) {
                    this.shininess = 10.0
                    this.onXMLMinorError("no valid shininess value, assuming shininess = 10");
                }

                var grandChildren = [];
                var newNodeNames = [];

                grandChildren = children[materialsIndex].children;

                for (var j = 0; j < grandChildren.length; j++) {
                    newNodeNames.push(grandChildren[j].nodeName);
                }

                for (i = 0; i < grandChildren.length; i++) {

                    if (newNodeNames[i] == "emission") {
                        error = this.parseEmission(i, grandChildren);
                        if (error != null)
                            return error;
                    } else if (newNodeNames[i] == "ambient") {
                        error = this.parseAmbient(i, grandChildren);
                        if (error != null)
                            return error;
                    } else if (newNodeNames[i] == "diffuse") {
                        error = this.parseDiffuse(i, grandChildren);
                        if (error != null)
                            return error;
                    } else if (newNodeNames[i] == "specular") {
                        error = this.parseSpecular(i, grandChildren);
                        if (error != null)
                            return error;
                    } else return "Inapropriate tag name in materials";

                }

                this.materials[materialsId] = [shininess, this.materialEmission, this.ambient, this.diffuse, this.specular];

                this.log("Parsed material");

            }

        }

        this.log("Parsed materials block");

        return null;

    }

	/**
	 * Parses the <emission> component
	 * @param {Emission index} emissionIndex
	 * @param {Children of Material} children
	 */
    parseEmission(emissionIndex, grandChildren) {

        // Retrieves the emission.
        this.materialEmission = [];
        if (emissionIndex != -1) {

            this.materialEmission = this.retrieveColor(grandChildren[emissionIndex]);

            return null;

        }

        return -1;
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
                        var xyz = this.getXYZ(grandChildren[i]);

                        mat4.translate(this.transformations[this.transformationsId], this.transformations[this.transformationsId],
                            xyz);

                        break;

                    case "scale":
                        var xyz = this.getXYZ(grandChildren[i]);

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
                    return error;
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

            default:
                return "Tag not identified on primitive " + primitiveID;
        }

        this.nodes[primitiveID] = new MyNode(build, primitiveID);

    }
	/**
	 * Processes the components node
	 * @param {Components node} componentsNode
	 */
    parseComponents(componentsNode) {
        var children = componentsNode.children;
        var componentID;

        //First pass - Merely add them to the list
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            componentID = this.reader.getString(children[i], "id");

            if (this.nodes[componentID] != null)
                return "ID must be unique for each transformation (conflict: ID = " + componentID + ")";
            else
                this.nodes[componentID] = new MyNode(null, componentID);
        }

        if (this.nodes[this.idRoot] == null)
            return "Root element isn't present in components";
        else
            this.root = this.nodes[this.idRoot];


        //Second pass - analyze & parse remaining details

        for (let i = 0; i < children.length; i++) {
            let error = this.parseComponent(children[i]);

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
        var i, nodeNames = [],
            index;
        var tranformationMatrix, materialList = [],
            textureSpecs = [],
            childrenList = [];
        var componentID = this.reader.getString(componentBlock, "id");

        for (i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        index = nodeNames.indexOf("transformation");

        if (index == null)
            return "No transformation tag present in component " + componentID;

        if (typeof (tranformationMatrix = this.parseComponentTransformation(children[index], componentID)) == "string")
            return tranformationMatrix;

        index = nodeNames.indexOf("materials");

        if (index == null)
            return "No materials tag present in component " + componentID;

        if (typeof (materialList = this.parseComponentMaterials(children[index], componentID)) == "string")
            return materialList;

        index = nodeNames.indexOf("texture");

        if (index == null)
            return "No texture tag present in component: " + componentID;

        if (typeof (textureSpecs = this.parseComponentTexture(children[index], componentID)) == "string")
            return textureSpecs;

        index = nodeNames.indexOf("children");

        if (index == null)
            return "No children tag present in component: " + componentID;

        if (typeof (childrenList = this.parseComponentChildren(children[index], componentID)) == "string")
            return childrenList;
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

        for (let i = 0; i < children.length; i++) {
            childrenID = this.reader.getString(children[i], "id");

            if (this.nodes[childrenID] == null)
                return "Component " + componentID + ": Children " + childrenID + " not previously declared";

            childrenList.push(childrenID);
        }

        this.nodes[componentID].children = childrenList;
    }

	/**
	 * Parses the transformation block of a component.
	 * @param {Component's tranformation block} componentTransformationBlock
	 * @param {Component's ID} componentID
	 */
    parseComponentTransformation(componentTransformationBlock, componentID) {
        var children = componentTransformationBlock.children;
        var transformationMatrix, xyz;

        for (let i = 0; i < children.length; i++) {
            switch (children[i].nodeName) {
                case "transformationref":
                    let transformationID = this.reader.getString(children[i], "id");

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

                    xyz = this.getXYZ(children[i]);

                    if (typeof xyz == "string")
                        return transformationErrorTag + xyz;
                    else
                        mat4.translate(transformationMatrix, transformationMatrix, xyz);

                    break;

                case "scale":

                    if (i == 0)
                        transformationMatrix = mat4.create();

                    xyz = this.getXYZ(children[i]);

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

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            materialID = this.reader.getString(children[i], "id");

            if (materialID == "inherit" || this.materials[materialID] != null)
                materialList.push(this.materials[materialID]);
            else
                return "Component " + componentID + ": Material " + materialID +
                    " not defined previously";
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

        if (textureID == "inherit" || textureID == "none")
            textureSpecs.push(textureID);
        else {
            if (this.textures[textureID] == null)
                return "Component " + componentID + ": Texture " + textureID + " not previously defined";
            else
                textureSpecs.push(this.textures[textureID]);
        }

        textureSpecs.push(this.reader.getFloat(componentTextureTag, "length_s"));
        textureSpecs.push(this.reader.getFloat(componentTextureTag, "length_t"));

        this.nodes[componentID].texture = textureSpecs;
    }

	/**
	 * Returns the XYZ values from a tag
	 * @param {the tag containing the XYZ values} tag
	 */
    getXYZ(tag) {
        var xyz = [];

        xyz.push(this.reader.getFloat(tag, "x"));
        xyz.push(this.reader.getFloat(tag, "y"));
        xyz.push(this.reader.getFloat(tag, "z"));

        if (xyz[0] == null || xyz[1] == null || xyz[2] == null)
            onXMLMinorError("XYZ values not properly defined");
        else if (isNaN(xyz[0]) || isNaN(xyz[1]) || isNaN(xyz[2]))
            onXMLMinorError("XYZ values not properly defined");
        else
            return xyz;
    }


	/**
	 * Retrieves RGBA components from a generic tag
	 * @param {Tag containing RGBA components} tag
	 * @param {Object ID} ID
	 */
    retrieveColor(tag, ID) {
        var colorArray = [];

        //R
        var r = this.reader.getFloat(tag, 'r');

        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component for " + ID;
        else
            colorArray[0] = r;

        // G
        var g = this.reader.getFloat(tag, 'g');

        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component for " + ID;
        else
            colorArray[1] = g;

        // B
        var b = this.reader.getFloat(tag, 'b');

        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component for " + ID;
        else
            colorArray[2] = b;

        // A
        var a = this.reader.getFloat(tag, 'a');

        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component for " + ID;
        else
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

        this.displayGraph(this.idRoot, this.nodes[this.idRoot].texture[0], this.nodes[this.idRoot].materials);
    }

	/**
	 * Displays a node
	 * @param {Node's ID} nodeID
	 * @param {Texture associated} textureInit
	 * @param {Material associated} materialInit
	 */
    displayGraph(nodeID, textureInit, materialInit) {
        var texture, material = materialInit;
        var node;

        if (nodeID != null)
            node = this.nodes[nodeID];
        else
            this.log("Error in node ID");

        this.scene.pushMatrix();

        if (node.texture.length != 0) {
            switch (node.texture[0]) {
                case "inherit":
                    texture = textureInit;
                    break;

                case "none":
                    texture = textureInit;
                    break;

                default:
                    texture = node.texture[0];
                    break;
            }


        }

        if (node.materials.length != 0)
            material = node.materials;

        if (node.transformations != null) {
            this.scene.multMatrix(node.transformations);
        }

        for (let i = 0; i < node.children.length; i++) {
            this.displayGraph(node.children[i], texture, material);
        }

        if (node.build != null) {
            node.build.display();
        }

        this.scene.popMatrix();
    }
}