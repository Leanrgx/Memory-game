
const gridContainer = document.querySelector(".grid-container");
let startBtn = document.querySelector("#gameStart");
let cards = [];
let firstCard, secondCard;
let lockBoard = true;
let score = 0;

document.querySelector('.score').textContent = score;
startBtn.addEventListener("click", gameStart);



fetch ("./data/cards.json")
.then((res) => res.json())
.then((data) =>{
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
});



function gameStart(){    
    lockBoard = false;
    let hideStartScreen = document.querySelector(".startScreen");
    hideStartScreen.style.visibility = "hidden";
    startTimer();
}

function shuffleCards(){
    let currentIndex = cards.length,
        randomIndex,
        temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards(){
    for (let card of cards){
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image} />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

function flipCard(){
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if(isMatch){
        finalScore();
        disableCards();
    }else{
        unflipCards();
    } 
        
}

function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    
    resetBoard();
}

function unflipCards() {
    setTimeout(() =>{
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function startTimer() {
    let startTime = Date.now();

    function updateTimer() {
      const elapsedTime = (Date.now() - startTime) / 1000;
      const formattedTime = elapsedTime.toFixed(2);
      document.querySelector('.timer').innerText = formattedTime;

      requestAnimationFrame(updateTimer);
    }

    updateTimer();
  }
  
function finalScore(){
    ++score;
    document.querySelector(".score").textContent = score;
}

function restart (){
    resetBoard();
    shuffleCards();
    score = 0;
    timer = 0.00;
    document.querySelector(".score").textContent = score;
    document.querySelector('.timer').textContent = timer;
    gridContainer.innerHTML = "";
    generateCards();
}

