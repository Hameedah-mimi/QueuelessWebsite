# QueueLess Frontend

React + Vite frontend for the QueueLess appointment & queue platform.

## Features in this starter

- **4 roles**: Customer, Worker, Organization, Admin
- **Admin is invite/approval only** – cannot self-register or use Google sign-in
- **Firebase Auth ready** (Google + email/password)
- **Django JWT integration** (login, register, refresh, Firebase exchange)
- **Role-based navigation** – public navbar → role-specific sidebar after login
- **Protected routes** – unauthenticated users redirected to `/login`
- **Admin live analytics dashboard** with interactive charts (Recharts)
- Clean Tailwind design matching your SVG mockups (brand teal `#16A6A1`)

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Firebase keys + Django API URL

# 3. Run
npm run dev
```

Open http://localhost:5173

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_*` | From Firebase Console → Project settings |
| `VITE_API_BASE_URL` | Django API base, e.g. `http://localhost:8000/api/v1` |

## Auth flow

1. **Email/password** → `POST /api/v1/auth/login/` or `/auth/register/` → Django returns JWT + user
2. **Google** → Firebase popup → send `id_token` to `POST /api/v1/auth/firebase/` → Django creates/links user + returns JWT
3. Admin accounts must have `is_approved=true` on the backend; they cannot register via the UI

## Project structure

```
src/
├── api/client.js          # Axios + JWT interceptors
├── context/AuthContext.jsx
├── components/
│   ├── ProtectedRoute.jsx
│   └── layout/            # PublicNavbar, RoleNavbar
├── pages/
│   ├── Landing.jsx
│   ├── auth/              # Login, Register
│   ├── customer/
│   ├── worker/
│   ├── organization/
│   └── admin/             # Live analytics dashboard
├── firebase.js
└── App.jsx                # Routes
```

## Next steps for you

1. Add your Firebase project keys to `.env`
2. Ensure your Django backend has:
   - `/auth/login/`, `/auth/register/`, `/auth/token/refresh/`
   - `/auth/firebase/` (optional, for Google)
   - User model with `role` and `is_approved` for admins
3. Replace demo data in Admin dashboard with real API calls
4. Build out the remaining pages using your SVG designs (Explore, Book, Queue, Earnings, etc.)

## Scripts

- `npm run dev` – development server
- `npm run build` – production build
- `npm run preview` – preview production build
