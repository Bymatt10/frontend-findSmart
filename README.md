# 📱 FinSmart Mobile

Mobile app for **FinSmart** — your intelligent personal finance coach.

Built with [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/) + [NativeWind](https://www.nativewind.dev/).

## ✨ Features

- **🔐 Auth** — Login & Register with Supabase
- **📊 Dashboard** — Balance overview, income/expense split, recent transactions
- **💰 Transactions** — Add, edit, delete with multi-currency (C$/USD)
- **🎯 Goals** — Set financial goals with deadlines and progress tracking
- **🤖 AI Coach** — Chat with an AI financial advisor powered by Gemini
- **📈 Insights** — AI-generated trends, alerts & recommended actions
- **🌙 Dark Theme** — Premium dark UI throughout

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Framework   | Expo SDK 54 + React Native 0.81 |
| Navigation  | Expo Router (file-based)       |
| Styling     | NativeWind (Tailwind CSS)      |
| State       | Zustand                        |
| HTTP        | Axios                          |
| Auth        | Supabase Auth                  |
| Icons       | Ionicons / Lucide              |

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Expo CLI (`npx expo`)
- iOS Simulator / Android Emulator / Physical device
- Backend API running ([Backend-findSmart](https://github.com/Bymatt10/Backend-findSmart))

### Setup

```bash
# Install dependencies
npm install

# Copy env example and fill in your values
cp .env.dev .env

# Start Expo dev server
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan QR code with Expo Go.

### Environment Variables

See [`.env.dev`](.env.dev) for required variables:

| Variable                      | Description                                         |
|-------------------------------|-----------------------------------------------------|
| `EXPO_PUBLIC_API_URL`         | Backend API URL (e.g. `http://192.168.1.X:4000`)   |
| `EXPO_PUBLIC_SUPABASE_URL`    | Your Supabase project URL                           |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key                     |

> **Note:** For physical devices, use your computer's local IP instead of `localhost`.

---

## 📦 Building the Android APK (Local)

### Requirements

| Tool              | Version              |
|-------------------|----------------------|
| Java (JDK)        | 21 (OpenJDK)         |
| Android SDK       | API 36 (Android 16)  |
| Android NDK       | r27d (27.3.13750724) |
| Build Tools       | 36.1.0               |
| Gradle            | 8.13                 |

### Steps

```bash
# 1. Generate native Android project
npx expo prebuild --platform android --clean

# 2. Build the APK
cd android
./gradlew assembleRelease --no-daemon
```

### Output

```
android/app/build/outputs/apk/release/app-release.apk  (~36 MB)
```

### Android Local Configuration

`android/local.properties`:
```properties
sdk.dir=/home/<user>/Android/Sdk
```

`android/gradle.properties` (key settings):
```properties
reactNativeArchitectures=arm64-v8a   # or add more archs for wider support
newArchEnabled=true
hermesEnabled=true
```

`android/gradle/wrapper/gradle-wrapper.properties`:
```properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.13-bin.zip
```

`android/app/build.gradle`:
```groovy
android {
    ndkVersion "27.3.13750724"   // NDK r27d
    ...
}
```

> **Signing:** The APK is signed with the **debug keystore** for development.  
> For Google Play Store, generate a production keystore and update `signingConfigs`.

### Install on Device via ADB

```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

---

## 📂 Project Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator
│   ├── index.tsx         # Dashboard (Resumen)
│   ├── transactions.tsx  # Transactions list (Movimientos)
│   ├── insights.tsx      # AI Insights (Asistente)
│   └── profile.tsx       # User profile (Perfil)
├── add-transaction.tsx   # Add transaction modal
├── add-category.tsx      # Add category modal
├── add-goal.tsx          # Add goal modal
├── chat.tsx              # AI Coach chat screen
└── _layout.tsx           # Root layout

stores/
├── auth.store.ts         # Authentication state
├── dashboard.store.ts    # Dashboard data
├── transaction.store.ts  # Transactions state
├── insights.store.ts     # AI insights state
└── chat.store.ts         # Chat bot state

services/
├── api.ts                # Axios client with auth interceptor
└── supabase.ts           # Supabase client config
```

## 👤 Author

**Matthew Reyes** — [@Bymatt10](https://github.com/Bymatt10)

## 📄 License

UNLICENSED — Private project.
