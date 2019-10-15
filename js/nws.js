var nwsUrl = 'https://forecast.weather.gov/MapClick.php?lat=38.8976&lon=-92.7373&unit=0&lg=english&FcstType=dwml';
//var nwsUrl = '/testNws.dwml'

var xmlResponse = '';

$.ajax({
    type: "GET",
    url: nwsUrl,
    cache: true,
    dataType: "xml",
    error: function() {
        loadError();
    },
    success: function(xml) {
        xmlResponse = xml;
        var nwsDiv = document.getElementById('nws-advisories');
        var totalHazards = loadSuccess(xml);

        //If no advisories, create an element for it
        handleNoAdvisories(totalHazards, nwsDiv);

        //Credit the NWS office
        addNwsCredit(nwsDiv);

        //Handle current weather
        addCurrentWeather(xml);
    }
});

function loadError() {
    var text = document.createTextNode('<Failed to load weather details - click here to refresh the page>');
    var a = document.createElement('a');
    a.setAttribute('href', '.');
    a.appendChild(text);
    var p = document.createElement('p');
    p.setAttribute('style', 'background-color:Azure');
    p.appendChild(a);
    var nwsDiv = document.getElementById('nws-advisories');
    nwsDiv.appendChild(p);
};

function handleNoAdvisories(totalHazards, nwsDiv) {
    if (totalHazards == 0) {
        var p = document.createElement('p');
        p.style.cssText = 'border:thin solid';
        var text = document.createTextNode('No active NWS advisories');
        var b = document.createElement('b');
        b.appendChild(text);
        p.appendChild(b);
        nwsDiv.appendChild(p);
    }
}

function addNwsCredit(nwsDiv) {
    var p = document.createElement('p');
    var a = document.createElement('a');
    a.setAttribute('href', 'https://www.weather.gov/eax/');
    a.setAttribute('target', '_blank');
    var text = document.createTextNode("Weather Forcast from the NWS Office in Kansas City, MO");
    a.appendChild(text);
    p.appendChild(a);
    nwsDiv.appendChild(p);
}

function addCurrentWeather(xml) {

    var temperature = 'N/A';
    var dewpoint = 'N/A';
    var summary = 'N/A';
    var humidity = 'N/A';
    var summaryImg = '';
    var barometer = 'N/A';
    var timestamp = 'N/A';
    var wind = 'N/A';

    $(xml).find('data').each(function() {
        if ($(this).attr('type') === 'current observations') {
            $(this).find('temperature').each(function() {
                var attr = $(this).attr('type');
                var value = $(this).find('value').text() + String.fromCharCode(176) + 'F';
                if (attr === 'apparent') {
                    temperature = value;
                } else if (attr === 'dew point') {
                    dewpoint = value;
                }
            });

            humidity = $(this).find('humidity').find('value').text() + '%';
            summary = $(this).find('weather-conditions').attr('weather-summary');
            summaryImg = $(this).find('conditions-icon').find('icon-link').text().replace('/medium/', '/large/');
            barometer = $(this).find('pressure').text() + ' in';
            var mph = 'N/A';
            $(this).find('wind-speed').each(function() {
                var attr = $(this).attr('type');
                var value = $(this).find('value').text()
                if (attr === 'sustained') {
                    mph = Math.round(value * 1.15078);
                }
            });
            wind = degToCompass($(this).find('direction').text()) + ' ' + mph + ' mph';
            timestamp = new Date($(this).find('start-valid-time').text()).toLocaleString();
        }
    });

    document.getElementById('nws-summary-img').setAttribute('src', summaryImg);
    addTextToElement('nws-summary', summary);
    addTextToElement('nws-temperature', temperature);
    addTextToElement('nws-humidity', humidity);
    addTextToElement('nws-wind', wind);
    addTextToElement('nws-barometer', barometer);
    addTextToElement('nws-dewpoint', dewpoint);
    addTextToElement('nws-timestamp', timestamp);
}

function addTextToElement(elementId, text) {
    document.getElementById(elementId).appendChild(document.createTextNode(text));
}

