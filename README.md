# Where2Be-App
This contains the codebase for the frontend application of Where2Be

# How to run the app from scratch

- Remove `node_modules`
- Run `cd ios`
- Run `pod deintegrate`
- Create a `.env` file in the format of `.env-example` with those fields filled in
- Run `npm i` if you do not have `node_modules` folder
- If you're running using native modules with iOS, `cd ios` and `pod install`
- Run `npx expo run:ios --device` or `npx expo run:android --device`

# Reminder for development!

- Go to `constants/settings.ts` and turn `firebaseAnalytics` to `false`
- Go to `backendconfig.json` and turn `"env"` to `"dev"` (with the appropriate API url)
- If you want to test shareable links, you'll need access to `branch.io` and use the `test` url. Set `universalLinks` in `constants/settings.ts` to `true` and follow instructions on how to run using `where2be.test.app.link` online. Account credentials are on Lastpass. Contact either Kyle or Chirag to get access.

# Reminder before production deployment!

- Go to `constants/settings.ts` and turn `firebaseAnalytics` to `true`
- Go to `constants/settings.ts` and turn `universalLinks` to `true`
- Go to `backendconfig.json` and turn `"env"` to `"prod"` (with the appropriate API url)