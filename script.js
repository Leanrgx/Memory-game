
const gridContainer = document.querySelector(".grid-container");
let startBtn = document.querySelector("#gameStart");
let restartBtn = document.querySelector('.restart');
let finalScoreDisplay = document.querySelector(".finalScoreDisplay");
let cards = [];
let firstCard, secondCard;
let lockBoard = true;
let score = 0;

document.querySelector('.score').textContent = score;
startBtn.addEventListener("click", gameStart);
restartBtn.addEventListener("click", restart);

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
        partialPlayerScore();
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
        if (score == 10){
            const finalTime = document.querySelector('.timer').innerText;
            return gameOver(finalTime); 
        }         
        const elapsedTime = (Date.now() - startTime) / 1000;
        const formattedTime = elapsedTime.toFixed(2);
        document.querySelector('.timer').innerText = formattedTime;
        
        requestAnimationFrame(updateTimer);
    }

    updateTimer();
  }
  
function partialPlayerScore(){
    score = score + 10;
    document.querySelector(".score").textContent = score;
    return score;
}

function gameOver(finalTime){
    let finalScore =  (score * 100) / finalTime;
    finalScoreDisplay.innerHTML = "Good job! <br> Your final score is " + finalScore.toFixed(0)
    finalScoreDisplay.style.visibility = "visible";
    
}

function restart (){
    if (lockBoard) return;
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();
    document.querySelector('.timer').innerText = '0.00';
    startTimer();
    finalScoreDisplay.style.visibility = "hidden";
}

