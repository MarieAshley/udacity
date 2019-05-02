// Main JavaScript file for the Cat Clicker game.

// Dictionary of cat headers, image sources, and initial counts
const cats = {"Big Cat": ["img/bigcat.jpg", 0],
			  "Angry Cat": ["img/angrycat.jpg", 0],
			  "Sad Cat": ["img/sadcat.jpg", 0],
			  "Small Cat": ["img/smallcat.jpg", 0],
			  "Curious Cat": ["img/curiouscat.jpg", 0]
			 };

function countTracker(counter, counterText, key) {

	return function(){
		counter ++;
		counterText.textContent = `Number of clicks: ${counter}`;
		cats[key][1] = counter;
	}
}

// Build a list of cats
let catList = document.querySelector(".cat-links ul");
for (let key in cats){
	catList.insertAdjacentHTML('afterbegin', 
		`<li><button type="button">${key}</button></li>`);

	// Finds the first (last added) button 
	// & creates an event listener to update the header and image source
	let button = document.querySelector(".cat-links li button");
	button.addEventListener('click', (function(headerText, imageSrc){
		return function() {
			let elem = document.querySelector('.box2');
			let header = elem.querySelector('h3');
			header.textContent = headerText;
			let image = elem.querySelector('img');
			image.setAttribute("src", imageSrc);
			let counterText = elem.querySelector('p');
			counterText.textContent = `Number of clicks: ${cats[headerText][1]}`
		};
	})(key, cats[key][0]));
}

// Sets the event listener on the image
let image = document.querySelector('.box2 img');
image.addEventListener('click', function() {
	let key = document.querySelector('.box2 h3').textContent;
	let counter = cats[key][1];
	let counterText = document.querySelector('.box2 p');
	counter ++;
	counterText.textContent = `Number of clicks: ${counter}`;
	cats[key][1] = counter;
});