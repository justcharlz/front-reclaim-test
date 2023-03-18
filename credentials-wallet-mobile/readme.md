
## Opening a link in the app from the terminal

npx uri-scheme open "credwallet://your-links" --android

## Sync time/date

adb shell su root date $(date +%m%d%H%M%Y.%S)

## Clean cache

npm cache clean –force

npx react-native run-android -- --clean-cache

## Release

cd android
./gradlew assembleRelease