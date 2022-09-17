var events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (fn) {
                fn(data);
            });
        }
    },
};

let Player = function (name, marker) {
    var score = 0;
    var marker;

    return {
        name,
        score,
        marker,
    };
};

let Tile = function (val) {
    if (Array.isArray(val)) {
        var [row, column] = val;
        var $tile = $(`.tile[data-row=${row}][data-column=${column}]`).first();
    } else {
        var $tile = val;
        var row = parseInt($tile.attr("data-row"));
        var column = parseInt($tile.attr("data-column"));
    }

    var isTaken = false;
    var owner;

    $tile.on("click", selectTile);
    events.on("announceWinner", highlightTiles);

    function _render() {
        if (owner) {
            $tile.css({ "background-image": `url(${owner.marker})` });
        }
    }

    function selectTile() {
        if (isTaken) {
            $tile.css({ "background-color": "red" });
        } else {
            isTaken = true;
            owner = game.getActivePlayer();
            // $tile.css({ "background-color": "blue" });

            _render();
            events.emit("validTileSelected", this);
        }
    }

    function highlightTiles({ winner, tiles }) {
        if (tiles.some((tile) => tile.row === row && tile.column === column)) {
            $tile.css({ "background-color": "green" });
        }
    }

    function getOwner() {
        return owner;
    }

    return {
        row,
        column,
        getOwner,
        selectTile,
    };
};


let game = (function () {
    const $board = $("#gameboard");
    // const $tiles = $board.find(".tile");
    var tiles = [];
    var moves = 0;

    for (let i = 0; i <= 2; i++) {
        for (let j = 0; j <= 2; j++) {
            tiles.push(Tile([i, j]));
        }
    }

    var players = [
        Player("Alice", "../images/circle.svg"),
        Player("Bob", "../images/cross.svg"),
    ];
    var activePlayer = players[0];

    // $tiles.each(function() {
    //     new Tile($(this));
    // })

    events.on("validTileSelected", _switchPlayer);
    events.on("validTileSelected", _checkWinner);

    function getActivePlayer() {
        return activePlayer;
    }

    function _switchPlayer() {
        activePlayer = players.filter((player) => player != activePlayer)[0];
        moves++;
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
    }

    return {
        players,
        tiles,
        getActivePlayer,
    };
})();
