// Creates a NodeList that holds all initial game cards from index.html
let defaultCardOrder = document.querySelectorAll(".card");
// As NodeList is immutable, convert to an array.
let cards = [].slice.call(defaultCardOrder);

// Remove default cards from the deck
defaultCardOrder.forEach(function(card) {
    card.remove();
});

// Shuffle cards
cards = shuffle(cards);

// Add shuffled cards to deck.
let fragment = document.createDocumentFragment();
let deck = document.querySelector(".deck");
cards.forEach(function(card) {
    fragment.appendChild(card);
});
deck.appendChild(fragment);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Function to check for matched cards.
let tempOpenCards = [];
let allOpenCards = 0;
let movesCounter = 0;
function checkMatch(target) {
    tempOpenCards.push(target);
    if (tempOpenCards.length === 2) {
        let card1 = tempOpenCards[0].querySelector('.fa');
        let card2 = tempOpenCards[1].querySelector('.fa');
        card1 = card1.classList[1];
        card2 = card2.classList[1];
        if (card1 === card2) {
            keepMatchedOpen(tempOpenCards)
        }
        else {
            // Hide unmatched cards after half a second
            setTimeout(function() {hideCards();}, 500);
        }
        // Update moves counter
        movesCounter = Number(document.querySelector('.moves').innerHTML) + 1;
        document.querySelector('.moves').innerHTML = movesCounter.toString();

        //Reduce number of stars with more moves
        if ((movesCounter === 9) || (movesCounter === 17) || (movesCounter === 25)) {
            document.querySelector('.fa-star').remove();
        }

    }
}

// Sets up a listener for clicked cards.
function clickedCard(event) {
    if (event.target.nodeName === 'LI') {
        displayCard(event.target);
    }
}

// Sets up a listener for the clicked refresh button.
function clickedRefresh(event) {
    console.log("refresh")
    window.location.reload();
}

// Function to display cards when clicked.
function displayCard(target) {
    let cardClasses = target.classList;

    // Ensure the same card was not clicked twice.
    if (!cardClasses.contains('open') && !cardClasses.contains('show')) {
        cardClasses.add('open', 'show');
        checkMatch(event.target);
    }
}

// Function to hide non matching cards
function hideCards() {
    tempOpenCards.forEach(function(card) {
        card.classList.remove('open', 'show');
    });
    tempOpenCards = [];
}

// Function to keep two matched cards face up.
function keepMatchedOpen() {
    tempOpenCards.forEach(function(card) {
        let cardClasses = card.classList;
        cardClasses.remove('open', 'show');
        cardClasses.add('match');
    });
    tempOpenCards = [];
    allOpenCards += 2

    // Prompt "You Won!" winning overlay message.
    if (allOpenCards === 16) {
        clearInterval(timer); // stop the game clock
        document.getElementById("overlay-box").style.display = "block";
        scorePanel = document.querySelector(".score-panel");
        let winningText = `You won!<br>
        ${scorePanel.outerHTML}`;
        document.getElementById("overlay-text").innerHTML = winningText;

        // Ensure player can reset the game after winning
        let refresh = document.querySelector(".fa-repeat");
        refresh.addEventListener('click', clickedRefresh);
    }
}

deck.addEventListener('click', clickedCard);

let refresh = document.querySelector(".fa-repeat");
refresh.addEventListener('click', clickedRefresh);

// Start the game clock
let startTime = performance.now();
let timer = setInterval(function(){
    let displayTime = Math.round((performance.now() - startTime)/1000);
    document.querySelector('.timer').innerHTML=`, Seconds: ${displayTime}`;
}, 1000);
