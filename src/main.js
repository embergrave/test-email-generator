const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const { exec } = require('node:child_process');

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

// Send email using Outlook via PowerShell with direct child_process approach
async function sendOutlookEmail(emailAddress) {
  return new Promise((resolve, reject) => {
    try {
      const randomId = generateRandomId();
      const subject = `Admin Test #${randomId}`;
      const body = `This is an admin test (#${randomId}) of the email system.`;
      
      // Create a PowerShell script file for more reliable execution
      const tempScriptPath = path.join(app.getPath('temp'), `outlook-email-${randomId}.ps1`);
      
      // Write a robust PowerShell script to a temp file
      const psScript = `
# Script to create an Outlook email
$ErrorActionPreference = "Stop"

try {
    # Force garbage collection to release any existing COM objects
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
    
    # Create Outlook COM object with diagnostic info
    Write-Output "Creating Outlook COM object..."
    $outlook = New-Object -ComObject Outlook.Application
    if ($null -eq $outlook) {
        throw "Failed to create Outlook COM object"
    }
    
    Write-Output "Creating mail item..."
    $mail = $outlook.CreateItem(0) # 0 = olMailItem
    if ($null -eq $mail) {
        throw "Failed to create mail item"
    }
    
    # Set email properties with verification
    $mail.To = "${emailAddress}"
    $mail.Subject = "${subject.replace(/"/g, '`"')}"
    $mail.Body = "${body.replace(/"/g, '`"')}"
    
    # Force the email window to display in the foreground
    Write-Output "Displaying email..."
    $mail.Display($true) # The $true parameter requests foreground activation
    
    # Verify the window is open by checking a property
    if ($mail.Sent -eq $true) {
        Write-Output "WARNING: Email appears to have been sent automatically"
    } else {
        Write-Output "Email window opened successfully for: ${emailAddress}"
    }
    
    # Release COM objects to prevent memory leaks
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($mail) | Out-Null
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($outlook) | Out-Null
} catch {
    Write-Error "ERROR: $($_.Exception.Message)"
    if ($null -ne $mail) {
        try { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($mail) | Out-Null } catch {}
    }
    if ($null -ne $outlook) {
        try { [System.Runtime.InteropServices.Marshal]::ReleaseComObject($outlook) | Out-Null } catch {}
    }
    exit 1
} finally {
    # Final garbage collection
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
`;

      // Write script to temp file
      fs.writeFileSync(tempScriptPath, psScript, 'utf8');
      
      // Execute script with robust error handling
      console.log(`Executing PowerShell script: ${tempScriptPath}`);
      
      const psCommand = `powershell -ExecutionPolicy Bypass -NoProfile -File "${tempScriptPath}"`;      
      console.log(`Running command: ${psCommand}`);
      
      exec(psCommand, (error, stdout, stderr) => {
        try {
          // Always try to delete the temp file regardless of outcome
          fs.unlinkSync(tempScriptPath);
        } catch (deleteError) {
          console.warn(`Could not delete temp script file: ${deleteError.message}`);
        }
        
        if (error) {
          console.error('PowerShell execution error:', error);
          console.error('Error details:', stderr || 'No error details available');
          resolve({ success: false, message: `Failed to create email: ${error.message}` });
          return;
        }
        
        if (stderr && stderr.trim() !== '') {
          console.warn('PowerShell stderr:', stderr);
          resolve({ success: false, message: `Error in Outlook automation: ${stderr}` });
          return;
        }
        
        // Log output for diagnostic purposes
        console.log('PowerShell execution successful with output:');
        console.log(stdout);
        
        // Successful execution
        resolve({ 
          success: true, 
          message: stdout.includes('Email window opened successfully') ? 
            `Email opened in Outlook for ${emailAddress}` : 
            `Email command completed: ${stdout.trim()}` 
        });
      });
    } catch (error) {
      console.error('Error preparing email command:', error);
      resolve({ success: false, message: `Application error: ${error.toString()}` });
    }
  });
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
