var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
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

        this.idRoot = null;                    // The id of the root element.

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
            if ((error = this.parseAmbient(nodes[index])) != null)
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
    parseScene(SceneNode) {

        this.root = this.reader.getString(SceneNode, 'root');
        this.axis_length = this.reader.getFloat(SceneNode, 'axis_length');

        if (this.root == null) {
            this.onXMLMinorError("no ID defined for scene'");
        }

        if (!(this.axis_length != null && !isNaN(this.axis_length))) {
            this.axis_length = 1;
            this.onXMLMinorError("unable to parse value for axis length; assuming 'axis_length = 1'");
        }

        this.log("Parsed scene");

        return null;

    }

    /**
     * Parses the <views> block.
     */
    parseViews(viewsNode) {

        this.default = this.reader.getString(viewsNode, 'root');

        if (this.default == null) {
            this.onXMLMinorError("no ID defined for view");
        }

        var children = viewsNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Retrieves the perspective.
        var perspectiveIndex = nodeNames.indexOf("perspective");
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
        }

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

            var x = this.reader.getFloat(grandChildren[fromIndex], 'x');
            var y = this.reader.getFloat(grandChildren[fromIndex], 'y');
            var z = this.reader.getFloat(grandChildren[fromIndex], 'z');

            if (!(x != null && !isNaN(x))) {
                x = 25;
                return "unable to parse x-coordinate of the position, assuming x = 25'";
            } else
                this.position.push(x);

            if (!(y != null && !isNaN(y))) {
                y = 25;
                return "unable to parse y-coordinate of the position, assuming y = 25'";
            } else
                this.position.push(y);

            if (!(z != null && !isNaN(z))) {
                return "unable to parse z-coordinate of the position, assuming z = 25'";
            } else
                this.position.push(z);
        } else this.onXMLMinorError("position undefined'");

        var targetIndex = newNodeNames.indexOf("to");
        this.target = [];
        if (targetIndex != -1) {

            x = this.reader.getFloat(grandChildren[targetIndex], 'x');
            y = this.reader.getFloat(grandChildren[targetIndex], 'y');
            z = this.reader.getFloat(grandChildren[targetIndex], 'z');

            if (!(x != null && !isNaN(x))) {
                x = 25;
                return "unable to parse x-coordinate of the target, assuming x = 25'";
            } else
                this.target.push(x);

            if (!(y != null && !isNaN(y))) {
                y = 25;
                return "unable to parse y-coordinate of the target, assuming y = 25'";
            } else
                this.target.push(y);

            if (!(z != null && !isNaN(z))) {
                return "unable to parse z-coordinate of the target, assuming z = 25'";
            } else
                this.target.push(z);
        } else this.onXMLMinorError("target undefined'");

        // Retrieves the ortho.
        var orthoIndex = nodeNames.indexOf("ortho");
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
            if (this.near == null || this.far == null || this.left == null || this.rigth == null || this.top == null || this.bottom == null) {
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
            } else if (isNaN(this.near) || isNaN(this.far) || isNaN(this.left) || isNan(this.rigth) == null || isNan(this.top) == null || isNan(this.bottom) == null) {
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
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";
        }

        this.log("Parsed views");

        return null;

    }

    /**
     * Parses the <ambient> block.
     */
    parseViews(ambientNode) {

        var children = ambientNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Retrieves the ambient.
        var ambientIndex = nodeNames.indexOf("ambient");
        this.ambient = [];
        if (ambientIndex != -1) {

            var r = this.reader.getFloat(children[ambientIndex], 'r');
            var g = this.reader.getFloat(children[ambientIndex], 'g');
            var b = this.reader.getFloat(children[ambientIndex], 'b');
            var a = this.reader.getFloat(children[ambientIndex], 'a');
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
            if (!(r >= 0 && r <= 1))
                return "unable to parse r component"
            else
                ambient.push(r);
            if (!(g >= 0 && g <= 1))
                return "unable to parse g component"
            else
                ambient.push(g);
            if (!(b >= 0 && b <= 1))
                return "unable to parse b component"
            else
                ambient.push(b);
            if (!(a >= 0 && a <= 1))
                return "unable to parse a component"
            else
                ambient.push(a);

        }
        else
            this.onXMLMinorError("ambient undefined");

        // Retrieves the background.
        var backgroundIndex = nodeNames.indexOf("background");
        this.background = [];
        if (backgroundIndex != -1) {

            var r = this.reader.getFloat(children[backgroundIndex], 'r');
            var g = this.reader.getFloat(children[backgroundIndex], 'g');
            var b = this.reader.getFloat(children[backgroundIndex], 'b');
            var a = this.reader.getFloat(children[backgroundIndex], 'a');
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
            if (!(r >= 0 && r <= 1))
                return "unable to parse r component"
            else
                background.push(r);
            if (!(g >= 0 && g <= 1))
                return "unable to parse g component"
            else
                background.push(g);
            if (!(b >= 0 && b <= 1))
                return "unable to parse b component"
            else
                background.push(b);
            if (!(a >= 0 && a <= 1))
                return "unable to parse a component"
            else
                background.push(a);

        }
        else
            this.onXMLMinorError("background undefined");

        this.log("Parsed ambient");

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
    onXMLMinorErro(message) {
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