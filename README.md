# DevPulse

**🔗 Live App:** [devpulse-seven-sigma.vercel.app](https://devpulse-seven-sigma.vercel.app/)
**⚙️ Backend API:** [devpulse-backend-oj8q.onrender.com](https://devpulse-backend-oj8q.onrender.com)

DevPulse is a developer productivity dashboard. Search any GitHub profile to see their stats, repos, and recent activity at a glance, then keep your own saved links and notes right alongside it — all in one clean workspace.

---

## 📸 demo

<!-- Add a screenshot or screen-recording GIF of the app below. -->
<!-- Example:
<img src="./screenshots/dashboard.png" alt="DevPulse dashboard screenshot" width="800" />
-->

<!-- SCREENSHOT/GIF GOES HERE -->

---

## ✨ Features

- **GitHub Search** — Look up any GitHub username and pull their public profile, repositories, and recent activity via the GitHub REST API.
- **Dashboard** — At-a-glance stats: total repos, total stars, and a language breakdown for the searched user.
- **Saved Links** — Save, edit, and delete useful links with a title, URL, and optional description.
- **Notes** — Create, edit, and delete quick personal notes.
- **Responsive layout** — Sidebar navigation with smooth-scroll and scroll-spy between sections.

---

## 🛠️ Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Axios
- Lucide Icons

**Backend**
- Node.js + Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- Zod (request validation)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → PostgreSQL

---

## 🗂️ Project Structure

```
devpulse/
├── frontend/          # React + Vite + TypeScript client
│   └── src/
│       ├── components/    # Sidebar, Dashboard, GithubSearch, SavedLinks, Notes, etc.
│       ├── services/       # Axios clients (backend API + GitHub API)
│       └── types.ts        # Shared TypeScript types
└── backend/           # Express + Prisma API
    └── src/
        ├── routes/          # /api/links, /api/notes
        ├── controllers/     # Request handlers
        ├── services/        # Business logic
        └── prisma.ts        # Prisma client
```

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (v18+)
- A PostgreSQL database (local or hosted, e.g. Neon/Supabase/Render)

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/devpulse.git
cd devpulse
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
PORT=5000
```

Run migrations and start the server:

```bash
npx prisma migrate dev
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 📡 API Endpoints

| Method | Endpoint          | Description         |
|--------|-------------------|----------------------|
| GET    | `/health`         | Health check          |
| GET    | `/api/links`      | Get all saved links   |
| POST   | `/api/links`      | Create a saved link    |
| PUT    | `/api/links/:id`  | Update a saved link    |
| DELETE | `/api/links/:id`  | Delete a saved link    |
| GET    | `/api/notes`      | Get all notes          |
| POST   | `/api/notes`      | Create a note           |
| PUT    | `/api/notes/:id`  | Update a note            |
| DELETE | `/api/notes/:id`  | Delete a note             |

GitHub profile/repo/activity data is fetched directly from the [GitHub REST API](https://docs.github.com/en/rest) on the frontend.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
