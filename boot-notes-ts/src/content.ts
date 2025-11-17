import TurndownService from 'turndown';

console.log("Boot Notes loading and listening");

let turndownService = new TurndownService({ bulletListMarker: '-', codeBlockStyle: 'fenced', preformattedCode: 'true', headingStyle: 'atx'});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message recieved in content scritp: ", message);

    if (message.action === 'extractAndCopy') {
	console.log("Actions 'extractAndCopy' confirmed. Looking for #markdown-side div...");
	const markdownSideDiv = document.getElementById('markdown-side');

	if (markdownSideDiv) {
	    console.log("#markdown-side div found");

	    const tempDiv = markdownSideDiv.cloneNode(true) as HTMLElement;
	    tempDiv.querySelectorAll('svg').forEach(element => {
            element.remove();
        });
	    tempDiv.querySelectorAll('button').forEach(element => {
            element.remove();
        });
	    tempDiv.querySelectorAll('input').forEach(element => {
            element.remove();
        });

	    const htmlContent = tempDiv.innerHTML;
	    console.log(htmlContent);
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

    if (message.action === 'extractHeader') {
	console.log("Actions 'extractHeader confirmed. Looking for #markdown-side div h1...'")
	const header = document.querySelector('h1');

	if (header) {
	    console.log("h1 header found")
	    const h1 = header.textContent;

	    sendResponse({ status: 'success', lessonHeader: h1});
	    console.log("h1 response sent");

	} else {
	    console.warn("h1 NOT found on this page.");
	    console.log("Sending error response because h1 was not found.");
	    sendResponse({ status: 'error', message: 'Lesson title not found on this page.' });
	}
	return true;
    }
});

