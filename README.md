<div align="center">

<img src="public/icon.png" alt="Keystroker Logo" width="120" height="120" />

# Keystroker

**A sleek, zero-latency mechanical keyboard & mouse sound engine for Windows**

*Transform every keystroke and mouse click into satisfying tactile acoustic feedback — powered by Electron, React, TypeScript, and the Web Audio API.*

<p>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-00B074.svg?style=flat-square" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/Platform-Windows%20x64-0078D4.svg?style=flat-square&logo=windows" alt="Platform: Windows x64" />
  <img src="https://img.shields.io/badge/Electron-44-47848F.svg?style=flat-square&logo=electron" alt="Electron" />
  <img src="https://img.shields.io/badge/React-19-61DAFB.svg?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6.svg?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Sound%20Profiles-21%20Included-8A2BE2.svg?style=flat-square" alt="21 Sound Profiles" />
  <img src="https://img.shields.io/badge/Latency-Sub--millisecond-success.svg?style=flat-square" alt="Zero Latency Audio" />
</p>

---

<p>
  <a href="#-about-keystroker">About</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-visual-tour">Visual Tour</a> •
  <a href="#-sound-profiles-library">Sound Profiles</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-installation--usage">Installation</a> •
  <a href="#-building-from-source">Building</a> •
  <a href="#-icon--design-philosophy">Design</a> •
  <a href="#-license--credits">License</a>
</p>

<picture>
  <img
    width="920"
    src="docs/assets/keystroker-preview.svg"
    alt="Keystroker Sound Engine Interface Preview"
  />
</picture>

</div>

---

## 🔊 About Keystroker

Typing on a standard membrane laptop or quiet chiclet keyboard often lacks the deep acoustic satisfaction and tactile feedback that mechanical keyboard enthusiasts adore. 

**Keystroker** is an ultra-lightweight, hardware-accelerated sound engine designed specifically for Windows. Running quietly as a background daemon, it intercepts system-wide keystrokes and mouse clicks in real time, triggering studio-grade mechanical switch and microswitch acoustics through your headphones or speakers with imperceptible latency.

Whether you crave the deep, pillowy "thock" of electro-capacitive **Topre** domes, the tactile snap of **Holy Panda** switches, the nostalgic clack of an **IBM Model M**, or crisp **mouse clicks**, Keystroker turns everyday typing and gaming into an immersive sensory ritual.

- ⚡ **Zero-Latency Playback**: Employs Chromium's Web Audio API with pre-decoded hardware `AudioBuffer` pools for instant sound reproduction without CPU spikes or lag.
- 🌐 **Global OS-Wide Hook**: Intercepts keys and clicks seamlessly across all software—browsers, code editors, terminals, and games—via native C++ bindings (`uiohook-napi`).
- 🎛️ **Modern Floating HUD**: A draggable, frameless dark glass overlay positioned conveniently near your system tray that auto-dismisses when you click away.
- 🔒 **100% Offline & Private**: Zero telemetry, no cloud accounts, and no keylogging. Keystroker only tracks key type classes (space, enter, backspace, normal, click) to assign the appropriate acoustic sample.

---

## ✨ Key Features

<table>
  <tr>
    <td width="50%">
      <h3>⚡ Global Native Interception</h3>
      <p>Low-level Windows event interception via <code>uiohook-napi</code> capturing key presses and mouse clicks across all applications without active window focus.</p>
    </td>
    <td width="50%">
      <h3>🎧 21 Studio Sound Profiles</h3>
      <p>Curated sound collections spanning mechanical legends (Topre, Holy Panda, IBM Model M), Cherry MX switches, typewriters, and retro arcade synthesizers.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🖱️ Tactile Mouse Clicks</h3>
      <p>Brings mechanical microswitch feedback to mouse presses, automatically pitch-scaled for authentic peripheral acoustics.</p>
    </td>
    <td width="50%">
      <h3>🚀 Zero-Latency Audio Engine</h3>
      <p>Interactive-hint Web Audio architecture with pre-cached buffers, micro-pitch jitter (±2%) for natural organic realism, and polyphonic voice mixing.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔕 Windows Sound Suppressor</h3>
      <p>Optional integrated background utility to silence disruptive default Windows navigation clicks, dings, and chime alerts while typing.</p>
    </td>
    <td width="50%">
      <h3>🪟 Sleek System Tray Integration</h3>
      <p>Runs quietly in the notification area with a left-click toggle, context menu pause/exit, and automatic position memory.</p>
    </td>
  </tr>
