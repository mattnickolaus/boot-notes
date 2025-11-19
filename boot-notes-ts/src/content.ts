import TurndownService from 'turndown';

const turndownService = new TurndownService({
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    headingStyle: 'atx',
});
turndownService.keep(['video']);


type MessageAction = 'extractLesson' | 'extractHeader' | 'extractCode';

interface Message {
    action: MessageAction;
}

type StatusResponse = {
    status: 'success' | 'error';
    message?: string;
};

type MarkdownResponse = StatusResponse & {
    markdown?: string;
};

type HeaderResponse = StatusResponse & {
    lessonHeader?: string | null;
};

type CodeResponse = StatusResponse & {
    code?: string | null;
    language?: string;
};

type SendResponse = (response: StatusResponse | MarkdownResponse | HeaderResponse | CodeResponse) => void;


const handleExtractLesson = (sendResponse: SendResponse) => {
    const viewerDiv = document.querySelector('.viewer');
    if (!viewerDiv) {
        sendResponse({ status: 'error', message: 'Lesson content not found.' });
        return;
    }

    const tempDiv = viewerDiv.cloneNode(true) as HTMLElement;
    tempDiv.querySelectorAll('svg, button, input').forEach(el => el.remove());

    const htmlContent = tempDiv.innerHTML;
    const markdown = turndownService.turndown(htmlContent);

    sendResponse({ status: 'success', markdown });
};

const handleExtractHeader = (sendResponse: SendResponse) => {
    const header = document.querySelector('.viewer h1');
    if (!header) {
        sendResponse({ status: 'error', message: 'Lesson title not found.' });
        return;
    }
    sendResponse({ status: 'success', lessonHeader: header.textContent });
};

const handleExtractCode = (sendResponse: SendResponse) => {
    const codeEditor = document.querySelector('.cm-content') as HTMLElement;
    if (!codeEditor) {
        sendResponse({ status: 'success', code: null, language: null });
        return;
    }

    const language = codeEditor.dataset.language || '';
    const lines = Array.from(codeEditor.querySelectorAll('.cm-line'));
    const code = lines.map(line => line.textContent).join('\n');
    
    sendResponse({ status: 'success', code, language });
};

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
    switch (message.action) {
        case 'extractLesson':
            handleExtractLesson(sendResponse);
            break;
        case 'extractHeader':
            handleExtractHeader(sendResponse);
            break;
        case 'extractCode':
            handleExtractCode(sendResponse);
            break;
        default:
            sendResponse({ status: 'error', message: 'Unknown action requested.' });
    }
    
    return true;
});

