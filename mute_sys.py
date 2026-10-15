import sys
try:
    from pycaw.pycaw import AudioUtilities
    mute = sys.argv[1] == '1'
    sessions = AudioUtilities.GetAllSessions()
    for session in sessions:
        if session.Process is None or (session.Process and session.Process.name().lower() == "explorer.exe"):
            volume = session.SimpleAudioVolume
            volume.SetMute(1 if mute else 0, None)
except Exception as e:
    pass
