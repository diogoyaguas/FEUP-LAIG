//From https://github.com/EvanHahn/ScriptInclude
include = function () { function f() { var a = this.readyState; (!a || /ded|te/.test(a)) && (c-- , !c && e && d()) } var a = arguments, b = document, c = a.length, d = a[c - 1], e = d.call; e && c--; for (var g, h = 0; c > h; h++)g = b.createElement("script"), g.src = arguments[h], g.async = !0, g.onload = g.onerror = g.onreadystatechange = f, (b.head || b.getElementsByTagName("head")[0]).appendChild(g) };
serialInclude = function (a) { var b = console, c = serialInclude.l; if (a.length > 0) c.splice(0, 0, a); else b.log("Done!"); if (c.length > 0) { if (c[0].length > 1) { var d = c[0].splice(0, 1); b.log("Loading " + d + "..."); include(d, function () { serialInclude([]); }); } else { var e = c[0][0]; c.splice(0, 1); e.call(); }; } else b.log("Finished."); }; serialInclude.l = new Array();

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[decodeURIComponent(key)] = decodeURIComponent(value);
        });
    return vars;
}

//Include additional files here
serialInclude(['../lib/CGF.js', 'XMLscene.js', 'MySceneGraph.js', 'MyInterface.js', 'scenes/primitives/MyCylinder.js', 
'scenes/primitives/MyCylinderTop.js', 'scenes/primitives/MyCylinderSide.js', 'scenes/primitives/MyRectangle.js', 
'scenes/primitives/MySphere.js', 'scenes/primitives/MyTorus.js', 'scenes/primitives/MyTriangle.js', 
'scenes/primitives/MyPlane.js', 'scenes/primitives/MyPatch.js', 'scenes/primitives/MyCylinder2.js', 
'scenes/primitives/MyDrone.js', 'MyNode.js', 'scenes/animation/Animation.js', 'scenes/animation/LinearAnimation.js', 
'scenes/animation/CircularAnimation.js','scenes/primitives/MyTerrain.js','scenes/primitives/MyWater.js',

    main = function () {
        // Standard application, scene and interface setup
        var app = new CGFapplication(document.body);
        var myInterface = new MyInterface();
        var myScene = new XMLscene(myInterface);

        app.init();

        app.setScene(myScene);
        app.setInterface(myInterface);

        myInterface.setActiveCamera(myScene.camera);

        var filename = getUrlVars()['file'] || "file.xml";

        // create and load graph, and associate it to scene. 
        // Check console for loading errors
        var myGraph = new MySceneGraph(filename, myScene);

        // start
        app.run();
    }

]);