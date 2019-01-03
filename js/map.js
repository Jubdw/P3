class ResaMap {
    constructor() {
        this.myMap = null;
        this.hud = {};
    }
    
    init() {
        this.myMap = L.map('mapleaf').setView([47.205255, -1.540886], 16);
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
    
    createMarkers() {
        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Nantes&apiKey=80bb2b9387f1117e3f540eacf5480c08353b1ba6",(reponse) => {
            let stations = JSON.parse(reponse);
            stations.forEach((station) => {
                let marker = L.marker([station.position.lat, station.position.lng]).addTo(this.myMap);
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

    }
}








