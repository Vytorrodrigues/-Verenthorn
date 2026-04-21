let campGames = document.getElementById("jogos");
let campWin = document.getElementById("vitorias");
let campPlayer = document.getElementById("player");
let campCPU = document.getElementById("cpu");
let campResult = document.getElementById("result");
let pedra = document.getElementById("pedra");
let papel = document.getElementById("papel");
let tesoura = document.getElementById("tesoura");

let deckGlobal =[];

// //CHAMADA A API
const cardsJSON = async () => {

    try {
        const response = await fetch("./cards.json");

        if (!response.ok){
            throw new Error(`Erro ao carregar dados ${response.status}`);
        };

        const data = await response.json();
        return data;

    } catch (error) {
      console.log(`Erro na requisição das cartas`, error);
    } finally  {
        console.log("Requisition ended");
    };

};

class Player{
    constructor(){
        this.cardActual = null;
    };

    getCardType(typeWanted, deck){
        const cardType = deck.cards.filter(cards => cards.tipo === typeWanted);
        let randomIndice = Math.floor(Math.random() * cardType.length);
        this.cardActual = cardType[randomIndice];
        return this.cardActual;
    };
};

class CPU{
    constructor(){
        this.cardActual = null;
    };

    getCardRandom(deck){
        let randomIndice = Math.floor(Math.random() * deck.cards.length);
        this.cardActual = deck.cards[randomIndice];
        return this.cardActual;

    };
};

class Game{
    constructor(){
        this.games = 0;
        this.wins = 0;
    };

    draw(){
        return "DRAW";
    };

    playerWinner(){
        this.wins += 1;
        return "Your Card WIN!";
    };

    defeat(){
        return "DEFEAT! The CPU beat your card.";
    };

    duel(cardPlayer, cardCPU){
        this.games += 1;

        let typePlayer = cardPlayer.type;
        let typeCPU = cardCPU.type;

        if (typePlayer === typeCPU) {
            return this.draw();
        } else if((typePlayer === "pedra" && typeCPU === "tesoura") ||
            (typePlayer === "tesoura" && typeCPU === "papel") || (typePlayer === "papel" && typeCPU === "pedra")){
                return this.playerWinner();
            }else {
                return this.defeat()
            };
    };

};

const player1 = new Player();
const cpu = new CPU();
const match = new Game();

function relizeTurn(typeSelected){
    if(deckGlobal.cards){
        //ver qual mensagem sera exibida ao escolher
        console.log("O deck está sendo invocado");
        return;
    };

    let cardOfPlayer = player1.getCardType(typeSelected, deckGlobal);

    let cardOfCPU = cpu.getCardRandom(deckGlobal);

    let resultDuel = match.duel(cardOfPlayer, cardOfCPU);

    //DOM
    campResult.textContent = resultDuel;
    //nome das cartas
    campPlayer.textContent = cardOfPlayer.name;
    campCPU.textContent = cardOfCPU.name;
    
    campGames.textContent = match.games;
    campWin.textContent = match.wins;

    //implementar imagens
    //imagemdecks
    //imagens cartas
};

async function initGame() {
    
    deckGlobal = await cardsJSON();
    if(deckGlobal && deckGlobal.cards){
        console.log(`${deckGlobal.length} cartas no deck`);
    };

    // papel.onclick = () => relizeTurn("papel");
    // pedra.onclick = () => relizeTurn("pedra");
    // tesoura.onclick = () => relizeTurn("tesoura");

    //prepara front e setar seletores de cartas/decks
};

initGame();

