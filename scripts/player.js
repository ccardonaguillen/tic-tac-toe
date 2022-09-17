let Player = function (name, num) {
    var score = 0;
    var marker = num === 1 ? "../images/circle.svg" : "../images/cross.svg";

    events.on("announceWinner", _setScore);
    events.on("gameRestarted", _resetScore);

    function _setScore(newScore) {
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
        getScore,
        getName,
    };
};

let Robot = function (name) {
    const robot = Player(name, 2);

    _turnOn();

    events.on("announceWinner", _turnOff);
    events.on("gameRestarted", _turnOn);
    events.on("nextRound", _turnOn);
    events.on("nextRound", _makeMove);

    function _turnOn() {
        events.on("playerSwitch", _makeMove);
    }

    function _turnOff() {
        events.off("playerSwitch", _makeMove);
    }

    function _makeMove() {
        currPlayer = game.getActivePlayer()
        if (robot.getName() !== currPlayer.getName()) return;

        availableTiles = game.getAvailableTiles()
        selection = availableTiles[Math.floor(Math.random() * availableTiles.length)]
        
        setTimeout(function () {
            selection.tile.click()
        }, 500);
    }

    return Object.assign({}, robot);
};
