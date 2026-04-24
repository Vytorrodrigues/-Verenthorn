const campPlayer = document.getElementById("campPlayer");
const campCpu = document.getElementById("campCpu");
const infoDisplay = document.getElementById("gameInfo");

class JokenpoGame {
    constructor(jsonURL) {
        this.jsonURL = jsonURL;
        this.allCards = [];
        this.playerHand = [];
        this.cpuHand = [];
        this.roundsPlayed = 0;
        this.playerScore = 0;
        this.cpuScore = 0;
        this.rules = {
            pedra: "tesoura",
            tesoura: "papel",
            papel: "pedra"
        };
    };

    async loadCards() {
        try {
            const response = await fetch(this.jsonURL);
            const data = await response.json();
            this.allCards = data.cards;
            console.log("Cartas carregadas com sucesso.");
        } catch (error) {
            console.error("Erro ao carregar JSON. Certifique-se de estar usando um servidor local.", error);
            // Mock de dados para teste caso o fetch falhe
            this.allCards = [
                {id: 1, name: "Guerreiro", type: "Pedra"},
                {id: 2, name: "Arqueiro", type: "Papel"},
                {id: 3, name: "Assassino", type: "Tesoura"},
                {id: 4, name: "Golem", type: "Pedra"},
                {id: 5, name: "Mago", type: "Papel"},
                {id: 6, name: "Ninja", type: "Tesoura"}
            ];
        };
    };

    getRandomCards() {
        // return this.allCards[Math.floor(Math.random() * this.allCards.length)];

        let sorT = 0; 
        while(sorT < 3){
            this.allCards[Math.floor(Math.random() * this.allCards.length)];
        };

    };

    createCardHTML(card, index, isPlayer = true) {
        return `
            <div class="card ${!isPlayer ? 'cpu-card' : ''}" 
                    ${isPlayer ? `onclick="game.selectCard(${index})"` : ""} 
                    id="${isPlayer ? 'p-' : 'c-'}${index}"
                    style="${!isPlayer ? 'visibility: hidden;' : ''}">
                <div class="card-info">
                    <img class="cardImage" src="${card.image}" alt="${card.name}"/>
                    <!--<h2>${card.name}</h2>
                    <p>Tipo: ${card.type}</p>--!>
                </div>
                <span class="id-tag">#${card.id}</span>
            </div>
        `;
    };

    async play() {
        if (this.allCards.length === 0) {
            await this.loadCards();
        }

        this.roundsPlayed = 0;
        this.playerScore = 0;
        this.cpuScore = 0;
        infoDisplay.innerText = "Escolha uma carta!";

        const drawnCards = this.getRandomCards();

        this.playerHand = drawnCards
        console.log(drawnCards);

        // this.cpuHand = drawnCards.slice(0, 3);

        // campPlayer.innerHTML = this.playerHand.find((card, i) => this.createCardHTML(card, i, true)).join("");
        // campCpu.innerHTML = this.cpuHand.map((card, i) => this.createCardHTML(card, i, false)).join("");
    };

    selectCard(index) {
        if (this.roundsPlayed >= 3) return;

        const playerCardEl = document.getElementById(`p-${index}`);
        if (playerCardEl.classList.contains('selected')) return;

        // Cartas escolhidas
        const pCard = this.playerHand[index];
        const cCard = this.cpuHand[index];

        // Revelar carta da CPU e marcar jogador
        playerCardEl.classList.add('selected');
        const cpuCardEl = document.getElementById(`c-${index}`);
        cpuCardEl.style.visibility = "visible";

        // Lógica de Comparação
        const result = this.compare(pCard, cCard);
        this.roundsPlayed++;

        if (result === "Ganhou") {
            this.playerScore++;
        }else if (result === "Perdeu") {
            this.cpuScore++;
        }else{
            this.cpuScore == 0;
            this.playerScore == 0;
        };

        infoDisplay.innerText = `Rodada ${this.roundsPlayed}: Você ${result}! \n (Placar: \n Player - ${this.playerScore} VS  CPU - ${this.cpuScore})`;

        if (this.roundsPlayed === 3) {
            setTimeout(() => this.finishGame(), 800);
        }; 
    };

    compare(pCard, cCard) {
        const pType = pCard.type.toLowerCase();
        const cType = cCard.type.toLowerCase();

        if (pType === cType) {
            return "Empatou";
        };
        return this.rules[pType] === cType ? "Ganhou" : "Perdeu";
    };

    finishGame() {
        let finalResult = "";
        if (this.playerScore > this.cpuScore) {
            finalResult = "VOCÊ VENCEU O JOGO! 🎉";
        } else if (this.cpuScore > this.playerScore) {
            finalResult = "A CPU VENCEU! 🤖";
        } else {
            finalResult = "O JOGO EMPATOU! ⚖️";
        };
        alert(finalResult);
        if (confirm("Jogar novamente?")) {
            this.play();
        };
    };
}

// Iniciar o jogo
window.game = new JokenpoGame(`./cards.json`);
window.game.play();