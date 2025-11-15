document.addEventListener('DOMContentLoaded', () => {
    const extractButton = document.getElementById('extractButton');
    const statusMessage = document.getElementById('statusMessage');
    document.body.appendChild(statusMessage);

    if (extractButton) {
	extractButton.addEventListener('click', async () => {
	    statusMessage.textContent = 'Extracting and copying...';

	    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	    if (tab && tab.id) {
		try {
		    const messagePromise = chrome.tabs.sendMessage(tab.id, { action: 'extractAndCopy'});
		    console.log('1. Message Promise (before await): ', messagePromise);

		    const response = await messagePromise;
		    console.log('2. Resolved response in popup (after await): ', response);

		    if (response && response.status === 'success') {
			console.log("Sucessful response received.");
			await navigator.clipboard.writeText(response.markdown);
			console.log("Copied to clipboard");
			statusMessage.textContent = "Lesson Copied to clipboard!";
		    } else {
			statusMessage.textContent = `Error: ${response.message || 'Unknown error.'}`;
		    }
		} catch (error) {
		    console.error('Error communicating with content script:', error);
		    statusMessage.textContent = 'Could not connect to the page. Please reload the tab.';
		}
	    } else {
		statusMessage.textContent = 'No active tab found.';
	    }
	});
    }
})
