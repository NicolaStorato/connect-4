document.getElementById("inserisciNickname").addEventListener("click", function() {
    
    let player1 = document.getElementById("nickname1").value;
    console.log(player1);

    let player2 = document.getElementById("nickname2").value;
    console.log(player2);

    if(player1 == 0 || player2 == 0){
        alert("Inserire i nicknames");
    }

    if(player1 != 0 && player2 != 0){
        
        localStorage.setItem('player1', player1);
        localStorage.setItem('player2', player2);

        window.location.href = 'gameIndex.html';
    }
    
})

document.getElementById("classificaButton").addEventListener("click", function() {
    window.location.href = 'classificaIndex.html';
})