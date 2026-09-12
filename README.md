# ⏱️ Sprint Focus Engine

A high-performance, dark-mode productivity web application and PWA engineered for **goal-driven target deadlines**, deep work sprints, long-term discipline campaigns, and distraction-free execution.

![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![PWA](https://img.shields.io/badge/PWA-Ready-black?style=flat-square)

---

## ✨ Features

### 1. 🎯 Dynamic Target Deadline & Campaign Context Engine
- **Custom Deadlines**: Pick any deadline date & time — from short sprints (e.g. your current September 30 target) to multi-month or year-end milestones.
- **Adaptive Time Context**: Dynamically computes `Day X / Total Days`, live remaining hours, minutes, and contextual units (`X Months, Y Days` or `X Years`).
- **1-Click Sprint Presets**:
  - 🔥 **Sep 30 (18-Day Sprint)**: Pre-configured for rapid milestone delivery
  - ⚡ **7-Day Power Sprint**
  - 🚀 **14-Day Lock-In**
  - 📅 **30-Day Focus Challenge**
  - 🎯 **End of Month Milestone**
  - 🌟 **Year-End Mission**
- **Live Visual Progress Gauge**: Smooth 0% to 100% progress tracking your exact journey towards the deadline.
- **Anti-Tamper Admin Security Console**: Protected by a SHA-256 cryptographic PIN (Default: `1818`) to lock schedules and eliminate impulsive resets.

### 2. ⚡ Unthrottled Focus Engine (Pomodoro)
- **Zero Tab Throttling**: Employs an inline **Web Worker** background thread so intervals never pause, drift, or lag when switching browser tabs or locking your phone screen.
- Pre-configured sprint modes:
  - **Pomodoro** (25 min)
  - **Short Break** (5 min)
  - **Long Break** (15 min)
  - **Custom** (1 – 180 min)
- **Synthesized Audio Chime**: Generates a two-tone harmonious Web Audio chime (C5 & G5) natively — no external audio files required.
- Dynamic tab title sync displaying remaining sprint time directly in your browser tab.

### 3. 📱 Compact 2x2 Mobile Widget Mode
- One-click toggle between the **Full Mission Dashboard** and a **2x2 Squircle Widget View**.
- Specifically optimized for **Android home screen floating windows** (OnePlus Flexible Windows, Samsung Pop-up View, etc.) to look and feel like native home screen widgets (such as Duolingo or Storage cards).
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
1. Ensure your PC and phone are on the same Wi-Fi (or deploy free to Vercel/Netlify).
2. Open the URL in Google Chrome on Android.
3. Tap the **three dots (⋮)** in Chrome $\rightarrow$ **Install app** (or **Add to Home screen**).

### Step 2: Set as Floating Screen Widget (OxygenOS / OneUI)
1. Open the installed **Sprint Focus Engine** app.
2. Tap **Widget View** in the top bar to shrink it into 2x2 widget format.
3. Swipe up and hold to view **Recent Apps**.
4. Tap the app menu icon $\rightarrow$ select **Floating Window** (Flexible Window).
5. Resize and pin it to the top corner of your screen for a live, unobtrusive focus widget.

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

MIT License. Designed for relentless discipline and execution.
