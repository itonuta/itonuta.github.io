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
    Culture: L.icon({ iconUrl: 'icons/art.svg', iconSize: [25, 25] }),
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

// Toggle filter menu visibility
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
  const selectedCategory = document.querySelector('.category-filter:checked').value;

  // Step 1: Fade out existing markers before removing them (using double requestAnimationFrame)
  markerLayer.eachLayer(layer => {
    // Check if the marker element exists.
    // In newer versions of Leaflet you might prefer layer.getElement() over layer._icon.
    const iconEl = layer.getElement ? layer.getElement() : layer._icon;
    if (iconEl) {
      // Set the transition for fading out
      iconEl.style.transition = "opacity 2s ease-out";
      // Use two nested requestAnimationFrame calls to force the style to be applied before changing opacity
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          iconEl.style.opacity = "0";
        });
      });
    }
  });

  // Step 2: Wait for the fade-out animation to complete before clearing markers.
  // (If you still don’t see the fade-out, consider increasing this timeout slightly)
  setTimeout(() => {
    markerLayer.clearLayers(); // Remove markers after fade-out

    // Step 3: Add new markers with fade-in effect using geoJSON data
    L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        const category = feature.properties.category || 'Default';
        if (selectedCategory === "everything!" || selectedCategory === category) {
          const icon = icons[category] || icons.Default;
          const marker = L.marker(latlng, { icon: icon });

          // Step 4: Fade in new markers when they are added
          marker.on('add', function() {
            const iconEl = marker.getElement ? marker.getElement() : marker._icon;
            if (iconEl) {
              // Start with zero opacity and set up a short fade-in transition
              iconEl.style.opacity = "0";
              iconEl.style.transition = "opacity 0.3s ease-in";
              setTimeout(() => {
                iconEl.style.opacity = "1";
              }, 50);
            }
          });

          return marker;
        }
      },
      onEachFeature: function(feature, layer) {
        const { name, googleMaps, category } = feature.properties;
        const popupContent = `
          <h3>${name}</h3>
          <p>${category}</p>
          <p>
            <img src="icons/google-maps.svg" alt="Google Maps Icon"
                 style="width: 16px; height: 16px; vertical-align: middle; margin-right: 5px;">
            <a href="${googleMaps}" target="_blank" rel="noopener noreferrer">
              <span style="font-weight: bold;">Google</span> Maps
            </a>
          </p>
        `;
        layer.bindPopup(popupContent);
      }
    }).addTo(markerLayer);

  }, 2100); // Wait just over 2 seconds for fade-out to finish
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
