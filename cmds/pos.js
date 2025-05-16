module.exports = (bot, username, params, cChat) => {
    cChat(bot, `I'm at ${bot.entity.position.x} ${bot.entity.position.y} ${bot.entity.position.z}`);
};