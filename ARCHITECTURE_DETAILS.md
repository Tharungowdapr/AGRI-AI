# 🧬 KrishiVigyan AI: Deep Technical Architecture

This guide provides the specific code-level logic for each module to assist in writing your **Technical Report**.

---

## 1. The Core AI Service (`geminiService.ts`)
This is the "Neural Backbone" of the project.
*   **Vision Logic:** Uses `analyzeCropImage`. It uses a "Pathologist Personas" prompt. It forces the model to act as a scientist, not a chatbot.
*   **Search Logic:** Uses `getMarketIntelligence`. It utilizes the `googleSearch` tool, which is a specialized feature of Gemini 3 Pro to browse the live web.
*   **Audio Logic:** Uses `speakText`. This implements the `gemini-2.5-flash-preview-tts` model. The unique technical feat here is **Raw PCM Decoding**. Standard browsers cannot play Gemini's raw bytes; this project implements a custom `decodeAudioDataManual` function to convert those bytes into an `AudioBuffer`.

---

## 2. Localization Logic (`translations.ts`)
Unlike standard apps, this uses a **Dual-Key Semantic Map**.
*   Every string is mapped in both English and Kannada.
*   The `useLang` context in `App.tsx` allows for instant, state-preserved language switching without page reloads.

---

## 3. Data Persistence (`App.tsx` & `Admin.tsx`)
We use a **Simulated Relational Database**.
*   **User DB:** `kv_user_db`
*   **Crop Registry:** `kv_master_crops`
*   **Feedback DB:** `kv_feedback_db`
*   **Global Scan DB:** `kv_global_scans_db`
This ensures that when an admin adds a crop in `Admin.tsx`, it immediately appears in the `Crops.tsx` library and the `Tracker.tsx` selection list.

---

## 4. Navigation & Security (`App.tsx`)
*   **Protected Routes:** The `ProtectedRoute` component wraps the `/admin` and `/tracker` routes.
*   **Role-Based Access (RBAC):** Only the email `tharungowdapr@gmail.com` is granted the `admin` role by default. Other admins must be approved by this root user.

---

## 5. UI/UX Philosophy
*   **Palette:** "Nature-Stone" (Greens, Stones, and Nature-Accent Yellow).
*   **Typography:** Space Grotesk (Sans) and Playfair Display (Serif) to create a "Technical yet Organic" feel.
*   **Responsiveness:** Full Tailwind CSS grid implementation for mobile-first field usage.

---
*Technical Specification v2.4*