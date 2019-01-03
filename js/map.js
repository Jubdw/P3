let mymap = L.map('mapleaf').setView([47.205255, -1.540886], 16);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoianVsaWVuYmFycmUiLCJhIjoiY2pwdjdoM3o2MGRhdzN4czRmZW5ycTZuMSJ9.yILbOpuKdhUGZDaLt3PbDg'
}).addTo(mymap);



let infoStation = $('#infostation');

let infoTitre = document.createElement('p');
infoTitre.textContent = 'Détails de la station :';
infoTitre.classList.add('titre');
infoStation.append(infoTitre);

let infoNom = document.createElement('p');
infoNom.classList.add('info');
infoStation.append(infoNom);

let infoAdresse = document.createElement('p');
infoAdresse.classList.add('info');
infoStation.append(infoAdresse);

let infoPlace = document.createElement('p');
infoPlace.classList.add('info');
infoStation.append(infoPlace);

let infoVelo = document.createElement('p');
infoVelo.classList.add('info')
infoStation.append(infoVelo);


ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Nantes&apiKey=80bb2b9387f1117e3f540eacf5480c08353b1ba6",(reponse) => {
    let stations = JSON.parse(reponse);
    console.log(stations);
    stations.forEach((station) => {
        let marker = L.marker([station.position.lat, station.position.lng]).addTo(mymap);
        let popup = L.popup();
        function onMarkerClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("Nom de la station : " + station.name)
                .openOn(mymap);
            infoNom.innerHTML = '';
            infoNom.textContent = 'Nom de la station : ' +station.name;
            infoAdresse.innerHTML = '';
            infoAdresse.textContent = 'Adresse : ' + station.address;
            infoPlace.innerHTML = '';
            infoPlace.textContent = station.bike_stands + ' places';
            infoVelo.innerHTML = '';
            infoVelo.textContent = station.available_bikes + ' vélos disponibles';
        }
        marker.on('click', onMarkerClick);
    });
});


