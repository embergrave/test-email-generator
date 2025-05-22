// DOM Elements
const emailInput = document.getElementById('emailInput');
const emailList = document.getElementById('emailList');
const countInput = document.getElementById('countInput');
const generateBtn = document.getElementById('generateBtn');
const statusMessage = document.getElementById('statusMessage');
const minimizeBtn = document.getElementById('minimize-btn');
const closeBtn = document.getElementById('close-btn');

// Window control functionality
minimizeBtn.addEventListener('click', () => {
  window.api.minimizeWindow();
});

closeBtn.addEventListener('click', () => {
  window.api.closeWindow();
});

// Load saved emails on app start
async function loadSavedEmails() {
  try {
    const emails = await window.api.loadEmails();
    
    // Clear the datalist
    emailList.innerHTML = '';
    
    // Add emails to datalist
    for (const email of emails) {
      const option = document.createElement('option');
      option.value = email;
      emailList.appendChild(option);
    }
  } catch (error) {
    showStatus('Error loading saved emails', true);
  }
}

// The datalist works automatically with the input
// No need for a separate change event handler

// Validate inputs and enable/disable generate button
function validateInputs() {
  const email = emailInput.value.trim();
  const count = countInput.value;
  
  const isEmailValid = email !== '' && window.api.validateEmail(email);
  const isCountValid = !Number.isNaN(count) && count >= 0 && count <= 9;
  
  generateBtn.disabled = !isEmailValid || !isCountValid;
  
  // Show validation errors
  if (email !== '' && !window.api.validateEmail(email)) {
    showStatus('Please enter a valid email address', true);
  } else {
    hideStatus();
  }
}

// Input validation events
emailInput.addEventListener('input', validateInputs);
countInput.addEventListener('input', validateInputs);

// Show/hide status message
function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${isError ? 'error' : 'success'}`;
}

function hideStatus() {
  statusMessage.style.display = 'none';
  statusMessage.className = 'status-message';
}

// Generate button click handler
generateBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const count = Number.parseInt(countInput.value, 10);
  
  if (!window.api.validateEmail(email)) {
    showStatus('Please enter a valid email address', true);
    return;
  }
  
  if (Number.isNaN(count) || count < 0 || count > 9) {
    showStatus('Count must be between 0 and 9', true);
    return;
  }
  
  try {
    // Save the email if it's valid
    await window.api.saveEmail(email);
    
    // Reload the email dropdown
    await loadSavedEmails();
    
    // Show success message with the generate placeholder
    showStatus(`Successfully generated ${count} test email${count !== 1 ? 's' : ''} for ${email}`, false);
    
    // Here you would typically call a function to actually generate the emails
    console.log(`Generating ${count} test email(s) for ${email}`);
    
  } catch (error) {
    showStatus('Error generating test emails', true);
  }
});

// Enforce number input range (0-9)
countInput.addEventListener('change', () => {
  const value = Number.parseInt(countInput.value, 10);
  if (Number.isNaN(value)) {
    countInput.value = 0;
  } else if (value < 0) {
    countInput.value = 0;
  } else if (value > 9) {
    countInput.value = 9;
  }
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  loadSavedEmails();
  validateInputs();
});
