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

// Define icons for each category using the new SVG icons in the 'icons' folder
const icons = {
    Fastfood: L.icon({ iconUrl: 'icons/fastfood.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    Secondhand: L.icon({ iconUrl: 'icons/secondhand.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    Restaurant: L.icon({ iconUrl: 'icons/restaurant.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    Bar: L.icon({ iconUrl: 'icons/bar.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    Pub: L.icon({ iconUrl: 'icons/pub.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    Club: L.icon({ iconUrl: 'icons/club.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    Cafe: L.icon({ iconUrl: 'icons/cafe.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    Other: L.icon({ iconUrl: 'icons/other.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    "Museum or gallery": L.icon({ iconUrl: 'icons/art.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }),
    Default: L.icon({ iconUrl: 'icons/other.svg', iconSize: [25, 25], iconAnchor: [10, 10], popupAnchor: [0, -10] }) // Using 'other.svg' as a fallback
};


// Toggle filter menu visibility
function toggleFilterMenu() {
    const filterMenu = document.getElementById('filter-menu');
    const filterButton = document.getElementById('filter-button');

    if (filterMenu.classList.contains('show')) {
        filterMenu.classList.remove('show'); // Hide the menu
        setTimeout(() => {
            filterMenu.style.display = 'none'; // Ensure it's fully hidden after fading out
        }, 800); // Match the fade-out duration (0.8s)
        filterButton.classList.remove('active'); // Remove button active state
    } else {
        filterMenu.style.display = 'block'; // Ensure it's displayed for the animation
        setTimeout(() => {
            filterMenu.classList.add('show'); // Fade in the menu
        }, 400); // Slight delay to trigger the transition
        filterButton.classList.add('active'); // Add button active state
    }
}

// Button to close the filter menu
document.getElementById("closeFilter").addEventListener("click", function() {
    const filterMenu = document.getElementById("filter-menu");
    const filterButton = document.getElementById("filter-button");

    // Remove the "show" class so the transition effect works
    filterMenu.classList.remove("show");

    // Wait for the fade-out animation to complete before hiding the menu
    setTimeout(() => {
        filterMenu.style.display = "none";
    }, 800); // Match the CSS transition time (0.8s)

    // Remove the "active" state from the button
    filterButton.classList.remove("active");
});

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