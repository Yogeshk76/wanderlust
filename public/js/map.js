document.addEventListener('DOMContentLoaded', async (event) => {
const listingDataElement = document.getElementById('listingData');const location = listingDataElement.getAttribute('data-location');
const country = listingDataElement.getAttribute('data-country');
const address = `${location}, ${country}`;
let api_key="664da79fc6a76459125172pyh7c330b"

const response = await fetch (`https://geocode.maps.co/search?q=${address}&api_key=${api_key}`)
var data=await response.json()
let mydata=data[0];
let lon=mydata.lon;
let lat=mydata.lat;

mapboxgl.accessToken = "pk.eyJ1IjoiZGVsdGEtc3R1ZGVudGpvaG4iLCJhIjoiY2x3aGd5ZjBhMGVydjJqc2Qxcmw0anpjcCJ9.a1YAS-bV6VqjbfAhHGplnA";
        const map = new mapboxgl.Map({
            container: 'map', 
            center: [lon,lat], 
            zoom: 9 
        });

        const marker1=new mapboxgl.Marker().setLngLat([lon,lat]).addTo(map)
    })
