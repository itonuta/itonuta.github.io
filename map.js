// Initialize the map
const map = L.map('map', {
    zoomControl: false // Disables zoom buttons
}).setView([52.5200, 13.4050], 12);
 // Centered on Berlin

// Add Jawg.io tiles
L.tileLayer('https://tile.jawg.io/fd663c4b-f13d-4782-b03f-98a43b3dec72/{z}/{x}/{y}{r}.png?access-token=pvUBUhZkXVnDBUQF9HFKGHvhdn3YrgDr4bIeyxrESzyfGpyRCsL0LFgmD7RO43LQ', {
    attribution: '<a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a> contributors',
    maxZoom: 19 // Ensure max zoom matches the provider's capabilities
}).addTo(map);

// Add LocateControl
L.control.locate({
    position: 'topright', // Position of the button
    flyTo: true, // Animates the map to the user's location
    setView: 'once', // Centers the map on the first location found
    keepCurrentZoomLevel: false, // Adjusts zoom level to fit user location
    showPopup: true, // Displays a popup with location info
    strings: {
        title: "Show me where I am", // Tooltip text for the button
        popup: "You are within {distance} meters from this point." // Popup text
    }
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

// Toggle filter menu visibility
function toggleFilterMenu() {
    const menu = document.getElementById('filter-menu');
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

// Create a layer group to manage markers
const markerLayer = L.layerGroup().addTo(map);

// Load GeoJSON data
fetch('places.geojson')
    .then(response => response.json())
    .then(data => {
        // Function to update markers based on selected categories
        function updateMarkers() {
            // Clear all markers
            markerLayer.clearLayers();

            // Get selected categories
            const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(checkbox => checkbox.value);

            // Add markers for selected categories
            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    const category = feature.properties.category || 'Default';
                    if (selectedCategories.includes(category)) {
                        const icon = icons[category] || icons.Default;
                        return L.marker(latlng, { icon: icon });
                    }
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
            }).addTo(markerLayer);
        }

        // Initial load of markers
        updateMarkers();

        // Add event listeners to checkboxes
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', updateMarkers);
        });
    })
    .catch(error => console.error('Error loading GeoJSON:', error));

// Remove the border of the LocateControl button via JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const locateControlDiv = document.querySelector('.leaflet-control-locate.leaflet-bar.leaflet-control');
    if (locateControlDiv) {
        locateControlDiv.style.border = 'none';
        locateControlDiv.style.boxShadow = 'none';
    }
});