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
    }
    console.log(tempOpenCards);
}

// Sets up a listener for clicked cards.
function clickedCard(event) {
    if (event.target.nodeName === 'LI') {
        displayCard(event.target);
    }
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
}

deck.addEventListener('click', clickedCard);


/*
 * set up the event listener for a card. If a card is clicked:
 *  - if the list already has another card, check to see if the two cards match
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
