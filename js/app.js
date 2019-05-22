const images = [
    {url : 'images/vieler1.jpg', alt : 'vieler1', title : 'wouf1'},
    {url : 'images/vieler2.jpg', alt : 'vieler2', title : 'wouf2'},
    {url : 'images/vieler3.jpg', alt : 'vieler3', title : 'wouf3'},
    {url : 'images/vieler4.jpg', alt : 'vieler4', title : 'wouf4'},
    {url : 'images/vieler5.jpg', alt : 'vieler5', title : 'wouf5'},
    {url : 'images/vieler6.jpg', alt : 'vieler6', title : 'wouf6'}
]
const slider = new Slider($('#slider'), images);

ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Nantes&apiKey=80bb2b9387f1117e3f540eacf5480c08353b1ba6",(reponse) => {
    this.stations = JSON.parse(reponse);
    let myMap = new ResaMap(this.stations);
});