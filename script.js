let teams = [];
let matches = [];
let currentRound = 0;

function initializeTable() {
    teams = [
        { name: document.getElementById('team1').value, J: 0, G: 0, E: 0, P: 0, GF: 0, GC: 0, Pts: 0 },
        { name: document.getElementById('team2').value, J: 0, G: 0, E: 0, P: 0, GF: 0, GC: 0, Pts: 0 },
        { name: document.getElementById('team3').value, J: 0, G: 0, E: 0, P: 0, GF: 0, GC: 0, Pts: 0 },
        { name: document.getElementById('team4').value, J: 0, G: 0, E: 0, P: 0, GF: 0, GC: 0, Pts: 0 }
    ];

    generateMatches();
    updateTable();
    displayMatches();
}

function generateMatches() {
    matches = [
        [{team1: teams[0], team2: teams[1]}, {team1: teams[2], team2: teams[3]}],
        [{team1: teams[0], team2: teams[2]}, {team1: teams[1], team2: teams[3]}],
        [{team1: teams[0], team2: teams[3]}, {team1: teams[1], team2: teams[2]}]
    ];
}

function displayMatches() {
    const matchesDiv = document.getElementById('matches');
    matchesDiv.innerHTML = '';

    if (currentRound < matches.length) {
        const round = matches[currentRound];
        const roundDiv = document.createElement('div');
        roundDiv.classList.add('round');
        roundDiv.innerHTML = `<h3>Jornada ${currentRound + 1}</h3>`;

        round.forEach(match => {
            const matchDiv = document.createElement('div');
            matchDiv.classList.add('match');
            matchDiv.innerHTML = `
                <span>${match.team1.name} vs ${match.team2.name}</span>
                <input type="number" class="score" data-team1="${match.team1.name}" data-team2="${match.team2.name}" placeholder="Goles ${match.team1.name}">
                <input type="number" class="score" data-team1="${match.team2.name}" data-team2="${match.team1.name}" placeholder="Goles ${match.team2.name}">
            `;
            roundDiv.appendChild(matchDiv);
        });

        matchesDiv.appendChild(roundDiv);
        document.getElementById('next-round-btn').style.display = 'none';
    } else {
        matchesDiv.innerHTML = '<h3>El torneo ha terminado</h3>';
    }
}

function updateScores() {
    const scoreInputs = document.querySelectorAll('.score');

    scoreInputs.forEach((scoreInput, index) => {
        const team1Name = scoreInput.getAttribute('data-team1');
        const team2Name = scoreInput.getAttribute('data-team2');
        const score = parseInt(scoreInput.value);

        if (!isNaN(score)) {
            const team1 = teams.find(t => t.name === team1Name);
            const team2 = teams.find(t => t.name === team2Name);

            if (index % 2 === 0) {
                team1.GF += score;
            } else {
                team2.GF += score;
            }

            if (index % 2 === 0) {
                const team2Score = parseInt(scoreInput.nextElementSibling.value);
                if (!isNaN(team2Score)) {
                    team2.GC += score;
                    team1.GC += team2Score;
                    if (score > team2Score) {
                        team1.G += 1;
                        team1.Pts += 3;
                        team2.P += 1;
                    } else if (score < team2Score) {
                        team2.G += 1;
                        team2.Pts += 3;
                        team1.P += 1;
                    } else {
                        team1.E += 1;
                        team2.E += 1;
                        team1.Pts += 1;
                        team2.Pts += 1;
                    }
                }
            }
        }
    });

    teams.forEach(team => team.J += 1);
    updateTable();
    document.getElementById('next-round-btn').style.display = 'block';
}

function nextRound() {
    currentRound += 1;
    displayMatches();
}

function updateTable() {
    const tbody = document.querySelector('#score-table tbody');
    tbody.innerHTML = '';

    teams.sort((a, b) => b.Pts - a.Pts || (b.GF - b.GC) - (a.GF - a.GC)); // Sort by points, then goal difference

    teams.forEach(team => {
        const row = document.createElement('tr');

        for (const key in team) {
            const cell = document.createElement('td');
            cell.innerText = team[key];
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    });
}