</table>

---

## 🖼️ Visual Tour

### 1. Minimalist Floating HUD
A clean, frameless dark acrylic interface that stays out of your way. Adjust volume with a smooth slider, switch audio profiles on the fly, and toggle features with responsive switches.

<p align="center">
  <img src="docs/assets/keystroker-preview.svg" alt="Keystroker HUD Interface" width="820" />
</p>

### 2. High-Performance Audio Engine Pipeline
From raw hardware interrupt to acoustic playback in under a millisecond. Keypress events are filtered, debounced, dispatched over IPC, and rendered through pre-decoded memory buffers.

<p align="center">
  <img src="docs/assets/pipeline.svg" alt="Real-time Audio Pipeline Diagram" width="820" />
</p>

### 3. Windows Notification Area & Tray Controls
Left-click the system tray icon to reveal the HUD right above the taskbar. Right-click to access instant controls to pause typing audio or exit the app.

<p align="center">
  <img src="docs/assets/tray-preview.svg" alt="Windows Tray Integration Demo" width="650" />
</p>

---

## 🎹 Sound Profiles Library

Keystroker ships out of the box with **21 distinct acoustic profiles**, each featuring dedicated audio samples for normal alphanumeric typing, spacebars, enter keys, backspace, and mouse clicks:

| Category | Sound Profile | Acoustic Signature & Description |
| :--- | :--- | :--- |
| **Enthusiast Mechanical** | **Topre** | Deep, luxurious, rounded electro-capacitive tactile thock |
| | **Holy Panda** | Snappy, tactile, prominent clack with rich bottom-out |
| | **Thocky** | Deep pitch, dampened acoustic profile beloved in custom builds |
| | **Gateron Ink Black** | Silky-smooth linear switch sound with clean bottoming |
| | **Mechanical** | Universal balanced mechanical switch acoustic |
| **Cherry MX Family** | **Cherry MX Blue** | Crisp, high-pitched mechanical click with distinct tactile bump |
| | **Cherry MX Brown** | Subtle tactile clack without loud click bar resonance |
| | **Cherry MX Red** | Smooth, quiet linear travel with light switch report |
| | **Clicky** | Sharp, pronounced acoustic snap for tactile typing purists |
| **Vintage & Retro** | **IBM Model M** | Iconic buckling spring snap from the golden age of computing |
| | **Typewriter Vintage** | Heavy mechanical carriage and steel hammer impacts |
| | **Typewriter Modern** | Crisp mid-century manual typewriter clack |
| | **Typewriter** | Classic mechanical typewriter keys with resonant body reverb |
| **Digital & Arcade** | **Opera GX** | Modern digital feedback inspired by high-energy gaming browsers |
| | **8-Bit Retro** | Chiptune synth clicks reminiscent of 80s arcade cabinets |
| | **Hacker Terminal** | Cyberpunk sci-fi console keystrokes |
| | **Sci-Fi Blaster** | Futuristic energy weapon pulses on every stroke |
| **Novelty & Ambient** | **Water Drops** | Calming, organic liquid droplets with resonant pitch |
| | **Wooden Blocks** | Hollow, woody percussive strikes with warm resonance |
| | **Soft** | Gentle, muted tap suited for late-night typing and shared rooms |
| | **Cheap Membrane** | Playful recreation of retro office rubber-dome keyboards |

---

## ⚙️ How It Works

Keystroker coordinates low-level C++ native hooks with Chromium's Web Audio subsystem to deliver instantaneous, stutter-free sound:

```
[ Hardware Keyboard / Mouse ]
              │
              ▼
   uiohook-napi (C++ Thread)
   ├─ 25ms Anti-Flutter Debounce
   └─ Key Classification (Normal, Space, Enter, Backspace, Click)
              │
              ▼
   Electron Main Process (IPC)
   └─ backgroundThrottling: false
              │
              ▼
   Web Audio API (Renderer Engine)
   ├─ Pre-Decoded AudioBuffer Cache
   ├─ Micro-Pitch Jitter (±2% natural human variance)
   └─ Linear Gain Staging
              │
              ▼
   [ Windows Audio Drivers / Headphones ]
```

