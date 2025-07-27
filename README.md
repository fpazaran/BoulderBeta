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

### Development Notes
- Currently the frontend is in progress, so there is no need to setup backend/Firebase

## Development Status
Project started: June 2025
Status: In active development

## Future Enhancements
- Integrate Firebase authentication/Firestore
- Create prediction models

## Getting Started

### Prerequisites
- Node.js and npm
- Python 3.9+
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
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```
4. Configure Firebase credentials
5. Start the development servers:
   - Frontend: `npm start`
   - Backend: `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`

