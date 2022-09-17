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
    events.on("announceWinner", _highlightTiles);
    events.on("gameRestarted", _reset);
    events.on("nextRound", _reset);


    function _render() {
        if (owner) {
            $tile.css({ "background-image": `url(${owner.marker})` });
        } else {
            $tile.css({ "background-image": "none" });
        }
    }

    function _reset() {
        $tile.css({ "background-color": "grey" });
        isTaken = false;
        owner = undefined;

        _render()
    }

    function selectTile() {
        if (isTaken) {
            $tile.css({ "background-color": "red" });
        } else {
            isTaken = true;
            owner = game.getActivePlayer();

            _render();
            events.emit("validTileSelected", this);
        }
    }

    function _highlightTiles({ winner, tiles }) {
        if (tiles.some((tile) => tile.row === row && tile.column === column)) {
            $tile.css({ "background-color": "green" });
        }

        isTaken = true;
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
