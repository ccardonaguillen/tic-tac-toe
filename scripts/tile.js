var Tile = function (val) {
    // If an array is passed init a tile in that row and column
    if (Array.isArray(val)) {
        var [row, column] = val;
        var $tile = $(`.tile[data-row=${row}][data-column=${column}]`).first();
    } else {
    // If not assume it is a tile HTML element
        var $tile = val;
        var row = parseInt($tile.attr("data-row"));
        var column = parseInt($tile.attr("data-column"));
    }

    // Init tile properties
    var isTaken = false;
    var owner;

    // Connect listener
    $tile.on("click", selectTile);
    
    //Connect events
    events.on("announceWinner", _highlightTiles);
    events.on("gameRestarted", _reset);
    events.on("nextRound", _reset);

    function _render() {
        // If the tile is taken render its owner's marker
        if (owner) {
            $tile.css({ "background-image": `url(${owner.marker})` });
        } else {
            $tile.css({ "background-image": "none" });
        }
    }

    function _reset() {
        // Reset the content of the tile and its color back to default
        $tile.css({ "background-color": "#4b85a8" });
        isTaken = false;
        owner = undefined;

        _render()
    }

    function selectTile() {
        // If the tile is taken the selection is not valid
        if (isTaken) {
            // $tile.css({ "background-color": "red" });
            events.emit("invalidSelection");
        // If not assign current active player as owner of the selection
        } else {
            isTaken = true;
            owner = game.getActivePlayer();

            _render();
            events.emit("validSelection");
        }
    }

    function _highlightTiles({ winner, tiles }) {
        // If it is no a draw color the corresponding tiles green
        if (!winner) return;
        
        if (tiles.some((tile) => tile.row === row && tile.column === column)) {
            $tile.css({ "background-color": "green" });
        }

        isTaken = true;
    }

    function getOwner() {
        // Get tile owner
        return owner;
    }

    function getStatus () {
        // Get tile status
        return isTaken;
    }

    return {
        tile: $tile,
        row,
        column,
        getOwner,
        getStatus,
        selectTile,
    };
};
