// Initialize the map
const map = L.map('map').setView([52.5200, 13.4050], 12); // Centered on Berlin

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load GeoJSON data
fetch('places.geojson')
    .then(response => response.json())
    .then(data => {
        // Add GeoJSON data to the map
        L.geoJSON(data, {
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    // Combine name and description in the popup
                    const popupContent = `
                        <h3>${feature.properties.name || 'No Name'}</h3>
                        <p>${feature.properties.description || 'No Description'}</p>
                    `;
                    layer.bindPopup(popupContent);
                }
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
