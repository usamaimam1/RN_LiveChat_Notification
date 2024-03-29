## React Native Firebase Auth Login Signup, ForgetPassword, ChangePassword <a href="https://invertase.io/oss/react-native-firebase"><img align="left" src="https://i.imgur.com/JIyBtKW.png" width="180px"></a>

[![Backers on Open Collective](https://opencollective.com/react-native-firebase/backers/badge.svg)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/react-native-firebase/sponsors/badge.svg)](#sponsors)
[![npm version](https://img.shields.io/npm/v/react-native-firebase.svg?style=flat-square)](https://www.npmjs.com/package/react-native-firebase)
[![NPM downloads](https://img.shields.io/npm/dm/react-native-firebase.svg?style=flat-square)](https://www.npmjs.com/package/react-native-firebase)
[![Chat](https://img.shields.io/badge/chat-on%20discord-7289da.svg?style=flat-square)](https://discord.gg/C9aK28N)
[![Twitter Follow](https://img.shields.io/twitter/follow/rnfirebase.svg?style=social&label=Follow)](https://twitter.com/rnfirebase)

---

A basic react native app with [`react-native-firebase`](https://github.com/invertase/react-native-firebase) pre-integrated  to get you started quickly.

---


### Getting Started

> If you're only developing for one platform you can ignore the steps below that are tagged with the platform you don't require.

#### 1) Clone & Install Dependencies

- 1.1) `https://github.com/usamaimam1/react-native-firebase-auth-login-signup-boilerplate.git`
- 1.2) `cd react-native-firebase-auth-login-signup-boilerplate` - cd into your newly created project directory.
- 1.3) Install NPM packages with your package manager of choice - i.e run `yarn` or `npm install`

#### 2) Rename Project

**You will need to be running Node version 7.6 or greater for the rename functionality to work**

- 2.1) `npm run rename` - you'll be prompted to enter a project name and company name
- 2.2) Note down the package name value - you'll need this when setting up your Firebase project

#### 3) **[iOS]** Install Pods `RN < 0.60.0`

- 3.1) `cd ios` and run `pod install` - if you don't have CocoaPods you can follow [these instructions](https://guides.cocoapods.org/using/getting-started.html#getting-started) to install it.

#### 4) Add `Google Services` files (plist & JSON)

- 4.1) **[iOS]** Follow the `add firebase to your app` instructions [here](https://firebase.google.com/docs/ios/setup#add_firebase_to_your_app) to generate your `GoogleService-Info.plist` file if you haven't done so already - use the package name generated previously as your `iOS bundle ID`.
- 4.2) **[iOS]** Place this file in the `ios/` directory of your project.
  - Once added to the directory, add the file to your Xcode project using 'File > Add Files to "[YOUR APP NAME]"…' and selecting the plist file.
- 4.3) **[Android]** Follow the `manually add firebase` to your app instructions [here](https://firebase.google.com/docs/android/setup#manually_add_firebase) to generate your `google-services.json` file if you haven't done so already - use the package name generated previously as your `Android package name`.
- 4.4) **[Android]** Place this file in the `android/app/` directory of your project.

#### 5) AdMob Setup (Or Removal)

- 5.1) React Native Firebase Starter kit comes with AdMob pre-install. The default Sample AdMob App ID is used in both the `info.plist` **[iOS]** and the `AndroidManifest.xml` **[Android]** files. If you don't want to use AdMob, just remove it. If you do, be sure to update your ID!
- 5.2) **[iOS]** Remove or change in `info.plist` by editing the `GADApplicationIdentifier` key string.
- 5.3) **[Android]** Remove or change in `AndroidManifest.xml` by modifying the content of `<meta-data />` tag within the `<application />` tag.
- 5.4) More instrucation can be found [here](https://developers.google.com/admob/android/quick-start).
#### 6) Setup your database and configure dynamic links(if any)

#### 7) Start your app

- 6.1) Start the react native packager, run `yarn run start` or `npm start` from the root of your project.
- 6.2) **[iOS]** Build and run the iOS app, run `npm run ios` or `yarn run ios` from the root of your project. The first build will take some time. This will automatically start up a simulator also for you on a successful build if one wasn't already started.
- 6.3) **[Android]** If you haven't already got an android device attached/emulator running then you'll need to get one running (make sure the emulator is with Google Play / APIs). When ready run `npm run android` or `yarn run android` from the root of your project.

