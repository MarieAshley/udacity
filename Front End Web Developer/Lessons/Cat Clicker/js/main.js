// Main JavaScript file for the Cat Clicker game using MOV.

class Model {
	constructor() {
		this.cats = {"Big Cat": ["img/bigcat.jpg", 0],
			         "Angry Cat": ["img/angrycat.jpg", 0],
			         "Sad Cat": ["img/sadcat.jpg", 0],
			         "Small Cat": ["img/smallcat.jpg", 0],
			         "Curious Cat": ["img/curiouscat.jpg", 0]};		
	}
}

class Octopus {
	constructor() {
		this.model = new Model();
		this.viewCatButtons = new ViewCatButtons(this);
		this.viewCatImage = new ViewCatImage(this);
		this.viewCatButtons.addEventListenerToEachButton();
		this.viewCatImage.addEventListenerToImage();
	}
	updateCatImage(text, imageSrc, counter) {
		this.viewCatImage.render(text, imageSrc, counter);
	}
	updateCounter(key, counter) {
		this.model.cats[key][1] = counter;
	}
}

class ViewCatButtons {
	constructor(octopus) {
		this.octopus = octopus
		this.catList = document.querySelector(".cat-links ul");
		this.render();
	}
	addEventListenerToEachButton() {
		let octopus = this.octopus
		let buttons = document.querySelectorAll(".cat-links li button");
		buttons.forEach(function(button) {
			button.addEventListener('click', function(){
				let buttonText = button.innerText;
				let imageSrc = octopus.model.cats[buttonText][0];
				let counter = octopus.model.cats[buttonText][1];
				octopus.updateCatImage(buttonText, imageSrc, counter);
			});	
		});
	}
	render() {
		for (let key in this.octopus.model.cats){
			this.catList.insertAdjacentHTML('afterbegin', `<li><button type="button">${key}</button></li>`);
		}
	}
}

class ViewCatImage {
	constructor(octopus) {
		this.octopus = octopus;
		let button = document.querySelector(".cat-links li button").innerText;
		let imageSrc = this.octopus.model.cats[button][0];
		let counter = this.octopus.model.cats[button][1];
		this.render(button, imageSrc, counter);
	}
	addEventListenerToImage() {
		let image = document.querySelector('.box2 img');
		let ocotopus = this.octopus;
		image.addEventListener('click', function() {
			let key = document.querySelector('.box2 h3').textContent;
			let counter = octopus.model.cats[key][1];
			let counterText = document.querySelector('.box2 p');
			counter ++;
			counterText.textContent = `Number of clicks: ${counter}`;
			octopus.updateCounter(key, counter);
		});
	}
	render(button, imageSrc, counter) {
		let elem = document.querySelector('.box2');
		let header = elem.querySelector('h3');
		header.textContent = button;
		let image = elem.querySelector('img');
		image.setAttribute("src", imageSrc);
		let counterText = elem.querySelector('p');
		counterText.textContent = `Number of clicks: ${counter}`
	}
}

let octopus = new Octopus();
