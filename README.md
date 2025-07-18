# Peek: A Modern Tab Search Experience

A lightweight and fast extension to search and manage your browser tabs, featuring a modern, Gemini-inspired interface.

## Features

-   **Slick, Modern UI**: A dark-themed, minimalist design inspired by Google's Gemini.
-   **Instant Search**: Filter tabs by title or URL in real-time.
-   **Keyboard Navigation**: Seamlessly use `ArrowUp` and `ArrowDown` to navigate and `Enter` to switch.
-   **Close Tabs**: Quickly close tabs directly from the search results.
-   **Cross-Window Search**: Finds tabs across all your open Chrome windows.
-   **Keyboard Shortcut**: Open the popup with `Ctrl+Shift+Space`.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine. You can download them from [here](https://nodejs.org/).

### Installation

1.  Clone the repo:
    ```sh
    git clone https://github.com/your-username/peek.git
    ```
2.  Install NPM packages:
    ```sh
    npm install
    ```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Usage as a Chrome Extension

To load this extension in Chrome for development:

1.  **Build the extension**:
    ```sh
    npm run build
    ```
2.  **Open Chrome Extensions**:
    -   Navigate to `chrome://extensions` in your Chrome browser.

3.  **Enable Developer Mode**:
    -   In the top-right corner, turn on the "Developer mode" toggle.

4.  **Load the Extension**:
    -   Click the "Load unpacked" button.
    -   Select the `build` directory that was generated in your project.

The Peek icon will appear in your Chrome toolbar.

## How to Use

1.  Click the Peek icon in your toolbar or press `Ctrl+Shift+Space`.
2.  Start typing to filter your open tabs.
3.  Use your mouse or arrow keys to select a tab.
4.  Press `Enter` or click on the item to jump to that tab.
5.  Click the `×` button to close a tab directly from the list.


## Built With

*   [React](https://reactjs.org/) - The web framework used.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.