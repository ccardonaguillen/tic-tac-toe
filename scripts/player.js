let Player = function (name, marker) {
    var score = 0;
    var marker;

    events.on("announceWinner", _setScore);
    events.on("gameRestarted", _resetScore);

    function _setScore(newScore) {
        if (typeof(newScore) === "number") {
            score = newScore;
        } else {
            let {winner, tiles} = newScore;
            if (winner.getName() === name) score++;
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
        getName
    };
};