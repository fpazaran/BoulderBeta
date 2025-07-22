# Boulder Beta - Bouldering Beta Prediction App

## Overview
Boulder Beta is a mobile application that leverages computer vision and machine learning to predict and analyze indoor bouldering routes. 
The app helps climbers understand route beta (climbing sequence) through analysis of climbing holds and movement patterns.

## Features
- **Computer Vision Analysis**: Detects climbing holds and classifies grip types using PyTorch and OpenCV
- **Beta Prediction**: Predicts optimal climbing sequences based on hold positions and types
- **User Management**: Secure authentication and personalized experience through Firebase
- **Beta Storage**: Users can save and manage their favorite climbing betas

## Technical Stack

### Frontend (Mobile App)
- Expo/React Native with TypeScript
- Firebase Authentication for user management
- Modern, responsive UI components
- Camera integration for route capture
- Beta visualization

### Backend (API)
- FastAPI (Python) for efficient API endpoints
- Firebase Firestore for data persistence
- Secure user data management
- RESTful API architecture

### Machine Learning Pipeline
- PyTorch for deep learning models
- OpenCV for image processing
- Hold detection and classification
- Movement sequence prediction
- Continuous model training and improvement

## Project Structure
```
BoulderBeta/
├── frontend/         # Expo/React Native mobile app
│   ├── app/          # Main application components
│   ├── assets/       # Images and static resources
│   └── types/        # TypeScript type definitions
├── backend/          # FastAPI server
├── ml/               # Machine learning models
└── data/             # Training data and resources
```

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.8+
- Expo CLI
- Firebase account

### Installation
1. Clone the repository
2. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```
3. Set up the backend:
   ```bash
   cd backend
   pip install 
   ```
4. Configure Firebase credentials
5. Start the development servers:
   - Frontend: `npm start`
   - Backend: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`

## Backend Setup

### Setting up the Python Environment
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   # On macOS/Linux
   python3 -m venv fastapi-env
   source fastapi-env/bin/activate

   # On Windows
   python -m venv fastapi-env
   fastapi-env\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Firebase Configuration
1. Create a new project in Firebase Console
2. Download your Firebase Admin SDK service account key
3. Create a `.env` file in the backend directory with:
   ```
   FIREBASE_CREDENTIALS_PATH=path/to/your/serviceAccountKey.json
   ```

### Running the Backend Server
1. Make sure your virtual environment is activated
2. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
3. The API will be available at `http://localhost:8000`
4. Access the API documentation at `http://localhost:8000/docs`

### Development Notes
- The backend server must be running for the mobile app to function
- API endpoints are protected with Firebase Authentication
- Environment variables can be configured in the `.env` file
- The ML model will automatically download required weights on first run

## Development Status
Project started: June 2025
Status: In active development

## Future Enhancements
- Enhanced hold detection accuracy
- Advanced beta suggestion algorithms
- Social features for sharing betas
- Integration with gym route databases
- Performance analytics dashboard
