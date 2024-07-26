document.getElementById("inserisciNickname").addEventListener("click", function() {
    
    let player1 = document.getElementById("nickname1").value;
    console.log(player1);

    let player2 = document.getElementById("nickname2").value;
    console.log(player2);

    if(player1 == 0 || player2 == 0){
        alert("Inserire i nicknames");
    }

    if(player1 != 0 && player2 != 0){
        window.location.href = 'index.html';
    }
    
})