const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // Get saved emails from main process
    getSavedEmails: () => ipcRenderer.invoke('get-saved-emails'),
    
    // Send a test email
    sendTestEmail: (emailAddress) => ipcRenderer.invoke('send-test-email', emailAddress)
  }
);
