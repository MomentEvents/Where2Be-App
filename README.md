![image](https://github.com/user-attachments/assets/86602d5e-c444-44c3-853c-60ff5880abca)  

https://github.com/user-attachments/assets/af624584-add8-4099-92da-ca03caf3a0ad  

# Where2Be-App
This contains the codebase for Where2Be's React Native mobile application.

# How to run the app from scratch

- Remove `node_modules`
- Run `cd ios`
- Run `pod deintegrate`
- Create a `.env` file in the format of `.env-example` with those fields filled in
- Run `npm i` if you do not have `node_modules` folder
- Run `pod install` in `ios` directory (if you're going to run iOS)
- Run `npx expo run:ios --device` or `npx expo run:android --device`

You'll need cocoapods to run the application on iOS. Follow a tutorial online on how to get them. It's recommended to use a macbook to develop Where2Be.

# Reminder for development!

- Go to `constants/settings.ts` and turn `firebaseAnalytics` to `false` and `sentryEnabled` to `false`
- Go to `backendconfig.json` and turn `"env"` to `"dev"` with the URL as your localhost (if you're running the server locally)
- If you want to test shareable links, you'll need access to `branch.io` and use the `test` url. Set `universalLinks` in `constants/settings.ts` to `true` and follow instructions on how to run using `where2be.test.app.link` online. Account credentials are on Lastpass. Contact either Kyle or Chirag to get access.

# Reminder before production deployment!

- Go to `constants/settings.ts` and turn `firebaseAnalytics` to `true`
- Go to `constants/settings.ts` and turn `universalLinks` to `true`
- Go to `constants/settings.ts` and turn `sentryEnabled` to `true`
- Go to `backendconfig.json` and turn `"env"` to `"prod"` (with the appropriate API url)
- Go to `android/app/build.gradle` and increase the `versionName` to what the new android version will be.
- Go to `ios/Where2Be/Info.plist` and increase the version for the key `<key>CFBundleShortVersionString</key>`

# IMPORTANT NOTE:

Do NOT run `npx expo prebuild`. Where2Be uses native modules, and running this command causes issues.
