class ResaMap {
    constructor() {
        this.myMap = null;
        this.stations = null;
        this.percent = null;
        this.iconList = null;
        this.hud = {};
        this.resaHud = {};
        this.activeResa = 0;
        this.intervalId = null;
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
        this.checkResa();
        this.createMarkers();
    }
    
    chooseIcon() {
        let allIcons = ['images/marker_empty_0.png', 'images/marker_20.png', 'images/marker_40.png', 'images/marker_60.png', 'images/marker_80.png', 'images/marker_100.png']
        this.iconList = allIcons[Math.round(this.percent/20)]
    }
    
    createMarkers() {
        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Nantes&apiKey=80bb2b9387f1117e3f540eacf5480c08353b1ba6",(reponse) => {
            this.stations = JSON.parse(reponse);
            this.stations.forEach((station) => {
                this.percent = station.available_bikes / station.bike_stands * 100;
                this.chooseIcon();
                let myIcon = L.icon({
                    iconUrl: this.iconList,
                    iconSize: [32, 50],
                    iconAnchor: [16, 50],
                    popupAnchor: [-16, -45]
                });
                let marker = L.marker([station.position.lat, station.position.lng], {icon: myIcon}).addTo(this.myMap);
                let onMarkerClick = (e) => {
                    let popup = L.popup();
                    popup
                        .setLatLng(e.latlng)
                        .setContent("Nom de la station : " + station.name)
                        .openOn(this.myMap);
                    this.hud.infoNom.textContent = 'Nom de la station : ' + station.name;                    
                    this.hud.infoAdresse.textContent = 'Adresse : ' + station.address;                    
                    this.hud.infoPlace.textContent = station.bike_stands + ' places';                    
                    if (station.name === localStorage.nomstation) {
                        this.hud.infoVelo.textContent = localStorage.velos + ' vélos disponibles';
                    } else {
                        this.hud.infoVelo.textContent = station.available_bikes + ' vélos disponibles';
                    }                    
                    $('#resa').css({
                        display : 'block'
                    });
                    let onResaClick = () => {
                        if (station.available_bikes === 0){
                            this.hud.infoVelo.textContent = station.available_bikes + ' vélos disponibles';
                            console.log('Aucun vélo disponible, réservation impossible.');
                        } else {
                            localStorage.setItem('nomstation', station.name);
                            localStorage.setItem('velos', station.available_bikes);
                            this.submitResa();
                            $(this.hud.inputSubmit).css({
                                display : 'none'
                            });
                            $(this.resaHud.inputCancel).css({
                                display : 'block'
                            });
                        }
                        console.log(localStorage);
                    };
                    $(this.hud.inputSubmit).on('click', onResaClick);
                }
                marker.on('click', onMarkerClick);                
            });
        });
        this.createHUD();
    }    
    
    submitResa() {
        this.sauvegarde();
        localStorage.velos -= 1;
        this.hud.infoVelo.textContent = localStorage.velos + ' vélos disponibles';
        this.resaHud.resaData.textContent = 'Vélo réservé à la station ' + localStorage.nomstation + ' par ' + localStorage.prenom + ' ' + localStorage.nom;
        $(this.resaHud.infoResa).css({
            display: 'block'
        });
        this.startChrono();
    }
    
    sauvegarde() {
        this.activeResa++;
        localStorage.setItem('reservation', this.activeResa);
        localStorage.setItem('nom', document.getElementById('nom').value);
        localStorage.setItem('prenom', document.getElementById('prenom').value);
    }
    
    startChrono() {
        let timerMinute = 20;
        let timerSeconde = 0;
        let diminuerCompteur = () => {
            this.resaHud.resaTimer.textContent = 'Temps restant : ' + timerMinute + ' minute(s) ' + timerSeconde + ' seconde(s).';
            if (timerSeconde >= 0) {
                timerSeconde--;
            }
            if (timerSeconde < 0) {
                timerMinute--;
                timerSeconde = 59;
            }
            if ((timerMinute === 0) && (timerSeconde === 0)) {
                this.resaHud.resaTimer.textContent = 'Fin de la réservation. Le vélo est à nouveau disponible à la station.';
                clearInterval(this.intervalId);
                setTimeout( () => {
                    $(this.resaHud.infoResa).css({
                            display: 'none'
                        });
                }, 10000);
                localStorage.clear;
            }
        }
        this.intervalId = setInterval(diminuerCompteur, 1000);
    }
    
    checkResa() {
        if (localStorage.reservation === 1) {
            $(this.resaHud.infoResa).css({
                display: 'block'
            });
        } else {
            $(this.resaHud.infoResa).css({
                display: 'none'
            });
        }
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
        
        this.hud.inputNom = document.createElement('input');
        this.hud.inputNom.type = "text";
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
        this.hud.inputPrenom.id = "prenom";
        this.hud.labelPrenom = document.createElement('label');
        this.hud.labelPrenom.htmlFor = "prenom";
        this.hud.labelPrenom.innerHTML = "Prénom : ";
        $(this.hud.labelPrenom).appendTo(this.hud.form).addClass('form');
        $(this.hud.inputPrenom).appendTo(this.hud.form).addClass('form');
        
        this.hud.sautLigne = document.createElement('br');
        $(this.hud.sautLigne).appendTo(this.hud.form);
        
        this.hud.inputSubmit = document.createElement('input');
        this.hud.inputSubmit.type = "button";
        this.hud.inputSubmit.value = "Réserver";
        this.hud.inputSubmit.id = "reserver";
        $(this.hud.inputSubmit).appendTo(this.hud.form).addClass('form');
        
        $(this.hud.form).appendTo(this.hud.reservation).addClass('form');
        $(this.hud.reservation).appendTo(this.hud.infoStation).addClass('form');
        
        this.createResaHud();
    }
    
    createResaHud() {
        this.resaHud.infoResa = $('#inforesa');
        
        this.resaHud.resaTitre = document.createElement('p');
        this.resaHud.resaTitre.textContent = 'Réservation validée :';
        $(this.resaHud.resaTitre).appendTo(this.resaHud.infoResa).addClass('titre');
        
        this.resaHud.resaData = document.createElement('p');
        $(this.resaHud.resaData).appendTo(this.resaHud.infoResa).addClass('info');
        
        this.resaHud.resaTimer = document.createElement('p');
        $(this.resaHud.resaTimer).appendTo(this.resaHud.infoResa).addClass('info');
        
        this.resaHud.inputCancel = document.createElement('input');
        this.resaHud.inputCancel.type = "button";
        this.resaHud.inputCancel.value = "Annuler";
        $(this.resaHud.inputCancel).appendTo(this.resaHud.infoResa).addClass('cancel');
        
        let onCancelClick = () => {
            localStorage.clear();
            document.location.reload(true);
        }
        $(this.resaHud.inputCancel).on('click', onCancelClick);
    }  
}