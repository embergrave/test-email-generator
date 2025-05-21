# Test Email Generator

A simple, user-friendly desktop application that allows you to quickly create and send test emails through your Outlook client. Perfect for administrators, IT support staff, and anyone who needs to verify email functionality.

![Test Email Generator](https://github.com/embergrave/test-email-generator/raw/main/assets/app-screenshot.png)

## Features

- **Simple, Dark-Themed Interface**: Clean design with minimal distractions
- **Email Address Management**: Automatically saves previously used email addresses
- **Outlook Integration**: Creates pre-filled test emails directly in your Outlook client
- **Zero Installation**: Runs as a standalone application - just unzip and click
- **Portable**: Can be carried on a USB drive or shared as a simple zip file

## Requirements

- Windows 11
- Microsoft Outlook installed and configured
- No internet connection required to run the application

## How to Use

### First-Time Setup

1. Download the `Test Email Generator.zip` file
2. Extract the zip file to any location on your computer
3. Double-click the `Test Email Generator.exe` file to launch the application

### Sending a Test Email

1. Type an email address in the input field, or select one from the dropdown
2. Click the "Send Test Email" button
3. An Outlook window will open with a pre-filled subject and body
4. Review the email and click Send in Outlook

Each test email includes a unique ID in the subject and body for easy tracking.

## Managing Saved Email Addresses

The application automatically saves every email address you use to a file called `saved_emails.txt`. This file is located in the same folder as the application.

### Editing Saved Emails

You can manually edit this file to add, remove, or modify email addresses:

1. Close the Test Email Generator application
2. Open `saved_emails.txt` using Notepad or any text editor
3. Add or remove email addresses (one per line)
4. Save and close the file
5. Restart the Test Email Generator application

## Troubleshooting

### The application doesn't open

- Make sure you've extracted all files from the zip archive
- Try running the application as Administrator

### Outlook doesn't open when clicking "Send Test Email"

- Verify that Outlook is installed and working on your computer
- Try restarting Outlook and the Test Email Generator

### Email addresses aren't appearing in the dropdown

- Check that the `saved_emails.txt` file exists and isn't empty
- Make sure you've used proper email formats (like `name@domain.com`)

## Support

For additional help or questions, please contact your IT department or the application administrator.
