# ⏱️ CHRONO·PRO — Precision Stopwatch Web Application

CHRONO·PRO is a modern, enterprise-level stopwatch web application built with pure HTML, CSS, and JavaScript. It is designed to be fast, accurate, and visually polished — giving users a professional stopwatch experience right in the browser without needing any installation or internet connection.

---

## 🚀 Live Demo

Simply download the files, open `index.html` in your browser, and it works instantly. No setup required.

---

## ✨ Features

### ⏱️ Core Stopwatch
- Millisecond-precision timer using `requestAnimationFrame` for smooth and accurate time tracking
- Start, Pause, Resume, and Reset functionality
- Displays time in `HH:MM:SS.mmm` format
- Animated progress bar that cycles every 60 seconds

### 🔁 Lap & Split Tracking
- **Lap Recording** — Record individual lap times without stopping the main timer
- **Split Markers** — Mark a point in time without resetting the current lap
- Each lap and split is logged instantly with a smooth animation

### 📊 Lap History Table
- Displays all laps and splits in a clean, scrollable table
- Shows **Lap Number**, **Lap Time**, **Total Split Time**, and **Delta vs Previous Lap**
- Automatically highlights the **Best Lap** in green and **Worst Lap** in red
- Clear button to reset the entire lap history

### 📈 Live Statistics
- **Total Laps** counter
- **Best Lap** time (fastest)
- **Worst Lap** time (slowest)
- Updates in real time as you record laps

### 🔊 Sound Effects
- Distinct audio tones for Start, Stop, Lap, Split, and Reset actions
- Built using the **Web Audio API** — no external sound files needed
- Sound can be toggled On or Off anytime

### 🎨 Theme Toggle
- Switch between **Dark Mode** and **Light Mode** with one click
- Smooth color transition across the entire UI

### ⌨️ Keyboard Shortcuts
| Key     | Action |
|---------|--------|
| `Space` | Start / Pause |
| `L`     | Record Lap |
| `M`     | Mark Split |
| `R`     | Reset |

### 📱 Fully Responsive
- Works perfectly on Desktop, Tablet, and Mobile
- Layout adjusts automatically for smaller screens

---

## 🛠️ Tech Stack

| Technology            | Purpose |
|-----------------------|---------|
| HTML5                 | App structure and layout |
| CSS3                  | Styling, animations, and theme |
| JavaScript (Vanilla)  | Timer logic, lap tracking, audio, UI |
| Web Audio API         | Sound feedback |
| requestAnimationFrame | Smooth millisecond-precision timing |

---

## 📁 Project Structure

```
chrono-pro/
│
├── index.html       → Main HTML structure
├── style.css        → All styles, animations, and themes
└── script.js        → All JavaScript logic
```

---

## 🧠 How It Works

The timer uses `performance.now()` combined with `requestAnimationFrame` instead of `setInterval`. This approach is far more accurate because it ties the timer updates directly to the browser's rendering cycle, preventing drift and ensuring millisecond-level precision even over long sessions.

Each lap time is calculated by recording the timestamp at the moment the lap button is pressed and comparing it to the timestamp of the previous lap. The delta (difference) between consecutive laps is then calculated and displayed automatically.

Sound effects are generated on the fly using the **Web Audio API** by creating oscillator nodes with different frequencies and durations for each action — no audio files are needed at all.

---

## 🚀 Getting Started

1. Download or clone the repository
2. Make sure all three files are in the same folder
3. Open `index.html` in any modern browser
4. Press `Space` or click the play button to start

No internet connection, no installation, no dependencies — it just works.

---

## 🌐 Browser Support

| Browser | Supported |
|---------|-----------|
| Chrome  | ✅ |
| Firefox | ✅ |
| Safari  | ✅ |
| Edge    | ✅ |
| Opera   | ✅ |

---

## 🙌 Acknowledgements

- Fonts by [Google Fonts](https://fonts.google.com) — Bebas Neue, Space Mono, DM Sans
- Timer precision powered by the browser's native `performance.now()` API
- Sound generated using the browser's native **Web Audio API**

---
