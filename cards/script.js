const collection = document.getElementById("allCards");

class CardsColec{
    constructor(jsonURL){
        this.jsonURL = jsonURL;
        this.allCards = [];
    };

    async loadCards() {
        try {
            const response = await fetch(this.jsonURL);
            const data = await response.json();
            this.allCards = data.cards;
            console.log("Cartas carregadas com sucesso.");
        } catch (error) {
            console.error("Erro ao carregar JSON. Certifique-se de estar usando um servidor local.", error);
        };
    };

    createCardHTML(card, index) {
        const pathImage = `../${card.image}`

        return `
            <div class="card" id="${index}">
                <div class="card-info">
                    <p class="id-tag">#${card.id}</p>
                    <img class="cardImage" src="${pathImage}" alt="${card.name}"/>
                </div>
            </div>
        `;
    };

    async play() {
        if (this.allCards.length === 0) {
            await this.loadCards();
        };
           
        collection.innerHTML = this.allCards.map((card, i) => this.createCardHTML(card, i)).join("");

    };
};

window.cole = new CardsColec(`../cards.json`);
window.cole.play();