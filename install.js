let installButton = document.getElementById('installButton');

// Handle the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the browser from showing the default install prompt
    e.preventDefault();

    // Stash the event for later use
    window.deferredPrompt = e;

    // Make the install button visible
    installButton.style.display = 'block';
});

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
            // Clear the deferredPrompt variable after use
            window.deferredPrompt = null;
        });
    } else {
        // Provide instructions for unsupported browsers
        alert('To install this app, use the browser’s "Add to Home Screen" option.');
    }
});
