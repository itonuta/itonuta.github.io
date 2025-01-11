let installButton = document.getElementById('installButton');

// Handle the install button click
installButton.addEventListener('click', () => {
    if (window.deferredPrompt) {
        // Show the install prompt
        window.deferredPrompt.prompt();

        // Optionally, handle the user's response
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Clear the deferredPrompt variable
            window.deferredPrompt = null;
        });
    } else {
        // Provide fallback for unsupported browsers
        alert('To install this app, use the browser’s "Add to Home Screen" option.');
    }
});

// Listen for the beforeinstallprompt event to cache it
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default install dialog
    e.preventDefault();

    // Save the event for use when the button is clicked
    window.deferredPrompt = e;
});
