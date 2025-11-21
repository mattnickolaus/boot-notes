# boot-notes

A Chrome extension for converting [boot.dev](https://boot.dev) lessons to Markdown for efficient note-taking in platforms like Obsidian or Notion.

![Quick Demo](./images/boot-notes-demo_4.gif)

* [Features](#features)
* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

## Features

- **Convert to Markdown**: Extracts lesson content from boot.dev and converts it to Markdown.
    - Including: Code Snippets, Images, and *Videos (videos extracted as html unconverted)
- **Copy to Clipboard**: Copies the Markdown content to your clipboard.
- **Include Code**: Option to include code from the boot.dev editor in the copied content.

## Requirements

* [Node.js](https://nodejs.org/en/) (>=20.19.0)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/mattnickolaus/boot-notes.git && cd ./boot-notes
    ```

2.  Install dependencies:
    ```bash
    npm ci
    ```

3.  Build the extension:
    ```bash
    npm run build
    ```
    This will create a `dist` directory with the extension files.

4.  Load the extension in Chrome:
    *   Open Chrome and navigate to `chrome://extensions`.
    *   Enable "Developer mode" in the top right corner.
    *   Click "Load unpacked" and select the `dist` directory.

## Usage

While on a boot.dev lesson, click the Boot Notes extension icon. You'll see a popup with an option to include the assignment code. Click "Copy Lesson" to copy the lesson content to your clipboard.

![Boot Notes Extension Popup UI](./images/boot-notes-1.png)

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

> Note: I intend to port this over to a Firefox extension in the near future as well.

## License

This project is licensed under the MIT License.


