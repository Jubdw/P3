class Slider {
    constructor(slideDiv, images) {
        this.slideDiv = slideDiv;
        this.images = images;
        this.slideIndex = 0;
        this.slides = null;
        this.dots = null;
        this.prev = null;
        this.next = null;
        this.stop = null;
        this.play = null;
        this.intervalId = null;
        this.createContent();
        this.createEventButton();
        this.createEventKeydown();
        this.createEventDot();
        this.showSlides(this.slideIndex);
        this.createEventAutoPlay();
    }
    // Création du slider
    createContent() {
        let divContainer = document.createElement('div');
        let divPagination = document.createElement('div');
        
        divContainer.classList.add('container');
        divPagination.classList.add('pagination');
        
    // Pour chaque images contenu dans le tableau 'images' du fichier app.js, création de tous les éléments nécessaires
        for (let i = 0; i < $(this.images).length; i++) {
            let divSlide = document.createElement('figure');
            let slideImg = document.createElement('img');
            let slideCaption = document.createElement('figcaption');
            let dot = document.createElement('span');
            
            $(divSlide).addClass('slide');
            
            $(slideImg).attr('src', this.images[i].url);
            $(slideImg).attr('alt', this.images[i].alt);
            $(slideImg).attr('title', this.images[i].title);
            
            $(slideCaption).text(this.images[i].title);
            
            
            $(dot).addClass('dot');
            
            $(divSlide).append(slideImg);
            $(divSlide).append(slideCaption);
            $(divPagination).append(dot);
            $(divContainer).append(divSlide);
        }
               
        $(this.slideDiv).append(divContainer);
        $(divContainer).append(divPagination);
        this.slides = $('.slide');
        this.dots = $('.dot');
        
      
    // Création des boutons  next, prev, stop, play
        
        let aPrev = document.createElement('a');
        aPrev.classList.add('prev');
        aPrev.innerHTML = '&#139;';
        divContainer.appendChild(aPrev);        
        this.prev = $('.prev');
        
        
        let aNext = document.createElement('a');
        aNext.classList.add('next');
        aNext.innerHTML = '&#155;';
        divContainer.appendChild(aNext);        
        this.next = $('.next');
        
        
        let aStop = document.createElement('a');
        aStop.classList.add('stop');
        aStop.innerHTML = '&#x25A3;';
        divContainer.appendChild(aStop);
        this.stop = $('.stop');
        
        
        let aPlay = document.createElement('a');
        aPlay.classList.add('play');
        aPlay.innerHTML = '&#x25b7;';
        divContainer.appendChild(aPlay);
        this.play = $('.play');
        
    }
    
    // Défilement auto du slider, toutes les 5s
    createEventAutoPlay() {
        this.intervalId = setInterval( () => {this.plusSlides(1);}, 5000);
    }
    
    // Avancement du slider au clic sur le point de l'image concernée via son index dans le tableau et fin du défilement auto
    createEventDot() {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].addEventListener('click', () => {
                this.currentSlide(i);
                clearInterval(this.intervalId);
            });
        }
    }
    
    // Avancement ou recul de une image pour les boutons next et prev et arrêt du défilement auto, arrêt du défilement auto au bouton stop et reprise au bouton play
    createEventButton() {
        this.prev.on('click', () => {
            this.plusSlides(-1);
            clearInterval(this.intervalId);
        });
        this.next.on('click', () => {
            this.plusSlides(1);
            clearInterval(this.intervalId);
        });
        this.stop.on('click', () => {
            clearInterval(this.intervalId);
        });
        this.play.on('click', () => {
            this.createEventAutoPlay();
        });
    }
    
    // Si le slider est visible à l'écran, les touches flèches directionnelles permettent d'avancer et de reculer
    createEventKeydown() {
        document.addEventListener('keydown', (event) => {
            let scrollTop = parseInt($(window).scrollTop());
            if (scrollTop < $('#map').offset().top) {
                if (event.keyCode === 37) {
                    this.plusSlides(-1);
                    clearInterval(this.intervalId);
                }
                if (event.keyCode === 39) {
                    this.plusSlides(1);
                    clearInterval(this.intervalId);
                }
            }
        });
    }
    
    // On avance ou recul vers l'image concernée
    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }
    // On se dirige vers l'image choisie par son index
    currentSlide(n) {
        this.showSlides(this.slideIndex = n);
    }
    // Permet d'afficher une seule image à la fois, celle qui doit être affichée. Si on dépasse le nombre d'images présentes dans le slider, retour à la 1ère slide.
    showSlides(n) {
        let i;
        if (n > this.slides.length - 1) {
            this.slideIndex = 0;
        }    
        if (n < 0) {
            this.slideIndex = this.slides.length - 1;
        }

        for (i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = "none";  
        }

        for (i = 0; i < this.dots.length; i++) {
            this.dots[i].className = this.dots[i].className.replace(" active", "");
        }
        
        $(this.slides[this.slideIndex]).css('display', 'block');
        $(this.dots[this.slideIndex]).addClass('active');
    }
}

