# PROJECT ETERNITY

A small, multi-file front-end project built with HTML5, CSS3, and modern JavaScript modules.

## Features
- Responsive interface
- ES module architecture
- Encapsulated application class and private fields
- Event-driven form handling
- Async passphrase verification
- Map-based message archive
- Dynamic DOM updates and status feedback

## Run locally
1. Extract the project folder.
2. Open a terminal in the project folder.
3. Run `python -m http.server 8000`
4. Visit `http://localhost:8000` in your browser.

Modern browsers restrict JavaScript modules opened directly through `file://`, so use a local server.

## Customize before sharing
Edit `js/config.js`:
- Change `recipient`.
- Change `passphrase`.
- Rewrite `message` in your own words.

The passphrase check is a playful reveal gate only. The passphrase and message are included in the client-side source files, so this is not real authentication or encryption. Do not store confidential information in this project.

## Technologies
HTML5 · CSS3 · JavaScript ES modules · DOM API · Async/Await · Map
