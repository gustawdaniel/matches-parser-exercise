var matches = [
    {
        sport: 'soccer',
        participant1: 'Chelsea',
        participant2: 'Arsenal',
        score: '2:1',
    },
    {
        sport: 'volleyball',
        participant1: 'Germany',
        participant2: 'France',
        score: '3:0,25:23,25:19,25:21',
    },
    {
        sport: 'handball',
        participant1: 'Pogoń Szczeciń',
        participant2: 'Azoty Puławy',
        score: '34:26',
    },
    {
        sport: 'basketball',
        participant1: 'GKS Tychy',
        participant2: 'GKS Katowice',
        score: [
            ['9:7', '2:1'],
            ['5:3', '9:9']
        ],
    },
    {
        sport: "tennis",
        participant1: 'Maria Sharapova',
        participant2: 'Serena Williams',
        score: '2:1,7:6,6:3,6:7',
    },
    {
        sport: "ski jumping",
    }
];

class EventParser {
    makeEventName(match) {
        if (match.sport === 'soccer') {
            return match.participant1 + " - " + match.participant2;
        } else if (match.sport === 'tennis') {
            return match.participant1 + " vs " + match.participant2;
        } else if (match.sport === 'volleyball') {
            return match.participant1 + " - " + match.participant2;
        } else if (match.sport === 'handball') {
            return match.participant1 + " vs " + match.participant2;
        } else if (match.sport === 'basketball') {
            return match.participant1 + " - " + match.participant2;
        } else {
            return "Exception: invalid sport";
        }
    }

    formatScore(match) {
        if (match.sport === 'soccer') {
            return match.score;
        } else if (match.sport === 'tennis') {
            var scores = /([0-9]+\:[0-9]+),([0-9]+\:[0-9]+),([0-9]+\:[0-9]+),([0-9]+\:[0-9]+)/.exec(match.score);
            var set1 = scores[2];
            var set2 = scores[3];
            var set3 = scores[4];

            return "Main score: " + scores[1] + " ("
                + "set1 " + set1 + ", "
                + "set2 " + set2 + ", "
                + "set3 " + set3
                + ")";
        } else if (match.sport === 'volleyball') {
            var scores = /([0-9]+\:[0-9]+),([0-9]+\:[0-9]+),([0-9]+\:[0-9]+),([0-9]+\:[0-9]+)/.exec(match.score);
            var set1 = scores[2];
            var set2 = scores[3];
            var set3 = scores[4];

            return "Main score: " + scores[1] + " ("
                + "set1 " + set1 + ", "
                + "set2 " + set2 + ", "
                + "set3 " + set3
                + ")";
        } else if (match.sport === 'basketball') {
            return match.score[0][0] + ',' + match.score[0][1] + ',' + match.score[1][0] + ',' + match.score[1][1];
        } else if (match.sport === 'handball') {
            return match.score;
        } else {
            return "Exception: invalid sport";
        }
    }
}

let matchesParsed = [];

for (var i = 0; i < (matches.length); i++) {
    let parser = new EventParser()
    let name = parser.makeEventName(matches[i])
    let score = parser.formatScore(matches[i])

    if(name !== 'Exception: invalid sport' && score !== 'Exception: invalid sport'){
        matchesParsed.push({
            name,
            score
        })
    }
}

console.log(matchesParsed);
