<div align="center">

<img src="./client/src/ss1.png" alt="Chattr Banner" width="100%" style="border-radius: 12px;" />

<br/>
<br/>

<img src="https://img.shields.io/badge/Chattr-Connect.%20Chat.%20Vibe.-7C3AED?style=for-the-badge" alt="Chattr" />

# Chattr

### A premium real-time chat application built with the MERN stack + Socket.io

[![Live Demo](https://img.shields.io/badge/Live%20Demo-chattr--sandy.vercel.app-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://chattr-sandy.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-HinduPatrini-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/HinduPatrini/Chattr)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hindu%20Patrini-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hindu-patrini-7ab07a37a)

<br/>

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)

</div>

---

## 🚀 Live Demo

🔗 **[https://chattr-sandy.vercel.app/](https://chattr-sandy.vercel.app/)**

> **Demo Account** — Try the app without registering:
> ```
> Email:    demo@chattr.com
> Password: demo1234
> ```

---

## 📸 Screenshots

### Login Page
![Login Page](./client/src/ss1.png)

### Chat — No Conversations
![Chat Empty](./client/src/ss2.png)

### Chat — Active Conversation
![Chat Active](./client/src/ss3.png)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register and login with bcrypt password hashing and JWT tokens
- ⚡ **Real-time Messaging** — Instant message delivery powered by Socket.io WebSockets
- 💬 **One-to-One DMs** — Private conversations between any two users
- 👥 **Group Chat** — Create groups, add members, rename, and manage with admin controls
- ✍️ **Typing Indicator** — Animated "user is typing..." powered by live socket events
- ✅ **Read Receipts** — Single tick (sent), double grey tick (delivered), double purple tick (read)
- 🟢 **Online / Offline Status** — Real-time presence indicator with last seen timestamps
- 🖼️ **Image Sharing** — Send images in chat, stored on Cloudinary with inline preview
- 🔍 **User Search** — Debounced live search to find users and start new conversations
- 🔔 **Unread Badge** — Unread message count per conversation, clears automatically on open
- 👤 **Profile Management** — Edit username, bio, and avatar with instant preview
- 📱 **Fully Responsive** — Seamless experience on both desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework and build tool |
| Tailwind CSS v3 | Utility-first styling |
| Zustand | Lightweight global state management |
| Socket.io Client v4 | Real-time WebSocket communication |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP API requests with interceptors |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express v4 | REST API server |
| MongoDB + Mongoose | Database and ODM |
| Socket.io v4 | WebSocket server for real-time events |
| JSON Web Token | Stateless authentication |
| Bcrypt.js | Secure password hashing |
| Cloudinary | Cloud image storage for avatars and media |
| Multer | Multipart file upload handling |

---

## 📁 Project Structure

```
chattr/
├── client/                        # React frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── manifest.json
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with auth interceptor
│   │   ├── components/
│   │   │   ├── auth/              # LoginForm, RegisterForm
│   │   │   ├── chat/              # ChatWindow, ChatHeader, MessageBubble,
│   │   │   │                      # MessageInput, MessageList, TypingIndicator
│   │   │   ├── sidebar/           # Sidebar, ConversationList,
│   │   │   │                      # ConversationItem, SearchBar
│   │   │   ├── modals/            # NewChatModal, CreateGroupModal, ProfileModal
│   │   │   └── common/            # Avatar, Loader
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── store/
│   │   │   ├── useAuthStore.js    # Auth state (user, token, login, logout)
│   │   │   ├── useChatStore.js    # Chat state (conversations, messages)
│   │   │   └── useSocketStore.js  # Socket instance management
│   │   ├── hooks/
│   │   │   └── useSocket.js       # Custom hook for socket events
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
│
└── server/                        # Node.js backend
    ├── src/
    │   ├── config/
    │   │   ├── db.js              # MongoDB connection
    │   │   └── cloudinary.js      # Cloudinary config
    │   ├── models/
    │   │   ├── User.js            # User schema
    │   │   ├── Conversation.js    # Conversation schema (DM + group)
    │   │   └── Message.js         # Message schema
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── userController.js
    │   │   ├── conversationController.js
    │   │   └── messageController.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── userRoutes.js
    │   │   ├── conversationRoutes.js
    │   │   └── messageRoutes.js
    │   ├── middlewares/
    │   │   ├── authMiddleware.js  # JWT verification
    │   │   └── errorMiddleware.js # Global error handler
    │   ├── socket/
    │   │   └── socketHandler.js   # All Socket.io events
    │   └── utils/
    │       ├── generateToken.js
    │       ├── cloudinaryUpload.js
    │       └── seeder.js          # Demo user seeder
    ├── server.js
    └── package.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the repository

```bash
git clone https://github.com/HinduPatrini/Chattr.git
cd Chattr
```

### 2. Setup backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chattr
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup frontend

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`


---

## 🚢 Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploys on every push to main |
| Backend | Render | Free tier — may take 30s to wake up |
| Database | MongoDB Atlas | Free M0 cluster |
| Media Storage | Cloudinary | Free tier, 25GB storage |

---

## 📄 Environment Variables Reference

### Server
| Variable | Description |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry duration (e.g. 7d) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | development or production |

### Client
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |
| `VITE_SOCKET_URL` | Backend Socket.io URL |

---

## 👨‍💻 Author

**Hindu Patrini**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/hindu-patrini-7ab07a37a)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/HinduPatrini)
[![Portfolio](https://img.shields.io/badge/Live%20Demo-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://chattr-sandy.vercel.app/)

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

<br/>

Made by Hindu Patrini

</div>
