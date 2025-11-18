import TurndownService from 'turndown';

console.log("Boot Notes loading and listening");

let turndownService = new TurndownService({ bulletListMarker: '-', codeBlockStyle: 'fenced', preformattedCode: 'true', headingStyle: 'atx'});
turndownService.keep('video');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message recieved in content scritp: ", message);

    if (message.action === 'extractAndCopy') {
	console.log("Actions 'extractAndCopy' confirmed. Looking for .viewer div...");
	const viewerDiv = document.querySelector('.viewer');

	if (viewerDiv) {
	    console.log(".viewer div found");

	    const tempDiv = viewerDiv.cloneNode(true) as HTMLElement;
	    tempDiv.querySelectorAll('svg, button, input').forEach(element => {
		element.remove();
	    });

	    const htmlContent = tempDiv.innerHTML;
	    console.log(htmlContent);
	    const markdown = turndownService.turndown(htmlContent);

	    sendResponse({ status: 'success', markdown: markdown});
	    console.log("Markdown generated. Response sent");

	} else {
	    console.warn(".viewer div NOT found on this page.");
	    console.log("Sending error response because div was not found.");
	    sendResponse({ status: 'error', message: 'Lesson content not found on this page.' });
	}
	return true;
    }

    if (message.action === 'extractHeader') {
	console.log("Actions 'extractHeader confirmed. Looking for .viewer div h1...'")
	const header = document.querySelector('.viewer h1');

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

    if (message.action === 'extractCode') {
        console.log("Action 'extractCode' confirmed. Looking for .cm-content div...");
        const codeEditor = document.querySelector('.cm-content') as HTMLElement;

        if (codeEditor) {
            console.log(".cm-content div found");
            const language = codeEditor.dataset.language || '';
            const lines = Array.from(codeEditor.querySelectorAll('.cm-line'));
            const code = lines.map(line => line.textContent).join('\n');
            
            sendResponse({ status: 'success', code: code, language: language });
            console.log("Code and language extracted. Response sent");
        } else {
            console.warn(".cm-content div NOT found on this page.");
            // It's okay if it's not found, some lessons may not have it.
            sendResponse({ status: 'success', code: null, language: null });
        }
        return true;
    }
});

