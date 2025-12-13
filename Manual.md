# MaXxCode Technical Manual

This document provides a technical overview of the MaXxCode codebase. It is designed to help developers understand the structure, purpose, and modification points of the application.

---

## 1. Core Configuration & State

### `types.ts`
- **What is in it**: TypeScript interfaces defining the shape of data structures like `UserState`, `Lesson`, `Theme`, `Badge`, and `Translation`.
- **Used For**: Enforcing type safety across the entire application.
- **Why**: To prevent runtime errors and provide IntelliSense support during development.
- **How to modify**: Add new properties to interfaces here when adding new features (e.g., adding a new setting to `UserState`).
- **Relates to**: Imported by almost every component.

### `constants.ts`
- **What is in it**: Static data including the full curriculum (`LESSONS`), color themes (`THEMES`), achievements (`BADGES`), and localization strings (`TRANSLATIONS`).
- **Used For**: Acting as the local "database" for content and configuration.
- **Why**: Keeps content separate from logic, allowing for easy updates to lessons or themes without touching component code.
- **How to modify**: 
    - Add new lessons to the `RAW_LESSONS` array.
    - Add new color schemes to the `THEMES` object.
- **Relates to**: `App.tsx`, `DashboardView`, `LessonView`.

### `utils/storage.ts`
- **What is in it**: Functions (`getUserState`, `saveUserState`, `updateStreak`) interacting with `localStorage`.
- **Used For**: Persisting user progress, XP, and settings between browser sessions.
- **Why**: Essential for a client-side app to maintain user state ("save game") without a backend database. Includes "deep merge" logic to handle schema updates safely.
- **How to modify**: Update `INITIAL_STATE` if you start tracking new metrics.
- **Relates to**: `App.tsx` (initializes user state on load).

---

## 2. Main Application Logic

### `App.tsx`
- **What is in it**: The root component containing the main state (`user`, `view`), high-level handlers (completing lessons, changing languages), and the view router.
- **Used For**: Orchestrating the entire application lifecycle and rendering the active view.
- **Why**: Centralizes state management to ensure all sub-components (Sidebar, TopBar, Views) stay in sync.
- **How to modify**: Add new cases to the conditional rendering to add new pages/views.
- **Relates to**: All View components (`DashboardView`, `LessonView`, etc.).

---

## 3. UI & Layout Components

### `components/layout/FloatingBackground.tsx`
- **What is in it**: An animated component rendering moving SVG hills, floating tech icons, and cosmic elements.
- **Used For**: Creating the immersive, gamified visual atmosphere behind the app.
- **Why**: To provide a polished, playful aesthetic that adapts to the active theme colors.
- **How to modify**: Adjust the SVG paths or CSS keyframes to change the animation style.
- **Relates to**: `App.tsx` (rendered as the bottom layer).

### `components/UIComponents.tsx`
- **What is in it**: Atomic UI components like `Button`, `Card`, `Modal`, `ProgressBar`, `Console`, and `QuizView`.
- **Used For**: Building the interface with a consistent design system.
- **Why**: Promotes reusability and ensures UI consistency (e.g., all buttons look and behave the same).
- **How to modify**: Edit `Button` styles here to globally update the look of interactive elements.
- **Relates to**: Consumed by all Views.

### `components/layout/Sidebar.tsx` & `MobileNav.tsx`
- **What is in it**: Navigation logic for desktop (sidebar) and mobile (bottom bar).
- **Used For**: Allowing users to switch between Dashboard, Profile, Arcade, etc.
- **Why**: responsive navigation structure.
- **Relates to**: `App.tsx`.

---

## 4. Feature Views

### `components/views/LessonView.tsx`
- **What is in it**: The logic for the learning interface, including the code editor, instructions panel, and output console.
- **Used For**: Running code, checking answers, and displaying lesson content.
- **Why**: Isolates the complex logic of code execution/transpilation from the main dashboard.
- **How to modify**: Update the `handleRunCode` function to improve the simulated Python/JS runtime.
- **Relates to**: `App.tsx`, `AIChat`.

### `components/views/DashboardView.tsx`
- **What is in it**: The visual map of lessons with connecting paths and animated nodes.
- **Used For**: Displaying the user's journey and allowing them to select levels.
- **Why**: To visualize progress in a "Saga map" style (similar to Duolingo).
- **Relates to**: `App.tsx`.

### `components/ArcadeGames.tsx`
- **What is in it**: Mini-games like "Bug Hunter" and "Syntax Sprint".
- **Used For**: Providing extra practice in a different, faster-paced format.
- **How to modify**: Add new game modes or levels to the internal arrays.
- **Relates to**: `App.tsx`.

---

## 5. Services & Utilities

### `services/geminiService.ts`
- **What is in it**: Wrapper for the Google GenAI SDK.
- **Used For**: Sending code context to Gemini and receiving helpful hints.
- **Why**: Powers the AI Chat assistant.
- **How to modify**: Change the `systemPrompt` to alter the persona of the AI tutor.
- **Relates to**: `components/AIChat.tsx`.

### `utils/audio.ts`
- **What is in it**: A browser-native synthesizer using `AudioContext`.
- **Used For**: generating sound effects (success chimes, error buzzers) programmatically.
- **Why**: Eliminates the need for external audio files, making the app lightweight and faster to load.
- **How to modify**: Adjust oscillator frequencies to design new sound effects.
- **Relates to**: Triggered by user actions in `App.tsx` and `UIComponents`.

