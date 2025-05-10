const fs = require('fs');
const path = require('path');

module.exports = (bot, username, params, cChat) => {
    let helpCommands = [];
    fs.readdirSync('./cmds').forEach(file => {
        if (file.endsWith('.js')) {
            let cmdName = `${path.basename(file, '.js')}`;
            helpCommands.push(cmdName)
        }
    });
    
    cChat(bot, `The chat commands are as follows, prefixed by a \$: ${helpCommands.toString()}\nThis bot will only ever send messages if a player invokes a command. I'm not here to spam!`);
};
