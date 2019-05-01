// Main JavaScript file for the Cat Clicker game.

// Variables to change
const header1Text = "Mini Tiger";
const header2Text = "Big Tiger";

// Box 1
const elem1 = document.querySelector('.box1');
const header1 = elem1.querySelector('h3');
header1.textContent = header1Text;
const image1 = elem1.querySelector('img');
const counterText1 = elem1.querySelector('p');
let counter1 = 0;
image1.addEventListener('click', function() {
	counter1 ++;
	counterText1.textContent = `Number of clicks: ${counter1}`;
}, false);

// Box 2
const elem2 = document.querySelector('.box2');
const header2 = elem2.querySelector('h3');
header2.textContent = header2Text;
const image2 = elem2.querySelector('img');
const counterText2 = elem2.querySelector('p');
let counter2 = 0;
image2.addEventListener('click', function() {
	counter2 ++;
	counterText2.textContent = `Number of clicks: ${counter2}`;
}, false);