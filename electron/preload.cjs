// Preload script — runs in renderer context before page loads
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  parsePdf: (buffer) => ipcRenderer.invoke('parse-pdf', buffer),
  scrapeJobs: (config) => ipcRenderer.invoke('scrape-jobs', config),
  
  // Theme APIs
  getTheme: () => ipcRenderer.invoke('theme:get'),
  setThemeSource: (source) => ipcRenderer.invoke('theme:set-source', source), // 'light' | 'dark' | 'system'
  onThemeChanged: (callback) => ipcRenderer.on('theme-changed', (_event, value) => callback(value)),
  
  // Window Focus APIs
  onWindowBlur: (callback) => ipcRenderer.on('window-blur', callback),
  onWindowFocus: (callback) => ipcRenderer.on('window-focus', callback),
  
  // History APIs
  loadHistory: () => ipcRenderer.invoke('history:load'),
  saveHistory: (data) => ipcRenderer.invoke('history:save', data),
  savePdfToDisk: (buffer, filename) => ipcRenderer.invoke('save-pdf-to-disk', { buffer, filename }),
})
