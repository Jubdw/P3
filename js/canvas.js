class ResaCanvas {
    constructor() {
        this.signature = {};
        this.context = null;
        this.clickX = [];
        this.clickY = [];
        this.clickDrag = [];
        this.paint = null;
    }

    init() {
        this.signature.canv = document.createElement('canvas');
        this.signature.canv.id = "signature";
        this.signature.canv.width = "200";
        this.signature.canv.height = "120";

        this.signature.canvasBox = $('#sign');
        $(this.signature.canv).appendTo(this.signature.canvasBox);

        this.createSignature();
    }

    createSignature() {

        this.context = this.signature.canv.getContext('2d');
        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';

        this.signature.canv.onmousedown = (e) => {
            this.paint = true;
            this.addClick(e.clientX, e.clientY);
            this.redraw();
            console.log(this.clickX, this.clickY, this.clickDrag);
        }

        this.signature.canv.onmouseup = (e) => {
            this.paint = false;
        }

        this.signature.canv.onmousemove = (e) => {
            if (this.paint) {
                this.addClick(e.clientX, e.clientY, true);
                this.redraw();
                console.log(this.clickX, this.clickY, this.clickDrag);
            }
        }
        
        this.signature.canv.onmouseout = (e) => {
            this.paint = false;
        }

    }
    
    addClick(x, y, dragging) {
        this.clickX.push(x);
        this.clickY.push(y);
        this.clickDrag.push(dragging);
    }
    
    redraw() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.context.strokeStyle = 'red';
        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        this.context.lineWidth = 5;
        
        for (let i=0; i < this.clickX.length; i++) {
            this.context.beginPath();
            if (this.clickDrag[i] && i) {
                this.context.moveTo(this.clickX[i-1], this.clickY[i-1]);
            } else {
                this.context.moveTo(this.clickX[i]-1, this.clickY[i]-1);
            }
            this.context.lineTo(this.clickX[i], this.clickY[i]);
            this.context.closePath();
            this.context.stroke();
        }
    }
    
}
