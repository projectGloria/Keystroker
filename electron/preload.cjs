const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  loadSound: (profile, soundType) => ipcRenderer.invoke('load-sound', { profile, soundType }),
  setMuteSystem: (mute) => ipcRenderer.invoke('set-mute-system', mute),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  hideWindow: () => ipcRenderer.send('hide-window'),
  onKeySound: (callback) => {
    const subscription = (_event, soundType) => callback(soundType);
    ipcRenderer.on('key-sound', subscription);
    return () => {
      ipcRenderer.removeListener('key-sound', subscription);
    };
  },
});
