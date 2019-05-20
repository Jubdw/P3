class ResaCanvas {
    constructor() {
        this.signature = {};
        this.context = null;
        this.paint = null;
        this.validate = null;
        this.createSignature();
    }

    createSignature() {
        this.signature.canv = document.createElement('canvas');
        this.signature.canv.id = "signature";
        this.signature.canvasBox = $('#infostation');
        $(this.signature.canv).appendTo(this.signature.canvasBox);
        this.context = this.signature.canv.getContext('2d');
        this.context.strokeStyle = 'black';
        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';
        this.context.lineWidth = 2;
        
        this.signature.canv.onmousedown = (e) => {
            this.paint = true;
            this.context.beginPath();
            this.context.moveTo(e.offsetX, e.offsetY);
        }
        this.signature.canv.onmouseup = (e) => {
            this.paint = false;
        }        
        this.signature.canv.onmousemove = (e) => {
            if (this.paint) {
                this.context.lineTo(e.offsetX, e.offsetY);
                this.context.stroke();
                this.validate = true;
                }
            if (this.validate) {
                $('#reserver').css({
                    display : 'block'
                });
            }
        }        
        this.signature.canv.onmouseout = (e) => {
            this.paint = false;
        }
    }
}