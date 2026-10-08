# Mamad Craft Launcher

A real cross-platform launcher project scaffold for Windows and Android.

## Windows
1. Install Node.js 20+.
2. Run `npm install`.
3. Run `npm start` for the desktop app.
4. Run `npm run dist:win` on Windows to create the real `Mamad-Craft-Launcher-1.0.0-Setup.exe`.

## Android
1. Install Android Studio + Android SDK + JDK 17+.
2. Run `npm install`.
3. Run `npm run cap:add` (first time), then `npm run cap:sync`.
4. Open Android Studio with `npm run cap:open` and build an APK.

The UI is functional, but actual Minecraft Java/Bedrock runtime launching is intentionally not faked. Native runtime integration is the next engineering stage.
