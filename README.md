# SaberSim DFS Build Optimizer - Chrome Extension

A powerful Chrome extension that integrates with the SaberSim API to optimize Daily Fantasy Sports (DFS) lineups across multiple sports and contest types.

## Features

- **Multi-Sport Support**: NFL, NBA, MLB, NHL, PGA, Soccer, NASCAR, MMA, College Basketball, and College Football
- **Multiple Contest Types**: Classic, Showdown/Single Game, Tiers, and Best Ball
- **DFS Platform Support**: DraftKings, FanDuel, and Yahoo
- **Advanced Build Parameters**:
  - Customizable salary caps and minimum salary usage
  - Player exposure controls (min/max)
  - Randomness settings for lineup variety
  - Team stacking with configurable stack sizes
  - Multiple lineup generation (1-150 lineups)
- **User-Friendly Interface**: Clean, modern UI with intuitive controls
- **Persistent Settings**: Automatically saves your preferences
- **Export Functionality**: Export lineups to CSV or copy to clipboard
- **Secure API Key Storage**: Encrypted storage of your SaberSim API credentials

## Installation

### Method 1: Load Unpacked (Development)

1. **Clone or Download this Repository**
   ```bash
   git clone https://github.com/yourusername/sabersim-plugin.git
   cd sabersim-plugin
   ```

2. **Open Chrome Extensions Page**
   - Navigate to `chrome://extensions/`
   - Or click the three-dot menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `SaberSim-Plugin` directory
   - The extension should now appear in your extensions list

5. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "SaberSim DFS Build Optimizer"
   - Click the pin icon to keep it visible

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store once it's published.

## Setup

### 1. Obtain SaberSim API Key

You'll need a valid SaberSim API key to use this extension:

