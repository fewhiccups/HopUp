var geocoder = new google.maps.Geocoder();

document.getElementById('submitZipForm').onclick = function() {
    var input_zip = document.getElementById('zip_code_input').value;
    if(!input_zip) {
        console.log('no values entered!');
        return false;
    } else {
        validateZipCode(input_zip);
    }
};

function validateZipCode(input_zip) {
    console.log('validating zip code: ', input_zip);
    geocoder.geocode({ 'address': input_zip }, function (result, status) {
        var state = "N/A";
        if(result[0]) {
            for (var component in result[0]['address_components']) {
                // console.log(result[0]['address_components'][component]['types'][i], '=====');
                for (var i in result[0]['address_components'][component]['types']) {
                    if (result[0]['address_components'][component]['types'][i] == "administrative_area_level_1") {
                        // console.log(result[0]['address_components'][component]['types'][i], '=====');
                        state = result[0]['address_components'][component]['short_name'];
                        console.log("[ ", input_zip, ' : ', state, ' ]');
                        // do stuff with the state here!
                        document.getElementById('state').innerHTML = state;
                        return;
                    } else {
                        document.getElementById('state').innerHTML = 'No records found!';
                    }
                }
            }
        } else {
            document.getElementById('zip_code_input').setAttribute('border', '1px solid red');
            console.log('none');
        }

    });
}