### Key Architectural Highlights
1. **Interactive Audio Context**: Initialized with `{ latencyHint: 'interactive' }` ensuring lowest possible hardware buffer sizes.
2. **Pre-Decoded Audio Buffers**: Rather than reading `.wav` files on each keypress, samples are decoded into raw PCM memory buffers when a profile is selected.
3. **Background Throttling Disabled**: Chromium naturally throttles background renderers to save power. Keystroker explicitly disables background throttling so sound triggers immediately even while heavy 3D games or compilers run.
4. **Natural Pitch Micro-Jitter**: Real mechanical keyboards never sound 100% identical on repeated keystrokes. Keystroker injects a random `±0.02` playback rate jitter into each strike to eliminate robotic fatigue.

---

## 📦 Installation & Usage

### Running the Windows Installer

Download the latest installer executable (`Keystroker-Setup-0.1.0.exe`) from the repository releases and run it:

```powershell
release/Keystroker-Setup-0.1.0.exe
```

Upon installation, Keystroker sets up:
- Desktop and Start Menu shortcuts.
- Silent startup capability in the Windows System Tray.
- Persistent user configuration at `%APPDATA%\keystroker\keystroker-settings.json`.

### Controls & Navigation

- **Show / Hide**: Left-click the Keystroker icon in the system tray.
- **Dismiss**: Simply click anywhere outside the popup HUD window to dismiss it.
- **Reposition**: Click and drag the header bar to place the HUD anywhere on your desktop.
- **Pause Audio**: Toggle **Pause Sounds** in the HUD or right-click the tray icon and choose **Pause Sounds**.
- **Exit**: Right-click the tray icon and select **Exit Keystroker**.

---

## 🛠️ Building from Source

### Prerequisites

Ensure the following tools are installed on your Windows environment:
- **Node.js** (v18.x or newer; v20+ recommended)
- **Python** (required for compiling native Node C++ modules via `node-gyp`)
- **Visual Studio C++ Build Tools** (Desktop development with C++)
- **Git for Windows**

### Build Steps

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/projectGloria/Keystroker.git
   cd Keystroker
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Start the local development server:**
   ```powershell
   npm run dev
   ```
   *This starts Vite on `http://localhost:1420` and boots Electron with hot reload.*

4. **Package the Windows executable:**
   ```powershell
   npm run build:win
   ```
   The production NSIS installer will be output into the `release/` directory:
   ```
   release/Keystroker-Setup-0.1.0.exe
   ```

---

## 🎨 Icon & Design Philosophy

<p align="center">
  <img src="public/icon.png" alt="Keystroker Icon Close-up" width="108" height="108" />
</p>

> *"A bold, vibrant indigo and violet geometric keycap emblem representing acoustic energy and tactile precision."*

The visual design is crafted to integrate harmoniously with Windows 11 Fluent and modern dark mode workspace environments:
- **Deep Space Palette**: Layered `#15181e` and `#1a1d26` surfaces with subtle border strokes (`#232733`) prevent eye strain.
- **Electric Indigo Accents**: The signature `#6366f1` to `#7c3aed` gradient evokes tactile mechanical precision and digital audio waveforms.
- **Pixel-Crisp Assets**: Includes both multi-resolution Windows `.ico` and alpha-transparent `.png` icons formatted for standard desktop shortcuts and compact 16px/32px tray status bars.

---

## 📄 License & Credits

Keystroker is open-source software licensed under the **[MIT License](LICENSE)**.

- **Engine & Architecture**: Built with [Electron](https://www.electronjs.org/), [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vitejs.dev/).
- **Native Hooking**: Powered by [uiohook-napi](https://github.com/Tolik518/uiohook-napi) for cross-platform event interception.
- **Sound Libraries**: Acoustic samples curated and balanced for headphones and desktop speakers.
- **Author**: Created with ❤️ by [Nihil](https://github.com/projectGloria).