function loadSuccess(xml) {
    var totalHazards = 0;
    $(xml).find('hazards').each(function() {
        totalHazards++;
        var advisoryText = $(this).find('hazard').attr('headline');
        var advisoryUrl = $(this).find('hazardTextURL').text();

        var nwsDiv = document.getElementById('nws-advisories');
        var p = document.createElement('p');
        p.setAttribute('style', 'background-color:Silver');
        var text = document.createTextNode(advisoryText);
        var b = document.createElement('b');
        var a = document.createElement('a');
        a.setAttribute('href', advisoryUrl);
        a.setAttribute('target', '_blank');
        a.setAttribute('style', 'color:black');
        switch(advisoryText) {
            // Advisories gathered from:
            // https://www.weather.gov/help-map
            // https://en.wikipedia.org/wiki/Severe_weather_terminology_(United_States)

            //Severe Local Storms
            //Tornado
            case 'Tornado Watch':
            case 'Particularly Dangerous Situation Tornado Watch':
                p.setAttribute('style', 'background-color:Yellow');
                break;
            case 'Tornado Warning':
            case 'Particularly Dangerous Situation Tornado Warning':
            case 'Tornado Emergency':
                p.setAttribute('style', 'background-color:Red');
                break;

            //Severe Thunderstorm
            case 'Severe Thunderstorm Watch':
            case 'Particularly Dangerous Situation Severe Thunderstorm Watch':
                p.setAttribute('style', 'background-color:Palevioletred');
                break;
            case 'Severe Thunderstorm Warning':
            case 'Severe Thunderstorm Emergency':
            case 'Significant Weather Advisory':
                p.setAttribute('style', 'background-color:Orange');
                break;

            //Flash Flood
            case 'Flash Flood Watch':
            case 'Particularly Dangerous Situation Flash Flood Watch':
                p.setAttribute('style', 'background-color:Seagreen');
                break;
            case 'Flash Flood Warning':
            case 'Flash Flood Statement':
            case 'Flash Flood Emergency':
                p.setAttribute('style', 'background-color:Darkred');
                break;

            //Misc
            case 'Severe Weather Statement':
                p.setAttribute('style', 'background-color:Aqua');
                break;
            case 'Storm Warning':
                p.setAttribute('style', 'background-color:Darkviolet');
                break;
            case 'Storm Watch':
                p.setAttribute('style', 'background-color:Moccasin');
                break;
            case 'Short Term Forecast':
                p.setAttribute('style', 'background-color:Palegreen');
                break;
            //END Severe Local Storms

            //Winter Precipitation
            case 'Blizzard Warning':
                p.setAttribute('style', 'background-color:Orangered');
                break;
            case 'Blizzard Watch':
                p.setAttribute('style', 'background-color:Greenyellow');
                break;
            case 'Winter Storm Warning':
                p.setAttribute('style', 'background-color:Hotpink');
                break;
            case 'Winter Storm Watch':
                p.setAttribute('style', 'background-color:Steelblue');
                break;
            case 'Winter Weather Advisory':
                p.setAttribute('style', 'background-color:Mediumslateblue');
                break;
            case 'Ice Storm Warning':
                p.setAttribute('style', 'background-color:Darkmagenta');
                break;
            case 'Freezing Rain Advisory':
                p.setAttribute('style', 'background-color:Orchid');
                break;
            //END Winter Precipitation

            //Fire Weather
            case 'Fire Warning':
                p.setAttribute('style', 'background-color:Sienna');
                break;
            case 'Red Flag Warning':
                p.setAttribute('style', 'background-color:Deeppink');
                break;
            case 'Fire Weather Watch':
                p.setAttribute('style', 'background-color:Navajowhite');
                break;
            case 'Extreme Fire Danger':
                p.setAttribute('style', 'background-color:Darksalmon');
                break;

            //END Fire Weather

            //Flooding (no difference between River and Arial)
            case 'Flood Warning':
                p.setAttribute('style', 'background-color:Lime');
                break;
            case 'Flood Watch':
                p.setAttribute('style', 'background-color:Seagreen');
                break;
            case 'Flood Advisory':
            case 'Urban And Small Stream Flood Advisory':
            case 'Small Stream Flood Advisory':
            case 'Hydrologic Advisory':
                p.setAttribute('style', 'background-color:Springgreen');
                break;
            case 'Hydrologic Outlook':
                p.setAttribute('style', 'background-color:Lightgreen');
                break;
            //END Flooding

            //Temperature
            case 'Excessive Heat Warning':
                p.setAttribute('style', 'background-color:Mediumvioletred');
                break;
            case 'Excessive Heat Watch':
                p.setAttribute('style', 'background-color:Maroon');
                break;
            case 'Extreme Cold Warning':
            case 'Extreme Cold Watch':
                p.setAttribute('style', 'background-color:Blue');
                break;
            case 'Freeze Warning':
                p.setAttribute('style', 'background-color:Darkslateblue');
                break;
            case 'Freeze Watch':
                p.setAttribute('style', 'background-color:Cyan');
                break;
            case 'Frost Advisory':
                p.setAttribute('style', 'background-color:Cornflowerblue');
                break;
            case 'Hard Freeze Warning':
                p.setAttribute('style', 'background-color:Darkviolet');
                break;
            case 'Hard Freeze Watch':
                p.setAttribute('style', 'background-color:Royalblue');
                break;
            case 'Heat Advisory':
                p.setAttribute('style', 'background-color:Coral');
                break;
            //END Temperature

            //Wind
            case 'Extreme Wind Warning':
                p.setAttribute('style', 'background-color:Darkorange');
                break;
            case 'Wind Advisory':
                p.setAttribute('style', 'background-color:Tan');
                break;
            case 'High Wind Warning':
            case 'High Wind Watch':
                p.setAttribute('style', 'background-color:Darkgoldenrod');
                break;
            //END Wind

            //Wind Chill
            case 'Wind Chill Warning':
                p.setAttribute('style', 'background-color:Lightsteelblue');
                break;
            case 'Wind Chill Advisory':
                p.setAttribute('style', 'background-color:Paleturquoise');
                break;
            case 'Wind Chill Watch':
                p.setAttribute('style', 'background-color:Cadetblue');
                break;
            //END Wind Chill

            //Other Hazards
            case 'Dense Fog Advisory':
                p.setAttribute('style', 'background-color:Slategray');
                break;
            case 'Freezing Fog Advisory':
                p.setAttribute('style', 'background-color:Teal');
                break;
            case 'Civil Emergency Message':
                p.setAttribute('style', 'background-color:Lightpink');
                break;
            case 'Law Enforcement Warning':
            case 'Local Area Emergency':
            case '911 Telephone Outage':
            case 'Administrative Message':
                p.setAttribute('style', 'background-color:Silver');
                break;
            case 'Child Abduction Emergency':
                p.setAttribute('style', 'background-color:Gold');
                break;
            case 'Special Weather Statement':
                p.setAttribute('style', 'background-color:Moccasin');
                break;
            //END Other Hazards

            default:
                break;
        }
        a.appendChild(text);
        b.appendChild(a);
        p.appendChild(b);
        nwsDiv.appendChild(p);
    });

    return totalHazards;
};

function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    return arr[(val % 16)];
}
