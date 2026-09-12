# ⏱️ 18-Day Locked Sprint & Focus Engine

A high-performance, dark-mode productivity web application and PWA engineered for deep work sprints, long-term discipline campaigns, and distraction-free execution.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![PWA](https://img.shields.io/badge/PWA-Ready-black?style=flat-square)

---

## ✨ Features

### 1. 🛡️ Macro 18-Day Locked Countdown Campaign
- Tracks an unyielding 18-day macro campaign down to the second (`Day X / 18`).
- Smooth visual progress bar from 0% to 100% completion.
- **Anti-Tamper Admin Security Console**: Protected by a SHA-256 cryptographic PIN (Default: `1818`) to prevent impulsive timeline resets or adjustments.

### 2. ⚡ Unthrottled Focus Engine (Pomodoro)
- **Zero Tab Throttling**: Employs an inline **Web Worker** background thread so intervals never pause or lag when switching browser tabs or locking your screen.
- Pre-configured sprint modes:
  - **Pomodoro** (25 min)
  - **Short Break** (5 min)
  - **Long Break** (15 min)
  - **Custom** (1 – 180 min)
- **Synthesized Audio Chime**: Generates a two-tone harmonious Web Audio chime (C5 & G5) natively — no external audio assets required.
- Dynamic tab title sync displaying remaining sprint time directly in your browser tab.

### 3. 📱 Compact 2x2 Mobile Widget Mode
- One-click toggle between the **Full Mission Dashboard** and a **2x2 Squircle Widget View**.
- Specifically optimized for **Android home screen floating windows** (OnePlus Flexible Windows, Samsung Pop-up View, etc.).
- Direct URL shortcut: append `?mode=widget` to launch straight into widget view.

### 4. 📜 High-Performance Wisdom Carousel
- Hand-curated discipline and stoic quotes from Marcus Aurelius, Seneca, Steve Jobs, and Benjamin Franklin.
- Smooth rotating carousel that pauses automatically on hover.

### 5. 📲 Progressive Web App (PWA)
- Offline caching powered by a custom Service Worker (`sw.js`).
- Web App Manifest (`manifest.json`) supporting standalone fullscreen installation on Windows, macOS, Android, and iOS.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/SESHANKCH7171/sprint-focus-engine.git

# Navigate to project directory
cd sprint-focus-engine

# Install dependencies
npm install

# Start local development server (with network access for phone testing)
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📱 Mobile Installation & Floating Widget Setup

### Step 1: Install on Phone (PWA)
1. Ensure your PC and phone are on the same Wi-Fi.
2. Run `npm run dev` and navigate to your PC's local IP (e.g. `http://192.168.1.x:5173`) in Chrome on Android.
3. Tap the **three dots (⋮)** in Chrome $\rightarrow$ **Install app** (or **Add to Home screen**).

### Step 2: Set as Floating Screen Widget (OxygenOS / OneUI)
1. Open the installed **Focus Engine** app.
2. Swipe up and hold to view **Recent Apps**.
3. Tap the app menu icon $\rightarrow$ select **Floating Window** (Flexible Window).
4. Resize and pin it to the top corner of your screen for a live, unobtrusive focus widget.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [PostCSS](https://postcss.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Native Web Audio API
- **Worker**: Native Web Workers API

---

## 📄 License

MIT License. Designed for relentless discipline.
