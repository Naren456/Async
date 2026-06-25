<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)
![Codemagic](https://img.shields.io/badge/Codemagic-F55F35?style=for-the-badge&logo=codemagic&logoColor=white)

</div>

# ASync Mobile App 

**ASync** is a modern, cross-platform mobile application designed to help college students and educators seamlessly manage academic resources, track assignments, and organize deadlines. Built with a stunning dark-mode "Deep Focus" aesthetic, the app integrates robust role-based access control, a sleek React Native interface, and a powerful Node.js/PostgreSQL backend.

---

## Screenshots 

### Auth & Onboarding
<p align="center"> 
  <img src="https://github.com/user-attachments/assets/e5ff1d0f-cf97-40d4-aa3c-76a73c7728fe" width="22%" />
  <img src="https://github.com/user-attachments/assets/504d2e89-b6c6-4cb8-ad75-ae6cb0507b06" width="22%"/>
</p>

### Student Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/3a525388-579a-492a-819f-589a50d67ca4" width="19%"/>
  <img src="https://github.com/user-attachments/assets/35ab4704-c0d4-47a7-81ca-95be4adb8687" width="19%"/>
  <img src="https://github.com/user-attachments/assets/835832eb-5f5c-4b8c-99d9-831c19932af7" width="19%"/>
  <img src="https://github.com/user-attachments/assets/01c69e8b-8e11-4bce-b4d0-e1dd26847dc2" width="19%"/>
  <img src="https://github.com/user-attachments/assets/51c0f12e-b5e2-48c8-9a1f-110380a47b9e" width="19%"/>
</p>

### Admin / Teacher Panel
<p align="center">
  <img src="https://github.com/user-attachments/assets/506dc18d-f487-40f3-84e0-3a714c836359" width="16%"/>
  <img src="https://github.com/user-attachments/assets/d47b169f-0a64-4541-9cb4-72019e718d28" width="16%"/>
  <img src="https://github.com/user-attachments/assets/5dcb5ab0-176a-4b75-b9cb-72a0d4551e62" width="16%"/>
  <img src="https://github.com/user-attachments/assets/3142b334-d8d3-477e-b51a-7f2183ee8c60" width="16%"/>
  <img src="https://github.com/user-attachments/assets/db40e750-0653-4471-8827-abe3ba12604c" width="16%"/>
  <img src="https://github.com/user-attachments/assets/1eecf529-a658-4a97-82fa-4413990b412d" width="16%"/>
</p>

## Demo 
Watch our app in action: [Watch Demo Video on Google Drive](https://drive.google.com/file/d/1DWEfB8W5igEUpIqNDGv97bxKVqlaRhlA/view?usp=sharing)

---

## Key Features

* **Role-Based Workflows:** Distinct, optimized interfaces for `STUDENT` and `TEACHER` (Admin) roles.
* **Coursera Sync:** Automatically fetches assignment data from Coursera ICS calendar URLs and syncs it to student cohorts via backend cron jobs.
* **Automated CI/CD:** Zero-touch deployments using GitHub Actions for Android `.apk` builds and Codemagic for iOS `.ipa` builds.
* **Smart Assignment Tracking:** Students view timeline-grouped due dates with native local push notification reminders.
* **Notes Management:** Teachers can upload PDF resources directly to Cloudinary. Students view them via a native integrated PDF viewer.
* **Deep Focus UI:** Custom, semantic dark-mode palette designed for low eye strain and maximum productivity, complete with dynamic island mockups for the landing page.

---

## Tech Stack

### Frontend & UI
- **Framework:** React Native, Expo SDK, Expo Router
- **State & Styling:** Redux Toolkit, NativeWind (Tailwind CSS)
- **Forms & Icons:** Formik, Yup, Lucide Icons

### Backend & API
- **Runtime:** Node.js, Express
- **Database:** PostgreSQL with Prisma ORM
- **Auth & Storage:** JWT, Cloudinary, Multer
- **Jobs:** Node Cron, `ical.js` (for calendar parsing)

### DevOps & CI/CD
- **Android Build:** GitHub Actions (`build-android-apk.yml`)
- **iOS Build:** Codemagic (`codemagic.yaml`)

---

## Repository Structure

```text
.
├── Backend/            # Node.js/Express server, Prisma ORM, Cron jobs
├── Frontend/           # React Native Expo app, Redux store, NativeWind UI
├── LandingPage/        # Modern React/Vite landing page showcasing the app
├── .github/workflows/  # Automated Android build pipelines
├── codemagic.yaml      # Automated iOS build pipelines
└── README.md
```

---

## Getting Started (Development)

### 1. Backend Setup
```bash
git clone https://github.com/Naren456/Async.git
cd Async/Backend
npm install
```
Configure your `.env` file with your `DATABASE_URL`, `JWT_SECRET`, and Cloudinary credentials.
```bash
npx prisma migrate dev
npm run dev
```

### 2. Frontend Setup
```bash
cd ../Frontend
npm install
npx expo start
```
Scan the QR code with the Expo Go app on your phone, or press `i` to open in the iOS simulator.

### 3. Landing Page Setup
```bash
cd ../LandingPage
npm install
npm run dev
```

---

## Building for Production

We use automated CI/CD pipelines to build the production binaries.

### Android (.apk)
Pushing code to the `main` branch will automatically trigger the GitHub Action (`build-android-apk.yml`) which runs an EAS local build and publishes the resulting APK as a GitHub Release artifact.

### iOS (.ipa)
Building an iOS app usually requires a Mac. We bypass this using a dedicated pipeline!
1. **Codemagic:** Our `codemagic.yaml` automatically provisions a `mac_mini_m2`, injects the environment variables, and generates an unsigned `app.ipa`.
2. **LambdaTest:** For physical device validation without owning an iPhone, we stream the `.ipa` to cloud devices via [LambdaTest Accessibility Scanner](https://accessibility.lambdatest.com/scanner/app).
3. **Physical Installation:** If you have an iPhone, see our [iOS Installation Guide](iOS_Installation_Guide.md) to sideload the app using AltStore without a 7-day expiration!

*(For technical details on the headless iOS compilation architecture, see [build_iomac.md](build_iomac.md)).*

---

## Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Naren456/Async/issues).

## License
This project is open-sourced under the MIT License.
