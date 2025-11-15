import TurndownService from 'turndown';

console.log("Boot Notes loading and listening");

const turndownService = new TurndownService({ bulletListMarker: '-', codeBlockStyle: 'fenced', preformattedCode: 'true', headingStyle: 'atx'});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message recieved in content scritp: ", message);

    if (message.action === 'extractAndCopy') {
	console.log("Actions 'extractAndCopy' confirmed. Looking for #markdown-side div...");
	const markdownSideDiv = document.getElementById('markdown-side');

	if (markdownSideDiv) {
	    console.log("#markdown-side div found")
	    const htmlContent = markdownSideDiv.innerHTML;
	    const markdown = turndownService.turndown(htmlContent);

	    sendResponse({ status: 'success', markdown: markdown});
	    console.log("Markdown generated. Response sent");

	} else {
	    console.warn("#mardown-side div NOT found on this page.");
	    console.log("Sending error response because div was not found.");
	    sendResponse({ status: 'error', message: 'Lesson content not found on this page.' });
	}
	return true;
    }
});

