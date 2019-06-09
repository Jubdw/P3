class ResaMap {
    constructor(stations) {
        this.percent = null;
        this.iconList = null;
        this.hud = {};
        this.resaHud = {};
        this.activeResa = 0;
        this.intervalId = null;
        this.myMap = L.map('mapleaf').setView([47.214547, -1.552943], 15);
        this.stations = stations;
        this.createContent();
    }
    // Affichage de la carte
    createContent() {
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoianVsaWVuYmFycmUiLCJhIjoiY2pwdjdoM3o2MGRhdzN4czRmZW5ycTZuMSJ9.yILbOpuKdhUGZDaLt3PbDg'
        }).addTo(this.myMap);
        this.createMarkers();
    }
    // Choix de l'icône en fonction du nombre de vélos disponibles => markers plus ou moins remplis
    chooseIcon() {
        let allIcons = ['images/marker_empty_0.png', 'images/marker_20.png', 'images/marker_40.png', 'images/marker_60.png', 'images/marker_80.png', 'images/marker_100.png']
        this.iconList = allIcons[Math.round(this.percent/20)]
    }
    // Ajout des markers aux emplacements des stations, ajout des informations relatives au stations suite à un clic sur un marker
    createMarkers() {
        this.stations.forEach((station) => {
            this.percent = station.available_bikes / station.bike_stands * 100;
            this.chooseIcon();
            let myIcon = L.icon({
                iconUrl: this.iconList,
                iconSize: [37.9, 60],
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
                this.hud.infoVelo.textContent = station.available_bikes + ' vélos disponibles';
                sessionStorage.setItem('nomstation', station.name);
                sessionStorage.setItem('velos', station.available_bikes);
                if (!sessionStorage.reservation) {
                $('#resa').css({
                    visibility : 'visible'
                });
                $(this.hud.infoResa).css({
                    visibility : 'visible'
                });
                $('#valider').css({
                    visibility : 'visible'
                });
                }
            }
            marker.on('click', onMarkerClick);
        });
        this.createHUD();
        this.reserver();
    }
    // Fonction de réservation, au clic sur le bouton 'réserver' => effacement du bouton de validation des input nom et prenom et du canvas pour la signature
    reserver() {
        let onResaClick = () => {
            if (sessionStorage.velos <= 0){
                this.hud.infoVelo.textContent = sessionStorage.velos + ' vélos disponibles';
                alert('Aucun vélo disponible, réservation impossible.');
            } else {
                this.submitResa();
                $(this.hud.inputSubmit).css({
                    visibility : 'hidden'
                });
                $('#signature').css({
                    visibility : 'hidden'
                });
                $(this.hud.infoResa).css({
                    visibility : 'hidden'
                });
                $('#valider').css({
                    visibility : 'hidden'
                });
                $(this.resaHud.inputCancel).css({
                    visibility : 'visible'
                });
            }
        }
        $(this.hud.inputSubmit).on('click', onResaClick);
    }
    // Sauvegarde des informations de réservation, lancement du chrono
    submitResa() {
        this.sauvegarde();
        sessionStorage.velos -= 1;
        this.hud.infoVelo.textContent = sessionStorage.velos + ' vélos disponibles';
        this.resaHud.resaData.textContent = 'Vélo réservé à la station ' + sessionStorage.nomstation + ' par ' + localStorage.prenom + ' ' + localStorage.nom;
        $(this.resaHud.infoResa).css({
            visibility : 'visible'
        });
        $(this.resaHud.inputCancel).css({
            visibility : 'visible'
        });
        this.startChrono(20, 0);
    }
    sauvegarde() {
        this.activeResa++;
        sessionStorage.setItem('reservation', this.activeResa);
        localStorage.setItem('nom', document.getElementById('nom').value);
        localStorage.setItem('prenom', document.getElementById('prenom').value);
    }
    // Chrono de 20min pour la réservation, effacement de celui-ci et fin de réservation au bout des 20min
    startChrono(timerMinute, timerSeconde) {
        let diminuerCompteur = () => {
            sessionStorage.setItem('minute', timerMinute);
            sessionStorage.setItem('seconde', timerSeconde);
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
                        visibility : 'hidden'
                    });
                    $(this.resaHud.inputCancel).css({
                        visibility : 'hidden'
                    });
                    $('#valider').css({
                        visibility : 'visible'
                    });
                    $('#resa').css({
                        visibility : 'visible'
                    });
                }, 10000);
                localStorage.clear;
                sessionStorage.clear;
            }
        }
        this.intervalId = setInterval(diminuerCompteur, 1000);
    }
    // Création de la fenêtre des infos relatives aux stations, des inputs et boutons 'valider' et 'réserver'
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
        
        this.hud.sautLigne = document.createElement('br');
        $(this.hud.sautLigne).appendTo(this.hud.infoStation);
        
        this.hud.reservation = document.createElement('div');
        this.hud.reservation.id = "resa";
        
        this.hud.infoResa = document.createElement('p');
        this.hud.infoResa.textContent = 'Réservez un vélo :';
        $(this.hud.infoResa).appendTo(this.hud.reservation).addClass('titre');
        
        this.hud.form = document.createElement('form');
        
        this.hud.inputNom = document.createElement('input');
        this.hud.inputNom.type = "text";
        this.hud.inputNom.id = "nom";
        this.hud.inputNom.title = "Votre nom. Deux lettres minimum.";
        this.hud.sautLigne = document.createElement('br');
        $(this.hud.sautLigne).appendTo(this.hud.form);
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
        this.hud.inputPrenom.title = "Votre prénom. Deux lettres minimum.";
        this.hud.sautLigne = document.createElement('br');
        $(this.hud.sautLigne).appendTo(this.hud.form);
        this.hud.labelPrenom = document.createElement('label');
        this.hud.labelPrenom.htmlFor = "prenom";
        this.hud.labelPrenom.innerHTML = "Prénom : ";
        $(this.hud.labelPrenom).appendTo(this.hud.form).addClass('form');
        $(this.hud.inputPrenom).appendTo(this.hud.form).addClass('form');
        
        this.hud.inputValidate = document.createElement('input');
        this.hud.inputValidate.type = "button";
        this.hud.inputValidate.value = "Valider Nom et Prénom";
        this.hud.inputValidate.id = "valider";
        $(this.hud.inputValidate).appendTo(this.hud.form).addClass('form');
        
        // Utilisation d'une Regex pour valider les input => acceptation de lettres uniquement, refus des caractères spéciaux et des chiffres. Deux caractères minimum.
        let onValidateClick = () => {
            let reg = /[^a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]/ig;
            let iPrenom = document.getElementById('prenom').value;
            let iNom = document.getElementById('nom').value;
            let reg1 = reg.test(iPrenom);
            let reg2 = reg.test(iNom);
            if ((document.getElementById('nom').value.length < 2) || (document.getElementById('prenom').value.length < 2)) {
                alert('Les Champs "Nom" et "Prénom" doivent être rempli par au moins deux caractères.');
            } else if ((reg1) || (reg2)) {
                alert("Aucun chiffre ou caractère spécial accepté. Uniquement des lettres.");
            // Si une réservation à déjà été validée puis annulée, effacement du canvas pour en afficher un nouveau
            } else if (document.getElementById('signature')) {
                let canv = document.getElementById('signature');
                let divParent = document.getElementById('infostation');
                divParent.removeChild(canv);
                const signature = new ResaCanvas();
                $('#valider').css({
                    visibility : 'hidden'
                });
                $('#resa').css({
                    visibility : 'hidden'
                });
            } else {
                const signature = new ResaCanvas();
                $('#valider').css({
                    visibility : 'hidden'
                });
                $('#resa').css({
                    visibility : 'hidden'
                });
            }
        }
        $(this.hud.inputValidate).on('click', onValidateClick);
        
        this.hud.inputSubmit = document.createElement('input');
        this.hud.inputSubmit.type = "button";
        this.hud.inputSubmit.value = "Réserver";
        this.hud.inputSubmit.id = "reserver";
        $(this.hud.inputSubmit).appendTo(this.hud.form).addClass('form');
        
        $(this.hud.form).appendTo(this.hud.reservation).addClass('form');
        $(this.hud.reservation).appendTo(this.hud.infoStation).addClass('form');
        this.createResaHud();
    }
    // Création de la fenêtre de réservation validée, ajout d'un bouton 'annuler'
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
        
        // Si annulation d'une réservation, effacement des données enregistrées, du chrono et de la fenêtre de réservation et effacement des infos station => retour au choix de station
        let onCancelClick = () => {
            this.activeResa--;
            localStorage.clear();
            sessionStorage.clear();
            clearInterval(this.intervalId);
            this.hud.infoVelo.textContent = '';
            this.hud.infoPlace.textContent = '';
            this.hud.infoAdresse.textContent = '';
            this.hud.infoNom.textContent = '';
            $(this.resaHud.infoResa).css({
                visibility : 'hidden'
            });
            $(this.resaHud.inputCancel).css({
                visibility : 'hidden'
            });
            $('#valider').css({
                visibility : 'hidden'
            });
            $('#resa').css({
                visibility : 'hidden'
            });
        }
        $(this.resaHud.inputCancel).on('click', onCancelClick);
        
        // Si une réservation est active, on affiche les infos de résa et le timer au chargement de la page
        if (sessionStorage.reservation) {
            $(this.resaHud.infoResa).css({
                visibility : 'visible'
            });
            this.resaHud.resaData.textContent = 'Vélo réservé à la station ' + sessionStorage.nomstation + ' par ' + localStorage.prenom + ' ' + localStorage.nom;
            this.startChrono(sessionStorage.minute, sessionStorage.seconde);
        } else {
            $(this.resaHud.infoResa).css({
                visibility : 'hidden'
            });
        }
    }
}