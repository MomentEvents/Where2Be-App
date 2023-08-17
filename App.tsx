import React from "react";
import Main from "./src/Main";
import * as Sentry from 'sentry-expo';
import { SETTINGS } from "./src/constants/settings";
import { View } from "react-native";

Sentry.init({
  dsn: 'https://4ec821edf22c4d9fb0a9241f1d40480d@o4505576552333312.ingest.sentry.io/4505580927123456',
  enableInExpoDevelopment: SETTINGS.sentryEnabled,
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

export default function App() {
  
  return (
    <Main/>
  );
}
