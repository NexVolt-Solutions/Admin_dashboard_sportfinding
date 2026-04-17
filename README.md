🏆 SportFinding Admin Dashboard

A modern, high-performance, and fully responsive admin dashboard for managing users, matches, and activity in the SportFinding platform.

Built with a focus on clean architecture, performance, scalability, and pixel-perfect UI.

📸 Preview

✨ Features
📊 Dynamic Dashboard (real-time stats & analytics)
👥 User Management (CRUD operations)
📈 Interactive Charts (data visualization)
🔍 Search, Filter & Pagination
📱 Fully Responsive (Mobile, Tablet, Desktop)
⚡ Optimized Performance (lazy loading, memoization)
🎯 Pixel-Perfect UI (based on design system)
🔐 Authentication (JWT-based)
🧼 Clean & Reusable Components
🛠️ Tech Stack
Frontend:
React.js
Tailwind CSS
React Router
Zustand / Redux (State Management)
Recharts / Chart.js
Backend:
Node.js
Express.js
MongoDB (Mongoose)
📁 Project Structure
src/
├── components/
│ ├── ui/
│ ├── layout/
│ ├── cards/
│ ├── charts/
│ ├── tables/
│
├── pages/
│ ├── Dashboard.jsx
│ ├── Users.jsx
│ ├── UserProfile.jsx
│
├── api/
├── store/
├── hooks/
├── utils/
├── assets/
⚙️ Installation & Setup

1. Clone the repository
   git clone <https://github.com/your-username/sportfinding-dashboard.git>
   cd sportfinding-dashboard
2. Install dependencies
   npm install
3. Setup environment variables

Create a .env file in root:

VITE_API_URL=<http://localhost:5000/api> 4. Run the project
npm run dev
🔌 Backend Setup
cd server
npm install
npm run dev
📱 Responsiveness
Mobile-first approach
Adaptive grid system
Collapsible sidebar
Optimized layouts for all screen sizes
⚡ Performance Optimization
Code splitting (React.lazy + Suspense)
Memoization (React.memo, useMemo, useCallback)
Optimized API calls (debouncing & caching)
Image optimization (WebP format)
Reduced bundle size
🔍 SEO Optimization
Semantic HTML structure
Proper heading hierarchy
Meta tags (title, description)
Fast loading speed
♻️ Reusable Components
Sidebar
Header
StatCard
ChartCard
Table
Dropdown
Modal
Buttons & Inputs
🎨 Design System
Primary Color: #3EA7FD
Font: Nunito (Main), Poppins (Header)
Clean spacing & consistent UI
🔐 Authentication
JWT-based authentication
Protected routes
Secure API endpoints
🚀 Future Improvements
Real-time updates (Socket.io)
Role-based access control
Dark mode
Advanced analytics
Notifications system
🤝 Contributing

Contributions are welcome!

Fork the repo
Create a new branch
Make your changes
Submit a pull request
📄 License

This project is licensed under the MIT License.
