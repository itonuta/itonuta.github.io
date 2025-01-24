// Initialize the map
const map = L.map('map').setView([52.5200, 13.4050], 12); // Initially centered on Berlin

// Add CartoDB Dark Matter tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Define icons for each category using the icons in the 'icons' folder
const icons = {
    Fastfood: L.icon({ iconUrl: 'icons/marker-icon-red.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    Secondhand: L.icon({ iconUrl: 'icons/marker-icon-green.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    Restaurant: L.icon({ iconUrl: 'icons/marker-icon-blue.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    Bar: L.icon({ iconUrl: 'icons/marker-icon-orange.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    Pub: L.icon({ iconUrl: 'icons/marker-icon-yellow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    Club: L.icon({ iconUrl: 'icons/marker-icon-violet.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    Cafe: L.icon({ iconUrl: 'icons/marker-icon-gold.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    Other: L.icon({ iconUrl: 'icons/marker-icon-black.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    "Museum or gallery": L.icon({ iconUrl: 'icons/marker-icon-grey.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }),
    Default: L.icon({ iconUrl: 'icons/marker-icon-grey.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }) // Grey as the default marker
};

// Add the Locate Me button
L.control.locate({
    position: 'topright',
    strings: {
        title: "Locate me"
    },
    flyTo: true,
    drawCircle: true,
    showPopup: true,
    locateOptions: {
        enableHighAccuracy: true
    }
}).addTo(map);

// Debugging: Log GeoJSON fetch progress
fetch('places.geojson')
    .then(response => {
        console.log('Fetching GeoJSON:', response);
        return response.json();
    })
    .then(data => {
        console.log('Loaded GeoJSON data:', data);

        // Add GeoJSON data to the map
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                const category = feature.properties.category || 'Default';
                const icon = icons[category] || icons.Default;

                console.log(`Adding marker: ${feature.properties.name}, Category: ${category}`);
                return L.marker(latlng, { icon: icon });
            },
            onEachFeature: function (feature, layer) {
                const { name, googleMaps, category } = feature.properties;
                const popupContent = `
                    <h3>${name}</h3>
                    <p>Category: ${category}</p>
                    <p>${googleMaps}</p>
                `;
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

// Handle location found
map.on('locationfound', function (e) {
    const radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map)
        .bindPopup(`You are within ${Math.round(radius)} meters from this point`).openPopup();
    L.circle(e.latlng, radius).addTo(map);
});

// Handle location error
map.on('locationerror', function (e) {
    alert("Unable to access location: " + e.message);
});
