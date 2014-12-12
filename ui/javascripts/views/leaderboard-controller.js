
var LeaderboardViz = require('../viz/leaderboard-circles');
var request = require('superagent')

/*
 * View controller
 */
function LeaderboardViewController($el, data) {
    if (!(this instanceof LeaderboardViewController)) {
        return new LeaderboardViewController($el, data);
    }

    this.$el = $el;
    console.log(data);

    console.log('leaderboard view controller');

    // get leaders
    var self = this;

    request.get('/top-scores', function(res) {
        console.log(res.body);
        self.setupPlayers(res.body);

        new LeaderboardViz('.bubble-container.first', res.body);
        new LeaderboardViz('.bubble-container.second', res.body);
        new LeaderboardViz('.bubble-container.third', res.body);

    });

}


module.exports = LeaderboardViewController;

function getFullName(player) {
    return (player.firstName || '') + ' ' + (player.lastName || '');
}


LeaderboardViewController.prototype.setupPlayers = function(games) {
    if(games.length) {
        $('.first-place.score').text(games[0].score);
        $('.first-place.name').text(getFullName(games[0].player));
    } 
    if (games.length > 1) {
        $('.second-place.score').text(games[1].score);
        $('.second-place.name').text(getFullName(games[1].player));

    }
    if (games.length > 2) {
        $('.third-place.score').text(games[2].score);
        $('.third-place.name').text(getFullName(games[2].player));
    }
};

