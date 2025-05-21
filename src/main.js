const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { PowerShell } = require('node-powershell');

// Keep a global reference of the window object
let mainWindow;

// Path to the saved emails file
const savedEmailsPath = path.join(app.getAppPath(), 'saved_emails.txt');

// Create or ensure the saved_emails.txt file exists
function ensureSavedEmailsFile() {
  try {
    if (!fs.existsSync(savedEmailsPath)) {
      fs.writeFileSync(savedEmailsPath, '', 'utf8');
      console.log('Created saved_emails.txt file');
    }
  } catch (error) {
    console.error('Error ensuring saved_emails file:', error);
  }
}

// Read saved emails from file
function getSavedEmails() {
  try {
    if (fs.existsSync(savedEmailsPath)) {
      const fileContent = fs.readFileSync(savedEmailsPath, 'utf8');
      const emails = fileContent.split('\n').filter(email => email.trim() !== '');
      return emails;
    }
    return [];
  } catch (error) {
    console.error('Error reading saved emails:', error);
    return [];
  }
}

// Save a new email to the file
function saveEmail(email) {
  try {
    const emails = getSavedEmails();
    
    // Check if email already exists (case insensitive)
    if (!emails.some(e => e.toLowerCase() === email.toLowerCase())) {
      emails.push(email);
      fs.writeFileSync(savedEmailsPath, emails.join('\n'), 'utf8');
      console.log(`Email "${email}" saved to file`);
      return true;
    }
    console.log(`Email "${email}" already exists, not adding duplicate`);
    return false;
  } catch (error) {
    console.error('Error saving email:', error);
    return false;
  }
}

// Generate a random 6-character ID
function generateRandomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Send email using Outlook via PowerShell
async function sendOutlookEmail(emailAddress) {
  const ps = new PowerShell({
    executionPolicy: 'Bypass',
    noProfile: true
  });

  try {
    const randomId = generateRandomId();
    const subject = `Admin Test #${randomId}`;
    const body = `This is an admin test (#${randomId}) of the email system.`;
    
    // PowerShell script to send email via Outlook
    await ps.addCommand(`
      $outlook = New-Object -ComObject Outlook.Application
      $mail = $outlook.CreateItem(0)
      $mail.To = "${emailAddress}"
      $mail.Subject = "${subject}"
      $mail.Body = "${body}"
      $mail.Display()
      return "Email prepared successfully for ${emailAddress}"
    `);
    
    const result = await ps.invoke();
    console.log(result);
    return { success: true, message: result };
  } catch (error) {
    console.error('PowerShell Error:', error);
    return { success: false, message: error.toString() };
  } finally {
    await ps.dispose();
  }
}

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    backgroundColor: '#1e1e1e', // Dark background
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(app.getAppPath(), 'assets', 'icon.png')
  });

  // Load the index.html file
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Disable menu bar
  mainWindow.setMenuBarVisibility(false);

  // Open DevTools in development mode
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  ensureSavedEmailsFile();
  createWindow();
  
  app.on('activate', () => {
    // On macOS, re-create a window when dock icon is clicked and no other windows are open
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-saved-emails', async () => {
  return getSavedEmails();
});

ipcMain.handle('send-test-email', async (event, emailAddress) => {
  if (!emailAddress || !emailAddress.trim()) {
    return { success: false, message: 'Email address is required' };
  }
  
  // Validate email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailAddress)) {
    return { success: false, message: 'Invalid email address format' };
  }
  
  try {
    // Save email to file (if it's new)
    saveEmail(emailAddress);
    
    // Send email via Outlook
    const result = await sendOutlookEmail(emailAddress);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: error.toString() };
  }
});
