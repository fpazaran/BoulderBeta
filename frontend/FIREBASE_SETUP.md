# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your BoulderBeta app.

## Prerequisites

- Firebase project created at [Firebase Console](https://console.firebase.google.com)
- React Native development environment set up

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "boulder-beta")
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Enable **Email/Password** authentication method
4. Click **Save**

## Step 3: Add Your App to Firebase

### For iOS:
1. Click the iOS icon in your Firebase project overview
2. Enter your iOS bundle ID (found in your `app.json` under `expo.ios.bundleIdentifier`)
3. Download the `GoogleService-Info.plist` file
4. Place it in your `frontend/` directory

### For Android:
1. Click the Android icon in your Firebase project overview
2. Enter your Android package name (found in your `app.json` under `expo.android.package`)
3. Download the `google-services.json` file
4. Place it in your `frontend/` directory

## Step 4: Configure Firebase in Your App

1. Open `frontend/firebase.config.ts`
2. Replace the placeholder values with your actual Firebase configuration:

```typescript
export const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

You can find these values in:
- Firebase Console → Project Settings → General → Your apps → Web app config

## Step 5: Update app.json (if needed)

Add the following plugins to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ]
  }
}
```

## Step 6: Build and Test

1. Clear your cache and reinstall dependencies:
   ```bash
   cd frontend
   npm install
   npx expo start --clear
   ```

2. Test the authentication flow:
   - Try creating a new account
   - Try logging in with existing credentials
   - Test logout functionality

## Troubleshooting

### Common Issues:

1. **"Firebase app not initialized"**
   - Make sure your config values are correct
   - Ensure the Firebase packages are properly installed

2. **"Auth domain not whitelisted"**
   - Check that your auth domain matches in firebase.config.ts
   - Verify the domain is authorized in Firebase Console → Authentication → Settings

3. **Build errors**
   - Clean your build cache: `npx expo start --clear`
   - Reinstall node_modules: `rm -rf node_modules && npm install`

## Features Implemented

✅ **Email/Password Authentication**
- User registration with email and password
- User login with email and password
- Password validation (minimum 6 characters)
- Automatic navigation based on auth state

✅ **Authentication Context**
- Global auth state management
- Automatic user session persistence
- Loading states during auth operations

✅ **Protected Routes**
- Automatic redirection based on auth state
- Authenticated users see main app
- Unauthenticated users see login/signup screens

✅ **User Profile Integration**
- Display user email in profile
- Secure logout with confirmation
- User-specific data handling

## Next Steps

Consider implementing:
- Password reset functionality
- Email verification
- Social authentication (Google, Apple)
- User profile management
- Account deletion

## Security Notes

- Never commit your actual Firebase configuration to version control
- Use environment variables for sensitive configuration in production
- Enable security rules for your Firebase services
- Consider implementing rate limiting for authentication attempts
