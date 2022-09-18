var game = (function () {
    // Init elements
    const $resetButton = $("#restart");
    const $nextRoundButton = $("#next-round");
    const $pvpMode = $("#pvp")
    const $pveMode = $("#pve")
    
    // Init variables
    var currentMode = "pvp";
    var tiles = [];
    var moves = 0;

    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            tiles.push(Tile([i, j]));
        }
    }
    
    players = [Player("Player1", 1), Player("Player2", 2)];
    var activePlayer = players[0];

    $nextRoundButton.hide()

    // Connect elements
    $resetButton.on('click', _restartGame);
    $nextRoundButton.on('click', _nextRound);
    $pvpMode.on('click', _changeMode);
    $pveMode.on('click', _changeMode);

    // Connect events
    events.on("validSelection", _switchPlayer);
    events.on("validSelection", _checkWinner);
    events.on("announceWinner", _showNextRoundButton);

    // Game mode options
    function _changeMode(event) {
        // Change the game mode from PvP to PvE or viceversa
        newMode = event.currentTarget.id;
        // Do not change if the game is already in this mode
        if (newMode === currentMode) return; 

        if (newMode === "pvp") {
            // Two human players
            players = [Player("Player1", 1), Player("Player2", 2)];
        } else {
            // Player vs Bot
            players = [Player("Player", 1), Bot("GlaDos")];
        }
        currentMode = newMode;
        _restartGame()
        events.emit("gameModeChanged");
    }

    function getMode() {
        // Get current game mode
        return currentMode;
    }

    // Player options

    function _switchPlayer() {
        // Switch the active player and emite events
        activePlayer = players.filter((player) => player != activePlayer)[0];
        moves++;

        events.emit("playerSwitch", activePlayer);
    }

    function getPlayers() {
        // Get game players
        return players;
    }

    function getActivePlayer() {
        // Get current active player
        return activePlayer;
    }
    
    // General game options

    function _showNextRoundButton() {
        // Show next round button
        $nextRoundButton.show();
    }

    function getAvailableTiles() {
        // Get tiles that have not already been taken
        return tiles.filter(tile => !tile.getStatus());
    }

    function _restartGame() {
        // Restart game setting moves to 0 and active player to first one
        activePlayer = players[0];
        moves = 0;
        events.emit("gameRestarted");
    }
    
    function _nextRound() {
        // Play next round resetting board and hiding button
        moves = 0;
        $nextRoundButton.hide();
        events.emit("nextRound");
    }

    function _checkWinner() {
        // Check if there is a winner (3 equal symbols)
        if (moves < 5) return; // If moves < 5 not enough to have a winner

        function areEqual(tiles) {
            // Check if the tiles passed are all equal
            const values = tiles.map((tile) => tile.getOwner());

            if (
                values[0] === values[1] &&
                values[1] === values[2] &&
                values[2] !== undefined
            ) {
                // If so, announce the winner and corresponding tiles
                const winner = values[0];
                events.emit("announceWinner", { winner, tiles });

                return true;
            } else {
                return false;
            }
        }

        for (let i = 0; i <= 2; i++) {
            // Check each row
            const rowTiles = tiles.filter((tile) => tile.row === i);
            if (areEqual(rowTiles)) return;
        }

        for (let j = 0; j <= 2; j++) {
            // Check each column
            const colTiles = tiles.filter((tile) => tile.column === j);
            if (areEqual(colTiles)) return;
        }

        // Check tiles in major and minor diagonals
        const majorDiagTiles = tiles.filter((tile) => tile.row == tile.column);
        if (areEqual(majorDiagTiles)) return;

        const minorDiagTiles = tiles.filter(
            (tile) => tile.row + tile.column === 2
        );
        if (areEqual(minorDiagTiles)) return;
        
        // If all the tiles have already been taken it is a draw
        if (moves === 9) {
            events.emit("announceWinner", { winner: null, tiles });
        }
    }

    return {
        tiles,
        getPlayers,
        getActivePlayer,
        getAvailableTiles,
        getMode
    };
})();
