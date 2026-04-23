const campPlayer = document.getElementById("campPlayer");
const cardS = document.getElementById(".card");

class JokenpoGame{
    //definindo atributos
    constructor(jsonURL){
        this.jsonURL = jsonURL;
        this.allCards = [];
        this.playerHand = [];
        this.cpuHand = [];
        this.roundsPlayed = [];
        this.rules = {
            pedra: "tesoura",
            tesoura: "papel",
            papel: "pedra"
        };
    };

    //chamada API metodo
    async loadCards(){
        try {
            const response = await fetch(this.jsonURL);

            const data = await response.json();

            this.allCards = data.cards;
            console.log("Cards read");
        }catch(error){
            console.log("Erro on load JSON", error);
        };
    };

    //SORTEIO Carta metodo
    getRandonCard(amount){
        return [...this.allCards].sort(() => Math.random() - 0.5).slice(0,amount);
    };

    //criar elemento html metodo
    createCard(card, index, isPlayer = true){
        return `
           <div class="card" ${isPlayer ? `onclick="game.selectCard(${index})"` : ""} id="${isPlayer ? 'p-' : 'c-'}${index}">
                <!--<img src="${card.image}" alt="${card.name}" class="cardImage"> --!>
                 <div class="card-info">
                     <h2>${card.name}</h2>
                     <p>Tipo: ${card.type}</p>
                     <span class="id-tag">#${card.id}</span>
                 </div>
             </div>
        `;
    };

    //metodo para iniciar
    async play(){
        if(this.allCards.length === 0){
            await this.loadCards();
        };

        const sortCard = this.getRandonCard(6);
        const playerHand = sortCard.slice(0, 3);
        const cpuHand = sortCard.slice(3, 6);

        // const result = this.battle(playerHand, cpuHand);
        
        if ( campPlayer) {
            campPlayer.innerHTML = playerHand.map((card) => this.createCard(card)).join("");
        } else {
            alert("Carta não encontrado");
        };

        // 2. Selecionamos todos os cards que acabamos de criar e adicionamos o evento aqui
        // const cardElements = campPlayer.querySelectorAll('.card');
        // cardElements.forEach((el, index) => {
        //     el.addEventListener('click', () => this.selectCard(index));
        // });

        // const info = document.getElementById('gameInfo');
        // info.innerHTML = `
        //     <h2>Ganhador da Rodada: ${result.winner}</h2>
        //     <p>Placar: ${result.playerPoints} vs ${result.cpuPoints}</p>
        // `;
        
        // console.log("Detalhes da Batalha:", result.logs);
    };

    selectCard(index) {
    if (this.roundsPlayed >= 3) return alert("A rodada acabou!");

    const pCard = this.playerHand[index];
    const cCard = this.cpuHand[index];

    // Destacar as cartas no HTML (opcional, para feedback visual)
    document.getElementById(`p-${index}`).classList.add('selected');
    document.getElementById(`c-${index}`).style.display = "block"; // Mostrar carta da CPU

    // Executar a batalha apenas deste par
    const roundResult = this.compare(pCard, cCard);
    console.log(`Round ${this.roundsPlayed + 1}: ${roundResult}`);

    this.roundsPlayed++;

    if (this.roundsPlayed === 3) {
        this.finishGame(); // Método para mostrar quem ganhou o ponto final
    }
}

// Método auxiliar apenas para comparar tipos
compare(pCard, cCard) {
    const pType = pCard.type.toLowerCase();
    const cType = cCard.type.toLowerCase();
    if (pType === cType) return "Empate";
    return this.rules[pType] === cType ? "Ganhou" : "Perdeu";
}

    // battle(playerHand, cpuHand){
    //     let playerPoints = 0;
    //     let cpuPoints = 0;
    //     const logs = [];

    //     for(let i = 0; i < 3; i++){
    //         const pCard = playerHand[i];
    //         const cCard = cpuHand[i];

    //         const pType = pCard.type.toLowerCase();
    //         const cType = cCard.type.toLowerCase();

    //         let resultMessage = "";

    //         if (pType === cType){
    //             resultMessage = "Empate";
    //         } else if( this.rules[pType] === cType){
    //             playerPoints++;
    //             resultMessage = "Jogador Ganhou";
    //         }else{
    //             cpuPoints++;
    //             resultMessage = "Vitória da CPU";
    //         };

    //         logs.push({
    //             round: i + 1,
    //             pCard: pCard.name,
    //             cCard: cCard.name,
    //             result: resultMessage
    //         });

    //     };

    //     return {
    //         playerPoints,
    //         cpuPoints,
    //         winner: playerPoints > cpuPoints? "Jogador" : cpuPoints > playerPoints ? "CPU" : "Empate",
    //         logs
    //     };
    // };
};
window.game = new JokenpoGame(`./cards.json`);
window.game.play();