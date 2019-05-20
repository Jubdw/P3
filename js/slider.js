// Elle est bien cachée ?

class Slider {
    constructor() {
        this.slideDiv = null;
        this.slideIndex = 0;
        this.slides = null;
        this.dots = null;
        this.prev = null;
        this.next = null;
        this.stop = null;
        this.play = null;
        this.images = null;
        this.intervalId = null;
    }
    
    init(slideDiv, images) {
        this.slideDiv = slideDiv;
        this.images = images;
        this.createContent();
        this.createEventButton();
        this.createEventKeydown();
        this.createEventDot();
        this.showSlides(this.slideIndex);
        this.createEventAutoPlay();
    }
    
    createContent() {
        let divContainer = document.createElement('div');
        let divPagination = document.createElement('div');
        
        divContainer.classList.add('container');
        divPagination.classList.add('pagination');
        
        
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
        
      
    // Boutons  next, prev, stop, play //
        
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
    
    createEventAutoPlay() {
        this.intervalId = setInterval( () => {this.plusSlides(1);}, 5000);
    }
    
    createEventDot() {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].addEventListener('click', () => {
                this.currentSlide(i);
                clearInterval(this.intervalId);
            });
        }
    }
    
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
    
    
    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }

    currentSlide(n) {
        this.showSlides(this.slideIndex = n);
    }

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

