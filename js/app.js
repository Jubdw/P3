// Les images du slider sont sous forme de tableau, ce qui permet d'en mettre autant que l'on veut sans changer le fonctionnement du slider
const images = [
    {url : 'images/1-reservez.jpg', alt : 'Louez un vélo à Nantes en quelques clics !', title : 'Réservez un vélo à Nantes en quelques clics !'},
    {url : 'images/2-zoom.png', alt : 'Zoom et dézoom', title : 'Zoom et dézoom'},
    {url : 'images/3-deplacer.png', alt : 'Se déplacer sur la carte', title : 'Se déplacer sur la carte'},
    {url : 'images/4-clicmarker.png', alt : 'Les marqueurs de station', title : 'Les marqueurs de station'},
    {url : 'images/5-markerstation.png', alt : 'Les informations sur les stations', title : 'Les informations sur les stations'},
    {url : 'images/6-nomprenom.png', alt : 'Indiquez vos nom et prénom', title : 'Indiquez vos nom et prénom'},
    {url : 'images/7-valider.png', alt : 'Validez nom et prénom', title : 'Validez nom et prénom'},
    {url : 'images/8-canvas.png', alt : 'La fenêtre de signature', title : 'La fenêtre de signature'},
    {url : 'images/9-signature.png', alt : 'Signez et réservez', title : 'Signez et réservez'},
    {url : 'images/10-resavalide.png', alt : 'Votre réservation est validée', title : 'Votre réservation est validée'},
    {url : 'images/11-annuler.png', alt : 'Annuler la réservation', title : 'Annuler la réservation'},
    {url : 'images/12-annulerretour.png', alt : 'Retour au choix de station', title : 'Retour au choix de station'},
    {url : 'images/13-finresa.png', alt : 'La réservation dure 20 mintes', title : 'La réservation dure 20 mintes'},
    {url : 'images/14-unefois.png', alt : 'Lorsque la réservation est validée', title : 'Lorsque la réservation est validée'},
    {url : 'images/15-prenez.jpg', alt : 'Le vélo vous attend à la station', title : 'Le vélo vous attend à la station'}
]
// Création du slider avec le tableau d'images en paramètre
const slider = new Slider($('#slider'), images);

// Récupération des données des stations depuis le serveur JCDecaux
// Création de la map avec les données des stations en paramètre pour y accéder depuis resamap.js
ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Nantes&apiKey=80bb2b9387f1117e3f540eacf5480c08353b1ba6",(reponse) => {
    this.stations = JSON.parse(reponse);
    let myMap = new ResaMap(this.stations);
});