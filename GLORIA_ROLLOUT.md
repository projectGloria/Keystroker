# Gloria rollout notes

Please check these choices made without asking:

- **Build type:** Electron (electron-builder). CI builds with `electron-builder --win --x64 --dir` and copies
  `release/win-unpacked/*` (Keystroker.exe, Electron runtime, `resources/` with the asar, unpacked uiohook-napi,
  sounds, tray icon and mute_sys.py) into `app-dist/`. The old NSIS step and `build-installers.yml` were removed.
- **Icon:** no `Keystroker.ico` in the root, so `public/icon.ico` (already used by electron-builder) is used.
- **Version:** `gloria.toml` says `0.1.0` (from package.json). The catalog says 0.1.8; the tag overrides it at release.
- **Data folder:** `%APPDATA%\keystroker`. The app never sets its name, so Electron's userData is named after
  package.json `name` ("keystroker"), and it holds `keystroker-settings.json`. Please confirm on an installed build.
- **legacy_names:** `["Keystroker"]`. electron-builder's NSIS DisplayName defaults to "Keystroker <version>"
  (e.g. "Keystroker 0.1.0"); if GloriaSetup matches exactly, old installs may not be detected. Add the versioned
  names if migration does not trigger.
- **WebView2:** not needed (Electron), so no bootstrapper.
- **Python:** `mute_sys.py` is shipped but runs with `python` from PATH, as before; it is not bundled.
- **Secrets:** `WINDOWS_PFX_BASE64` and `WINDOWS_PFX_PASSWORD` must exist in the repo; empty means an unsigned setup.
- Nothing was built locally, pushed, tagged or released.
