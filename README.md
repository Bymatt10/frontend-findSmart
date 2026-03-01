# 📱 FinSmart Mobile

Mobile app for **FinSmart** — your intelligent personal finance coach.

Built with [Expo](https://expo.dev/) + [React Native](https://reactnative.dev/) + [NativeWind](https://www.nativewind.dev/).

## ✨ Features

- **🔐 Auth** — Login & Register with Supabase
- **📊 Dashboard** — Balance overview, income/expense split, recent transactions
- **💰 Transactions** — Add, edit, delete with multi-currency (C$/USD)
- **🎯 Goals** — Set financial goals with deadlines and progress tracking
- **🤖 AI Coach** — Chat with an AI financial advisor powered by Gemini 3
- **📈 Insights** — AI-generated trends, alerts & recommended actions
- **🌙 Dark Theme** — Premium dark UI throughout

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK + React Native |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind (Tailwind CSS) |
| State | Zustand |
| HTTP | Axios |
| Auth | Supabase Auth |
| Icons | Ionicons |

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

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Backend API URL (e.g. `http://192.168.1.X:3000`) |
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

> **Note:** For physical devices, use your computer's local IP instead of `localhost`.

## 📂 Project Structure

```
app/
├── (tabs)/
│   ├── _layout.tsx      # Tab navigator (4 tabs)
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
