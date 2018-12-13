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
            let divSlide = document.createElement('div');
            let slideImg = document.createElement('img');
            let dot = document.createElement('span');
            
            $(divSlide).addClass('slide');
            
            $(slideImg).attr('src', this.images[i].url);
            $(slideImg).attr('alt', this.images[i].alt);
            $(slideImg).attr('title', this.images[i].title);
            
            $(dot).addClass('dot');
            
            $(divSlide).append(slideImg);
            $(divPagination).append(dot);
            $(divContainer).append(divSlide);
        }
        
        
        
        $('#slider').append(divContainer);
        
//        $(this.images).each((index, value) => {
//            let divSlide = document.createElement('div');
//            let slideImg = document.createElement('img');
//            let dot = document.createElement('span');
//            
//            $(divSlide).addClass('slide');
//            
//            $(slideImg).attr('src', value.url);
//            $(slideImg).attr('alt', value.alt);
//            $(slideImg).attr('title', value.title);
//            
//            $(dot).addClass('dot');
//            
//            $(divSlide).append(slideImg);
//            $(divPagination).append(dot);
//            $(divContainer).append(divSlide);
//        });
        
        $(this.slideDiv).append(divContainer);
        $(divContainer).append(divPagination);
        this.slides = $('.slide');
        this.dots = $('.dot');
       
        
//        let divNumber1 = document.createElement('div');
//        divNumber1.classList.add('numbertext');
//        divNumber1.textContent = (this.slideIndex + 1) + ' / ' + this.slides.length;
//        divSlide1.appendChild(divNumber1);
//        
//        let divText1 = document.createElement('div');
//        divText1.classList.add('text');
//        divText1.textContent = 'Image ' + this.slides.length;
//        divSlide1.appendChild(divText1);
//    
        
        
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
        console.log(this.slides);
        
        $(this.slides[this.slideIndex]).css('display', 'block');
        $(this.dots[this.slideIndex]).addClass('active');
    }
}

var ScrollTop = $("body").scrollTop();

if (ScrollTop > 100) {
    console.log('oui');
};