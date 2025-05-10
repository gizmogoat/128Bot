module.exports = (bot, username, params, cChat) => {
    let jokeText = "";

    fetch("https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,racist,sexist,explicit&format=txt&type=single")
        .then(response => response.text())
        .then(data => {
            jokeText = data;
            cChat(bot, jokeText);
        })
        .catch(error => {
            cChat(bot, "Something went wrong... I'm sorry. :(");
            console.error("Error fetching joke:", error);
        });
};
