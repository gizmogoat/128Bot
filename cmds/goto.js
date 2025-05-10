const { GoalXZ } = require('mineflayer-pathfinder').goals
module.exports = (bot, username, params, cChat) => {
    if (params.length === 3) {  // Expecting 2 parameters after the command itself
        let x = parseFloat(params[1]);
        let z = parseFloat(params[2]);
        
        if (isNaN(x) || isNaN(z)) {
            cChat(bot, "That doesn't look right... format is >goto x z");
        } else {
            cChat(bot, "Coming...!");
            bot.pathfinder.setGoal(new GoalXZ(x, z, 1));  // Assuming 1 is the radius for proximity
        }
    } else {
        cChat(bot, "That doesn't look right... format is >goto x z");
    }
};
