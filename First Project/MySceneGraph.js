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
     */
    parseScene(sceneNode) {

        this.root = this.reader.getString(sceneNode, 'root');
        this.axisLength = this.reader.getFloat(sceneNode, 'axis_length');

        if (this.root == null) {
            this.onXMLMinorError("no ID defined for scene'");
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
     */
    parseViews(viewsNode) {

        this.views = new Array();
        var error;

        this.default = this.reader.getString(viewsNode, 'default');

        if (this.default == null) {
            this.onXMLMinorError("no ID defined for view");
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
            } else return "Inapropriate tag name in views";
        }

        this.log("Parsed views block");

        return null;
    }

    parsePerspective(perspectiveIndex, children) {

        // Retrieves the perspective.
        if (perspectiveIndex != -1) {

            this.perspectiveId = this.reader.getString(children[perspectiveIndex], 'id');
            if (this.perspectiveId == null) {
                this.onXMLMinorError("no ID defined for perspective");
            }

            this.near = this.reader.getFloat(children[perspectiveIndex], 'near');
            this.far = this.reader.getFloat(children[perspectiveIndex], 'far');
            this.angle = this.reader.getFloat(children[perspectiveIndex], 'angle');
            if (this.near == null || this.far == null || this.angle == null) {
                this.near = 0.1;
                this.far = 500;
                this.angle = 45;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
                this.onXMLMinorError("unable to parse value for angle plane; assuming 'angle = 45'");
            } else if (isNaN(this.near) || isNaN(this.far) || isNaN(this.angle)) {
                this.near = 0.1;
                this.far = 500;
                this.angle = 45;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
                this.onXMLMinorError("unable to parse value for angle plane; assuming 'angle = 45'");
            } else if (this.near <= 0 || this.angle <= 0) {
                this.near = 0.1;
                this.angle = 45;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
                this.onXMLMinorError("unable to parse value for angle plane; assuming 'angle = 45'");
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[perspectiveIndex].children;
            // Specifications for the current position and target.

            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            var fromIndex = newNodeNames.indexOf("from");
            this.position = [];
            if (fromIndex != -1) {

                this.x = this.reader.getFloat(grandChildren[fromIndex], 'x');
                this.y = this.reader.getFloat(grandChildren[fromIndex], 'y');
                this.z = this.reader.getFloat(grandChildren[fromIndex], 'z');

                if (!(this.x != null || !isNaN(this.x))) {
                    this.x = 25;
                    return "unable to parse x-coordinate of the position, assuming x = 25'";
                } else
                    this.position[0] = this.x;

                if (!(this.y != null || !isNaN(this.y))) {
                    this.y = 25;
                    return "unable to parse y-coordinate of the position, assuming y = 25'";
                } else
                    this.position[1] = this.y;

                if (!(this.z != null || !isNaN(this.z))) {
                    return "unable to parse z-coordinate of the position, assuming z = 25'";
                } else
                    this.position[2] = this.z;
            } else this.onXMLMinorError("position undefined'");

            var targetIndex = newNodeNames.indexOf("to");
            this.target = [];
            if (targetIndex != -1) {

                this.x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                this.y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                this.z = this.reader.getFloat(grandChildren[targetIndex], 'z');

                if (!(this.x != null || !isNaN(this.x))) {
                    this.x = 25;
                    return "unable to parse x-coordinate of the target, assuming x = 25'";
                } else
                    this.target[0] = this.x;

                if (!(this.y != null || !isNaN(this.y))) {
                    this.y = 25;
                    return "unable to parse y-coordinate of the target, assuming y = 25'";
                } else
                    this.target[1] = this.y;

                if (!(this.z != null || !isNaN(this.z))) {
                    return "unable to parse z-coordinate of the target, assuming z = 25'";
                } else
                    this.target[2] = this.z;
            } else this.onXMLMinorError("target undefined'");

            var perspective = new CGFcamera(this.angle, this.near, this.far, this.position, this.target);
            this.views[this.perspectiveId] = perspective;

            this.log("Parsed perspective");

            return null;

        }

        return -1;

    }

    parseOrtho(orthoIndex, children) {

        // Retrieves the ortho.
        if (orthoIndex != -1) {

            this.orthoId = this.reader.getString(children[orthoIndex], 'id');
            if (this.perspectiveId == null) {
                this.onXMLMinorError("no ID defined for ortho'");
            }

            this.near = this.reader.getFloat(children[orthoIndex], 'near');
            this.far = this.reader.getFloat(children[orthoIndex], 'far');
            this.left = this.reader.getFloat(children[orthoIndex], 'left');
            this.rigth = this.reader.getFloat(children[orthoIndex], 'right');
            this.top = this.reader.getFloat(children[orthoIndex], 'top');
            this.bottom = this.reader.getFloat(children[orthoIndex], 'bottom');
            /*if (this.near == null || this.far == null || this.left == null || this.rigth == null || this.top == null || this.bottom == null) {
                this.near = 0.1;
                this.far = 500;
                this.left = 5;
                this.rigth = 5;
                this.top = 5;
                this.bottom = 5;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
                this.onXMLMinorError("unable to parse value for left plane; assuming 'left = 5'");
                this.onXMLMinorError("unable to parse value for rigth plane; assuming 'rigth = 5'");
                this.onXMLMinorError("unable to parse value for top plane; assuming 'top = 5'");
                this.onXMLMinorError("unable to parse value for bottom plane; assuming 'bottom = 5'");
            } else if (isNaN(this.near) || isNaN(this.far) || isNaN(this.left) || isNan(this.rigth) || isNan(this.top) || isNan(this.bottom)) {
                this.near = 0.1;
                this.far = 500;
                this.left = 5;
                this.rigth = 5;
                this.top = 5;
                this.bottom = 5;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
                this.onXMLMinorError("unable to parse value for left plane; assuming 'left = 5'");
                this.onXMLMinorError("unable to parse value for rigth plane; assuming 'rigth = 5'");
                this.onXMLMinorError("unable to parse value for top plane; assuming 'top = 5'");
                this.onXMLMinorError("unable to parse value for bottom plane; assuming 'bottom = 5'");
            } else if (this.near <= 0) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            }*/

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";

            this.log("Parsed ortho");

            return null;
        }

        return -1;
    }

    /**
     * Parses the <ambient> block.
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

    parseAmbient(ambientIndex, children) {

        // Retrieves the ambient.
        this.ambient = [];
        if (ambientIndex != -1) {

            this.r = this.reader.getFloat(children[ambientIndex], 'r');
            this.g = this.reader.getFloat(children[ambientIndex], 'g');
            this.b = this.reader.getFloat(children[ambientIndex], 'b');
            this.a = this.reader.getFloat(children[ambientIndex], 'a');
            if (this.r == null || this.g == null || this.b == null || this.a == null) {
                this.r = 1;
                this.g = 1;
                this.b = 1;
                this.a = 1;
                this.onXMLMinorError("unable to parse r component; assuming 'r = 1'");
                this.onXMLMinorError("unable to parse g component assuming 'g = 1'");
                this.onXMLMinorError("unable to parse b component; assuming 'b = 1'");
                this.onXMLMinorError("unable to parse a component; assuming 'a = 1'");
            }
            if (!(this.r >= 0 && this.r <= 1))
                return "unable to parse r component"
            else
                this.ambient[0] = this.r;
            if (!(this.g >= 0 && this.g <= 1))
                return "unable to parse g component"
            else
                this.ambient[1] = this.g;
            if (!(this.b >= 0 && this.b <= 1))
                return "unable to parse b component"
            else
                this.ambient[2] = this.b;
            if (!(this.a >= 0 && this.a <= 1))
                return "unable to parse a component"
            else
                this.ambient[3] = this.a;

            this.log("Parsed ambient");

            return null;

        }

        return -1;
    }

    parseBackground(backgroundIndex, children) {

        // Retrieves the background.
        this.background = [];
        if (backgroundIndex != -1) {

            this.r = this.reader.getFloat(children[backgroundIndex], 'r');
            this.g = this.reader.getFloat(children[backgroundIndex], 'g');
            this.b = this.reader.getFloat(children[backgroundIndex], 'b');
            this.a = this.reader.getFloat(children[backgroundIndex], 'a');
            if (this.r == null || this.g == null || this.b == null || this.a == null) {
                this.r = 1;
                this.g = 1;
                this.b = 1;
                this.a = 1;
                this.onXMLMinorError("unable to parse r component; assuming 'r = 1'");
                this.onXMLMinorError("unable to parse g component assuming 'g = 1'");
                this.onXMLMinorError("unable to parse b component; assuming 'b = 1'");
                this.onXMLMinorError("unable to parse a component; assuming 'a = 1'");
            }
            if (!(this.r >= 0 && this.r <= 1))
                return "unable to parse r component"
            else
                this.background[0] = this.r;
            if (!(this.g >= 0 && this.g <= 1))
                return "unable to parse g component"
            else
                this.background[1] = this.g;
            if (!(this.b >= 0 && this.b <= 1))
                return "unable to parse b component"
            else
                this.background[2] = this.b;
            if (!(this.a >= 0 && this.a <= 1))
                return "unable to parse a component"
            else
                this.background[3] = this.a;

            this.log("Parsed background");

            return null;

        }

        return -1;
    }

    /**
     * Parses the <lights> block.
     */
    parseLights(lightsNode) {

        this.lights = new Array();

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

    parseOmni(omniIndex, children) {

        var error;
        this.omniLights = [];

        // Retrieves the omni.
        if (omniIndex != -1) {

            this.omniId = this.reader.getString(children[omniIndex], 'id');
            for (var j = 0; j < this.omniLights.length; j++)
                if (this.omniLights[j] == this.omniId)
                    this.onXMLMinorError("id repeated");
            if (this.omniId == null) {
                this.onXMLMinorError("no ID defined for omni");
            }

            this.omniLights.push(this.omniId);

            this.enabled = this.reader.getBoolean(children[omniIndex], 'enabled');
            if (this.enabled != 0 && this.enabled != 1) {
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

            this.lights[this.omniId] = [this.enabled, this.location, this.ambient, this.diffuse, this.specular];

            this.log("Parsed omni");

            return null;
        }

        return -1;

    }

    parseLocation(locationIndex, grandChildren) {

        // Retrieves the location.
        this.location = [];
        if (locationIndex != -1) {

            this.x = this.reader.getFloat(grandChildren[locationIndex], 'x');
            this.y = this.reader.getFloat(grandChildren[locationIndex], 'y');
            this.z = this.reader.getFloat(grandChildren[locationIndex], 'z');
            this.w = this.reader.getFloat(grandChildren[locationIndex], 'w');

            if (!(this.x != null || !isNaN(this.x))) {
                this.x = 25;
                return "unable to parse x-coordinate of the position, assuming x = 25'";
            } else
                this.location[0] = this.x;

            if (!(this.y != null || !isNaN(this.y))) {
                this.y = 25;
                return "unable to parse y-coordinate of the position, assuming y = 25'";
            } else
                this.location[1] = this.y;

            if (!(this.z != null || !isNaN(this.z))) {
                return "unable to parse z-coordinate of the position, assuming z = 25'";
            } else
                this.location[2] = this.z;
            if (!(this.w != null || !isNaN(this.w))) {
                this.w = 25;
                return "unable to parse homogeneous-coordinate of the position, assuming w = 25'";
            } else
                this.location[3] = this.w;

            this.log("Parsed location");

            return null;
        }

        return -1;
    }

    parseDiffuse(diffuseIndex, grandChildren) {

        // Retrieves the diffuse.
        this.diffuse = [];
        if (diffuseIndex != -1) {

            var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
            var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
            var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
            var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
            if (this.r == null || this.g == null || this.b == null || this.a == null) {
                this.r = 1;
                this.g = 1;
                this.b = 1;
                this.a = 1;
                this.onXMLMinorError("unable to parse r component; assuming 'r = 1'");
                this.onXMLMinorError("unable to parse g component assuming 'g = 1'");
                this.onXMLMinorError("unable to parse b component; assuming 'b = 1'");
                this.onXMLMinorError("unable to parse a component; assuming 'a = 1'");
            }
            if (!(this.r >= 0 && this.r <= 1))
                return "unable to parse r component"
            else
                this.diffuse[0] = this.r;
            if (!(this.g >= 0 && this.g <= 1))
                return "unable to parse g component"
            else
                this.diffuse[1] = this.g;
            if (!(this.b >= 0 && this.b <= 1))
                return "unable to parse b component"
            else
                this.diffuse[2] = this.b;
            if (!(this.a >= 0 && this.a <= 1))
                return "unable to parse a component"
            else
                this.diffuse[3] = this.a;

            this.log("Parsed diffuse");

            return null;

        }

        return -1;
    }

    parseSpecular(specularIndex, grandChildren) {

        // Retrieves the specular.
        this.specular = [];
        if (specularIndex != -1) {

            this.r = this.reader.getFloat(grandChildren[specularIndex], 'r');
            this.g = this.reader.getFloat(grandChildren[specularIndex], 'g');
            this.b = this.reader.getFloat(grandChildren[specularIndex], 'b');
            this.a = this.reader.getFloat(grandChildren[specularIndex], 'a');
            if (this.r == null || this.g == null || this.b == null || this.a == null) {
                this.r = 1;
                this.g = 1;
                this.b = 1;
                this.a = 1;
                this.onXMLMinorError("unable to parse r component; assuming 'r = 1'");
                this.onXMLMinorError("unable to parse g component assuming 'g = 1'");
                this.onXMLMinorError("unable to parse b component; assuming 'b = 1'");
                this.onXMLMinorError("unable to parse a component; assuming 'a = 1'");
            }
            if (!(this.r >= 0 && this.r <= 1))
                return "unable to parse r component"
            else
                this.specular[0] = this.r;
            if (!(this.g >= 0 && this.g <= 1))
                return "unable to parse g component"
            else
                this.specular[1] = this.g;
            if (!(this.b >= 0 && this.b <= 1))
                return "unable to parse b component"
            else
                this.specular[2] = this.b;
            if (!(this.a >= 0 && this.a <= 1))
                return "unable to parse a component"
            else
                this.specular[3] = this.a;

            this.log("Parsed specular");

            return null;

        }

        return -1;
    }

    parseSpot(spotIndex, children) {

        var error;
        this.spotLights = [];

        // Retrieves the spot.
        if (spotIndex != -1) {

            this.spotId = this.reader.getString(children[spotIndex], 'id');
            for (var j = 0; j < this.spotLights.length; j++)
                if (this.spotLights[j] == this.spotId)
                    this.onXMLMinorError("id repeated");
            if (this.omniId == null) {
                this.onXMLMinorError("no ID defined for spot");
            }
            this.spotLights.push(this.spotId);

            this.enabled = this.reader.getFloat(children[spotIndex], 'enabled');
            if (this.enabled != 0 && this.enabled != 1) {
                this.onXMLMinorError("no enabled defined for spot");
            }

            this.angle = this.reader.getFloat(children[this.spotId], 'angle');
            if (this.angle < 0) {
                this.onXMLMinorError("no angle defined for spot");
            }

            this.exponent = this.reader.getFloat(children[this.spotId], 'exponent');
            if (this.exponent < 0) {
                this.onXMLMinorError("no angle defined for spot");
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

            this.log("Parsed spot");

            return null;
        }

        return -1;

    }

    parseTarget(targetIndex, grandChildren) {

        // Retrieves the target.
        this.ligthTarget = [];
        if (targetIndex != -1) {

            this.x = this.reader.getFloat(grandChildren[targetIndex], 'x');
            this.y = this.reader.getFloat(grandChildren[targetIndex], 'y');
            this.z = this.reader.getFloat(grandChildren[targetIndex], 'z');

            if (!(this.x != null || !isNaN(this.x))) {
                this.x = 25;
                return "unable to parse x-coordinate of the position, assuming x = 25'";
            } else
                this.ligthTarget[0] = this.x;

            if (!(this.y != null || !isNaN(this.y))) {
                this.y = 25;
                return "unable to parse y-coordinate of the position, assuming y = 25'";
            } else
                this.ligthTarget[1] = this.y;

            if (!(this.z != null || !isNaN(this.z))) {
                return "unable to parse z-coordinate of the position, assuming z = 25'";
            } else
                this.ligthTarget[2] = this.z;

            this.log("Parsed target");

            return null;

        }

        return null;
    }

    /**
     * Parses the <textures> block.
     */
    parseTextures(texturesNode) {

        this.textures = [];

        var children = texturesNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        for (i = 0; i < children.length; i++) {

            // Retrieves the textures.
            var texturesIndex = nodeNames.indexOf("textures");
            if (texturesIndex != -1) {

                this.texturesId = this.reader.getString(children[texturesIndex], 'id');
                if (this.texturesId == null) {
                    this.onXMLMinorError("no ID defined for textures");
                }

                for (var j = 0; j < this.textures.length; j++)
                    if (this.textures[j] == textureID)
                        this.onXMLMinorError("texture ID must be different");
                this.textures.push(this.texturesId);

                this.texturesFile = this.reader.getString(children[texturesIndex], 'file');
                if (this.texturesFile == null) {
                    this.onXMLMinorError("no File found");
                }
            }

        }

        this.log("Parsed texture block");

        return null;

    }

    /**
     * Parses the <materials> block.
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

                this.materialsId = this.reader.getString(children[materialsIndex], 'id');
                if (this.materialsId == null) {
                    this.onXMLMinorError("no ID defined for materials");
                }

                for (var j = 0; j < this.materials.length; j++)
                    if (this.materials[j] == materialsID)
                        this.onXMLMinorError("materials ID must be different");
                this.materials.push(this.materialsId);

                this.shininess = this.reader.getFloat(children[materialsIndex], 'shininess');
                if (this.shininess == null || this.shininess < 0 || this.shininess > 1 || isNaN(this.shininess)) {
                    this.onXMLMinorError("no valid shininess value");
                }
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

        }

        this.log("Parsed materials block");

        return null;

    }

    parseEmission(emissionIndex, grandChildren) {

        // Retrieves the emission.
        this.materialEmission = [];
        if (emissionIndex != -1) {

            this.r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
            this.g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
            this.b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
            this.a = this.reader.getFloat(grandChildren[emissionIndex], 'a');
            if (this.r == null || this.g == null || this.b == null || this.a == null) {
                this.r = 1;
                this.g = 1;
                this.b = 1;
                this.a = 1;
                this.onXMLMinorError("unable to parse r component; assuming 'r = 1'");
                this.onXMLMinorError("unable to parse g component assuming 'g = 1'");
                this.onXMLMinorError("unable to parse b component; assuming 'b = 1'");
                this.onXMLMinorError("unable to parse a component; assuming 'a = 1'");
            }
            if (!(this.r >= 0 && this.r <= 1))
                return "unable to parse r component"
            else
                this.materialEmission[0] = this.r;
            if (!(this.g >= 0 && this.g <= 1))
                return "unable to parse g component"
            else
                this.materialEmission[1] = this.g;
            if (!(this.b >= 0 && this.b <= 1))
                return "unable to parse b component"
            else
                this.materialEmission[2] = this.b;
            if (!(this.a >= 0 && this.a <= 1))
                return "unable to parse a component"
            else
                this.materialEmission[3] = this.a;

            this.log("Parsed emission");

            return null;

        }

        return -1;
    }

    /**
     * Parses the <transformations> block.
     */
    parseTransformations(transformationsNode) {

        this.transformations = [];
        var error;

        var children = transformationsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Retrieves the transformations.
        var transformationsIndex = nodeNames.indexOf("transformation");

        if (transformationsIndex != -1) {

            this.transformationsId = this.reader.getString(children[transformationsIndex], 'id');

            if (this.transformationsId == null) {
                this.onXMLMinorError("no ID defined for transformations");
            }

            for (var j = 0; j < this.transformations.length; j++)
                if (this.transformations[j] == transformationsID)
                    this.onXMLMinorError("transformations ID must be different");

            this.transformations.push(this.transformationsId);

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[transformationsIndex].children;

            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            for (var i = 0; i < grandChildren.length; i++) {

                if (newNodeNames[i] == "translate") {
                    error = this.parseTranslate(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "rotate") {
                    error = this.parseRotate(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "scale") {
                    error = this.parseScale(i, grandChildren);
                    if (error != null)
                        return error;
                } else return "Inapropriate tag name in spot";

            }

            this.log("Parsed transformation");

        }


        this.log("Parsed transformations block");

        return null;

    }

    parseTranslate(translateIndex, grandChildren) {

        // Retrieves the translate.
        this.translateV = [];

        if (translateIndex != -1) {

            this.x = this.reader.getFloat(grandChildren[translateIndex], 'x');
            this.y = this.reader.getFloat(grandChildren[translateIndex], 'y');
            this.z = this.reader.getFloat(grandChildren[translateIndex], 'z');

            if (!(this.x != null || !isNaN(this.x))) {
                this.x = 25;
                return "unable to parse x-coordinate of the position, assuming x = 25'";
            } else
                this.translateV[0] = this.x;
            if (!(this.y != null || !isNaN(this.y))) {
                this.y = 25;
                return "unable to parse y-coordinate of the position, assuming y = 25'";
            } else
                this.translateV[1] = this.y;
            if (!(this.z != null || !isNaN(this.z))) {
                return "unable to parse z-coordinate of the position, assuming z = 25'";
            } else
                this.translateV[2] = this.z;

            this.log("Parsed translate");

            return null;

        } else this.onXMLMinorError("translate undefined'");

        return -1;

    }

    parseRotate(rotateIndex, grandChildren) {

        // Retrieves the rotate.
        this.rotateV = [];

        if (rotateIndex != -1) {

            this.axis = this.reader.getString(grandChildren[rotateIndex], 'axis');
            this.angle = this.reader.getFloat(grandChildren[rotateIndex], 'angle');

            if (this.angle < 0) {
                this.onXMLMinorError("invalid angle for rotation");
            }

            if (this.axis != 'x' && this.axis != 'y' && this.axis != 'z') {
                this.onXMLMinorError("invalid axis for rotation");
            }

            this.log("Parsed rotate");

            return null;

        } else this.onXMLMinorError("rotate undefined'");

        return -1;

    }

    parseScale(scaleIndex, grandChildren) {

        // Retrieves the scale.
        this.scaleV = [];

        if (scaleIndex != -1) {

            this.x = this.reader.getFloat(grandChildren[scaleIndex], 'x');
            this.y = this.reader.getFloat(grandChildren[scaleIndex], 'y');
            this.z = this.reader.getFloat(grandChildren[scaleIndex], 'z');

            if (!(this.x != null || !isNaN(this.x))) {
                this.x = 25;
                return "unable to parse x-coordinate of the position, assuming x = 25'";
            } else
                this.scaleV[0] = this.x;

            if (!(this.y != null || !isNaN(this.y))) {
                this.y = 25;
                return "unable to parse y-coordinate of the position, assuming y = 25'";
            } else
                this.scaleV[1] = this.y;

            if (!(this.z != null || !isNaN(this.z))) {
                return "unable to parse z-coordinate of the position, assuming z = 25'";
            } else
                this.scaleV[2] = this.z;

            this.log("Parsed scale");

            return null;

        } else this.onXMLMinorError("scale undefined'");

        return -1;
    }

    /**
     * Parses the <primitives> block.
     */
    parsePrimitives(primitivesNode) {

        this.primitives = [];
        this.rectangles = [];
        this.triangles = [];
        this.cylinders = [];
        this.spheres = [];
        this.torus = [];

        var error;

        var children = primitivesNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Retrieves the primitives.
        var primitiveIndex = nodeNames.indexOf("primitive");

        if (primitiveIndex != -1) {

            this.primitiveId = this.reader.getString(children[primitiveIndex], 'id');

            if (this.primitiveId == null) {
                this.onXMLMinorError("no ID defined for primitive");
            }

            for (var j = 0; j < this.primitives.length; j++)
                if (this.primitives[j] == primitiveID)
                    this.onXMLMinorError("transformations ID must be different");

            this.primitives.push(this.transformationsId);

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[primitiveIndex].children;

            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            for (var i = 0; i < grandChildren.length; i++) {

                if (newNodeNames[i] == "rectangle") {
                    error = this.parseRectangle(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "triangle") {
                    error = this.parseTriangle(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "cylinder") {
                    error = this.parseCylinder(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "sphere") {
                    error = this.parseSphere(i, grandChildren);
                    if (error != null)
                        return error;
                } else if (newNodeNames[i] == "torus") {
                    error = this.parseTorus(i, grandChildren);
                    if (error != null)
                        return error;
                } else return "Inapropriate tag name in transformation";

            }

            this.log("Parsed primitive");

        }

        this.log("Parsed primitives block");

        return null;

    }

    parseRectangle(rectangleIndex, grandChildren) {

        // Retrieves the rectangle.

        if (rectangleIndex != -1) {

            this.x1 = this.reader.getFloat(grandChildren[rectangleIndex], 'x1');
            this.y1 = this.reader.getFloat(grandChildren[rectangleIndex], 'y1');
            this.x2 = this.reader.getFloat(grandChildren[rectangleIndex], 'x2');
            this.y2 = this.reader.getFloat(grandChildren[rectangleIndex], 'y2');

            if (!(this.x1 != null || !isNaN(this.x1))) {
                this.x1 = 1;
                return "unable to parse x1-coordinate of the position, assuming x1 = 1'";
            }
            if (!(this.y1 != null || !isNaN(this.y1))) {
                this.y1 = 1;
                return "unable to parse y1-coordinate of the position, assuming y1 = 1'";
            }
            if (!(this.x2 != null || !isNaN(this.x2))) {
                this.x2 = 1;
                return "unable to parse x2-coordinate of the position, assuming x2 = 1'";
            }
            if (!(this.y2 != null || !isNaN(this.y2))) {
                return "unable to parse x2-coordinate of the position, assuming y2 = 1'";
            }

            this.rectangle = new MyRectangle(this.scene, this.x1, this.y1, this.x2, this.y2);
            this.rectangles.push(this.rectangle);

            this.log("Parsed rectangle");

            return null;

        } else this.onXMLMinorError("rectangle undefined'");

        return -1;
    }

    parseTriangle(triangleIndex, grandChildren) {

        // Retrieves the triangle.

        if (triangleIndex != -1) {

            this.x1 = this.reader.getString(grandChildren[triangleIndex], 'x1');
            this.y1 = this.reader.getString(grandChildren[triangleIndex], 'y1');
            this.z1 = this.reader.getString(grandChildren[triangleIndex], 'z1');
            this.x2 = this.reader.getString(grandChildren[triangleIndex], 'x2');
            this.y2 = this.reader.getString(grandChildren[triangleIndex], 'y2');
            this.z2 = this.reader.getString(grandChildren[triangleIndex], 'z2');
            this.x3 = this.reader.getString(grandChildren[triangleIndex], 'x3');
            this.y3 = this.reader.getString(grandChildren[triangleIndex], 'y3');
            this.z3 = this.reader.getString(grandChildren[triangleIndex], 'z3');

            this.triangle = new MyTriangle(this.scene, this.x1, this.y1, this.z1, this.x2, this.y2, this.z2, this.x3, this.y3, this.z3);
            this.triangles.push(this.triangle);

            this.log("Parsed triangle");

            return null;

        } else this.onXMLMinorError("rotate undefined'");
    }

    parseCylinder(cylinderIndex, grandChildren) {

        // Retrieves the cylinder.
        this.cylinderV = [];

        if (cylinderIndex != -1) {

            this.base = this.reader.getFloat(grandChildren[cylinderIndex], 'base');
            this.top = this.reader.getFloat(grandChildren[cylinderIndex], 'top');
            this.height = this.reader.getFloat(grandChildren[cylinderIndex], 'height');
            this.slices = this.reader.getFloat(grandChildren[cylinderIndex], 'slices');
            this.stacks = this.reader.getFloat(grandChildren[cylinderIndex], 'stacks');

            this.cylinder = new MyCylinder(this.scene, this.base, this.top, this.height, this.slices, this.stacks);
            this.cylinders.push(this.cylinder);

        } else this.onXMLMinorError("cylinder undefined'");

    }

    parseSphere(sphereIndex, grandChildren) {

        // Retrieves the sphere.

        if (sphereIndex != -1) {
            this.radius = this.reader.getFloat(grandChildren[sphereIndex], 'radius');
            this.slices = this.reader.getFloat(grandChildren[sphereIndex], 'slices');
            this.stacks = this.reader.getFloat(grandChildren[sphereIndex], 'stacks');

            this.sphere = new MySphere(this.scene, this.radius, this.slices, this.stacks);
            this.spheres.push(this.sphere);

        } else this.onXMLMinorError("sphere undefined'");

    }

    parseTorus(torusIndex, grandChildren) {

        // Retrieves the torus.
        if (torusIndex != -1) {
            this.inner = this.reader.getFloat(grandChildren[torusIndex], 'inner');
            this.outer = this.reader.getFloat(grandChildren[torusIndex], 'outer');
            this.slices = this.reader.getFloat(grandChildren[torusIndex], 'slices');
            this.loops = this.reader.getFloat(grandChildren[torusIndex], 'loops');

        } else this.onXMLMinorError("torus undefined'");

    }


    /**
    * Parses the <components> block.
    */
    parseComponents(componentsNode) {

        this.components = [];
        var children = componentsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Retrieves the component.
        var componentIndex = nodeNames.indexOf("component");

        if (componentIndex != -1) {

            this.componentId = this.reader.getString(children[componentIndex], 'id');

            if (this.componentId == null) {
                this.onXMLMinorError("no ID defined for component");
            }

            for (var j = 0; j < this.transformations.length; j++)
                if (this.transformations[j] == componentId)
                    this.onXMLMinorError("component ID must be different");

            this.component.push(this.componentId);

            var grandChildren = [];
            var newNodeNames = [];

            grandChildren = children[componentIndex].children;

            for (var j = 0; j < grandChildren.length; j++) {
                newNodeNames.push(grandChildren[j].nodeName);
            }

            var transformationIndex = newNodeNames.indexOf("transformation");
            var materialsIndex = newNodeNames.indexOf("materials");
            var textureIndex = newNodeNames.indexOf("texture");
            var childrenIndex = newNodeNames.indexOf("children");

            // Retrieves the transformation.
            if (transformationIndex != -1) {

                var grandGrandChildren = [];
                var newNodeName = [];

                grandGrandChildren = grandchildren[transformationIndex].children;

                for (var j = 0; j < grandGrandChildren.length; j++) {
                    newNodeName.push(grandGrandChildren[j].nodeName);
                }


                // Retrieves the transformationref (CORRIGIR)
                var transformationrefIndex = newNodeName.indexOf("transformationref");


                if (transformationrefIndex != -1) {
                    if (this.transformationref == null) {
                        this.onXMLMinorError("no ID defined for transformationref");
                    }

                    for (var j = 0; j < this.transformationref.length; j++)
                        if (this.transformationref[j] == transformationrefID)
                            this.onXMLMinorError("transformationref ID must be different");

                    this.transformationref.push(this.transformationrefId);

                } else this.onXMLMinorError("transformationref undefined'");



                // Retrieves the translate.
                var translateIndex = newNodeName.indexOf("translate");
                this.translateV = [];

                if (translateIndex != -1) {

                    this.x = this.reader.getFloat(grandGrandChildren[translateIndex], 'x');
                    this.y = this.reader.getFloat(grandGrandChildren[translateIndex], 'y');
                    this.z = this.reader.getFloat(grandGrandChildren[translateIndex], 'z');

                    if (!(this.x != null || !isNaN(this.x))) {
                        this.x = 25;
                        return "unable to parse x-coordinate of the position, assuming x = 25'";
                    } else
                        this.translateV[0] = this.x;
                    if (!(this.y != null || !isNaN(this.y))) {
                        this.y = 25;
                        return "unable to parse y-coordinate of the position, assuming y = 25'";
                    } else
                        this.translateV[1] = this.y;
                    if (!(this.z != null || !isNaN(this.z))) {
                        return "unable to parse z-coordinate of the position, assuming z = 25'";
                    } else
                        this.translateV[2] = this.z;
                } else this.onXMLMinorError("translate undefined'");

                // Retrieves the rotate.
                var rotateIndex = newNodeName.indexOf("rotate");
                this.rotateV = [];

                if (rotateIndex != -1) {

                    var axis = this.reader.getChar(grandGrandChildren[rotateIndex], 'axis');
                    var angle = this.reader.getFloat(grandGrandChildren[rotateIndex], 'angle');
                    if (this.angle < 0) {
                        this.onXMLMinorError("no angle defined for spot");
                    }
                } else this.onXMLMinorError("rotate undefined'");

                // Retrieves the scale.
                var scaleIndex = newNodeName.indexOf("scale");
                this.scaleV = [];

                if (scaleIndex != -1) {

                    this.x = this.reader.getFloat(grandGrandChildren[scaleIndex], 'x');
                    this.y = this.reader.getFloat(grandGrandChildren[scaleIndex], 'y');
                    this.z = this.reader.getFloat(grandGrandChildren[scaleIndex], 'z');

                    if (!(this.x != null || !isNaN(this.x))) {
                        this.x = 25;
                        return "unable to parse x-coordinate of the position, assuming x = 25'";
                    } else
                        this.scaleV[0] = this.x;

                    if (!(this.y != null || !isNaN(this.y))) {
                        this.y = 25;
                        return "unable to parse y-coordinate of the position, assuming y = 25'";
                    } els1
                    this.scaleV[1] = this.y;

                    if (!(this.z != null || !isNaN(this.z))) {
                        return "unable to parse z-coordinate of the position, assuming z = 25'";
                    } else
                        this.scaleV[2] = this.z;

                } else this.onXMLMinorError("scale undefined'");
                this.log("Parsed transformations");

            } else this.onXMLMinorError("transformations undefined'");

            // Retrieves the materials.
            if (materialsIndex != -1) {

                var grandGrandChildren = [];
                var newNodeName = [];

                grandGrandChildren = grandchildren[materialsIndex].children;

                for (var j = 0; j < grandGrandChildren.length; j++) {
                    newNodeName.push(grandGrandChildren[j].nodeName);
                }


                // Retrieves the material  (CORRIGIR)
                var materialIndex = nodeNames.indexOf("material");

                if (materialfIndex != -1) {
                    this.materialId = this.reader.getString(children[materialIndex], 'id');
                    if (this.materialId == null) {
                        this.onXMLMinorError("no ID defined for material");
                    }

                    for (var j = 0; j < this.material.length; j++)
                        if (this.material[j] == materialID)
                            this.onXMLMinorError("material ID must be different");
                    this.material.push(this.materialId);

                }

            } else this.onXMLMinorError("materials undefined'");

            // Retrieves the texture.
            if (textureIndex != -1) {


                this.textureId = this.reader.getString(grandChildren[textureIndex], 'id');
                if (this.textureId == null) {
                    this.onXMLMinorError("no ID defined for texture");
                }

                for (var j = 0; j < this.texture.length; j++)
                    if (this.texture[j] == textureId)
                        this.onXMLMinorError("texture ID must be different");
                this.texture.push(this.textureId);

                this.length_s = this.reader.getFloat(children[textureIndex], 'length_s');
                if (this.length_s == null || this.length_s < 0 || this.length_s > 1 || !isNaN(this.shininess)) {
                    this.onXMLMinorError("no valid length_s value");
                }

                this.length_t = this.reader.getFloat(children[textureIndex], 'length_s');
                if (this.length_t == null || this.length_t < 0 || this.length_t > 1 || !isNaN(this.shininess)) {
                    this.onXMLMinorError("no valid length_t value");
                }

            } else this.onXMLMinorError("texture undefined'");


            // Retrieves the children.
            if (childrenIndex != -1) {

                var grandGrandChildren = [];
                var newNodeName = [];

                grandGrandChildren = grandchildren[childrenIndex].children;

                for (var j = 0; j < grandGrandChildren.length; j++) {
                    newNodeName.push(grandGrandChildren[j].nodeName);
                }


                // Retrieves the componentref 
                var componentrefIndex = newNodeName.indexOf("componentref");

                if (componentrefIndex != -1) {
                    this.componentrefId = this.reader.getString(children[componentrefIndex], 'id');
                    if (this.componentrefId == null) {
                        this.onXMLMinorError("no ID defined for componentref");
                    }

                    for (var j = 0; j < this.componentref.length; j++)
                        if (this.componentref[j] == componentrefId)
                            this.onXMLMinorError("componentref ID must be different");
                    this.componentref.push(this.componentrefId);

                }

                // Retrieves the primitiveref 
                var primitiverefIndex = newNodeName.indexOf("primitiveref");

                if (primitiverefIndex != -1) {
                    this.primitiverefId = this.reader.getString(children[primitiverefIndex], 'id');
                    if (this.primitiverefId == null) {
                        this.onXMLMinorError("no ID defined for primitiveref");
                    }

                    for (var j = 0; j < this.primitiveref.length; j++)
                        if (this.primitiveref[j] == primitiverefId)
                            this.onXMLMinorError("primitiveref ID must be different");
                    this.primitiveref.push(this.primitiverefId);

                }

            } else this.onXMLMinorError("children undefined'");

        } else this.onXMLMinorError("component undefined'");

        return null;
    }
    
    /*
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
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}