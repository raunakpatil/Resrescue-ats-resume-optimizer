const { app, BrowserWindow, shell, ipcMain, nativeTheme, Menu, MenuItem, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

// Clear all GPU-related caches to prevent crashes after version upgrades
const cacheDirs = ['GPUCache', 'DawnGraphiteCache', 'DawnWebGPUCache'];
const userDataPath = app.getPath('userData');
for (const dir of cacheDirs) {
  const cachePath = path.join(userDataPath, dir);
  if (fs.existsSync(cachePath)) {
    try { fs.rmSync(cachePath, { recursive: true, force: true }); } catch (e) { /* ignore */ }
  }
}

process.on('uncaughtException', (error) => {
  const logPath = path.join(app.getPath('desktop'), 'resrescue-crash-log.txt');
  fs.writeFileSync(logPath, `Uncaught Exception:\n${error.stack}\n`, { flag: 'a' });
});

process.on('unhandledRejection', (reason, promise) => {
  const logPath = path.join(app.getPath('desktop'), 'resrescue-crash-log.txt');
  fs.writeFileSync(logPath, `Unhandled Rejection at: ${promise}\nReason: ${reason}\n`, { flag: 'a' });
});

// IPC handler for PDF extraction
ipcMain.handle('parse-pdf', async (event, data) => {
  try {
    const pdfParse = require('pdf-parse');
    const buffer = Buffer.from(data);
    const parsed = await pdfParse(buffer);
    return parsed.text.trim();
  } catch (err) {
    console.error('PDF parsing error in main process:', err);
    throw new Error(err.message);
  }
});

// IPC handlers for Resume History
ipcMain.handle('history:load', async () => {
  try {
    const docsPath = app.getPath('documents');
    const folderPath = path.join(docsPath, 'ResRescue');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = path.join(folderPath, 'resume-history.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error('Error loading history:', err);
    return [];
  }
});

ipcMain.handle('history:save', async (event, historyData) => {
  try {
    const docsPath = app.getPath('documents');
    const folderPath = path.join(docsPath, 'ResRescue');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = path.join(folderPath, 'resume-history.json');
    fs.writeFileSync(filePath, JSON.stringify(historyData, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving history:', err);
    return false;
  }
});

// IPC handler to save actual PDF to the ResRescue folder silently
ipcMain.handle('save-pdf-to-disk', async (event, { buffer, filename }) => {
  try {
    const docsPath = app.getPath('documents');
    const folderPath = path.join(docsPath, 'ResRescue');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    const filePath = path.join(folderPath, filename);
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return filePath;
  } catch (err) {
    console.error('Error saving PDF to disk:', err);
    throw err;
  }
});

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0f172a',
      symbolColor: '#f0f0f5', // We'll need to dynamically update this based on theme later if needed
      height: 32
    },
    title: "Raunak's ResRescue (v1.7.6)",
    ...(app.isPackaged ? {} : { icon: path.join(__dirname, '../build/icon.png') }),
    show: true,
    backgroundColor: '#0f172a', // Safe solid fallback color to prevent GPU crash
  })

  // Load the Vite-built app
  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))

  // External Links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith('file://')) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  // Native Context Menu for Copy/Paste
  mainWindow.webContents.on('context-menu', (event, params) => {
    const menu = new Menu()

    if (params.isEditable) {
      menu.append(new MenuItem({ role: 'cut' }))
      menu.append(new MenuItem({ role: 'copy' }))
      menu.append(new MenuItem({ role: 'paste' }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ role: 'selectAll' }))
    } else if (params.selectionText.trim().length > 0) {
      menu.append(new MenuItem({ role: 'copy' }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({ role: 'selectAll' }))
    }

    if (menu.items.length > 0) {
      menu.popup({ window: mainWindow })
    }
  })

  // Window Focus Events for UI Dimming
  mainWindow.on('blur', () => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-blur')
    }
  })
  
  mainWindow.on('focus', () => {
    if (!mainWindow.isDestroyed()) {
      mainWindow.webContents.send('window-focus')
    }
  })
}

// Theme IPC Handlers
ipcMain.handle('theme:get', () => nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
ipcMain.handle('theme:set-source', (e, source) => { nativeTheme.themeSource = source; }) // 'light' | 'dark' | 'system'
ipcMain.handle('get-prefers-reduced-motion', () => app.accessibilitySupportEnabled) // Actually, better to use standard CSS media query for prefers-reduced-motion

// Watch OS Theme changes
nativeTheme.on('updated', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('theme-changed', nativeTheme.shouldUseDarkColors ? 'dark' : 'light')
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
