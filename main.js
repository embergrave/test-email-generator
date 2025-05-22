const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('node:fs');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

// File path for saved emails
const savedEmailsPath = path.join(app.getPath('userData'), 'saved_emails.txt');

function createWindow() {
  // Create the browser window with frameless design
  mainWindow = new BrowserWindow({
    width: 500,
    height: 550,
    frame: false, // No default title bar
    resizable: false,
    webPreferences: {
      nodeIntegration: false, // Security: disable Node integration in renderer
      contextIsolation: true, // Security: enable context isolation
      preload: path.join(__dirname, 'preload.js'), // Use preload script
    },
    backgroundColor: '#2e2c29', // Dark background color
    // Use icon if it exists
    icon: fs.existsSync(path.join(__dirname, 'renderer/assets/icon.ico')) ? 
          path.join(__dirname, 'renderer/assets/icon.ico') : 
          undefined
  });

  // Load the index.html of the app
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  // Open DevTools in development environment
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// Create window when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  // On macOS it is common for applications to stay open
  // until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS re-create a window when dock icon is clicked and no windows are open
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for window controls
ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// IPC handlers for file operations
ipcMain.handle('load-emails', async () => {
  try {
    // Check if file exists, if not create it
    if (!fs.existsSync(savedEmailsPath)) {
      fs.writeFileSync(savedEmailsPath, '', 'utf8');
      return [];
    }
    
    // Read file content
    const fileContent = fs.readFileSync(savedEmailsPath, 'utf8');
    // Parse lines into array, filter empty lines
    return fileContent.split('\n')
      .filter(email => email.trim() !== '')
      .slice(0, 10); // Keep only the 10 most recent
  } catch (error) {
    console.error('Error loading emails:', error);
    return [];
  }
});

ipcMain.handle('save-email', async (_, email) => {
  try {
    if (!email || email.trim() === '') return false;
    
    // Get existing emails
    let emails = [];
    if (fs.existsSync(savedEmailsPath)) {
      const fileContent = fs.readFileSync(savedEmailsPath, 'utf8');
      emails = fileContent.split('\n').filter(e => e.trim() !== '');
    }
    
    // Add new email to the beginning if it doesn't exist
    if (!emails.includes(email)) {
      emails.unshift(email);
      // Keep only the 10 most recent
      emails = emails.slice(0, 10);
      // Write back to file
      fs.writeFileSync(savedEmailsPath, emails.join('\n'), 'utf8');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving email:', error);
    return false;
  }
});
