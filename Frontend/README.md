# ASync - Student Assignment Companion

ASync is a comprehensive mobile application designed to help students track assignments, deadlines, and academic schedules. Built with React Native and Expo, it simplifies academic management for students.

## 🚀 Features

- **Assignment Tracking**: View upcoming assignments and deadlines in a unified dashboard.
- **Push Notifications**: Get timely reminders for due dates.
- **Google Sign-In**: Secure and easy authentication using your institutional email.
- **Admin Panel**: Teachers can upload assignments and notes directly.
- **Offline Support**: View cached data even without internet.

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **State Management**: Redux Toolkit
- **Navigation**: Expo Router (File-based routing)
- **Backend / Database**: Node.js, Prisma, PostgreSQL (NeonDB)

## 🏁 Getting Started

### Prerequisites

- Node.js & npm/yarn
- Expo Go app on your mobile device (or Android Studio/Xcode for emulators)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Async/Frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the `Frontend` directory with the following keys:
    ```env
    EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_web_client_id
    EXPO_PUBLIC_IOS_URL_SCHEME=your_ios_url_scheme
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id_for_web
    ```

4.  **Start the application**:
    ```bash
    npx expo start
    ```

5.  **Run on Device/Emulator**:
    - Scan the QR code with Expo Go (Android) or Camera (iOS).
    - Press `a` to open in Android Emulator.
    - Press `i` to open in iOS Simulator.

## 📂 Project Structure

- `app/`: Expo Router pages (Screens).
- `components/`: Reusable UI components.
- `api/`: Axios client and service functions.
- `store/`: Redux slices and store configuration.
- `assets/`: Images and static resources.

## 🤝 Contributing

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request
