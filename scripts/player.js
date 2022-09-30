var Player = function (name, num) {
    // Init variables
    var score = 0;
    var marker = num === 1 ? "images/circle.svg" : "images/cross.svg";

    // Connect events
    events.on("announceWinner", _setScore);
    events.on("gameRestarted", _resetScore);

    function _setScore(newScore) {
        // Set new score. If it's a number set that value if not sum 1 to current score
        if (typeof newScore === "number") {
            score = newScore;
        } else {
            let { winner } = newScore;
            if (winner && winner.getName() === name) score++;
        }
    }

    function _resetScore() {
        _setScore(0);
    }

    function getScore() {
        return score;
    }

    function setName(newName) {
        name = newName;
    }

    function getName() {
        return name;
    }

    return {
        marker,
        num,
        getScore,
        getName,
    };
};

let Bot = function (name) {
    // Base functions from Player class
    const bot = Player(name, 2);

    _turnOn();

    // Turn on or off the bot
    events.on("announceWinner", _turnOff);
    events.on("gameRestarted", _turnOn);
    events.on("nextRound", _turnOn);
    events.on("nextRound", _makeMove);
    events.on("gameModeChanged", function () {
        // Need to fix stacking of robots
        if (game.getMode() === "pvp") _turnOff()
    });


    function _turnOn() {
        // Turn on automatic robot functions
        if (game.getMode() === "pve") {
            events.on("playerSwitch", _makeMove)
        };
    }

    function _turnOff() {
        // Turn off automatic robot functions
        events.off("playerSwitch", _makeMove);
    }

    function _makeMove() {
        // Check if the bot is the current player. If so choose a free tile
        currPlayer = game.getActivePlayer()
        if (currPlayer.num === 1) return;

        availableTiles = game.getAvailableTiles()
        selection = availableTiles[Math.floor(Math.random() * availableTiles.length)]
        
        setTimeout(function () {
            selection.tile.click()
        }, 500);
    }

    return Object.assign({}, bot);
};
