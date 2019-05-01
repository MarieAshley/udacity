// Main JavaScript file for the Cat Clicker game.

const elem = document.getElementById('cat-image');
const counterText = document.getElementById('counter');
let counter = 0;
elem.addEventListener('click', function(){
	counter ++;
	counterText.textContent = `Number of clicks: ${counter}`;
}, false);