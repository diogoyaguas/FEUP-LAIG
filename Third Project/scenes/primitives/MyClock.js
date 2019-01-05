/**
 * MyClock
 * @constructor
 */
/**
 * Creates a clock
 * 
 * @class MyClock
 * @extends {CGFobject}
 */
class MyClock extends CGFobject {

    /**
     * Creates an instance of MyClock.
     * @param {any} scene 
     * 
     */
    constructor(scene) {

        super(scene);

        this.scene = scene;

        this.screen = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.playerPoints = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.time = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.alarm = new MySphere(this.scene, 1, 32, 32);

        this.setAppearance();

    };

    setAppearance() {

        this.clockAppearance = new CGFappearance(this.scene);
        this.clockAppearance.setAmbient(1, 1, 1, 1);
        this.clockAppearance.setSpecular(1, 1, 1, 1);
        this.clockAppearance.setDiffuse(1, 1, 1, 1);
        this.clockAppearance.setShininess(1);

        this.normalAlarmAppearance = new CGFappearance(this.scene);
        this.normalAlarmAppearance.setAmbient(1, 1, 1, 1);
        this.normalAlarmAppearance.setSpecular(1, 1, 1, 1);
        this.normalAlarmAppearance.setDiffuse(1, 1, 1, 1);
        this.normalAlarmAppearance.setShininess(1);

        this.redAlarmAppearance = new CGFappearance(this.scene);
        this.redAlarmAppearance.setAmbient(1, 0, 0, 1);
        this.redAlarmAppearance.setSpecular(1, 0, 0, 1);
        this.redAlarmAppearance.setDiffuse(1, 0, 0, 1);
        this.redAlarmAppearance.setShininess(1);

        this.greenAlarmAppearance = new CGFappearance(this.scene);
        this.greenAlarmAppearance.setAmbient(0, 1, 0, 1);
        this.greenAlarmAppearance.setSpecular(0, 1, 0, 1);
        this.greenAlarmAppearance.setDiffuse(0, 1, 0, 1);
        this.greenAlarmAppearance.setShininess(1);

        this.alarmAppearance = this.normalAlarmAppearance;


    };

    display() {

        if (this.scene.countdown() <= 0) {

            console.log(this.scene.activePlayer);

            if (this.scene.activePlayer == 'b') {
                this.scene.winner = 'w';
            } else if (this.scene.activePlayer == 'w')
                this.scene.winner = 'b';
        }

        var gameOver = this.scene.winner;
        if (gameOver == undefined) {
            this.displayTimer();
        } else if (gameOver != undefined) {
            this.displayWinner(gameOver);
        }

    };

    displayWinner(gameOver) {

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(1.5, 2.5, -1.2);
        this.scene.scale(11, 3, 8);
        if (gameOver == "w")
            this.clockAppearance.setTexture(this.scene.whiteWinnerTex.texture);
        else
            this.clockAppearance.setTexture(this.scene.blackWinnerTex.texture);
        this.clockAppearance.apply();
        this.screen.setSAndT(1, 1);
        this.screen.display();
        this.scene.popMatrix();
    };

    displayTimer() {

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(1.5, 2.5, -1.2);
        this.scene.scale(11, 3, 8);
        if (this.scene.activePlayer == 'w')
            this.clockAppearance.setTexture(this.scene.whiteTurnTex.texture);
        else if (this.scene.activePlayer == 'b')
            this.clockAppearance.setTexture(this.scene.blackTurnTex.texture);
        this.clockAppearance.apply();
        this.screen.setSAndT(1, 1);
        this.screen.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(9, 3.25, -1.15);
        this.displayTime(1).apply();

        this.time.setSAndT(1, 1);
        this.time.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(10, 3.25, -1.15);
        this.displayTime(2).apply();
        this.time.setSAndT(1, 1);
        this.time.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(3, 3.25, -1.15);
        this.displayPontuation(1).apply();
        this.time.setSAndT(1, 1);
        this.time.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI / 6, 1, 0, 0);
        this.scene.translate(4, 3.25, -1.15);
        this.displayPontuation(2).apply();
        this.time.setSAndT(1, 1);
        this.time.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(11.35, -5, -1.35);
        this.scene.scale(0.25, 0.25, 0.25);
        this.alarmAppearance.apply();
        this.alarm.display();
        this.scene.popMatrix();

    };

    displayTime(number) {

        switch (number) {

            case 1:
                if (this.scene.isPlayingMovie)
                    return this.scene.sixTex;
                else if (this.scene.countdown() > 0)
                    return this.getDigit(Math.trunc(this.scene.countdown()), 1);
                else
                    return this.scene.zeroTex;

            case 2:
                if (this.scene.isPlayingMovie)
                    return this.scene.zeroTex;
                else if (this.scene.countdown() > 0)
                    return this.getDigit(Math.trunc(this.scene.countdown()), 2);
                else
                    return this.scene.zeroTex;
        }
    };

    displayPontuation(number) {

        switch (number) {

            case 1:

                if (this.scene.pontuation > 0)
                    return this.scene.plusTex;
                else if (this.scene.pontuation < 0)
                    return this.scene.minusTex;
                else
                    return this.scene.zeroTex;

            case 2:

                return this.getDigit(this.scene.pontuation, 2);

        }
    };

    getDigit(digit, type) {
        var string = digit.toString();

        if (string.length == 2 && type == 1)
            string = string.charAt(0);
        else if (string.length == 2 && type == 2)
            string = string.charAt(1);
        else if (string.length == 1 && type == 1)
            return this.scene.zeroTex;
        else if (string.length == 1 && type == 2)
            string = string.charAt(0);

        switch (string) {
            case "0":
                return this.scene.zeroTex;
            case "1":
                return this.scene.oneTex;
            case "2":
                return this.scene.twoTex;
            case "3":
                return this.scene.threeTex;
            case "4":
                return this.scene.fourTex;
            case "5":
                return this.scene.fiveTex;
            case "6":
                return this.scene.sixTex;
            case "7":
                return this.scene.sevenTex;
            case "8":
                return this.scene.eightTex;
            case "9":
                return this.scene.nineTex;

        }
    };
}