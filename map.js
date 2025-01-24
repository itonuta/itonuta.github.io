// Initialize the map
const map = L.map('map').setView([52.5200, 13.4050], 12); // Centered on Berlin

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add LocateControl
L.control.locate({
    position: 'topright',
    flyTo: true,
    strings: {
        title: "Locate Me"
    }
}).addTo(map);
