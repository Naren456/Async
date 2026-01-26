# Async Chrome Extension (React)

Modern Chrome extension for tracking and managing college assignments, built with React, Vite, and Tailwind CSS.

## 🚀 Quick Start

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Build the extension**
   ```bash
   npm run build
   ```

3. **Load in Chrome**
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

### Development

```bash
npm run dev   # Start development server with HMR
npm run build # Build for production
```

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID (Web application type)
3. Add authorized redirect URI: `https://YOUR-EXTENSION-ID.chromiumapp.org/`
4. Update `public/config.js` with your client ID

### Backend Setup

Update `public/config.js`:
```javascript
const CONFIG = {
  API_BASE_URL: 'https://your-backend.com/api',
  GOOGLE_CLIENT_ID: 'your-client-id.apps.googleusercontent.com',
};
```

## 🏗️ Project Structure

```
Extension/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Main screens (Login, Dashboard)
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API and auth services
│   ├── context/         # React Context for state
│   ├── App.jsx          # Main app component
│   └── popup.jsx        # Entry point
├── public/
│   ├── config.js        # Configuration
│   └── *.png            # Extension icons
├── dist/                # Build output (load this in Chrome)
└── manifest.json        # Extension manifest
```

## ✨ Features

- ✅ Google OAuth authentication
- ✅ View assignments grouped by due date
- ✅ Mark assignments as complete/incomplete
- ✅ Click to open assignment links
- ✅ Real-time stats (Total, Completed, Pending)
- ✅ Background notifications for upcoming deadlines
- ✅ Matches mobile app design with Tailwind CSS

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chrome Extension APIs** - Browser integration
- **React Context** - State management

## 📝 Usage

1. **Login**: Click "Continue with Google" to authenticate
2. **View Assignments**: See all your assignments grouped by due date
3. **Complete Tasks**: Click the checkbox to mark as done
4. **Open Links**: Click assignment cards to open in new tab
5. **Refresh**: Manual refresh button to reload data

## 🎨 Customization

The extension uses Tailwind CSS matching the mobile app design. Edit:
- `tailwind.config.js` - Color scheme and theme
- `src/styles.css` - Global styles
- Individual components for specific UI changes

## 📦 Building for Production

```bash
npm run build
```

Output will be in `dist/` folder, ready to:
- Load in Chrome for testing
- Package as `.crx` for distribution
- Submit to Chrome Web Store

## 🔒 Security

- OAuth tokens stored in `chrome.storage.local`
- JWT authentication with backend
- HTTPS-only API communication
- Minimal permissions requested

## 📄 License

© 2026 Async Assignment Tracker
