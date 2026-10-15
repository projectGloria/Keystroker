# Keystroker

A sleek mechanical keyboard sound engine for Windows built with Electron, React, TypeScript, and Web Audio API.

## Features

- **Global Interception**: Captures keystrokes and mouse clicks across all applications using `uiohook-napi`.
- **21 Switch Sound Profiles**: Including Topre, Opera GX, Holy Panda, Cherry MX, IBM Model M, Thocky, and more.
- **Mouse Click Audio**: Realistic microswitch clicks on mouse button presses.
- **Zero-Latency Sound Engine**: Chromium Web Audio API with pre-decoded polyphonic audio buffers.
- **System Tray Integration**: Runs quietly in the notification area with a left-click toggle and quick-access context menu.
- **Draggable UI**: Frameless dark popup window you can drag and reposition anywhere.
- **Settings Persistence**: Volume, active profile, and toggle states are saved across sessions.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run build:win
```
