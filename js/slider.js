// Elle est bien cachée ?

class Slider {
    constructor() {
        this.slideIndex = 0;
        this.slides = null;
        this.dots = null;
        this.prev = null;
        this.next = null;
        this.images = null;
    }
    
    init(slideDiv, images) {
        this.images = images;
        this.createContent();
        this.createEventButton();
        this.createEventKeydown();
        this.createEventDot();
        this.showSlides(this.slideIndex);
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
            
            $(slideCaption).text('à kadoc');
            
            
            $(dot).addClass('dot');
            
            $(divSlide).append(slideImg);
            $(divSlide).append(slideCaption);
            $(divPagination).append(dot);
            $(divContainer).append(divSlide);
        }
                
        $('#slider').append(divContainer);        
        $(this.slideDiv).append(divContainer);
        $(divContainer).append(divPagination);
        this.slides = $('.slide');
        this.dots = $('.dot');
      

        // BOUTONS     
        let aPrev = document.createElement('a');
        aPrev.classList.add('prev');
        aPrev.textContent = '<';
        divContainer.appendChild(aPrev);
        
        this.prev = $('.prev');
        
        
        let aNext = document.createElement('a');
        aNext.classList.add('next');
        aNext.textContent = '>';
        divContainer.appendChild(aNext);
        
        this.next = $('.next');
        
        
        
    }
    
    
    createEventDot() {
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].addEventListener('click', () => {
                this.currentSlide(i);
            });
        }
    }
    
    createEventButton() {
        this.prev.on('click', () => {
            this.plusSlides(-1);
        });
        this.next.on('click', () => {
            this.plusSlides(1);
        });
    }
    
    createEventKeydown() {
        document.addEventListener('keydown', () => {
            if (event.keyCode === 37) {
                this.plusSlides(-1);
            }
            if (event.keyCode === 39) {
                this.plusSlides(1);
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

var ScrollTop = $("body").scrollTop();

if (ScrollTop > 100) {
    console.log('oui');
};