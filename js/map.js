class ResaMap {
    constructor() {
        this.myMap = null;
        this.hud = {};
        this.percent = null;
        this.iconList = null;
    }
    
    init() {
        this.myMap = L.map('mapleaf').setView([47.214547, -1.552943], 15);
        this.createContent();
    }
    
    createContent() {
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoianVsaWVuYmFycmUiLCJhIjoiY2pwdjdoM3o2MGRhdzN4czRmZW5ycTZuMSJ9.yILbOpuKdhUGZDaLt3PbDg'
        }).addTo(this.myMap);
        
        this.createMarkers();
    }
    
    
    chooseIcon() {
        if (this.percent === 0) {
            this.iconList = 'images/marker_empty_0.png';
        }
        if ((this.percent > 0) && (this.percent < 40)) {
            this.iconList = 'images/marker_20.png';
        }
        if ((this.percent >= 40) && (this.percent < 60)) {
            this.iconList = 'images/marker_40.png';
        }
        if ((this.percent >= 60) && (this.percent < 80)) {
            this.iconList = 'images/marker_60.png';
        }
        if ((this.percent >= 80) && (this.percent < 100)) {
            this.iconList = 'images/marker_80.png';
        }
        if (this.percent === 100) {
            this.iconList = 'images/marker_100.png';
        }
    }
    
    
    createMarkers() {
        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Nantes&apiKey=80bb2b9387f1117e3f540eacf5480c08353b1ba6",(reponse) => {
            let stations = JSON.parse(reponse);
            stations.forEach((station) => {
                this.percent = station.available_bikes / station.bike_stands * 100;
                this.chooseIcon();
                let myIcon = L.icon({
                    iconUrl: this.iconList,
                    iconSize: [38,60],
                    iconAnchor: [19, 5]
                });
                let marker = L.marker([station.position.lat, station.position.lng], {icon: myIcon}).addTo(this.myMap);
                let onMarkerClick = (e) => {
                    let popup = L.popup();
                    popup
                        .setLatLng(e.latlng)
                        .setContent("Nom de la station : " + station.name)
                        .openOn(this.myMap);
                    this.hud.infoNom.innerHTML = '';
                    this.hud.infoNom.textContent = 'Nom de la station : ' +station.name;
                    this.hud.infoAdresse.innerHTML = '';
                    this.hud.infoAdresse.textContent = 'Adresse : ' + station.address;
                    this.hud.infoPlace.innerHTML = '';
                    this.hud.infoPlace.textContent = station.bike_stands + ' places';
                    this.hud.infoVelo.innerHTML = '';
                    this.hud.infoVelo.textContent = station.available_bikes + ' vélos disponibles';
                    $('#resa').css({
                        display : 'block'
                    });
                };
                marker.on('click', onMarkerClick);
            });
        });
        this.createHUD();
    }
    
    createHUD() {
        this.hud.infoStation = $('#infostation');

        this.hud.infoTitre = document.createElement('p');
        this.hud.infoTitre.textContent = 'Détails de la station :';
        $(this.hud.infoTitre).appendTo(this.hud.infoStation).addClass('titre');

        this.hud.infoNom = document.createElement('p');
        $(this.hud.infoNom).appendTo(this.hud.infoStation).addClass('info');

        this.hud.infoAdresse = document.createElement('p');
        $(this.hud.infoAdresse).appendTo(this.hud.infoStation).addClass('info');

        this.hud.infoPlace = document.createElement('p');
        $(this.hud.infoPlace).appendTo(this.hud.infoStation).addClass('info');

        this.hud.infoVelo = document.createElement('p');
        $(this.hud.infoVelo).appendTo(this.hud.infoStation).addClass('info');
        
        
        this.hud.infoResa = document.createElement('p');
        this.hud.infoResa.textContent = 'Réservez un vélo :';
        $(this.hud.infoResa).appendTo(this.hud.infoStation).addClass('titre');
        
        this.hud.reservation = document.createElement('div');
        this.hud.reservation.id = "resa";
        
        this.hud.form = document.createElement('form');
        this.hud.form.method = "POST";
        this.hud.form.action = "bonjour.php"
        
        this.hud.inputNom = document.createElement('input');
        this.hud.inputNom.type = "text";
        this.hud.inputNom.name = "nom";
        this.hud.inputNom.id = "nom";
        this.hud.labelNom = document.createElement('label');
        this.hud.labelNom.htmlFor = "nom";
        this.hud.labelNom.innerHTML = "Nom : ";
        $(this.hud.labelNom).appendTo(this.hud.form).addClass('form');
        $(this.hud.inputNom).appendTo(this.hud.form).addClass('form');
        
        this.hud.sautLigne = document.createElement('br');
        $(this.hud.sautLigne).appendTo(this.hud.form);
        
        this.hud.inputPrenom = document.createElement('input');
        this.hud.inputPrenom.type = "text";
        this.hud.inputPrenom.name = "prenom";
        this.hud.inputPrenom.id = "prenom";
        this.hud.labelPrenom = document.createElement('label');
        this.hud.labelPrenom.htmlFor = "prenom";
        this.hud.labelPrenom.innerHTML = "Prénom : ";
        $(this.hud.labelPrenom).appendTo(this.hud.form).addClass('form');
        $(this.hud.inputPrenom).appendTo(this.hud.form).addClass('form');
        
        this.hud.sautLigne = document.createElement('br');
        $(this.hud.sautLigne).appendTo(this.hud.form);
        
        this.hud.inputSubmit = document.createElement('input');
        this.hud.inputSubmit.type = "submit";
        this.hud.inputSubmit.value = "Réserver";
        $(this.hud.inputSubmit).appendTo(this.hud.form).addClass('form');
        
        $(this.hud.form).appendTo(this.hud.reservation).addClass('form');
        $(this.hud.reservation).appendTo(this.hud.infoStation).addClass('form');
    }
}
