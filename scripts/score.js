let score = (function () {
    const $container = $("#players-info");
    const $pvpButton = $("#pvp");
    const $pveButton = $("#pve");
    const $score = $("#score");

    _render();

    events.on("announceWinner", _render);
    events.on("gameRestarted", _render);

    function _render() {
        playersScore = game.players.map((player) => player.getScore());
        playersName = game.players.map((player) => player.getName());

        $score.text(
            `${playersName[0]} ${playersScore[0]} - ${playersScore[1]} ${playersName[1]}`
        );
    }
})();
