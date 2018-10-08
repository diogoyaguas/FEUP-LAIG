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

        /*    // <transformations>
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
             }*/
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(sceneNode) {

        this.idRoot = this.reader.getString(sceneNode, 'root');
        this.axisLength = this.reader.getFloat(sceneNode, 'axis_length');

        if (this.idRoot == null) {
            this.onXMLMinorError("no root defined for scene'");
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

        this.views = [];
        var error;

        this.default = this.reader.getString(viewsNode, 'default');

        if (this.default == null) {
            this.onXMLMinorError("no ID defined for default view");
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

    /**
     * Parses the <perspective> block.
     */
    parsePerspective(perspectiveIndex, children) {

        // Retrieves the perspective.
        if (perspectiveIndex != -1) {

            this.perspectiveId = this.reader.getString(children[perspectiveIndex], 'id');

            if (this.views[this.perspectiveId] != null)
                this.onXMLMinorError("perspective's ID repeated");


            if (this.perspectiveId == null) {
                this.onXMLMinorError("no ID defined for perspective");
            }

            this.near = this.reader.getFloat(children[perspectiveIndex], 'near');
            this.far = this.reader.getFloat(children[perspectiveIndex], 'far');
            this.angle = this.reader.getFloat(children[perspectiveIndex], 'angle');

            if (this.near == null || isNaN(this.near) || this.near <= 0) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            } else if (this.far == null || isNaN(this.far)) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            } else if (this.angle == null || isNaN(this.angle)) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
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

            this.views[this.perspectiveId] = [this.near, this.far, this.angle, this.position, this.target];
            this.views[this.perspectiveId].type = "perspective";

            this.log("Parsed perspective");

            return null;

        }

        return -1;

    }

    /**
    * Parses the <ortho> block.
    */
    parseOrtho(orthoIndex, children) {

        // Retrieves the ortho.
        if (orthoIndex != -1) {

            this.orthoId = this.reader.getString(children[orthoIndex], 'id');


            if (this.views[this.orthoId] != null)
                this.onXMLMinorError("ortho's ID repeated");

            if (this.orthoId == null) {
                this.onXMLMinorError("no ID defined for ortho'");
            }

            this.near = this.reader.getFloat(children[orthoIndex], 'near');
            this.far = this.reader.getFloat(children[orthoIndex], 'far');
            this.left = this.reader.getFloat(children[orthoIndex], 'left');
            this.rigth = this.reader.getFloat(children[orthoIndex], 'right');
            this.top = this.reader.getFloat(children[orthoIndex], 'top');
            this.bottom = this.reader.getFloat(children[orthoIndex], 'bottom');

            if (this.near == null || this.near <= 0 || isNaN(this.near)) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            } else if (this.far == null || isNaN(this.far)) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            } else if (this.left == null || isNaN(this.left)) {
                this.left = 5;
                this.onXMLMinorError("unable to parse value for left plane; assuming 'left = 5'");
            } else if (this.rigth == null || isNan(this.rigth)) {
                this.rigth = 5;
                this.onXMLMinorError("unable to parse value for rigth plane; assuming 'rigth = 5'");
            } else if (this.top == null || isNan(this.top)) {
                this.top = 5;
                this.onXMLMinorError("unable to parse value for top plane; assuming 'top = 5'");
            } else if (this.bottom == null || isNan(this.bottom)) {
                this.bottom = 5;
                this.onXMLMinorError("unable to parse value for bottom plane; assuming 'bottom = 5'");
            } else if (this.near >= this.far)
                this.onXMLMinorError("'near' must be smaller than 'far'");

            this.views[this.orthoId] = [this.near, this.far, this.left, this.rigth, this.top, this.bottom];
            this.views[this.orthoId].type = "ortho";

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

    /**
    * Parses the <ambient> component
    */
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

    /**
    * Parses the <background> component
    */
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
    */
    parseOmni(omniIndex, children) {

        var error;

        // Retrieves the omni.
        if (omniIndex != -1) {

            this.omniId = this.reader.getString(children[omniIndex], 'id');


            if (this.lights[this.omniId] != null)
                this.onXMLMinorError("omni's ID repeated");

            if (this.omniId == null) {
                this.onXMLMinorError("no ID defined for omni");
            }

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
            this.lights[this.omniId].type = "omni";

            this.log("Parsed omni");

            return null;
        }

        return -1;

    }

    /**
    * Parses the <spot> block
    */
    parseSpot(spotIndex, children) {

        var error;
        this.spotLights = [];

        // Retrieves the spot.
        if (spotIndex != -1) {

            this.spotId = this.reader.getString(children[spotIndex], 'id');


            if (this.lights[this.spotId] != null)
                this.onXMLMinorError("spot's ID repeated");

            if (this.omniId == null) {
                this.onXMLMinorError("no ID defined for spot'");
            }

            this.enabled = this.reader.getBoolean(children[spotIndex], 'enabled');
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

            this.lights[this.spotId] = [this.enabled, this.location, this.ambient, this.diffuse, this.specular, this.target, this.angle, this.exponent];
            this.lights[this.spotId].type = "spot";

            this.log("Parsed spot");

            return null;
        }

        return -1;

    }

    /**
    * Parses the <location> component
    */
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

    /**
    * Parses the <diffuse> component
    */
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

    /**
    * Parses the <specular> component
    */
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

    /**
    * Parses the <target> component
    */
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

                if (this.textures[textureID] != null)
                    this.onXMLMinorError("texture's ID must be different");

                this.texturesFile = this.reader.getString(children[texturesIndex], 'file');

                if (this.texturesFile == null) {
                    this.onXMLMinorError("no File found");
                }

                this.textures[textureId] = this.texturesFile;
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

                if (this.materials[this.materialsId] != null)
                    this.onXMLMinorError("materials' ID must be different");

                this.shininess = this.reader.getFloat(children[materialsIndex], 'shininess');
                if (this.shininess == null || this.shininess < 0 || this.shininess > 1 || isNaN(this.shininess)) {
                    this.onXMLMinorError("no valid shininess value");
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

                this.materials[this.materialId] = [this.materialEmission, this.ambient, this.diffuse, this.specular];
                this.materialEmission = [];
                this.ambient = [];
                this.diffuse = [];
                this.specular = [];

                this.log("Parsed material");

            }

        }

        this.log("Parsed materials block");

        return null;

    }

    /**
    * Parses the <emission> component
    */
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

        var children = transformationsNode.children;
        var nodeNames = [];

        // Retrieves the transformations.
        for(var j = 0; j < children.length; j++) {
            if(children[j].nodeName != "transformation")
            {
                this.onXMLMinorError("unknown tag <" + children[j].nodeName + ">");
                continue;
            }
 
            this.transformationsId = this.reader.getString(children[j], 'id');

            if (this.transformationsId == null) {
                this.onXMLMinorError("no ID defined for transformations");
            }

            if (this.transformations[this.transformationsId] != null)
                this.onXMLMinorError("transformations ID must be different");

            this.transformations[transformationID] = mat4.create();

            grandChildren = children[i].children;

            for (var i = 0; i < grandChildren.length; i++) {

                switch (grandChildren[i].nodeName) {
                    case "translate":
                        xyz = this.getXYZ(grandChildren[i]);

                        if (typeof xyz == "string")
                            return transformationErrorTag + xyz;
                        else
                            mat4.translate(this.transformations[transformationID], this.transformations[transformationID],
                                xyz);

                        break;

                    case "scale":
                        xyz = this.getXYZ(grandChildren[i]);

                        if (typeof xyz == "string")
                            return transformationErrorTag + xyz;
                        else
                            mat4.scale(this.transformations[transformationID], this.transformations[transformationID],
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

                        mat4.rotate(this.transformations[transformationID], this.transformations[transformationID],
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

            if (this.primitives[this.primitiveID] != null)
                this.onXMLMinorError("primitive ID must be different");

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
                } else if (newNodeNames[i] == "cylinder" || newNodeNames[i] == "cone") {
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
                } else return "Inapropriate tag name in primitive";

            }

            this.log("Parsed primitive");

        }

        this.log("Parsed primitives block");

        return null;

    }

    /**
    * Parses the <rectangle> component
    */
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
            this.primitives(this.rectangle);

            this.log("Parsed rectangle");

            return null;

        } else this.onXMLMinorError("rectangle undefined'");

        return -1;
    }

    /**
    * Parses the <triangle> component
    */
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
            this.primitives.push(this.triangle);

            this.log("Parsed triangle");

            return null;

        } else this.onXMLMinorError("rotate undefined'");
    }

    /**
    * Parses the <cylinder> component
    */
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
            this.primitives.push(this.cylinder);

            this.log("Parsed cylinder/cone");

            return null;

        } else this.onXMLMinorError("cylinder/cone undefined'");

    }

    /**
    * Parses the <sphere> component
    */
    parseSphere(sphereIndex, grandChildren) {

        // Retrieves the sphere.

        if (sphereIndex != -1) {
            this.radius = this.reader.getFloat(grandChildren[sphereIndex], 'radius');
            this.slices = this.reader.getFloat(grandChildren[sphereIndex], 'slices');
            this.stacks = this.reader.getFloat(grandChildren[sphereIndex], 'stacks');

            this.sphere = new MySphere(this.scene, this.radius, this.slices, this.stacks);
            this.primitives.push(this.sphere);

            this.log("Parsed sphere");

            return null;

        } else this.onXMLMinorError("sphere undefined'");

    }

    /**
    * Parses the <torus> component
    */
    parseTorus(torusIndex, grandChildren) {

        // Retrieves the torus.
        if (torusIndex != -1) {
            this.inner = this.reader.getFloat(grandChildren[torusIndex], 'inner');
            this.outer = this.reader.getFloat(grandChildren[torusIndex], 'outer');
            this.slices = this.reader.getFloat(grandChildren[torusIndex], 'slices');
            this.loops = this.reader.getFloat(grandChildren[torusIndex], 'loops');

            this.log("Parsed torus");

            return null;

        } else this.onXMLMinorError("torus undefined'");

        // TODO:  create torus

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