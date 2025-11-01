# Google Calendar Clone

This project is a weekend-length reproduction of Google Calendar, built to showcase how I approach full‑stack product work. It covers everything from authentication and recurring-event logic on the server to a rich, theme-aware calendar UI on the client.

---

## ✨ Highlights

- **Modern React front end** with Vite, React Router, Redux Toolkit, Tailwind CSS, and lucide-react for icons.
- **Express + TypeScript API** backed by MongoDB and Mongoose, using Zod for request validation.
- **Recurring events** handled with `rrule`, including reminder support and server-side expansion.
- **Google-style UX flourishes**: floating quick-add modal that anchors to the selected date, full-page editor, dark/light themes, and responsive header with search, profile palette, and loader bar.

---

## 🗂️ Repository Layout

```
scaler/
├── frontend/          # Vite + React calendar client
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── CalendarGrid.jsx      # Month grid with anchor-aware clicks
│       │   ├── CalendarHeader.jsx    # Responsive header + search/profile UI
│       │   ├── EventModal.jsx        # Quick-add + full editor
│       │   ├── FullPageLoader.jsx    # Top progress bar loader
│       │   └── Sidebar.jsx           # Mini calendar + shortcuts + footer links
│       ├── pages/
│       │   └── Calendar.jsx          # App shell, modal wiring, data loading
│       ├── store/
│       │   ├── slices/               # Redux Toolkit slices (auth, events)
│       │   └── index.js              # Store configuration
│       ├── context/ThemeContext.jsx  # Light/dark toggle with local storage
│       └── services/api.js           # Axios wrapper
│
└── server/            # Express + TypeScript API
    ├── src/
    │   ├── config/               # Database connection
    │   ├── controllers/          # Auth + event controllers
    │   ├── middleware/           # Auth guard
    │   ├── models/               # User / Event Mongoose models
    │   ├── routes/               # CRUD routes
    │   ├── utils/recurrence.ts   # RRULE helpers
    │   ├── validators/           # Zod schemas
    │   └── server.ts             # App bootstrap
    └── tsconfig.json
```

> There is also a `client/` directory containing an earlier Next.js prototype. The Vite-based `frontend/` app is the active UI.

---

## 🧩 Features

### Calendar Experience
- Month view with anchored quick-add modal (single click) and full editor (double click or “More options”).
- Event creation, editing, deletion, and color tagging with reminders.
- Dark mode using a shared `ThemeContext`, plus a gradient loader bar for fetch states.
- Responsive header: search transforms into a stacked view on mobile, non-essential controls hide, and the profile menu mimics Google’s four-color ring.
- Sidebar mini calendar, quick create button, and a GitHub footer link.

### Backend Capabilities
- JWT-based authentication (login, signup, load user, logout).
- CRUD endpoints for events with date-range queries.
- Recurring event expansion using `rrule` and reminder support.
- Consistent validation via Zod, error handling, and secure token revocation on logout.

---

## 🚀 Getting Started

Make sure you have **Node.js 18+** and **MongoDB** (local or Atlas connection string) available.

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd scaler
```

#### Backend

```bash
cd server
npm install

cp .env.example .env        # Ensure the example file exists, otherwise create .env manually
# Fill in environment values, e.g.:
# MONGODB_URI=mongodb://localhost:27017/calendar-clone
# JWT_SECRET=super-secret-string
# CLIENT_URL=http://localhost:5173

npm run dev                 # Starts http://localhost:9001
```

#### Frontend

```bash
cd ../frontend
npm install

cp .env.example .env        # Optional: configure API base URL
# VITE_API_URL=http://localhost:9001

npm run dev                 # Launches http://localhost:5173
```

Visit `http://localhost:5173` and sign up to start adding events.

---

## 🧪 Useful Commands

| Task                    | Command (server)                 | Command (frontend) |
| ----------------------- | -------------------------------- | ------------------ |
| Start dev server        | `npm run dev`                    | `npm run dev`      |
| Production build        | `npm run build && npm start`     | `npm run build`    |
| Lint (frontend only)    | –                                | `npm run lint`     |

---

## 🛠️ Tech Deep Dive

- **React 19 + Vite** for fast refresh and fine-grained control over bundling.
- **Redux Toolkit** manages auth state (token hydration, user loading) and event state (async thunks for CRUD).
- **Tailwind CSS v4** with the new `@tailwindcss/vite` plugin for zero-config styling.
- **Express 5 + TypeScript** paired with Mongoose for schema definitions, plus request validation through Zod.
- **RRULE** handles repeat definitions; recurrence expansion happens server-side so the client receives ready-to-render instances.
- **JWT + cookies** for authenticated requests with refresh-safe logout.

---

## 📈 Future Enhancements

These are the items I would tackle next if I kept iterating:

1. Week and day views with drag-and-drop scheduling.
2. Shared calendars, guest invitations, and granular notification rules.
3. Search across event titles, descriptions, and locations.
4. Service worker for offline caching and background sync.
5. Real-time updates via WebSockets for multi-user collaboration.

---

## 🤝 Contributing

I created this for a Scaler assessment, but feedback, issues, or pull requests are always welcome. Feel free to fork the project and experiment with your own features.

