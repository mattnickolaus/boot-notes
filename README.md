# boot-notes

A script to pull in the lessons to markdown notes from boot.dev.

Currently working on Typescript rewrite.

![boot-notes extension image](./images/boot-notes-1.png)

## Options for running scripts (current state)

Locally run script via the main.py in the root of the directory file which runs the lesson with selenium and converts the lesson (free portion) to markdown and copies to your clipboard.

``` bash
python main.py htts://boot.dev/lessons/{example-lesson-id}
```


