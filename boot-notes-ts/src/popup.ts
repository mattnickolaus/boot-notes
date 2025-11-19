function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id "${id}" not found.`);
    }
    return element as T;
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        initializePopup();
    } catch (error) {
        const statusMessage = document.getElementById('statusMessage');
        if (statusMessage) {
            statusMessage.textContent = 'An unexpected error occurred.';
            console.error(error);
        }
    }
});

async function initializePopup() {
    const lessonTitle = getElement<HTMLSpanElement>('lesson-header');
    const extractButton = getElement<HTMLButtonElement>('extractButton');
    const includeCodeCheckbox = getElement<HTMLInputElement>('includeCodeCheckbox');
    const statusMessage = getElement<HTMLParagraphElement>('statusMessage');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) {
            throw new Error('No active tab found.');
        }

        const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractHeader' });
        
        if (response?.status === 'success') {
            lessonTitle.textContent = response.lessonHeader;
        } else {
            throw new Error(response?.message || 'Could not retrieve lesson title.');
        }
    } catch (error) {
        lessonTitle.textContent = "Couldn't get lesson title.";
        statusMessage.textContent = 'Please refresh the Boot.dev page and try again.';
        console.error('Error setting lesson title:', error);
    }

    extractButton.addEventListener('click', () => {
        handleExtractClick(includeCodeCheckbox, statusMessage);
    });
}

async function handleExtractClick(
    includeCodeCheckbox: HTMLInputElement,
    statusMessage: HTMLParagraphElement
) {
    statusMessage.textContent = 'Extracting and copying...';

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) {
            throw new Error('No active tab found.');
        }

        const markdownResponse = await chrome.tabs.sendMessage(tab.id, { action: 'extractLesson' });
        if (markdownResponse?.status !== 'success') {
            throw new Error(markdownResponse?.message || 'Failed to extract lesson.');
        }
        let finalMarkdown = markdownResponse.markdown;

        if (includeCodeCheckbox.checked) {
            const codeResponse = await chrome.tabs.sendMessage(tab.id, { action: 'extractCode' });
            if (codeResponse?.status === 'success' && codeResponse.code) {
                const { code, language } = codeResponse;
                const formattedCode = `\n\n#### Assignment Code:\n\n\`\`\`${language || ''}\n${code}\n\`\`\``;
                finalMarkdown += formattedCode;
            }
        }

        await navigator.clipboard.writeText(finalMarkdown);
        statusMessage.textContent = "Lesson copied to clipboard!";

    } catch (error) {
        console.error('Error during extraction:', error);
        statusMessage.textContent = `Error: ${(error as Error).message || 'An unknown error occurred.'}`;
    }
}

