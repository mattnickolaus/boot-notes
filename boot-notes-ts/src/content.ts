import TurndownService from 'turndown';

console.log("Boot Notes loading and listening");

const turndownService = new TurndownService({ bulletListMarker: '-', codeBlockStyle: 'fenced', preformattedCode: 'true', headingStyle: 'atx'});
turndownService.keep('video');

interface Message {
    action: string;
} 

type SendResponse = (response: any) => void;

const handleExtractLesson = (sendResponse: SendResponse) => {
    console.log("Actions 'extractLesson' confirmed. Looking for .viewer div...");
    const viewerDiv = document.querySelector('.viewer');

    if (viewerDiv) {
	console.log(".viewer div found");

	const tempDiv = viewerDiv.cloneNode(true) as HTMLElement;
	tempDiv.querySelectorAll('svg, button, input').forEach(element => {
	    element.remove();
	});

	const htmlContent = tempDiv.innerHTML;
	const markdown = turndownService.turndown(htmlContent);

	sendResponse({ status: 'success', markdown: markdown});

    } else {
	console.warn(".viewer div NOT found on this page.");
	sendResponse({ status: 'error', message: 'Lesson content not found on this page.' });
    }
}

const handleExtractHeader = (sendResponse: SendResponse) => {
    console.log("Actions 'extractHeader confirmed. Looking for .viewer div h1...'")
    const header = document.querySelector('.viewer h1');

    if (header) {
	console.log("h1 header found")
	const h1 = header.textContent;

	sendResponse({ status: 'success', lessonHeader: h1});
    } else {
	console.warn("h1 NOT found on this page.");
	sendResponse({ status: 'error', message: 'Lesson title not found on this page.' });
    }
}

const handleExtractCode = (sendResponse: SendResponse) => {
    console.log("Action 'extractCode' confirmed. Looking for .cm-content div...");
    const codeEditor = document.querySelector('.cm-content') as HTMLElement;

    if (codeEditor) {
	console.log(".cm-content div found");
	const language = codeEditor.dataset.language || '';
	const lines = Array.from(codeEditor.querySelectorAll('.cm-line'));
	const code = lines.map(line => line.textContent).join('\n');
	
	sendResponse({ status: 'success', code: code, language: language });
    } else {
	console.warn(".cm-content div NOT found on this page.");
	// return response with null if not found
	sendResponse({ status: 'success', code: null, language: null });
    }
}


chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
    console.log("Message recieved in content scritp: ", message);

    switch(message.action) {
	case "extractLesson":
	    handleExtractLesson(sendResponse);
	    break;
	case "extractHeader":
	    handleExtractHeader(sendResponse);
	    break;
	case "extractCode":
	    handleExtractCode(sendResponse);
	    break;
    }
    
    return true
});

