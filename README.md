# Where2Be-App
This contains the codebase for the frontend application of Where2Be

# How to run it fresh

Remove `node_modules`
`cd ios`
`pod deintegrate`

# How to run the app

- Create a `.env` file in the format of `.env-example` with those fields filled in
- Run `npm i` if you do not have `node_modules` folder
- If you're running using native modules with iOS, `cd ios` and `pod install`
- Run `npx expo run:ios --device` or `npx expo run:android --device`

# Reminder before production deployment!

- Go to `constants/settings.ts` and turn `firebaseAnalytics` to `true`
- Go to `backendconfig.json` and turn `"env"` to `"prod"` (with the appropriate API url)