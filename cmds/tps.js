
module.exports = (bot, username, params, cChat) => {
    cChat(bot, `TPS is ${bot.getTps()} -- it should be around 20.`)
};