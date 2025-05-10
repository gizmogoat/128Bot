module.exports = (bot, username, params, cChat) => {
    let url = "https://api.mojang.com/users/profiles/minecraft/"
    let playerToUUID = ""
    if (params.length >= 1) {
        url += params[1]
        playerToUUID = params[1]
    } else {
        url += username
        playerToUUID = username
    }

    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        cChat(bot, `${data.id} is ${playerToUUID}'s UUID`);
    })
    .catch(function(error) {
        cChat(bot, `Failed to get UUID for player`)
    });
};
