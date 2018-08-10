console.log('main script loaded...');

let userLocation; // CURRENT CO-ORDINATES OF USER
let map, infoWindow, geocoder;

// CREATE AND LOAD GOOGLE MAP INSTANCE
function initMap() {
    this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });
    this.infoWindow = new google.maps.InfoWindow;
    this.geocoder = new google.maps.Geocoder;
    this.checkUserGeolocation();
}

function checkUserGeolocation() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            this.userLocation = pos; // setting user current location based on GeoLocation
            console.log("checkUserGeolocation() found co-ordinates + ", this.userLocation);
            if (this.userLocation) {
                this.findPlacesNearby(this.userLocation);
                this.geocodeLatLng(this.geocoder, this.map, this.infoWindow);

            }
            this.infoWindow.setPosition(this.userLocation);
            this.infoWindow.setContent('The location has been found!');
            this.infoWindow.open(this.map);
            this.map.setCenter(this.userLocation);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

// FIND PLACES NEARBY BASED ON USER LOCATION (LAT/LNG)
function findPlacesNearby(userLoc) {
    var service = new google.maps.places.PlacesService(this.map);
    console.log('co-ordinates at findPlacesNearby :=> ', userLoc);
    service.nearbySearch({
        location: userLoc,
        radius: 1000,
        type: ['*']
        // type: ['accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm', 'bakery', 'bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store', 'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetery', 'church', 'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist', 'department_store', 'doctor', 'electrician', 'electronics_store', 'embassy', 'fire_station', 'florist', 'funeral_home', 'furniture_store', 'gas_station', 'gym', 'hair_care', 'hardware_store', 'hindu_temple', 'home_goods_store', 'hospital', 'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library', 'liquor_store', 'local_government_office', 'locksmith', 'lodging', 'meal_delivery', 'meal_takeaway', 'mosque', 'movie_rental', 'movie_theater', 'moving_company', 'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist', 'plumber', 'police', 'post_office', 'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school', 'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store', 'subway_station', 'supermarket', 'synagogue', 'taxi_stand', 'train_station', 'transit_station', 'travel_agency', 'veterinary_care', 'zoo']
    }, callback);
    // console.log("finding places at co-ordinates :=> ", userLoc);
}

function callback(results, status) {
    console.log('tracing callback fn :=> ', results, status);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location
    });

    // console.log('tracing createMarker fn :=> ', place);
    var infoWin = new google.maps.InfoWindow;
    google.maps.event.addListener(marker, 'click', function () {
        // console.log("tracing click event handler :=> ", marker);
        // console.log("tracing click event handler :=> ", marker, ', place name :=> ', place.name);
        infoWin.setContent(place.name);
        infoWin.open(map, this);
    });
}

function geocodeLatLng(geocoder, map, infoWindow) {
    geocoder.geocode({ 'location': this.userLocation }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                map.setZoom(11);
                var marker = new google.maps.Marker({
                    position: this.userLocation,
                    map: map
                });
                infoWindow.setContent(results[0].formatted_address);
                console.log("user converted address value :=> ", results[0].formatted_address);
                infoWindow.open(map, marker);
            } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}


