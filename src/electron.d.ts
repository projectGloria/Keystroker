export type SoundType = 'normal' | 'space' | 'enter' | 'backspace' | 'click';

export interface KeystrokerSettings {
  profile: string;
  volume: number;
  paused: boolean;
  muteSystem: boolean;
  mouseClicks: boolean;
}

export interface ElectronAPI {
  getProfiles: () => Promise<string[]>;
  loadSound: (profile: string, soundType: string) => Promise<ArrayBuffer | null>;
  setMuteSystem: (mute: boolean) => Promise<boolean>;
  getSettings: () => Promise<KeystrokerSettings>;
  saveSettings: (settings: Partial<KeystrokerSettings>) => Promise<boolean>;
  hideWindow: () => void;
  onKeySound: (callback: (soundType: SoundType) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
