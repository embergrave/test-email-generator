# Changelog

## Format Guide for AI Maintainers

This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) principles.

### Entry Format

```
## [Version or Date] - YYYY-MM-DD

### Added
- New features or capabilities added to the application
- Each bullet point should be concise but descriptive

### Changed
- Modifications to existing functionality
- UI adjustments, workflow changes, or behavior alterations

### Fixed
- Bug fixes and error corrections
- Performance improvements

### Removed
- Features, dependencies, or files that were removed
```

### Guidelines for AI Changelog Maintenance

1. **Date Format**: Use ISO format (YYYY-MM-DD)
2. **Entry Style**: 
   - Begin with an action verb in present tense (Add, Update, Fix)
   - Be specific but concise (5-15 words per entry)
   - Focus on user-visible changes or significant internal improvements
3. **Grouping**: 
   - Group related changes together under appropriate headings
   - For minor releases, you may combine categories if there are few entries
4. **Versions**:
   - Unreleased changes go under `[Unreleased]` heading
   - Once released, replace with version number and date
5. **Technical Details**:
   - Include just enough detail for context
   - Avoid implementation specifics unless relevant to users or future developers

---

## [1.1.0] - 2025-05-21

### Added
- Add Outlook version selector with options for 2013, 2016, 2019, 2021, and 365
- Create version selection modal with save/cancel options
- Add small grey "Set Outlook version" link in application footer
- Implement first-use prompt for Outlook version selection

### Changed
- Update saved_emails.txt format to store Outlook version as first line
- Modify email address loading to skip version line when displaying dropdown
- Enhance README.md with version selector usage instructions
- Update IPC communication to support version-aware data saving

### Fixed
- Fix Outlook email window not appearing after clicking "Send"
- Replace node-powershell dependency with Node.js built-in child_process module
- Improve error handling for PowerShell script execution
- Enhance COM object management to prevent memory leaks

## [1.0.0] - 2025-05-01

### Added
- Initial release of Test Email Generator
- Create dark-themed UI with email input and dropdown selector
- Implement Outlook integration for sending test emails
- Add automatic saving of previously used email addresses
- Build portable application that requires no installation
