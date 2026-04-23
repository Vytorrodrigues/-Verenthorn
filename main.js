const deckOopente = document.getElementById("deckO");
const deckJogadorc = document.getElementById("deckJ");

const zonaCentral = document.getElementById("centralZ");

const cemiterioOponente = document.getElementById("cemiO");
const cemiterioJogador = document.getElementById("cemiJ");

const battles = document.getElementById("battles");
const wins = document.getElementById("wins");
const defeat = document.getElementById("defeats");

const cardCPU1 = document.getElementById("cardCPU1");
const cardCPU2 = document.getElementById("cardCPU2");
const cardCPU3 = document.getElementById("cardCPU3");

const cardPlayer1 = document.getElementById("cardPlayer1");
const cardPlayer2 = document.getElementById("cardPlayer2");
const cardPlayer3 = document.getElementById("cardPlayer3");


class JokenpoGame{
    //definindo atributos
    constructor(jsonURL){
        this.jsonURL = jsonURL;
        this.allCards = [];
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
    createCard(card){
        return `
            <div class="card">
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

        const result = this.battle(playerHand, cpuHand);

        const campPlayer = document.getElementById("campPlayer");
        const card = document.querySelector(".card");
        
        if ( campPlayer) {
            campPlayer.innerHTML = playerHand.map((card) => this.createCard(card)).join("");
        } else {
            alert("Carta não encontrado");
        };

        const info = document.getElementById('gameInfo');
        info.innerHTML = `
            <h2>Ganhador da Rodada: ${result.winner}</h2>
            <p>Placar: ${result.playerPoints} vs ${result.cpuPoints}</p>
        `;
        
        console.log("Detalhes da Batalha:", result.logs);
    };


    battle(playerHand, cpuHand){
        let playerPoints = 0;
        let cpuPoints = 0;
        const logs = [];

        for(let i = 0; i < 3; i++){
            const pCard = playerHand[i];
            const cCard = cpuHand[i];

            const pType = pCard.type.toLowerCase();
            const cType = cCard.type.toLowerCase();

            let resultMessage = "";

            if (pType === cType){
                resultMessage = "Empate";
            } else if( this.rules[pType] === cType){
                playerPoints++;
                resultMessage = "Jogador Ganhou";
            }else{
                cpuPoints++;
                resultMessage = "Vitória da CPU";
            };

            logs.push({
                round: i + 1,
                pCard: pCard.name,
                cCard: cCard.name,
                result: resultMessage
            });

            return {
                playerPoints,
                cpuPoints,
                winner: playerPoints > cpuPoints? "Jogador" : cpuPoints > playerPoints ? "CPU" : "Empate",
                logs
            };
        }
    }
}

const game = new JokenpoGame(`./cards.json`);
game.play();