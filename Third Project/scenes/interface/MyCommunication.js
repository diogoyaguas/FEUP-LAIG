Game.getPrologRequest(requestString, onSuccess, onError, port) {

    var requestPort = port || 8081
    var request = new XMLHttpRequest();
    var board = this.board;
    var game = this;
    var linear = this.linear;

    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess ||
        function (data) {
            var response = data.target.response;

            if (requestString == "start") {
                console.log("'start'. Reply: " + response);

                board.create(response);
            } else if (requestString.includes("movePiece")) {
                console.log("'movePiece'. Reply: " + response);

                board.recreate(response);

                if (game.activeGameMode == 2)
                    game.botPlaying = true;
            } else if (requestString.includes("botMove")) {
                console.log("'botMove'. Reply: " + response);

                game.botSelectedSymbol = response.charAt(0)
                game.botSelectedIndex = response.charAt(2);
                game.botSelectedDirection = response.charAt(4);

            } else if (requestString.includes("checkGameOver")) {
                console.log("'Winner'. Reply: " + response);

                game.winner = response;
            }
        };

    request.onerror = onError || function () {
        console.log("error");
    };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}