document.addEventListener('DOMContentLoaded', () => {
    const extractButton = document.getElementById('extractButton');
    const statusMessage = document.getElementById('statusMessage');
    const lessonTitle = document.getElementById('lesson-header');


    document.body.appendChild(statusMessage);

    setLessonTitle(lessonTitle);

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


function setLessonTitle(lessonTitle: HTMLElement) {
    lessonTitle.textContent = "Test in function";
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	const activeTab = tabs[0];
	if (!activeTab) {
	    console.log("Hey no tab found.");
	}

	if (activeTab && activeTab.id) {
	    try {
		chrome.tabs.sendMessage(
		    activeTab.id,
		    { action: 'extractHeader' },
		    (response) => {
			if (chrome.runtime.lastError) {
			    lessonTitle.textContent = "Refresh Page - Could not retrieve lesson";
			} else if (response && response.status === 'success') {
			    console.log("Sucessful header response received.");
			    lessonTitle.textContent = response.lessonHeader;
			} else {
			    lessonTitle.textContent = `Error: ${response.message} || 'Unknown error.'`;
			}
		    });
	    } catch(error) {
		console.error("Error: ", error)
		lessonTitle.textContent = `Error: ${error} || 'Unknown error.'`;
	    }
	} else {
	    statusMessage.textContent = 'No active tab found.';
	}
    });
}

