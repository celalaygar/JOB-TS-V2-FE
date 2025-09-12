# 🎨 JOB TRACKING SYSTEM V2 - Frontend (Next.js + TypeScript)

The **frontend** of Job Tracking System V2 is a **modern, responsive, and high-performance web app** designed for seamless project management.

---

## 🛠️ Technology Stack

- **Next.js 14** (SSR & SSG for performance)
- **TypeScript** (strict typing for maintainability)
- **Tailwind CSS** (utility-first, responsive design)
- **NextAuth.js** (authentication & session management with providers like Google/GitHub)
- **Radix UI** (accessible UI primitives)
- **Redux Toolkit** (state management)
- **Axios** (API requests)
- **Framer Motion** (animations)
- **React Hook Form + Zod** (forms & validation)

---

## 📂 Project Structure

```
job-ts-v2-fe/
│── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # UI components (Navbar, Sidebar, Cards)
│   ├── features/           # Redux slices (projects, tasks, auth, sprints)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Axios setup, interceptors, helpers
│   ├── store/              # Redux store setup
│   ├── styles/             # Tailwind CSS config
│   └── types/              # TypeScript interfaces
│
└── package.json
```

---

## 🎯 Features

### 🔑 Authentication
- Login & Register forms
- JWT token storage in Redux
- Protected routes & role-based access
- Forgot password flow

### 📂 Project Management
- Create, edit, delete projects
- Invite members via email
- Manage teams & roles

### ✅ Task Management
- Create & assign tasks
- Subtasks & comments
- Automatic backlog handling

### 🌀 Sprint & Agile Support
- Create & manage sprints
- Assign/remove tasks
- Mark sprint as complete

### 📊 Kanban Board
- Drag & drop tasks between statuses
- Filter by sprint/project
- Real-time updates

### ⏱️ Weekly Tracking
- Enter & view weekly work hours
- Weekly board view
- Weekly list view

---

## 📸 Screenshots

![Login](https://raw.githubusercontent.com/celalaygar/main/refs/heads/main/project/job-tracking-system-v2/job-ts-10.png)
![Dashboard](https://raw.githubusercontent.com/celalaygar/main/refs/heads/main/project/job-tracking-system-v2/job-ts-11.png)
![Kanban](https://raw.githubusercontent.com/celalaygar/main/refs/heads/main/project/job-tracking-system-v2/job-ts-12.png)

---

## ⚙️ Local Setup

```bash
# Clone repository
git clone https://github.com/celalaygar/JOB-TS-V2-FE.git
cd JOB-TS-V2-FE

# Install dependencies
npm install

# Run development server
npm run dev
```

**Environment Variables**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 📡 API Integration

The frontend consumes the backend REST APIs (WebFlux) via Axios.

- **Auth APIs** → `/api/auth`
- **Project APIs** → `/api/projects`
- **Task APIs** → `/api/tasks`
- **Sprint APIs** → `/api/sprints`
- **Weekly APIs** → `/api/weekly`

---

## 📱 Responsive Design

- **Desktop First**: Optimized for 1920x1080 screens
- **Mobile Friendly**: Responsive navbar & sidebar
- **Sticky Menus**: Easy navigation on all devices

---

## 🚀 Deployment

- Built with `next build`
- Served with **Vercel**, **Docker**, or **Nginx**
- Uses **environment variables** for API endpoints
- CI/CD with GitHub Actions (optional)

---

## 📜 License

MIT License © 2025 [Celal Aygar](https://celalaygar.github.io)
