// Initialize the map
const map = L.map('map', {
    zoomControl: false // Disables zoom buttons
}).setView([52.5200, 13.4050], 12); // Centered on Berlin

// Add Jawg.io tiles
L.tileLayer('https://tile.jawg.io/fd663c4b-f13d-4782-b03f-98a43b3dec72/{z}/{x}/{y}{r}.png?access-token=pvUBUhZkXVnDBUQF9HFKGHvhdn3YrgDr4bIeyxrESzyfGpyRCsL0LFgmD7RO43LQ', {
    attribution: '<a href="https://www.jawg.io?utm_medium=map&utm_source=attribution" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org?utm_medium=map-attribution&utm_source=jawg" target="_blank">&copy; OpenStreetMap</a> contributors',
    maxZoom: 19 // Ensure max zoom matches the provider's capabilities
}).addTo(map);

// Add LocateControl
L.control.locate({
    position: 'topright', // Position of the button
    flyTo: true,
    setView: 'once',
    keepCurrentZoomLevel: false,
    showPopup: true,
    strings: {
        title: "Show me where I am",
        popup: "You are within {distance} meters from this point."
    }
}).addTo(map);

// Define icons for each category using the new SVG icons in the 'icons' folder
const icons = {
    Fastfood: L.icon({ iconUrl: 'icons/fastfood.svg', iconSize: [25, 25] }),
    Secondhand: L.icon({ iconUrl: 'icons/secondhand.svg', iconSize: [25, 25] }),
    Restaurant: L.icon({ iconUrl: 'icons/restaurant.svg', iconSize: [25, 25] }),
    Bar: L.icon({ iconUrl: 'icons/bar.svg', iconSize: [25, 25] }),
    Pub: L.icon({ iconUrl: 'icons/pub.svg', iconSize: [25, 25] }),
    Club: L.icon({ iconUrl: 'icons/club.svg', iconSize: [25, 25] }),
    Cafe: L.icon({ iconUrl: 'icons/cafe.svg', iconSize: [25, 25] }),
    Other: L.icon({ iconUrl: 'icons/other.svg', iconSize: [25, 25] }),
    "Museum or gallery": L.icon({ iconUrl: 'icons/art.svg', iconSize: [25, 25] }),
    Default: L.icon({ iconUrl: 'icons/other.svg', iconSize: [25, 25] })
};

// Show the filter menu and make the filter button active on page load
document.addEventListener("DOMContentLoaded", function () {
    const filterMenu = document.getElementById("filter-menu");
    const filterButton = document.getElementById("filter-button");
    const loadingOverlay = document.getElementById("loading-overlay");

    // Show the menu and activate the filter button immediately
    filterMenu.style.display = "block";
    filterMenu.classList.add("show");
    filterButton.classList.add("active");

    // Ensure map container is fully loaded before removing the overlay
    setTimeout(() => {
        loadingOverlay.classList.add("hidden"); // Trigger fade-out of the overlay
    }, 1000); // Matches CSS transition duration
});

function toggleFilterMenu() {
    const filterMenu = document.getElementById('filter-menu');
    const filterButton = document.getElementById('filter-button');

    if (filterMenu.classList.contains('show')) {
        filterMenu.classList.remove('show'); // Hide the menu
        setTimeout(() => {
            filterMenu.style.display = 'none';
        }, 800);
        filterButton.classList.remove('active'); // Remove active state
    } else {
        filterMenu.style.display = 'block';
        setTimeout(() => {
            filterMenu.classList.add('show');
        }, 400);
        filterButton.classList.add('active'); // Add active state
    }
}


// Toggle filter menu visibility
function toggleFilterMenu() {
    const filterMenu = document.getElementById('filter-menu');
    const filterButton = document.getElementById('filter-button');
<<<<<<< HEAD
    const mapContainer = document.getElementById('map'); // Reference the map container
=======
    const mapContainer = document.getElementById('map');
>>>>>>> parent of e256087 (icon fade)

    if (filterMenu.classList.contains('show')) {
        filterMenu.classList.remove('show'); // Hide the menu
        setTimeout(() => {
            filterMenu.style.display = 'none'; 
        }, 800);
        filterButton.classList.remove('active');
<<<<<<< HEAD
        mapContainer.classList.remove('icons-hidden'); // Remove fade effect from icons
=======
        
        // ✅ Fade markers back in when menu closes
        setTimeout(() => {
            mapContainer.classList.remove('icons-hidden'); 
        }, 300);
>>>>>>> parent of e256087 (icon fade)
    } else {
        filterMenu.style.display = 'block';
        setTimeout(() => {
            filterMenu.classList.add('show');
        }, 400);
        filterButton.classList.add('active');
<<<<<<< HEAD
        mapContainer.classList.add('icons-hidden'); // Apply fade effect to icons
    }
}

=======
        
        // ✅ Fade markers out when menu opens
        setTimeout(() => {
            mapContainer.classList.add("icons-hidden");
        }, 300);
    }
}


>>>>>>> parent of e256087 (icon fade)
// Function to close the filter menu and reset the filter button
function closeFilterMenu() {
    const filterMenu = document.getElementById("filter-menu");
    const filterButton = document.getElementById("filter-button");

    filterMenu.classList.remove("show");

    setTimeout(() => {
        filterMenu.style.display = "none";
    }, 800); // Match fade-out duration

    filterButton.classList.remove("active");
}

// Create a layer group to manage markers
const markerLayer = L.layerGroup().addTo(map);

// Load GeoJSON data
fetch('places.geojson')
    .then(response => response.json())
    .then(data => {
        console.log("GeoJSON loaded successfully");

        // Function to update markers based on selected category
        function updateMarkers() {
            markerLayer.clearLayers();
            const selectedCategory = document.querySelector('.category-filter:checked').value;

            L.geoJSON(data, {
                pointToLayer: function (feature, latlng) {
                    const category = feature.properties.category || 'Default';
                    if (selectedCategory === "everything!" || selectedCategory === category) {
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

        updateMarkers();

        // Add event listener to radio buttons
document.querySelectorAll('.category-filter').forEach(radio => {
    // Handles selecting a new category
    radio.addEventListener('change', function () {
        updateMarkers();
        closeFilterMenu();
    });

    // Handles clicking the already-selected category
    radio.addEventListener('click', function () {
        if (this.checked) { // If the clicked option is already selected
            closeFilterMenu();
        }
    });
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
