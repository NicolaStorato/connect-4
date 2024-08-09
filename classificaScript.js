document.addEventListener("DOMContentLoaded", () => {
    const leaderboardBody = document.getElementById("leaderboardBody");
    const backToGameButton = document.getElementById("backToGame");

    // Recupera la classifica dal localStorage
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};

    // Funzione per aggiornare la classifica
    const updateLeaderboard = () => {
        leaderboardBody.innerHTML = ""; // Pulisce la tabella
        for (let player in leaderboard) {
            let row = document.createElement("tr");
            let playerName = document.createElement("td");
            playerName.textContent = player;
            let wins = document.createElement("td");
            wins.textContent = leaderboard[player];
            row.appendChild(playerName);
            row.appendChild(wins);
            leaderboardBody.appendChild(row);
        }
    };

    // Chiama la funzione per visualizzare la classifica
    updateLeaderboard();

    // Aggiungi evento per tornare al gioco
    backToGameButton.addEventListener("click", () => {
        window.location.href = "mainMenu.html"; // Sostituisci con il nome del tuo file di gioco
    });
});
