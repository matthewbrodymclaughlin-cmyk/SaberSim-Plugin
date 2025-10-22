# Installation Guide

Complete step-by-step guide to install and configure the SaberSim DFS Build Optimizer Chrome extension.

## Prerequisites

Before you begin, ensure you have:

1. **Google Chrome Browser** (version 88 or higher)
   - Check your version: `chrome://version/`
   - Update if needed: `chrome://settings/help`

2. **SaberSim Account with API Access**
   - Visit [SaberSim.com](https://sabersim.com)
   - Sign up or log in
   - Subscribe to a plan with API access
   - Obtain your API key from account settings

3. **Git** (optional, for cloning the repository)
   - Download from [git-scm.com](https://git-scm.com/)

## Installation Steps

### Option 1: Install from Source (Recommended for Development)

#### Step 1: Download the Extension

**Using Git:**
```bash
git clone https://github.com/yourusername/sabersim-plugin.git
cd sabersim-plugin
```

**Or Download ZIP:**
1. Go to the GitHub repository
2. Click the green "Code" button
3. Select "Download ZIP"
4. Extract the ZIP file to a folder on your computer

#### Step 2: Add Extension Icons

Since icons aren't included in the repository, you need to create them:

1. Navigate to the `icons/` folder
2. Create three PNG images:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)
3. See `icons/ICONS_README.md` for design guidelines

**Quick Temporary Solution:**
Create simple colored squares as placeholders using any image editor.

#### Step 3: Load Extension in Chrome

1. **Open Chrome Extensions Page**
   - Type `chrome://extensions/` in the address bar
   - Or: Menu (⋮) → More Tools → Extensions

2. **Enable Developer Mode**
   - Look for "Developer mode" toggle in the top-right
   - Turn it ON

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Navigate to the `sabersim-plugin` folder
   - Select the folder and click "Select Folder" or "Open"

4. **Verify Installation**
   - The extension should appear in your extensions list
   - You should see "SaberSim DFS Build Optimizer"
   - Check that it's enabled (toggle is ON)

5. **Pin to Toolbar** (Recommended)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "SaberSim DFS Build Optimizer"
   - Click the pin icon to keep it visible

### Option 2: Install from Chrome Web Store (Coming Soon)

Once published to the Chrome Web Store:

1. Visit the extension's Chrome Web Store page
2. Click "Add to Chrome"
3. Click "Add extension" in the confirmation dialog
4. The extension will install automatically

## Configuration

### Step 1: Configure API Key

1. **Click the Extension Icon**
   - Look for the SaberSim icon in your Chrome toolbar
   - Click it to open the popup

2. **Enter API Key**
   - Find the "API Configuration" section at the top
   - Paste your SaberSim API key in the text field
   - Click "Save Key"

3. **Verify Success**
   - You should see a green success message
   - The input field will show "********** (saved)"

### Step 2: Set Default Preferences (Optional)

Configure your default settings to save time:

1. **Select Your Preferred Sport**
   - Choose your primary sport from the dropdown

2. **Choose Contest Type**
   - Select your preferred contest type (Classic, Showdown, etc.)

3. **Select DFS Site**
   - Pick your DFS platform (DraftKings, FanDuel, Yahoo)

4. **Adjust Build Parameters**
   - Set default salary cap
   - Configure exposure settings
   - Enable/disable stacking

All settings are automatically saved as you make changes.

## Verification

### Test the Extension

1. **Select Contest Details**
   - Sport: NFL
   - Contest Type: Classic
   - Site: DraftKings

2. **Set Simple Parameters**
   - Salary Cap: 50000
   - Number of Lineups: 1
   - Keep other settings at defaults

3. **Click "Optimize Lineups"**
   - If successful, you'll see lineup results
   - If there's an error, check the troubleshooting section below

### Check for Errors

1. **Open Developer Console**
   - Right-click the extension popup
   - Select "Inspect"
   - Click the "Console" tab

2. **Look for Error Messages**
   - Red text indicates errors
   - Note any error messages for troubleshooting

## Troubleshooting

### Extension Won't Load

**Problem**: Extension doesn't appear after loading
- **Solution**: Check for errors on `chrome://extensions/`
- Ensure all required files are present in the folder
- Verify `manifest.json` is valid JSON

**Problem**: "Manifest file is missing or unreadable"
- **Solution**: Ensure you selected the correct folder
- Check that `manifest.json` exists in the root directory

### Icons Not Displaying

**Problem**: Extension icon is blank or shows generic icon
- **Solution**: Create icon files in the `icons/` folder
- Name them exactly: `icon16.png`, `icon48.png`, `icon128.png`
- Use any image editor to create simple placeholder icons

### API Key Issues

**Problem**: "API key is required" error
- **Solution**: Save your API key in the configuration section
- Check for extra spaces when copying the key
- Verify the key is valid with SaberSim

**Problem**: "Invalid API key" or authentication errors
- **Solution**: Verify your SaberSim subscription is active
- Check that your API key hasn't expired
- Generate a new API key from your SaberSim account

### Network Errors

**Problem**: "Unable to reach SaberSim API"
- **Solution**: Check your internet connection
- Verify SaberSim's API is operational
- Check if firewall/antivirus is blocking requests
- Try disabling other extensions temporarily

**Problem**: "Request timeout"
- **Solution**: Try generating fewer lineups
- Check SaberSim server status
- Increase timeout in `background/background.js` if needed

### No Lineups Generated

**Problem**: Optimization completes but shows no lineups
- **Solution**: Verify players are available for selected sport
- Check that contest settings are valid
- Ensure salary cap is reasonable for the sport/site
- Review SaberSim API documentation for parameter requirements

## Updating the Extension

### Update from Git

```bash
cd sabersim-plugin
git pull origin main
```

After pulling updates:
1. Go to `chrome://extensions/`
2. Click the reload icon (🔄) on the extension card

### Update from Download

1. Download the latest version
2. Extract to the same location (or new location)
3. Go to `chrome://extensions/`
4. If same location: Click reload icon (🔄)
5. If new location: Remove old, load new unpacked extension

## Uninstalling

### Remove Extension

1. Go to `chrome://extensions/`
2. Find "SaberSim DFS Build Optimizer"
3. Click "Remove"
4. Confirm removal

This will:
- Remove the extension from Chrome
- Delete stored API key and settings
- Remove all saved data

### Keep Settings

If you want to reinstall later with same settings:
1. Export your settings before removing (feature coming soon)
2. Or note your API key and preferences manually

## Advanced Configuration

### Custom API Endpoint

If SaberSim provides a different API endpoint:

1. Open `background/background.js`
2. Find the `SABERSIM_CONFIG` object
3. Update the `baseUrl`:
   ```javascript
   const SABERSIM_CONFIG = {
       baseUrl: 'https://your-custom-api.com',
       // ...
   };
   ```
4. Save the file
5. Reload the extension

### Modify Timeout

For slower connections or large lineup requests:

1. Open `background/background.js`
2. Find `timeout: 60000` (60 seconds)
3. Increase the value (in milliseconds)
4. Save and reload the extension

### Enable Development Features

For debugging and development:

1. Right-click the extension popup
2. Select "Inspect"
3. Console tab shows all logs and errors
4. Network tab shows API requests/responses

## Security Notes

- **API Key Storage**: Keys are stored using Chrome's encrypted storage API
- **No External Sharing**: Your API key is only sent to SaberSim's API
- **Local Processing**: All data stays in your browser
- **HTTPS Only**: All API requests use secure HTTPS

## Getting Help

If you encounter issues not covered here:

1. **Check the README**: See `README.md` for detailed documentation
2. **Review Logs**: Check browser console for error messages
3. **GitHub Issues**: [Report an issue](https://github.com/yourusername/sabersim-plugin/issues)
4. **SaberSim Support**: Contact SaberSim for API-related questions

## Next Steps

After successful installation:

1. Read the `README.md` for detailed usage instructions
2. Explore advanced features like team stacking
3. Try different sports and contest types
4. Export lineups to CSV for upload to DFS sites

Happy lineup building!
