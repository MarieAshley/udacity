// Main JavaScript file for the Cat Clicker game using MOV.

class Model {
    constructor() {
        this.currentCat = null;
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
        this.viewCatImage.addEventListenerToImage();
        this.viewAdmin = new ViewAdmin();
        this.viewAdmin.addEventListenerToForm();
    }
    updateCatImage(text, imageSrc, counter) {
        this.setCurrentCat(text, imageSrc, counter);
        this.viewCatImage.render(text, imageSrc, counter);
    }
    updateButtons() {
        this.viewCatButtons.render();
    }
    incrementCounter(key) {
        let cats = this.getCats();
        let counter = cats[key][1];
        counter ++; 
        cats[key][1] = counter;
        this.setCurrentCat(key, cats[key][0], counter)
        this.viewCatImage.render();
    }
    getCats() {
        return this.model.cats;
    }
    getCurrentCat() {
        return this.model.currentCat;
    }
    removeCurrentCat(text) {
        let cats = this.getCats();
        delete cats[text];
    }
    setCurrentCat(text, imageSrc, counter) {
        this.model.currentCat = [text, imageSrc, counter];

        // Update the dictionary
        let cats = this.getCats();
        cats[text] = [imageSrc, counter];
    }
}

class ViewAdmin {
    constructor(octopus) {
        this.render();
    }
    addEventListenerToForm() {
        this.form = document.querySelector("form");
        this.form.addEventListener("submit", function(event) {
            // value of this = form element
            let currentCat = octopus.getCurrentCat()[0];
            let text = this.elements.name.value;
            let imageSrc = this.elements.imgurl.value;
            let counter = this.elements.numclicks.value;
            octopus.removeCurrentCat(currentCat);
            octopus.updateCatImage(text, imageSrc, counter);
            octopus.updateButtons();
            event.preventDefault();
        });
    }
    render() {
    }
}

class ViewCatButtons {
    constructor(octopus) {
        this.octopus = octopus
        this.catList = document.querySelector(".cat-links ul");
        this.render();
    }
    addEventListenerToEachButton() {
        let octopus = this.octopus;
        let cats = octopus.getCats();
        let buttons = document.querySelectorAll(".cat-links li button");
        buttons.forEach(function(button) {
            button.addEventListener('click', function(){
                let buttonText = button.innerText;
                let imageSrc = cats[buttonText][0];
                let counter = cats[buttonText][1];
                octopus.updateCatImage(buttonText, imageSrc, counter);
            }); 
        });
    }
    updateButton() {
       let button = document.querySelector(".cat-links li button");
    }
    render() {
        // Remove current button list
        this.catList.innerHTML = "";

        let cats = this.octopus.getCats();
        for (let key in cats){
            this.catList.insertAdjacentHTML('afterbegin', `<li><button type="button">${key}</button></li>`);
        }
        this.addEventListenerToEachButton();
    }
}

class ViewCatImage {
    constructor(octopus) {
        this.octopus = octopus;
        let cats = this.octopus.getCats();

        // Easy access to DOM elements
        this.elem = document.querySelector('.box2');
        this.counterText = this.elem.querySelector('p');
        this.header = this.elem.querySelector('h3');
        this.image = this.elem.querySelector('img');


        let buttonText = document.querySelector(".cat-links li button").innerText;
        let imageSrc = cats[buttonText][0];
        let counter = cats[buttonText][1];
        this.octopus.setCurrentCat(buttonText, imageSrc, counter);
        this.render();
    }
    addEventListenerToImage() {
        let octopus = this.octopus
        let image = document.querySelector('.box2 img');
        let cats = octopus.getCats();
        image.addEventListener('click', function() {
            let key = document.querySelector('.box2 h3').textContent;
            octopus.incrementCounter(key);
        });
    }
    render() {
        let currentCat = this.octopus.getCurrentCat();
        this.header.textContent = currentCat[0];
        this.image.setAttribute("src", currentCat[1]);
        this.counterText.textContent = `Number of clicks: ${currentCat[2]}`;
    }
}

let octopus = new Octopus();
