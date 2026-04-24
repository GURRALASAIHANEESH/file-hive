# FileHive

A modern cloud file manager for organizing and storing images. Built with a Node.js backend, React frontend, and MongoDB for data persistence. Images are stored on Cloudinary. Authentication uses JWT tokens in httpOnly cookies.

![FileHive](https://img.shields.io/badge/status-active-brightgreen) ![Node](https://img.shields.io/badge/node-18%2B-339933?logo=nodedotjs&logoColor=white) ![React](https://img.shields.io/badge/react-18-61DAFB?logo=react&logoColor=white) ![MongoDB](https://img.shields.io/badge/mongodb-7-47A248?logo=mongodb&logoColor=white)

---

## Features

**Authentication**
- Email and password registration
- Secure login with JWT stored in httpOnly cookies
- Persistent sessions across page reloads
- Protected routes on both frontend and backend

**File Management**
- Create folders at root or nested inside other folders
- Upload images (JPEG, PNG, WebP, GIF) up to 10MB
- Preview images in a full-screen modal with metadata
- Delete images and folders with cascading cleanup
- Breadcrumb navigation for folder hierarchy

**Smart Folder Sizing**
- Recursive size calculation using MongoDB `$graphLookup`
- Aggregates image sizes across all descendant subfolders
- Ownership-scoped at every level

**MCP Integration**
- JSON-RPC 2.0 compatible endpoint
- Tool manifest at `GET /api/mcp/tools`
- Dispatch calls via `POST /api/mcp/call`
- Supported tools: `list_folders`, `create_folder`, `list_images`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| API Framework | Express |
| Database | MongoDB with Mongoose |
| Auth | JWT + httpOnly cookies + bcryptjs |
| File Storage | Cloudinary v2 (stream upload) |
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |

---

## Project Structure

```
filehive/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary v2 initialization
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                # JWT verification middleware
│   │   └── upload.js              # Multer memory storage config
│   ├── models/
│   │   ├── User.js                # User schema with password comparison
│   │   ├── Folder.js              # Folder schema with parent reference
│   │   └── Image.js               # Image schema with Cloudinary metadata
│   ├── routes/
│   │   ├── auth.js                # Register, login, logout, session check
│   │   ├── folders.js             # CRUD for folders with recursive delete
│   │   ├── images.js              # Upload and delete with Cloudinary sync
│   │   └── mcp.js                 # MCP tool manifest and dispatch
│   ├── utils/
│   │   └── folderSize.js          # $graphLookup recursive size computation
│   └── server.js                  # Express app entry point
└── frontend/
    └── src/
        ├── api/                   # Axios client and endpoint functions
        ├── components/            # Reusable UI components
        ├── context/               # Auth context provider
        ├── pages/                 # Login, Register, Drive pages
        ├── App.jsx                # Route definitions
        ├── index.css              # Global styles
        └── main.jsx               # React entry point
```

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Authenticate and set cookie |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current user from cookie |

### Folders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/folders` | List root folders with sizes |
| POST | `/api/folders` | Create a folder |
| GET | `/api/folders/:id` | Get folder with children and images |
| DELETE | `/api/folders/:id` | Delete folder and all descendants |

### Images

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/images` | Upload image to a folder (multipart) |
| DELETE | `/api/images/:id` | Delete image from DB and Cloudinary |

### MCP

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mcp/tools` | Get tool manifest |
| POST | `/api/mcp/call` | Execute a tool by method name |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- MongoDB Atlas cluster or local MongoDB instance
- Cloudinary account

### Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/filehive
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

### Install and Run

**Backend:**
```bash
cd backend
npm install
node server.js
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

---

## Architecture Decisions

**Why multer memoryStorage instead of disk?**
Images are streamed directly from memory to Cloudinary. No temp files are written to disk, which is cleaner for containerized deployments.

**Why $graphLookup for folder sizes?**
A single aggregation pipeline computes the total size of a folder tree without recursive application-level queries. This scales better than fetching folders one by one in a loop.

**Why JWT in httpOnly cookies instead of localStorage?**
Prevents XSS attacks from accessing the token. The browser sends the cookie automatically on every request with `withCredentials: true`.

**Why no Firebase?**
The assignment required Node.js authentication. All auth logic is implemented server-side with bcryptjs and jsonwebtoken.

---

## License

MIT