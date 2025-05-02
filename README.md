# Task Management System

## Overview
This is a task management system that allows users to create, edit, and manage tasks. The system includes role-based access control, with an admin dashboard to view and manage all tasks, and a user dashboard where regular users can view and manage their tasks. Users are able to assign tasks to others, set priorities, and set due dates.

## Features
- **Role-Based Access Control**: Admins can view and manage all tasks; users can only view tasks assigned to them or created by them.
- **Task CRUD**: Create, Read, Update, Delete tasks.
- **Task Assignment**: Assign tasks to users and track progress.
- **Task Prioritization**: Set priority levels for tasks (e.g., high, medium, low).
- **Due Dates**: Track due dates for tasks and overdue tasks are highlighted.
- **Dashboard for Admin and User**: Admin can see all tasks, while regular users can see their own assigned tasks.

## Tech Stack
- **Frontend**: Next.js, React
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS

---

## Setup Instructions

### Prerequisites
Before setting up the project, ensure you have the following installed:
- **Node.js** (v14+)
- **npm** or **yarn** (package manager)
- **MongoDB** (for local development) or use a cloud service like MongoDB Atlas

### Clone the Repository
First, clone the repository to your local machine:
```bash
git clone https://github.com/Ayush-Dadhaniya/stamuraiTask.git
cd stamuraiTask

## 📦 Install Dependencies
Run the following command to install all required dependencies:

```bash
npm install
```

---

## ⚙️ Set Up Environment Variables
Create a `.env` file in the root directory and add the following variables:

```env
MONGO_URL=mongodb+srv://ayushdadhaniya27:t47x2hHKAcK9FvRM@cluster.afjkxgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster
ADMIN_SECRET=myStrongSecretKey
JWT_SECRET=someJwtSecretKey
```

> ⚠️ Replace `someJwtSecretKey` with a secure key of your choice.

---

## 🚀 Run the Project Locally

### Backend (Node.js/Express):
Run the backend server locally:

```bash
npm run dev
```

It will be available at: [http://localhost:5000](http://localhost:5000)

### Frontend (Next.js):
To start the frontend:

```bash
npm run dev
```

It will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🧠 Approach Explanation

### Backend (Node.js/Express)

#### 1. Authentication and Authorization
- We use **JWT (JSON Web Tokens)** for secure, stateless user authentication.
- A middleware function verifies the JWT token for protected routes.
- Tokens are stored on the client side and sent with each request in the `Authorization` header.
- Based on the user’s `role` (`admin` or `user`), different levels of access are granted.
- Admins have full access to all tasks, while users can access only those they created or are assigned to.

#### 2. Task Management
- Tasks are stored in **MongoDB** and include fields for `title`, `description`, `priority`, `status`, `dueDate`, `createdBy`, and `assignedTo`.
- Admins can manage all tasks.
- Users can manage tasks they created or were assigned.

#### 3. Populating User Details
- MongoDB's `populate()` function is used on the `createdBy` and `assignedTo` fields to return user details (like name/email) in API responses.

---

### Frontend (Next.js and React)

#### 1. Role-Based UI
- The frontend checks the user’s role and conditionally renders:
  - Admins: View all tasks and users.
  - Users: View only relevant tasks (created or assigned).
- The `TaskCard` component displays task info and actions like edit/delete.

#### 2. Fetching Data
- Data is fetched from the backend using **Axios**.
- JWT tokens are sent in headers for authentication.
- **React Hooks** (`useState`, `useEffect`) manage local UI state.

---

## 🔍 Assumptions and Trade-offs

### Assumptions

#### 1. JWT Authentication
- JWTs are stored in `localStorage`.
- Tokens expire after 1 hour to enhance security.

#### 2. MongoDB
- MongoDB is used as the primary database.
- A cloud URI is expected (e.g., MongoDB Atlas).

#### 3. Task Structure
- Each task includes:
  - `assignedTo` user (if none, displays as "Unknown").
  - Metadata like priority, status, and due date.

#### 4. No Real-Time Features
- The app doesn’t currently support real-time updates.
- Page refresh or re-fetch is required to see task updates.

---

### Trade-offs

#### 1. Simplified Features
- Lacks advanced task management (e.g., labels, tags, subtasks).
- No email or push notifications.

#### 2. Limited Error Handling
- Basic frontend/backend validation and feedback.
- Could be improved with detailed error toasts/modals.

#### 3. No Testing
- No unit or integration tests.
- Manual testing is required during development.

#### 4. Basic UI/UX
- Functional but minimalist design.
- Could be improved with animations, drag-and-drop features, etc.

✅ **Built by Ayush Dadhaniya. GenAI (ChatGPT) was used to support some UI/UX enhancements and development logic.**
