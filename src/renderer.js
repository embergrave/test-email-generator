// DOM Elements
const emailInput = document.getElementById('email-input');
const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownList = document.getElementById('dropdown-list');
const sendButton = document.getElementById('send-button');
const messageElement = document.getElementById('message');
const loader = document.getElementById('loader');

// State variables
let savedEmails = [];
let isDropdownOpen = false;

// Initialize the app
document.addEventListener('DOMContentLoaded', async () => {
  await loadSavedEmails();
  
  // Set placeholder text based on saved emails
  updatePlaceholderText();
  
  // Set up event listeners
  setupEventListeners();
});

// Load saved emails from the main process
async function loadSavedEmails() {
  try {
    savedEmails = await window.api.getSavedEmails() || [];
    renderDropdownItems();
  } catch (error) {
    console.error('Error loading saved emails:', error);
    showMessage('Failed to load saved emails', false);
  }
}

// Update input placeholder based on saved emails
function updatePlaceholderText() {
  if (savedEmails.length === 0) {
    emailInput.placeholder = 'Enter email address';
  } else {
    emailInput.placeholder = 'Enter or select email address';
  }
}

// Render dropdown items based on saved emails
function renderDropdownItems(filterText = '') {
  // Clear existing dropdown items
  dropdownList.innerHTML = '';
  
  // Filter emails based on input text
  const filteredEmails = filterText
    ? savedEmails.filter(email => email.toLowerCase().includes(filterText.toLowerCase()))
    : savedEmails;
  
  // Add emails to dropdown
  if (filteredEmails.length > 0) {
    for (const email of filteredEmails) {
      const item = document.createElement('div');
      item.classList.add('dropdown-item');
      item.textContent = email;
      item.addEventListener('click', () => {
        emailInput.value = email;
        closeDropdown();
      });
      dropdownList.appendChild(item);
    }
  } else {
    // No matching emails
    const noResults = document.createElement('div');
    noResults.classList.add('dropdown-item');
    noResults.textContent = 'No saved emails found';
    noResults.style.fontStyle = 'italic';
    noResults.style.color = '#8a8a8a';
    dropdownList.appendChild(noResults);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Toggle dropdown on button click
  dropdownToggle.addEventListener('click', () => {
    toggleDropdown();
  });
  
  // Filter dropdown items as user types
  emailInput.addEventListener('input', () => {
    if (!isDropdownOpen) {
      openDropdown();
    }
    renderDropdownItems(emailInput.value);
  });
  
  // Open dropdown on input focus
  emailInput.addEventListener('focus', () => {
    if (savedEmails.length > 0) {
      openDropdown();
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (isDropdownOpen && 
        !dropdownList.contains(event.target) && 
        !emailInput.contains(event.target) && 
        !dropdownToggle.contains(event.target)) {
      closeDropdown();
    }
  });
  
  // Handle send button click
  sendButton.addEventListener('click', async () => {
    await sendEmail();
  });
  
  // Handle Enter key press
  emailInput.addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
      await sendEmail();
    }
  });
}

// Show/hide the dropdown
function toggleDropdown() {
  if (isDropdownOpen) {
    closeDropdown();
  } else {
    openDropdown();
  }
}

function openDropdown() {
  if (savedEmails.length > 0) {
    dropdownList.classList.remove('hidden');
    isDropdownOpen = true;
    renderDropdownItems(emailInput.value);
  }
}

function closeDropdown() {
  dropdownList.classList.add('hidden');
  isDropdownOpen = false;
}

// Send test email
async function sendEmail() {
  const email = emailInput.value.trim();
  
  if (!email) {
    showMessage('Please enter an email address', false);
    return;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Please enter a valid email address', false);
    return;
  }
  
  // Show loading state
  setLoading(true);
  
  try {
    // Send email using the main process
    const result = await window.api.sendTestEmail(email);
    
    if (result.success) {
      showMessage(`Email prepared successfully for ${email}`, true);
      
      // Reload saved emails in case this one was added
      await loadSavedEmails();
      updatePlaceholderText();
      
      // Clear input if successful
      emailInput.value = '';
    } else {
      showMessage(`Failed to send email: ${result.message}`, false);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    showMessage('An error occurred while sending the email', false);
  } finally {
    setLoading(false);
  }
}

// Show status message to the user
function showMessage(text, isSuccess) {
  messageElement.textContent = text;
  messageElement.classList.remove('hidden', 'success', 'error');
  messageElement.classList.add(isSuccess ? 'success' : 'error');
  
  // Hide message after 5 seconds
  setTimeout(() => {
    messageElement.classList.add('hidden');
  }, 5000);
}

// Set loading state
function setLoading(isLoading) {
  if (isLoading) {
    sendButton.disabled = true;
    loader.classList.remove('hidden');
    sendButton.querySelector('.button-text').textContent = 'Sending...';
  } else {
    sendButton.disabled = false;
    loader.classList.add('hidden');
    sendButton.querySelector('.button-text').textContent = 'Send Test Email';
  }
}
