// Mineflayer packages
const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalXZ } = require('mineflayer-pathfinder').goals
var tpsPlugin = require('mineflayer-tps')(mineflayer)

// Environment packages
const fs = require('fs');
const path = require('path');
const configDir = path.join(__dirname, 'config');
const configFile = path.join(configDir, 'default.json');

const defaultConfig = {
    "server": {
        "host": "localhost",
        "port": 25565,
        "auth": {
            "type": "microsoft",
            "offlineusername": "Notch",
            "offlinepassword": "boxpig41"
        },
        "version": "1.8.9"
    }
};

if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
}
  
if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
    console.log('generated default configs');
}

const config = require('config');
const host = config.get('server.host');
const port = config.get('server.port');
const auth = config.get('server.auth.type');
const offlineUsername = config.get('server.auth.offlineusername')
const offlinePassword = config.get('server.auth.offlinepassword')
const version = config.get('server.version');

const commands = {};
fs.readdirSync('./cmds').forEach(file => {
    if (file.endsWith('.js')) {
        const cmdName = `\$${path.basename(file, '.js')}`;
        console.log(`loading command ${cmdName}`)
        commands[cmdName] = require(`./cmds/${file}`);
    }
});

// bypasses some anti-spam plugins if the bot happens to say the same things
// always use cChat, it will automatically prefix it with a random icon
const symbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
function cChat (myBot, msg) {
    const index = Math.floor(Math.random() * symbols.length);
    myBot.chat(`${symbols[index]} ${msg}`)
}

function createBot () {
    if (auth === 'offline') {
        const bot = mineflayer.createBot({
            host: host,
            username: offlineUsername,
            auth: auth,
            port: port,
            version: version,
            password: offlinePassword
        })
    } else {
        const bot = mineflayer.createBot({
            host: host,
            auth: auth,
            port: port,
            version: version,
        })
    }
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(tpsPlugin)
    
    bot.on('kicked', (reason) => {
        console.log(reason)
    })
    bot.on('error', (err) => {
        console.log(err)
    })
    bot.on('end', (reason) => {
        console.log(reason)
        createBotAfterDelay()
    })

    bot.once('spawn', () => {
        mcData = require('minecraft-data')(bot.version);
        
        const botMovements = new Movements(bot)
        botMovements.canDig = true;
        botMovements.canOpenDoors = true;
        botMovements.dontMineUnderFallingBlock = true;
        botMovements.allow1by1towers = true;
        botMovements.allowEntityDetection = false;
        botMovements.allowFreeMotion = true;
        botMovements.allowParkour = true;
        botMovements.allowSprinting = true;
        botMovements.maxDropDown = 4;

        botMovements.scafoldingBlocks = [ mcData.itemsByName.stone.id, mcData.itemsByName.oak_planks.id ]

        bot.pathfinder.setMovements(botMovements);
        // Workaround for 128 server's bad antibot
        let randX = Math.random() * 5
        let randZ = Math.random() * 5 
        bot.pathfinder.setGoal(new GoalXZ(bot.entity.position.x + randX, bot.entity.position.z + randZ))  
        
        if (bot.auth === 'offline') bot.chat
        bot.on('chat', (username, message) => {
            console.log(`<${username}> ${message}`)
            if (username === bot.username || !message.startsWith("$")) return
            let params = message.split(" ")
            let command = params[0];
            if (commands[command]) {
                commands[command](bot, username, params, cChat);
            }
        })
    })
}
createBot()

function createBotAfterDelay() {
    setTimeout(function () {
        createBot()
    }, 15000);
}