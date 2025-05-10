module.exports = (bot, username, params, cChat) => {
    let qPos = 0;    
    fetch('https://api.2b2t.vc/queue')
    .then(function(qresponse) {
        return qresponse.json();
    })
    .then(function(qdata) {
        let qPos = qdata.regular;
    
        return fetch('https://api.2b2t.vc/queue/eta-equation')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                let factor = data.factor;
                let pow = data.pow;
                let estimatedTime = factor * Math.pow(qPos, pow);
                let hours = Math.floor(estimatedTime / 3600);
                let minutes = Math.floor((estimatedTime % 3600) / 60);
                cChat(bot, `It would take about ${hours}h ${minutes}m to get into 2b2t currently.`);
            });
    })
    .catch(function(error) {
        cChat(bot, 'Failed to contact 2b2t API');
        console.log(error);
    });
};