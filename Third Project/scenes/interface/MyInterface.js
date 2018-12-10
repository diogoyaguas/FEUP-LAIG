/**
 * Creates a GUI interface.
 *
 * @class MyInterface
 */
class MyInterface extends CGFinterface {
    /**
     * Creates an instance of MyInterface.
     *
     * @memberOf MyBoard
     */
    constructor() {
        super();
    };

    /**
     *  Initializes the interface.
     * 
     * @param {any} application 
     * 
     * @memberOf MyInterface
     */
    init(application) {

        super.init(application);

        this.gui = new dat.GUI();

        return true;
    };

    /**
     * Adds a folder containing the cameras, the style of the game and the replay game button
     */
    addVisualOptions() {

        var group = this.gui.addFolder("Visual Options");
        group.open();

        var Movie = function (scene) {
            this.movie = function () {
                scene.playMovie();
            }
        };

        var movie = new Movie(this.scene);

        group.add(this.scene, 'activeCamera', ['Front', 'Top']).name("Camera");
        group.add(this.scene, 'activeStyle', ['Room', 'AE', 'FEUP']).name("Style");
        group.add(movie, 'movie').name("Replay game");

    };

    /**
     * Adds a folder containing the start game  button, the game mode, the bot difficuty and the undo button
     */
    addGameOptions() {

        var group = this.gui.addFolder("Game Options");
        group.open();

        var Start = function (scene) {
            this.start = function () {
                scene.startGame();
            }
        };

        var start = new Start(this.scene);

        var Undo = function (scene) {
            this.undo = function () {
                scene.undo();
            }
        };

        var undo = new Undo(this.scene);

        group.add(start, 'start').name("Start game");
        group.add(this.scene, 'gameMode', ['Human vs Human', 'Human vs Bot', 'Bot vs Bot']).name("Game mode");
        group.add(this.scene, 'botType', ['Easy', 'Smart']).name("Bot type");
        group.add(undo, 'undo').name("Undo last move");
    }

}