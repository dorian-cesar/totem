# Ionic App
Ionic ios/android

## Building a Mobile Application
You have to create a production build for generating mobile applications.

### Production Build
$ ionic build --prod

### Build iOS App
Following commands for executing Xcode build, watch the video tutorial you will understand more.

$ npx cap add ios

$ npx cap open ios

### Build Android App
Open Android build using Android SDK

$ npx cap add android

$ npx cap open android


### Project Updates
If you want to update your project changes.

First run $ ionic build --prod

$ npx cap copy
