import { useState, useEffect, useRef } from "react";
import { soundEngine, SoundType } from "./soundEngine";
import "./App.css";

function App() {
  const [profiles, setProfiles] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [volume, setVolume] = useState(0.5);
  const [paused, setPaused] = useState(false);
  const [muteSystem, setMuteSystem] = useState(false);
  const [mouseClicks, setMouseClicks] = useState(true);

  const volumeRef = useRef(volume);
  const pausedRef = useRef(paused);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    async function init() {
      if (!window.electronAPI) return;

      const [availableProfiles, settings] = await Promise.all([
        window.electronAPI.getProfiles(),
        window.electronAPI.getSettings(),
      ]);

      setProfiles(availableProfiles);

      if (settings) {
        setVolume(settings.volume ?? 0.5);
        setPaused(settings.paused ?? false);
        setMuteSystem(settings.muteSystem ?? false);
        setMouseClicks(settings.mouseClicks ?? true);

        const initialProfile =
          settings.profile && availableProfiles.includes(settings.profile)
            ? settings.profile
            : availableProfiles.includes("Opera GX")
            ? "Opera GX"
            : availableProfiles.includes("Topre")
            ? "Topre"
            : availableProfiles[0] || "";

        setSelectedProfile(initialProfile);
        if (initialProfile) {
          soundEngine.loadProfile(initialProfile);
        }
      } else if (availableProfiles.length > 0) {
        const defaultProf = availableProfiles.includes("Opera GX")
          ? "Opera GX"
          : availableProfiles.includes("Topre")
          ? "Topre"
          : availableProfiles[0];
        setSelectedProfile(defaultProf);
        soundEngine.loadProfile(defaultProf);
      }
    }

    init();

    // Listen for global key and mouse sound events from Electron main process
    const unsubscribe = window.electronAPI?.onKeySound((soundType: SoundType) => {
      if (!pausedRef.current) {
        soundEngine.play(soundType, volumeRef.current);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prof = e.target.value;
    setSelectedProfile(prof);
    soundEngine.loadProfile(prof);
    window.electronAPI?.saveSettings({ profile: prof });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    window.electronAPI?.saveSettings({ volume: val });
  };

  const handlePause = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setPaused(val);
    window.electronAPI?.saveSettings({ paused: val });
  };

  const handleMuteSystem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setMuteSystem(val);
    window.electronAPI?.setMuteSystem(val);
    window.electronAPI?.saveSettings({ muteSystem: val });
  };

  const handleMouseClicks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setMouseClicks(val);
    window.electronAPI?.saveSettings({ mouseClicks: val });
  };

  return (
    <div className="app-wrapper">
      <header>
        <div className="logo-box">K</div>
        <div className="header-text">
          <h1>Keystroker</h1>
          <p>Premium Typing Sound Engine</p>
        </div>
        <button
          className="close-btn"
          title="Hide to tray"
          onClick={() => window.electronAPI?.hideWindow()}
        >
          ✕
        </button>
      </header>

      <div className="settings-group">
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Pause Sounds</span>
            <span className="setting-desc">Instantly mute all sounds</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              className="toggle-input"
              checked={paused}
              onChange={handlePause}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Mouse Click Sounds</span>
            <span className="setting-desc">Play mechanical click on mouse press</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              className="toggle-input"
              checked={mouseClicks}
              onChange={handleMouseClicks}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Mute Windows Sounds</span>
            <span className="setting-desc">Suppresses system dings and navigation clicks</span>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              className="toggle-input"
              checked={muteSystem}
              onChange={handleMuteSystem}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-group">
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Volume</span>
            <span className="setting-desc">Adjust typing sound intensity</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="range-slider"
          />
        </div>

        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-title">Sound Profile</span>
            <span className="setting-desc">Select your switch type</span>
          </div>
          <select
            value={selectedProfile}
            onChange={handleProfileChange}
            className="profile-select"
          >
            {profiles.length > 0 ? (
              profiles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))
            ) : (
              <option value="">No sounds found</option>
            )}
          </select>
        </div>
      </div>

      <p className="footer-text">
        Click outside this window to hide it.<br />
        Right click the tray icon to exit completely.
      </p>
    </div>
  );
}

export default App;
