# FileHive

FileHive is a Google Drive-like file management application built with Node.js, React, and MongoDB.

## Features

- User registration
- User login and logout
- Protected authentication with JWT stored in httpOnly cookies
- Create folders
- Create nested folders
- Upload images inside folders
- Recursive folder size calculation including nested folders
- User-specific folder and image access
- MCP-compatible backend tool endpoints

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Cloudinary for image storage

### Frontend
- React
- Vite
- React Router
- Axios

## Project Structure

```bash
backend/   # Node.js API
frontend/  # React application
```

## Environment Variables

### Backend
Create a `.env` file inside `backend/` with:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Frontend
Create a `.env` file inside `frontend/` if needed for local configuration.

## Run Locally

### Backend
```bash
cd backend
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Folder Size Logic

Folder size is calculated recursively on the backend using MongoDB aggregation with `$graphLookup`. This ensures the total size includes all images inside the current folder and all nested subfolders without double counting.

## MCP Bonus

The backend includes MCP-compatible endpoints for:
- listing folders
- creating folders
- listing images

## Submission Notes

- The application is built according to the assignment requirements
- Authentication is implemented in Node.js
- Firebase is not used
- The app is intended to be deployed with the backend and frontend hosted separately