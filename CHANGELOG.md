# Changelog

**IMPORTANT: DO NOT UPDATE OR DELETE PREVIOUS CHANGE LOG ENTRIES!**

## [1.0.0] - 2025-05-22

### Added

- Initial implementation of Electron-based Test Email Generator
- Dark-themed UI with custom window controls (frameless window)
- Input field for email address with validation
- Dropdown for selecting previously used email addresses
- Number input (0-9) for specifying test email count
- Email storage in saved_emails.txt with deduplication and max 10 entries
- Secure IPC communication between main and renderer processes
- Configuration for electron-builder to create portable Windows executable

## Format Guide for AI Maintainers

This changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) principles.

### Entry Format

```markdown
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
