const { app, BrowserWindow, Tray, Menu, ipcMain, screen, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { uIOhook, UiohookKey } = require('uiohook-napi');

let mainWindow = null;
let tray = null;
let isQuitting = false;

// Settings path in userData
const settingsPath = path.join(app.getPath('userData'), 'keystroker-settings.json');

const defaultSettings = {
  profile: 'Topre',
  volume: 0.5,
  paused: false,
  muteSystem: false,
  mouseClicks: true,
};

function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      return { ...defaultSettings, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Failed to read settings:', err);
  }
  return { ...defaultSettings };
}

let currentSettings = loadSettings();

function saveSettings(newSettings) {
  currentSettings = { ...currentSettings, ...newSettings };
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(currentSettings, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// Locate sounds directory (support dev and packaged builds)
function getSoundsDir() {
  const devPath = path.join(__dirname, '..', 'sounds');
  if (fs.existsSync(devPath)) return devPath;
  const prodPath = path.join(process.resourcesPath, 'sounds');
  if (fs.existsSync(prodPath)) return prodPath;
  return path.join(app.getAppPath(), 'sounds');
}

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      showWindow();
    }
  });
}

function createTrayIcon() {
  const possiblePaths = [
    path.join(__dirname, '..', 'public', 'tray-icon.png'),
    path.join(__dirname, '..', 'dist', 'tray-icon.png'),
    path.join(process.resourcesPath, 'tray-icon.png'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return nativeImage.createFromPath(p);
    }
  }
  return nativeImage.createEmpty();
}

function toggleWindow() {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
}

let savedPosition = null;

function showWindow() {
  if (!mainWindow) return;

  if (savedPosition) {
    mainWindow.setPosition(savedPosition[0], savedPosition[1], false);
  } else {
    // Position near system tray (bottom-right on Windows by default)
    const trayBounds = tray ? tray.getBounds() : null;
    const primaryDisplay = screen.getPrimaryDisplay();
    const { workArea } = primaryDisplay;
    const windowBounds = mainWindow.getBounds();

    let x, y;
    if (trayBounds && trayBounds.x !== 0 && trayBounds.y !== 0) {
      x = Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2);
      y = Math.round(trayBounds.y - windowBounds.height - 10);

      // Keep within screen work area
      if (x + windowBounds.width > workArea.x + workArea.width) {
        x = workArea.x + workArea.width - windowBounds.width - 12;
      }
      if (x < workArea.x) x = workArea.x + 12;
      if (y < workArea.y) y = workArea.y + 12;
    } else {
      // Center if tray position unavailable
      x = Math.round(workArea.x + (workArea.width - windowBounds.width) / 2);
      y = Math.round(workArea.y + (workArea.height - windowBounds.height) / 2);
    }

    mainWindow.setPosition(x, y, false);
  }

  mainWindow.show();
  mainWindow.focus();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 460,
    height: 590,
    show: false,
    frame: false,
    resizable: false,
    maximizable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false, // Critical for instant audio in background
    },
  });

  const devUrl = 'http://localhost:1420';
  const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

  if (isDev) {
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  let canHideOnBlur = false;

  mainWindow.on('focus', () => {
    setTimeout(() => {
      canHideOnBlur = true;
    }, 300);
  });

  mainWindow.on('will-move', () => {
    canHideOnBlur = false;
  });

  mainWindow.on('moved', () => {
    savedPosition = mainWindow.getPosition();
    setTimeout(() => {
      canHideOnBlur = true;
    }, 500);
  });

  mainWindow.on('blur', () => {
    if (canHideOnBlur) {
      mainWindow.hide();
      canHideOnBlur = false;
    }
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

ipcMain.on('hide-window', () => {
  if (mainWindow) mainWindow.hide();
});

function setupTray() {
  const icon = createTrayIcon();
  tray = new Tray(icon);
  tray.setToolTip('Keystroker - Mechanical Keyboard Sound Engine');

  const updateContextMenu = () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Keystroker',
        click: () => showWindow(),
      },
      {
        label: currentSettings.paused ? 'Resume Sounds' : 'Pause Sounds',
        click: () => {
          currentSettings.paused = !currentSettings.paused;
          saveSettings({ paused: currentSettings.paused });
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('settings-changed', currentSettings);
          }
          updateContextMenu();
        },
      },
      { type: 'separator' },
      {
        label: 'Exit',
        click: () => {
          isQuitting = true;
          app.quit();
        },
      },
    ]);
    tray.setContextMenu(contextMenu);
  };

  tray.on('click', () => {
    toggleWindow();
  });

  updateContextMenu();
}

// Global Keystroke Listener
let lastKeyTime = 0;
function setupGlobalKeyHook() {
  uIOhook.on('keydown', (e) => {
    if (currentSettings.paused) return;

    // Fast debounce: avoid repeated machine-gun sounds if a key is held
    const now = Date.now();
    if (now - lastKeyTime < 25) return;
    lastKeyTime = now;

    let soundType = 'normal';
    if (e.keycode === UiohookKey.Space) {
      soundType = 'space';
    } else if (e.keycode === UiohookKey.Enter || e.keycode === 3612) {
      soundType = 'enter';
    } else if (e.keycode === UiohookKey.Backspace || e.keycode === UiohookKey.Delete) {
      soundType = 'backspace';
    }

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('key-sound', soundType);
    }
  });

  uIOhook.on('mousedown', () => {
    if (currentSettings.paused || currentSettings.mouseClicks === false) return;

    const now = Date.now();
    if (now - lastKeyTime < 25) return;
    lastKeyTime = now;

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('key-sound', 'click');
    }
  });

  uIOhook.start();
}

// IPC Handlers
ipcMain.handle('get-profiles', () => {
  const soundsDir = getSoundsDir();
  try {
    if (fs.existsSync(soundsDir)) {
      const items = fs.readdirSync(soundsDir, { withFileTypes: true });
      return items.filter((d) => d.isDirectory()).map((d) => d.name);
    }
  } catch (err) {
    console.error('Error scanning profiles:', err);
  }
  return [];
});

ipcMain.handle('load-sound', async (_event, { profile, soundType }) => {
  const soundsDir = getSoundsDir();
  const filePath = path.join(soundsDir, profile, `${soundType}.wav`);
  try {
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }
  } catch (err) {
    console.error(`Error reading sound ${filePath}:`, err);
  }
  return null;
});

ipcMain.handle('get-settings', () => {
  return currentSettings;
});

ipcMain.handle('save-settings', (_event, settings) => {
  saveSettings(settings);
  return true;
});

ipcMain.handle('set-mute-system', (_event, mute) => {
  const possiblePaths = [
    path.join(app.getAppPath(), 'mute_sys.py'),
    path.join(process.resourcesPath, 'mute_sys.py'),
    path.join(__dirname, '..', 'mute_sys.py'),
  ];
  const scriptPath = possiblePaths.find((p) => fs.existsSync(p));
  try {
    if (scriptPath) {
      spawn('python', [scriptPath, mute ? '1' : '0']);
    }
  } catch (err) {
    console.warn('Could not run mute_sys.py:', err);
  }
  return true;
});

app.whenReady().then(() => {
  createWindow();
  setupTray();
  setupGlobalKeyHook();
  showWindow(); // Open window initially so user sees it right away
});

app.on('will-quit', () => {
  try {
    uIOhook.stop();
  } catch (e) {
    // ignore
  }
});
