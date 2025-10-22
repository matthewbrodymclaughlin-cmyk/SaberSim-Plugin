# Contributing to SaberSim DFS Build Optimizer

Thank you for your interest in contributing to the SaberSim DFS Build Optimizer Chrome extension! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Google Chrome (latest version)
- Git
- Code editor (VS Code, Sublime, etc.)
- Basic knowledge of JavaScript, HTML, CSS
- Understanding of Chrome Extension development (helpful but not required)

### Fork and Clone

1. **Fork the Repository**
   - Visit [SaberSim-Plugin on GitHub](https://github.com/yourusername/sabersim-plugin)
   - Click the "Fork" button in the top-right

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/sabersim-plugin.git
   cd sabersim-plugin
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/original-owner/sabersim-plugin.git
   ```

## Development Setup

### 1. Load Extension in Developer Mode

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select the `sabersim-plugin` directory

### 2. Create Icon Files

For development, create simple placeholder icons:
- `icons/icon16.png` (16x16 px)
- `icons/icon48.png` (48x48 px)
- `icons/icon128.png` (128x128 px)

### 3. Configure API Access

For testing, you'll need a SaberSim API key:
- Sign up at [SaberSim.com](https://sabersim.com)
- Obtain an API key
- Save it in the extension's configuration

## How to Contribute

### Areas for Contribution

We welcome contributions in these areas:

1. **Bug Fixes**
   - Fix reported issues
   - Improve error handling
   - Resolve edge cases

2. **New Features**
   - Player lock/exclude functionality
   - Advanced stacking rules
   - Ownership projections
   - Contest imports
   - Historical tracking

3. **UI/UX Improvements**
   - Design enhancements
   - Better user feedback
   - Accessibility improvements
   - Mobile responsiveness

4. **Documentation**
   - Code comments
   - README improvements
   - Tutorial creation
   - API documentation

5. **Testing**
   - Write unit tests
   - Integration testing
   - Manual testing and QA

### Contribution Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

   Branch naming conventions:
   - `feature/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation updates
   - `refactor/` - Code refactoring
   - `test/` - Testing improvements

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the coding standards (see below)
   - Add comments where necessary
   - Update documentation if needed

3. **Test Your Changes**
   - Load the extension in Chrome
   - Test all affected functionality
   - Check for console errors
   - Verify on different screen sizes

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

   Commit message format:
   ```
   [Type] Brief description (50 chars max)

   Detailed explanation of what changed and why.
   Include any relevant issue numbers.

   Fixes #123
   ```

   Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "Pull Request"
   - Select your branch
   - Provide a clear title and description
   - Link any related issues

## Coding Standards

### JavaScript

```javascript
// Use camelCase for variables and functions
const apiKey = 'example';
function optimizeLineups() { }

// Use PascalCase for classes
class LineupBuilder { }

// Use UPPER_CASE for constants
const MAX_LINEUPS = 150;

// Add JSDoc comments for functions
/**
 * Format lineup data for display
 * @param {Object} lineup - Raw lineup data
 * @param {Object} params - Build parameters
 * @returns {Object} Formatted lineup
 */
function formatLineup(lineup, params) {
    // Implementation
}

// Use async/await for asynchronous code
async function fetchData() {
    try {
        const response = await makeApiRequest();
        return response;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Use template literals for string concatenation
const message = `Optimizing ${numLineups} lineups for ${sport}`;
```

### HTML

```html
<!-- Use semantic HTML5 elements -->
<section id="results-section">
    <h2>Results</h2>
    <!-- Content -->
</section>

<!-- Use meaningful IDs and classes -->
<button id="optimize-btn" class="btn btn-primary">Optimize</button>

<!-- Include accessibility attributes -->
<label for="sport-select">Sport:</label>
<select id="sport-select" aria-label="Select sport">
    <option value="nfl">NFL</option>
</select>
```

### CSS

```css
/* Use BEM-like naming for classes */
.lineup-card { }
.lineup-card__header { }
.lineup-card__player--highlighted { }

/* Group related properties */
.button {
    /* Positioning */
    position: relative;

    /* Box model */
    display: inline-block;
    padding: 10px 20px;
    margin: 5px;

    /* Typography */
    font-size: 14px;
    color: white;

    /* Visual */
    background: blue;
    border: none;
    border-radius: 4px;

    /* Misc */
    cursor: pointer;
    transition: all 0.3s;
}

/* Use CSS custom properties for repeated values */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --border-radius: 4px;
}
```

### File Organization

```
SaberSim-Plugin/
├── manifest.json           # Extension manifest
├── popup/                  # Popup UI files
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── background/             # Background service worker
│   └── background.js
├── utils/                  # Utility modules
│   └── storage.js
├── icons/                  # Extension icons
├── config/                 # Configuration files
└── docs/                   # Documentation (future)
```

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Extension loads without errors
- [ ] All UI elements render correctly
- [ ] Form validation works properly
- [ ] API calls succeed with valid credentials
- [ ] Error handling works as expected
- [ ] Settings persist across sessions
- [ ] Export functionality works
- [ ] No console errors or warnings

### Testing Different Scenarios

1. **Valid Inputs**: Test with correct parameters
2. **Invalid Inputs**: Test with missing or incorrect data
3. **Edge Cases**: Test with extreme values (max lineups, etc.)
4. **Network Issues**: Test with poor/no connection
5. **API Errors**: Test handling of API failures

### Browser Testing

Test on:
- Chrome (latest stable)
- Chrome (beta) if possible
- Different screen sizes
- Light and dark mode (if applicable)

## Submitting Changes

### Pull Request Guidelines

A good PR should:

1. **Have a Clear Title**
   - Describe what the PR does
   - Example: "Add player lock/exclude functionality"

2. **Include a Detailed Description**
   ```markdown
   ## Description
   Brief overview of changes

   ## Changes Made
   - Added lock/exclude UI controls
   - Implemented backend logic
   - Updated API request format

   ## Testing
   - Tested with 10+ lineups
   - Verified locked players appear in all lineups
   - Checked excluded players don't appear

   ## Screenshots
   [Include screenshots if UI changes]

   ## Related Issues
   Closes #45
   Related to #32
   ```

3. **Be Focused**
   - One feature or fix per PR
   - Keep changes minimal and relevant
   - Don't mix unrelated changes

4. **Pass All Checks**
   - No console errors
   - Code follows standards
   - Documentation updated

### PR Review Process

1. Maintainer reviews your PR
2. Feedback may be provided
3. Make requested changes
4. Push updates to your branch
5. Once approved, PR will be merged

### After Your PR is Merged

1. **Delete Your Branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update Your Fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## Reporting Bugs

### Before Reporting

1. Check existing issues to avoid duplicates
2. Update to the latest version
3. Test in a clean browser profile

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- Chrome Version: [e.g., 120.0.6099.129]
- Extension Version: [e.g., 1.0.0]
- OS: [e.g., Windows 11, macOS 14]

**Additional Context**
Any other relevant information

**Console Errors**
```
Paste any console errors here
```
```

## Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed? Who would use it?

**Proposed Solution**
How should this work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, related features, etc.
```

### Feature Discussion

1. Open an issue with your proposal
2. Discuss with maintainers and community
3. Get feedback and refine the idea
4. If approved, start implementation

## Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **Pull Requests**: Code contributions
- **Discussions**: General questions and ideas
- **Email**: [your-email@example.com] for sensitive matters

## Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in commit messages

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Open a new discussion
4. Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making DFS lineup optimization better for everyone!
