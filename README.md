# FixHub

## Project Description

FixHub is a home-repair service-request platform. Homeowners can create and track repair requests, attach photos, and manage their account, while authorized administrators can review requests and manage their status.

## Features

- **Authentication** — Supabase Auth registration, login, session handling, logout, and protected pages.
- **Repair Requests** — Create, view, edit, delete, and track repair requests with categories, descriptions, addresses, preferred dates, and statuses.
- **Photo Uploads** — Upload repair photos to Supabase Storage and display them through time-limited signed URLs.
- **Admin Panel** — Role-protected request overview, status updates, filtering, search, user count, and registered-profile list.
- **Profile Management** — Update a full name, upload a profile photo, view account metadata, and change a password.

## Technologies

- HTML5
- CSS3
- Bootstrap 5 and Bootstrap Icons
- Modern JavaScript (ES modules)
- Vite
- Supabase Auth, Postgres, Storage, and Row-Level Security

## Architecture

### Frontend

The frontend is a Vite multi-page application built with vanilla JavaScript and Bootstrap. Each HTML file loads its matching module under `src/js/pages`, while shared navigation, authentication guards, services, and styles are reused across pages.

### Backend

Supabase provides authentication, authorization, database access, and object storage. Client-side services encapsulate Supabase calls so page modules remain focused on rendering and user interaction.

### Database

Postgres tables store user profiles, roles, repair requests, and image metadata. Supabase migrations define foreign keys, indexes, timestamp triggers, and Row-Level Security policies.

### Storage

`repair-images` is a private Supabase Storage bucket. Repair photos are accessed with signed URLs and are restricted to the file owner or an administrator. `profile-images` stores public profile avatars.

## Folder Structure

```text
.
├── src/
│   ├── css/                 # Shared visual design and responsive styles
│   ├── js/
│   │   ├── components/      # Reusable UI components, including navigation
│   │   ├── pages/           # Page entry modules and page-specific behavior
│   │   ├── services/        # Supabase Auth, database, profile, and Storage access
│   │   └── utils/           # Authentication guard utilities
├── supabase/
│   └── migrations/          # Database schema, RLS, and Storage migration scripts
├── *.html                   # Vite page entry points
├── vite.config.js           # Multi-page Vite configuration
└── package.json             # Project scripts and dependencies
```

## Database Schema

| Table | Purpose | Relationships |
| --- | --- | --- |
| `profiles` | Public application profile for an authenticated user. | `profiles.id` references `auth.users.id`. |
| `user_roles` | Stores the application role (`user` or `admin`). | One-to-one with `profiles` through `user_id`. |
| `repair_requests` | Repair request details and lifecycle status. | Many requests belong to one profile through `user_id`. |
| `repair_images` | Metadata for images stored in Supabase Storage. | Each image belongs to a request and its owner; the composite relationship enforces that both match. |

The migration also creates a profile and default `user` role whenever a new Supabase Auth account is created. RLS restricts normal users to their own data; administrators have full table access.

## Local Development

### Installation

```bash
npm install
```

Create a `.env` file with your Supabase project values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Apply the appropriate migration in `supabase/migrations` to your Supabase project, then start the app:

```bash
npm run dev
```

Vite prints the local URL, normally `http://localhost:5173`.

Create a production build with:

```bash
npm run build
```

## Deployment

### Netlify

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Create a new Netlify site from that repository.
3. Set the build command to `npm run build` and publish directory to `dist`.
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Site configuration → Environment variables.
5. Deploy and add the deployed URL to Supabase Auth → URL Configuration as an allowed redirect URL if required.

### Vercel

1. Import the repository into Vercel.
2. Use the Vite preset, or set build command to `npm run build` and output directory to `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Project Settings → Environment Variables.
4. Deploy and add the Vercel URL to Supabase Auth → URL Configuration when using email confirmations or password recovery.

## Demo Credentials

Create demo accounts in your own Supabase project. Do not commit real credentials.

```text
Demo user email: demo.user@example.com
Demo user password: ChangeMe123!

Demo admin email: demo.admin@example.com
Demo admin password: ChangeMe123!
```

After creating the admin account, assign its role in Supabase:

```sql
update public.user_roles
set role = 'admin'
where user_id = 'AUTH-USER-UUID';
```
