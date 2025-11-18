document.addEventListener('DOMContentLoaded', () => {
    const extractButton = document.getElementById('extractButton');
    const statusMessage = document.getElementById('statusMessage');
    const lessonTitle = document.getElementById('lesson-header');
    const includeCodeCheckbox = document.getElementById('includeCodeCheckbox') as HTMLInputElement;


    document.body.appendChild(statusMessage);

    setLessonTitle(lessonTitle);

    if (extractButton) {
	extractButton.addEventListener('click', async () => {
	    statusMessage.textContent = 'Extracting and copying...';
	    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	    if (tab && tab.id) {
		try {
		    const markdownResponse = await chrome.tabs.sendMessage(tab.id, { action: 'extractAndCopy' });

		    if (!markdownResponse || markdownResponse.status !== 'success') {
			statusMessage.textContent = `Error: ${markdownResponse.message || 'Unknown error.'}`;
			return;
		    }

		    let finalMarkdown = markdownResponse.markdown;

		    if (includeCodeCheckbox.checked) {
			const codeResponse = await chrome.tabs.sendMessage(tab.id, { action: 'extractCode' });
			if (codeResponse && codeResponse.status === 'success' && codeResponse.code) {
			    const language = codeResponse.language || '';
			    finalMarkdown += `\n\n#### Assignment Code:\n\n\`\`\`${language}\n${codeResponse.code}\n\`\`\``;
			}
		    }

		    await navigator.clipboard.writeText(finalMarkdown);
		    console.log("Copied to clipboard");
		    statusMessage.textContent = "Lesson Copied to clipboard!";

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
			    lessonTitle.textContent = "Refresh Page - Could not retrieve Boot.dev lesson";
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

