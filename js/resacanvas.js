class ResaCanvas {
    constructor() {
        this.signature = {};
        this.context = null;
        this.paint = null;
        this.validate = null;
        this.createSignature();
    }
    // Création du canvas, assignation du contexte et du style de pinceau pour le dessin
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
        
    // Au clic dans le canvas, activation du dessin
        this.signature.canv.onmousedown = (e) => {
            this.paint = true;
            this.context.beginPath();
            this.context.moveTo(e.offsetX, e.offsetY);
        }
    // Relachement du clic, ne dessine plus
        this.signature.canv.onmouseup = (e) => {
            this.paint = false;
        }
    // Si le clic est maintenu enfoncé, enregistrement des points du canvas concernés, dessin, et apparition du bouton 'réserver' quand la signature a été tracée
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
    // Sortie du cadre du canvas, fin du dessin
        this.signature.canv.onmouseout = (e) => {
            this.paint = false;
        }
    }
}