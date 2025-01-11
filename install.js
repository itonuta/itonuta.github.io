let installButton = document.getElementById('installButton');

// Check if the user is on Safari on iOS
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) && /iPhone|iPad/.test(navigator.userAgent);

// Handle the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default install dialog
    e.preventDefault();

    // Save the event for use when the button is clicked
    window.deferredPrompt = e;
});

// Handle the install button click
installButton.addEventListener('click', () => {
    if (window.deferredPrompt) {
        // Show the install prompt for browsers that support beforeinstallprompt
        window.deferredPrompt.prompt();

        // Optionally, handle the user's response to the prompt
        window.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            // Clear the deferredPrompt variable after the prompt is used
            window.deferredPrompt = null;
        });
    } else if (isSafari) {
        // Show specific instructions for iOS users
        alert('To install this app on your iPhone or iPad:\n1. Open this site in Safari.\n2. Tap the "Share" button (the square with an upward arrow).\n3. Select "Add to Home Screen".');
    } else {
        // Generic fallback for other unsupported browsers
        alert('To install this app, use your browser’s "Add to Home Screen" option.');
    }
});
