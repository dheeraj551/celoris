# 📱 Celoris Native App (Powered by Expo & Supabase)

Your new native mobile app is ready! This app uses true Android components for a premium feel.

### 🚀 How to Run (Recommended)

1.  **Install Expo Go**: Download "Expo Go" from the Google Play Store or Apple App Store on your phone.
2.  **Start the Server**: Open your terminal in the `mobile` folder and run:
    ```bash
    npx expo start
    ```
3.  **Scan the QR Code**: 
    -   Open the Expo Go app.
    -   Scan the QR code displayed in your terminal.
    -   *Boom!* Your app will load instantly on your phone.

### 🔗 Backend Sync
This app is connected to your **exact same Supabase database**:
-   **URL**: `https://suaqywhmaheoansrinzw.supabase.co`
-   **Auth**: New users registered on the web can log in here.
-   **Realtime**: Messages sent from the website appear here instantly.

### 📂 Folder Structure
-   `src/lib`: Supabase configuration.
-   `src/screens`: Native UI screens (Lobby, Swipe, etc.).
-   `src/context`: Auth and UI state management.
-   `src/navigation`: Native stack and tab handlers.
