# Google Calendar Clone - Frontend

A modern, responsive Google Calendar clone built with React, Redux Toolkit, and Tailwind CSS.

## Features

- User authentication (Login/Signup)
- Monthly calendar view with intuitive navigation
- Create, edit, and delete events
- Event details including:
  - Title, description, location
  - Start and end times
  - All-day events
  - Color-coded events
  - Reminders
- Responsive design
- Real-time event updates
- Protected routes

## Tech Stack

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **Vite** - Build tool

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running on `http://localhost:9001`

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API URL:
```
VITE_API_BASE_URL=http://localhost:9001
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to:
```
http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code with ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── CalendarHeader.jsx
│   │   ├── CalendarGrid.jsx
│   │   ├── EventModal.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/              # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   └── Calendar.jsx
│   ├── store/              # Redux store
│   │   ├── index.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       └── eventsSlice.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env                   # Environment variables
├── .env.example          # Environment template
├── package.json
└── vite.config.js
```

## Features Overview

### Authentication
- Login with email and password
- Sign up for new users
- JWT-based authentication
- Protected routes with automatic redirects

### Calendar View
- Monthly calendar grid
- Current date highlighting
- Previous/Next month navigation
- Quick "Today" button
- Event display on calendar days

### Event Management
- Create events with detailed information
- Edit existing events
- Delete events
- Color-coded events (7 color options)
- All-day event support
- Multiple reminders per event

### User Interface
- Clean, modern Google Calendar-inspired design
- Responsive layout
- Smooth transitions and hover effects
- Modal-based event creation/editing
- User profile display in header

## API Integration

The app integrates with the following API endpoints:

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

### Events
- `GET /api/events?start=&end=` - Get events in date range
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### User
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/preferences` - Update preferences
- `PUT /api/user/profile` - Update profile

## State Management

The application uses Redux Toolkit with the following slices:

- **authSlice** - User authentication state
- **eventsSlice** - Calendar events state

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (default: `http://localhost:9001`)

## Build for Production

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

The optimized files will be in the `dist` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
