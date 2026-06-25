# ASync iOS Build & Testing Guide (Without a Mac or iPhone)

This document outlines the infrastructure and tools used to compile, build, and test the iOS version of the ASync application without requiring local Apple hardware (Mac or physical iPhone).

---

## 🏗️ 1. Cloud Build via Codemagic

Because building iOS applications requires macOS and Xcode, we have offloaded the build pipeline to **Codemagic**, a dedicated mobile CI/CD platform. 

### How it Works:
1. **Configuration (`codemagic.yaml`)**: The entire build process is defined as code in the `codemagic.yaml` file located at the root of the repository.
2. **Environment**: The pipeline utilizes a `mac_mini_m2` instance to ensure fast compilation speeds. Crucial environment variables (like Google and Firebase Client IDs) are injected securely during the build.
3. **Execution**:
   - Codemagic pulls the latest code from the `main` branch.
   - Runs `npm install` in the `Frontend` directory.
   - Executes `npx expo prebuild` to generate the native iOS project structures.
   - Runs a highly specific `xcodebuild` command designed to bypass strict Swift 6 concurrency errors (`SWIFT_STRICT_CONCURRENCY=minimal`) and, most importantly, bypasses Apple Developer Code Signing (`CODE_SIGNING_ALLOWED=NO`).
4. **Artifacts**: The build successfully compiles an `.app` directory, packages it into a `Payload` folder, and zips it into an unsigned **`app.ipa`** file. This `.ipa` file is then available for download directly from the Codemagic Artifacts dashboard.

---

## 📱 2. Device Testing via LambdaTest

Testing an `.ipa` file traditionally requires sideloading it onto a physical iPhone using a computer. Since local Apple hardware was unavailable, we utilized **LambdaTest** for cloud-based physical device testing.

### The Testing Workflow:
1. **Download the IPA**: The unsigned `app.ipa` is downloaded from the successful Codemagic build.
2. **Upload to LambdaTest**: The `.ipa` is uploaded to the LambdaTest platform. Cloud device providers like LambdaTest automatically resign the unsigned application with their own Enterprise Developer Certificates, allowing the app to run on their physical device farms.
3. **Accessibility & Functional Scanning**: 
   - The application was tested using the LambdaTest Accessibility Scanner: [https://accessibility.lambdatest.com/scanner/app](https://accessibility.lambdatest.com/scanner/app)
   - This web-based interface streams a real physical iPhone screen directly to the browser.
   - It allows for full manual interaction (touch, swipe, typing) to test the UI fidelity and functional flows of the React Native application.
   - The scanner simultaneously audits the application for WCAG accessibility compliance, ensuring the app is usable for all users.

---

### 📝 Summary
By combining **Codemagic** for headless cloud compilation and **LambdaTest** for remote physical device streaming, we successfully established a complete end-to-end iOS development and testing pipeline entirely from a Linux environment.
