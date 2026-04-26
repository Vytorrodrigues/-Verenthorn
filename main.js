const campPlayer = document.getElementById("campPlayer");
const campCpu = document.getElementById("campCpu");
const infoDisplay = document.getElementById("gameInfo");
const backCard1 = document.querySelector(".backCard1");
const backCard2 = document.querySelector(".backCard2");
const backCard3 = document.querySelector(".backCard3");


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

    createCardHTML(card, index, isPlayer = true) {
        if (isPlayer){
            return `
            <div class="card" onclick="game.selectCard(${index}, this)" id="$p-${index}">
                <div class="card-info">
                    <img class="cardImage" src="${card.image}" alt="${card.name}"/>
                    <!--<h2>${card.name}</h2>
                    <p>Tipo: ${card.type}</p>--!>
                </div>
                <span class="id-tag">#${card.id}</span>
            </div>
            `;
        } else{
            return `
                <div class="cpu-card-wrapper" id="-c-${index}">
                    <div class="backCard" id="back-c-${index}">
                    </div>
                        <div class="card cpu-card" id="c-${index}" style="display: none;">
                        <div class="card-info">
                        <img class="cardImage" src="${card.image}" alt="${card.name}"/>
                        </div>
                        <span class="id-tag">#${card.id}</span>
                        </div>
                </div>
            `
        };
    };

    getRandomCards() {
        const arrRandCard = [];

        for(let i = 0; i < 6;i ++){
            const randomC = this.allCards[Math.floor(Math.random() * this.allCards.length)];
            arrRandCard.push(randomC);
        }

        return arrRandCard;
    };

    async play() {
        if (this.allCards.length === 0) {
            await this.loadCards();
        };
        
        this.roundsPlayed = 0;
        this.playerScore = 0;
        this.cpuScore = 0;
        infoDisplay.innerText = "Escolha uma carta!";

        
        const drawnCards = this.getRandomCards();
        this.playerHand = drawnCards
        
        this.playerHand = drawnCards.slice(0, 3);
        this.cpuHand = drawnCards.slice(3, 6);
        
        campPlayer.innerHTML = this.playerHand.map((card, index) => this.createCardHTML(card, index, true)).join("");
        campCpu.innerHTML = this.cpuHand.map((card, index) => this.createCardHTML(card, index, false)).join("");
    };

    selectCard(index, clickedElement) {

        if (this.roundsPlayed >= 3) return;
        
        clickedElement.classList.add("selected")

        // Cartas escolhidas
        const pCard = this.playerHand[index];
        const cCard = this.cpuHand[index]; 

        //Esconder cpu back card
        const backEl = document.getElementById(`back-c-${index}`);
        if (backEl) backEl.style.display = "none";

        // Revelar carta da CPU e marcar jogador
        const cpuCardEl = document.getElementById(`c-${index}`);
        if (cpuCardEl) cpuCardEl.style.display = "block";

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

        infoDisplay.innerHTML = `
        <div>Rodada ${this.roundsPlayed}: ${result}! 
            <p>Placar:</p> 
            <p style= "color: #4CB944;"> Player - ${this.playerScore} </p>
                VS  
            <p style= "color: #FF2020;"> CPU - ${this.cpuScore} </p>
         </div>`;

        if (this.roundsPlayed === 3) {
            setTimeout(() => this.finishGame(), 800);
        }; 
    };

    compare(pCard, cCard) {
        const pType = pCard.type.toLowerCase().trim();
        const cType = cCard.type.toLowerCase().trim();

        if (pType === cType) {
            return "Empate";
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