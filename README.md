# Test Email Generator

A simple, user-friendly desktop application that allows you to manage test email addresses with a clean interface. Perfect for administrators, IT support staff, and anyone who needs to prepare for email functionality testing.

## Features

* **Simple, Dark-Themed Interface**: Clean design with minimal distractions
* **Custom Window Frame**: The standard Windows frame is hidden; close and minimize buttons are styled to match the custom dark mode skin for a fully integrated visual experience
* **Email Address Management**: Automatically saves previously used email addresses
* **Dropdown Selection**: Easily choose from previously entered email addresses
* **Test Count Control**: A numeric input field (0–9) next to the Generate button lets you specify how many test emails to generate
* **Generate Button**: Initiates the generation process (does not send emails)
* **Zero Installation**: Runs as a standalone application - just unzip and click
* **Portable**: Can be carried on a USB drive or shared as a simple zip file

## Requirements

* Windows 11
* No internet connection required to run the application

## How to Use

### First-Time Setup

1. Download the `Test Email Generator.zip` file
2. Extract the zip file to any location on your computer
3. Double-click the `Test Email Generator.exe` file to launch the application

### Managing Email Addresses

1. Type an email address in the input field
2. Email addresses you enter will be saved automatically for future use
3. Previously entered addresses can be selected from the dropdown

### Generating Test Emails

1. Enter an email address or choose one from the dropdown
2. Use the number input box (0–9) to specify how many test emails you want to generate
3. Click the **Generate** button to initiate the process

## Managing Saved Information

The application saves your email addresses to a file called `saved_emails.txt` located in the same folder as the application.

* Each line contains a previously used email address
* The application will remember up to 10 of your most recently used email addresses

### Editing Saved Emails

You can manually edit this file to add, remove, or modify email addresses:

1. Close the Test Email Generator application
2. Open `saved_emails.txt` using Notepad or any text editor
3. Add or remove email addresses (one per line)
4. Save and close the file
5. Restart the Test Email Generator application
