# 📝 Note Taking App

A full-stack note-taking application built with **Node, Express (TypeScript)** on the backend and **React (TypeScript)** on the frontend. The app allows users to securely create, update, delete, and view their personal notes. Tailwind CSS was used for a clean and responsive user interface.

---

## 🚀 Tech Stack

### 🖥️ Frontend
- React (with TypeScript)
- Tailwind CSS
- Axios
- React Router

### 🛠️ Backend
- Express (with TypeScript)
- MongoDB (via Mongoose)
- JWT Authentication
- CORS, dotenv

---

## 🔧 Features

- ✅ User Signup/Login with JWT-based authentication
- ✅ Protected routes (frontend & backend)
- ✅ Create, Edit, Delete, and View notes
- ✅ Tailwind CSS styled components for responsive UI
- ✅ Note storage per user

---

## 📁 Project Structure
- Note Taking App
    - backend
        - src
            - config
            - middlewares
            - routes
            - models
            - utils
            - app.ts
    - client
        - public
        - src
            - components
                - Home.tsx
                - Signin.tsx
                - Signup.tsx
            - App.tsx
             
    

---

## 🧑‍💻 How I Developed It

### Backend (Express + TypeScript)
1. **Project Setup**: Initialized Node.js project with TypeScript, configured `tsconfig.json`, and set up `nodemon` + `ts-node-dev` for development.
2. **Routing**: Created routes for `/signup`, `/login`, `/note` with their respective routes.
3. **Database Connection**: Used Mongoose to connect to MongoDB and created models for `User` and `Note`.
4. **Authentication**: Implemented JWT-based login system and middleware to protect routes.
5. **Error Handling**: Used `express-async-handler` to handle async errors gracefully.

### Frontend (React + TypeScript + Tailwind)
1. **Project Setup**: Bootstrapped with Vite + React + TypeScript. Configured Tailwind CSS.
2. **Routing**: Used `react-router-dom` for navigating between Signin, Signup, and Home pages.
3. **Auth Flow**: Created secure login and signup pages, storing the JWT in localStorage.
4. **Note Features**: Built components for displaying, editing, creating, and deleting notes. Integrated backend API using Axios.
5. **Styling**: Applied Tailwind CSS for responsive and clean UI across all devices.

---

## Backend env

- MONGO_URL= mongo url
- JWT_SECRET= secrate key for jwt
- EMAIL_USER= own email address
- EMAIL_PASS= password

---
## Cllient(Frontend) env

- VITE_BACKEND_URL= backend port or deployes url

###### Note :- This project was developed as part of an assignment provided through the Internshala platform.