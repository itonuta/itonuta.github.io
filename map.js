// Initialize the map
const map = L.map('map').setView([52.5200, 13.4050], 12); // Centered on Berlin

// Add Maptiler tiles
L.tileLayer('https://api.maptiler.com/maps/64eb344a-450d-486c-a0be-412d89b8e70d/{z}/{x}/{y}.png?key=gOESQyM8FmTuc2szi7bs', {
    attribution: '&copy; <a href="https://www.maptiler.com/">Maptiler</a>',
    tileSize: 512,
    zoomOffset: -1,
    maxZoom: 20
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

// Load GeoJSON data
fetch('places.geojson')
    .then(response => response.json())
    .then(data => {
        // Add GeoJSON data to the map
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                // Assign an icon based on the category
                const category = feature.properties.category || 'Default';
                const icon = icons[category] || icons.Default;

                return L.marker(latlng, { icon: icon });
            },
            onEachFeature: function (feature, layer) {
                // Create the popup content
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
