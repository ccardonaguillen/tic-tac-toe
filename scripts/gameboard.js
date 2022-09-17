let game = (function () {
    const $board = $("#gameboard");
    const $resetButton = $("#restart");
    const $nextRoundButton = $("#next-round");
    
    var tiles = [];
    var moves = 0;

    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            tiles.push(Tile([i, j]));
        }
    }
    
    var players = [
        Player("Alice", 1),
        Robot("Bob", 2),
    ];
    var activePlayer = players[0];

    $nextRoundButton.hide()

    $resetButton.on('click', _restartGame);
    $nextRoundButton.on('click', _nextRound);

    events.on("validSelection", _switchPlayer);
    events.on("validSelection", _checkWinner);
    events.on("announceWinner", _showNextRoundButton);

    function _showNextRoundButton() {
        $nextRoundButton.show()
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function getAvailableTiles() {
        return tiles.filter(tile => !tile.getStatus())
    }

    function _switchPlayer() {
        activePlayer = players.filter((player) => player != activePlayer)[0];
        moves++;

        events.emit("playerSwitch", activePlayer);
    }

    function _restartGame() {
        activePlayer = players[0];
        moves = 0;
        events.emit("gameRestarted")
    }
    
    function _nextRound() {
        moves = 0;
        events.emit("nextRound")
    }

    function _checkWinner() {
        if (moves < 5) return;

        function areEqual(tiles) {
            const values = tiles.map((tile) => tile.getOwner());

            if (
                values[0] === values[1] &&
                values[1] === values[2] &&
                values[2] !== undefined
            ) {
                const winner = values[0];
                events.emit("announceWinner", { winner, tiles });

                return true;
            } else {
                return false;
            }
        }

        for (let i = 0; i <= 2; i++) {
            const rowTiles = tiles.filter((tile) => tile.row === i);
            if (areEqual(rowTiles)) return;
        }

        for (let j = 0; j <= 2; j++) {
            const colTiles = tiles.filter((tile) => tile.column === j);
            if (areEqual(colTiles)) return;
        }

        const majorDiagTiles = tiles.filter((tile) => tile.row == tile.column);
        if (areEqual(majorDiagTiles)) return;

        const minorDiagTiles = tiles.filter(
            (tile) => tile.row + tile.column === 2
        );
        if (areEqual(minorDiagTiles)) return;

        if (moves === 9) {
            events.emit("announceWinner", { winner: null, tiles });
        }
    }

    return {
        players,
        tiles,
        getActivePlayer,
        getAvailableTiles
    };
})();
