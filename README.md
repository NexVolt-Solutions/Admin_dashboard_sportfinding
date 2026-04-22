# SportFinding Admin Dashboard

A modern React + Vite admin dashboard for managing the SportFinding platform. The application is built for administrators who need a fast, responsive interface for monitoring users, moderating platform activity, reviewing analytics, and maintaining core operational content.

This project uses a modular component structure, route-based code splitting, authenticated API access, and a reusable UI layer to support day-to-day admin workflows.

## Overview

The dashboard provides an admin-facing control panel for:

- Monitoring high-level platform metrics and charts
- Managing users and viewing profile details
- Browsing, filtering, and updating matches
- Moderating user reviews
- Handling support requests
- Editing policy and help content
- Managing administrator profile and account settings

## Key Features

### Authentication and Access

- JWT-based login flow
- Auth context for shared authentication state
- Protected route support through `AuthGuard`
- Automatic token attachment on API requests
- Automatic redirect to login on `401` and `403` responses

### Dashboard and Analytics

- Summary cards for total users, total matches, active matches, and new users today
- Lazy-loaded charts for:
  - user growth over time
  - matches per day
  - most popular sports
- React Query powered data fetching and caching
- Loading skeletons for a smoother dashboard experience

### User Management

- User listing with server-driven pagination
- Search by user name or address
- Filters for sport, location, and created date
- Create user modal with optional admin privileges
- Individual user profile screen with summary details
- Dedicated “All Sports” view for user sports information

### Match Management

- Match listing screen with search and filter controls
- Support for filtering by sport, location, and date
- Match action menu for row-level actions
- View match details page
- Edit match page
- Match status handling for scheduled, ongoing, completed, postponed, and cancelled states

### Reviews Moderation

- Review user list with searchable left-side thread panel
- Review feed for the selected user
- Review deletion workflow
- Optimistic refresh through React Query invalidation
- Moderation-friendly responsive layout

### Support Requests

- Searchable support request list
- Ticket detail view
- Ticket status update flow
- Responsive list-to-detail layout

### Content Management

- Content editor for:
  - Terms of Service
  - Privacy Policy
  - Help & Support
- Searchable section switching
- Dirty-state aware save action
- API-backed content loading and updating

### Settings

- Profile settings screen
- Account/security settings screen
- Animated tab transitions

### UI and Developer Experience

- Responsive sidebar and layout system
- Shared UI primitives for buttons, dialogs, inputs, labels, tables, cards, and skeletons
- Toast notifications via `sonner`
- Reusable helpers and hooks
- Route-level lazy loading with `React.lazy` and `Suspense`
- TypeScript support across the application

## Tech Stack

### Core

- React 19
- TypeScript
- Vite
- React Router

### Data and State

- Axios
- TanStack React Query
- React Context for authentication

### UI

- Tailwind CSS
- Lucide React
- Motion
- Shadcn-style UI components

## Project Structure

```text
src/
├── components/
│   ├── auth/          # Route protection
│   ├── content/       # Content editor modules
│   ├── dashboard/     # Analytics charts
│   ├── layout/        # Sidebar, header, app shell
│   ├── matches/       # Match tables, filters, actions, detail views
│   ├── reviews/       # Review moderation UI
│   ├── settings/      # Profile and security forms
│   ├── support/       # Ticket list and detail views
│   ├── tables/        # User table row components
│   ├── ui/            # Shared UI primitives
│   └── users/         # User creation modal
├── context/           # Global auth context
├── hooks/             # Reusable hooks
├── lib/               # API client and utilities
├── pages/             # Route-level screens
├── types/             # Shared TypeScript types
├── App.tsx            # Router and app composition
└── main.tsx           # Application bootstrap
```

## Available Pages

- `/login` - administrator sign-in
- `/` - dashboard overview
- `/users` - user management
- `/users/:id` - user profile
- `/users/sports` - sports listing view
- `/match` - match management
- `/match/view/:id` - match detail
- `/match/edit/:id` - edit match
- `/reviews` - reviews moderation
- `/content` - content management
- `/support` - support requests
- `/settings` - profile and account settings

## API Integration

The application uses a centralized Axios client in `src/lib/api-client.ts`.

Current integration patterns include:

- configurable API base URL via environment variables
- automatic JWT header injection
- centralized unauthorized-response handling
- React Query for caching, loading states, and invalidation

Examples of backend endpoints currently used by the frontend include:

- `/api/v1/auth/login`
- `/api/v1/admin/dashboard`
- `/api/v1/admin/account`
- `/api/v1/admin/users`
- `/api/v1/admin/matches`
- `/api/v1/admin/reviews/users`
- `/api/v1/admin/support-requests`
- `/api/v1/admin/content/:section`

The frontend is currently aligned to schema-driven admin responses such as:

- `DashboardStatsResponse`
- `AdminAccountResponse`
- `PaginatedResponse[AdminUserListItemResponse]`
- `AdminUserDetailResponse`
- `PaginatedResponse[AdminMatchListItemResponse]`
- `MatchDetailResponse`
- `PaginatedResponse[ReviewModerationUserItemResponse]`
- `ReviewModerationUserReviewsResponse`
- `PaginatedResponse[SupportRequestListItemResponse]`
- `SupportRequestDetailResponse`
- `ContentPageResponse`

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000
VITE_ENABLE_SEED=false
```

### Notes

- `VITE_API_URL` sets the base URL used by the shared Axios client.
- `VITE_ENABLE_SEED` is optional and keeps the development seed request disabled unless explicitly turned on.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

If no `.env.example` file exists yet, create `.env` manually using the variables above.

### 3. Start the development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

## Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run TypeScript type checking
- `npm run clean` - remove the `dist` directory

## Architecture Notes

- Route-level pages are defined under `src/pages`
- Reusable feature UI lives under `src/components`
- Authentication state is managed through `AuthContext`
- Data fetching is handled with React Query where the API contract is defined and stable
- Shared request behavior is centralized in the Axios client
- Heavy UI sections such as charts are lazy loaded for better performance

## Design and UX Highlights

- Clean admin-focused layout with collapsible sidebar behavior
- Responsive interfaces for desktop and mobile workflows
- Skeleton loading states across major sections
- Toast feedback for create, save, and delete flows
- Motion-based transitions in moderation and settings views

## Current Scope

This repository is the frontend admin application. It expects a separate backend API to provide authentication, dashboard data, user records, support data, content sections, reviews, and match operations.

## Recommended Improvements

- Add a dedicated `.env.example`
- Add unit and integration tests
- Standardize all API paths under a single versioned namespace
- Add route-level auth gating directly in the router tree
- Add CI checks for formatting, type safety, and build validation
- Add deployment documentation

## Contributing

1. Create a feature branch
2. Make your changes
3. Run `npm run lint`
4. Run `npm run build`
5. Open a pull request with a clear summary

## License

This project is private unless a separate license is provided by the repository owner.
