/**
 * background.js
 * 
 * This script runs in the background and is responsible for handling
 * events that are not tied to a specific popup or content script,
 * such as keyboard shortcuts.
 */

// Listener for keyboard shortcut commands defined in manifest.json
chrome.commands.onCommand.addListener((command) => {
  // The "_execute_action" command is a special command that triggers the
  // extension's primary action, which is defined as opening the popup
  // in the manifest.json.
  if (command === "_execute_action") {
    // No specific action is required here because the manifest handles
    // opening the popup. This is a good place to add any additional
    // logic that should run when the shortcut is pressed.
    console.log("Extension action triggered by keyboard shortcut.");
  }
});