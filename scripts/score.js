var score = (function () {
    // Init elements
    const $score = $("#score");
    const $playerNames = $(".player");

    // Start by rendering the score board
    _render();

    // Connect events
    events.on("playerSwitch", _render);
    events.on("announceWinner", _render);
    events.on("gameRestarted", _render);
    events.on("gameModeChanged", _render);

    function _render() {
        // Check both players, print their names and highlight the active one
        $playerNames.each(function() {
            let playerDiv = $( this );
            let idx = playerDiv.attr("data-player") - 1;
            let player = game.getPlayers()[idx];
            playerDiv.text(player.getName());

            if (player == game.getActivePlayer()) {
                playerDiv.css({"border-color": "#de6600",
                               "background-color": "#fea02f"});
            } else {
                playerDiv.css({"border-color": "grey",
                               "background-color": "lightgrey"});
            }
        })
        
        let players = game.getPlayers()

        // Update score
        $score.html(
            `${players[0].getScore()} &ndash; ${players[1].getScore()}`
        );
    }
})();
