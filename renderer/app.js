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

// Track generating state
let isGenerating = false;

// Generate button click handler
generateBtn.addEventListener('click', async () => {
  // If currently generating, this is a cancel action
  if (isGenerating) {
    cancelGeneration();
    return;
  }

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
    
    // Start generation animation
    startGeneration();
    
    // Simulate async generation process (will be replaced with actual generation in future)
    setTimeout(() => {
      // Complete generation after a delay
      completeGeneration();
      
      // Show success message
      showStatus(`Successfully generated ${count} test email${count !== 1 ? 's' : ''} for ${email}`, false);
      
      console.log(`Generating ${count} test email(s) for ${email}`);
    }, 2500); // Simulate a ~2.5 second operation
    
  } catch (error) {
    showStatus('Error generating test emails', true);
    // Reset UI on error
    completeGeneration();
  }
});

// Start the generation process and update UI
function startGeneration() {
  isGenerating = true;
  generateBtn.setAttribute('data-state', 'generating');
  // Disable email input and count during generation
  emailInput.disabled = true;
  countInput.disabled = true;
}

// Complete the generation process and reset UI
function completeGeneration() {
  isGenerating = false;
  generateBtn.setAttribute('data-state', 'idle');
  // Re-enable inputs
  emailInput.disabled = false;
  countInput.disabled = false;
}

// Cancel the generation process
function cancelGeneration() {
  // In future versions, this would cancel any in-progress operations
  completeGeneration();
  showStatus('Generation cancelled', false);
}

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