1. Visit [SaberSim's website](https://sabersim.com)
2. Create an account or log in
3. Navigate to your account settings or API section
4. Generate or copy your API key

**Note**: API access may require a SaberSim subscription. Check their pricing and plans.

### 2. Configure the Extension

1. **Click the Extension Icon**
   - Open the SaberSim DFS Optimizer popup

2. **Enter Your API Key**
   - Paste your API key in the "SaberSim API Key" field
   - Click "Save Key"
   - You should see a success message

3. **Verify Configuration**
   - Your API key is securely stored
   - The extension is now ready to use

## Usage

### Basic Workflow

1. **Select Contest Details**
   - Choose your sport (e.g., NFL, NBA, MLB)
   - Select contest type (Classic, Showdown, etc.)
   - Pick your DFS site (DraftKings, FanDuel, Yahoo)

2. **Configure Build Parameters**
   - Set salary cap (default: $50,000)
   - Choose number of lineups to generate (1-150)
   - Adjust player exposure settings
   - Set minimum salary usage
   - Enable/disable randomness
   - Configure team stacking if desired

3. **Optimize Lineups**
   - Click the "Optimize Lineups" button
   - Wait for the optimization to complete
   - Results will display in the popup

4. **Export Results**
   - Click "Export to CSV" to download lineup data
   - Or click "Copy to Clipboard" to paste elsewhere

### Advanced Features

#### Team Stacking

Team stacking helps create correlated lineups by grouping players from the same team:

1. Check the "Enable Team Stacking" checkbox
2. Set your desired stack size (2-5 players)
3. The optimizer will create lineups with player correlations

**Example**: For NFL, a 3-player stack might include QB + WR + WR from the same team

#### Player Exposure

Control how often players appear across your lineup portfolio:

- **Max Exposure**: Maximum percentage of lineups a player can appear in
  - Example: 50% max exposure with 10 lineups = player in max 5 lineups
- **Min Exposure**: Minimum percentage of lineups a player must appear in
  - Useful for "locking in" high-confidence plays

#### Randomness

Enable randomness to create lineup diversity:
- Useful for creating unique GPP tournament lineups
- Helps avoid "chalky" or overly popular player combinations

## Configuration File

You can manually configure advanced settings by editing the configuration:

### API Endpoints

The extension uses the following SaberSim API endpoints (configured in `background/background.js`):

```javascript
{
  baseUrl: 'https://api.sabersim.com',
  endpoints: {
    optimize: '/v1/optimize',
    projections: '/v1/projections',
    contests: '/v1/contests',
    validate: '/v1/validate'
  }
}
```

**Note**: These endpoints are placeholders. Update them based on the actual SaberSim API documentation.

### Custom API Base URL

If SaberSim provides a different API endpoint, you can modify it in `background/background.js`:

```javascript
const SABERSIM_CONFIG = {
    baseUrl: 'https://your-custom-api-url.com',
    // ...
};
```

## Project Structure

```
SaberSim-Plugin/
├── manifest.json              # Extension configuration
├── popup/
│   ├── popup.html            # Main UI interface
│   ├── popup.css             # Styling
│   └── popup.js              # UI logic and API integration
├── background/
│   └── background.js         # Service worker for API requests
├── utils/
│   └── storage.js            # Storage management utilities
├── icons/
│   ├── icon16.png           # Extension icon (16x16)
│   ├── icon48.png           # Extension icon (48x48)
│   └── icon128.png          # Extension icon (128x128)
├── config/
│   └── config.example.json  # Example configuration
└── README.md                # This file
```

## API Integration

### Request Format

The extension sends optimization requests to SaberSim with the following structure:

```json
{
  "sport": "nfl",
  "site": "draftkings",
  "contest_type": "classic",
  "settings": {
    "num_lineups": 5,
    "salary_cap": 50000,
    "min_salary": 49000,
    "max_exposure": 0.5,
    "min_exposure": 0,
    "use_randomness": true,
    "stacking": {
      "enabled": true,
      "stack_size": 3
    }
  }
}
```

### Response Format

The extension expects responses in this format:

```json
{
  "lineups": [
    {
      "players": [
        {
          "position": "QB",
          "name": "Patrick Mahomes",
          "salary": 8500,
          "projection": 26.5,
          "team": "KC",
          "opponent": "LV"
        }
        // ... more players
      ]
    }
    // ... more lineups
  ]
}
```

**Important**: The actual SaberSim API format may differ. Consult the official SaberSim API documentation and adjust `background/background.js` accordingly.

## Troubleshooting

### Common Issues

#### "API key is required" Error
- **Solution**: Make sure you've saved your API key in the configuration section
- Check that the key was copied correctly without extra spaces

#### "Network error: Unable to reach SaberSim API"
- **Solution**: Check your internet connection
- Verify that the SaberSim API is accessible
- Check if any firewall or proxy is blocking the request

#### "Request timeout"
- **Solution**: Try generating fewer lineups
- Check if the SaberSim API is experiencing issues
- Increase timeout in `background/background.js` if needed

#### No Lineups Returned
- **Solution**: Verify your contest settings are valid
- Check that players are available for the selected sport/contest
- Review SaberSim API documentation for parameter requirements

#### Extension Not Loading
- **Solution**: Ensure all files are in the correct directories
- Check the Chrome Extensions page for error messages
- Try reloading the extension

### Debug Mode

To enable detailed logging:

1. Right-click the extension icon
2. Select "Inspect popup"
3. Open the Console tab to view logs
4. Check for error messages or API response data

For background service worker logs:
1. Go to `chrome://extensions/`
2. Find SaberSim DFS Optimizer
3. Click "service worker" link
4. View console logs

## Development

### Requirements

- Chrome browser (version 88+)
- SaberSim API access
- Basic understanding of JavaScript, HTML, CSS

### Testing

1. **Load the extension in developer mode**
2. **Make changes to the code**
3. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Click the reload icon on the SaberSim extension
4. **Test your changes**

### Adding New Sports

To add support for additional sports:

1. Update `popup/popup.html` sport dropdown:
   ```html
   <option value="new-sport">New Sport Name</option>
   ```

2. Update position mappings in `background/background.js`:
   ```javascript
   const positionMap = {
       'new-sport': {
           classic: ['POS1', 'POS2', ...],
           showdown: ['CPT', 'FLEX', ...]
       }
   };
   ```

### Customizing the UI

- **Colors/Theme**: Edit `popup/popup.css`
- **Layout**: Modify `popup/popup.html`
- **Functionality**: Update `popup/popup.js`

## Privacy & Security

- **API Key Storage**: Keys are stored securely using Chrome's encrypted storage API
- **No Data Collection**: This extension does not collect or transmit any user data except to SaberSim API
- **Local Processing**: All data processing happens locally in your browser
- **Open Source**: Code is fully transparent and available for review

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This extension is not officially affiliated with SaberSim. It's a third-party tool that integrates with their API. Make sure you comply with SaberSim's Terms of Service and API usage guidelines.

Daily Fantasy Sports involves financial risk. Please play responsibly and within your means.

## Support

For issues, questions, or feature requests:

- **GitHub Issues**: [Open an issue](https://github.com/yourusername/sabersim-plugin/issues)
- **SaberSim API Docs**: Check official SaberSim documentation for API-related questions
- **Email**: your-email@example.com

## Acknowledgments

- SaberSim for providing the optimization API
- The DFS community for feedback and suggestions
- Chrome Extensions team for excellent documentation

## Roadmap

Planned features for future releases:

- [ ] Player lock/exclude functionality
- [ ] Contest import from DFS sites
- [ ] Historical lineup performance tracking
- [ ] Advanced stacking rules (bring-back, mini-stacks)
- [ ] Ownership projections integration
- [ ] Multi-entry tournament optimization
- [ ] Lineup comparison tools
- [ ] Live scoring integration
- [ ] Mobile app version

---

**Version**: 1.0.0
**Last Updated**: October 2025
**Author**: Your Name

Happy lineup building!
