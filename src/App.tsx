/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";
import MainLayout from "./components/layout/MainLayout";
import AuthGuard from "./components/auth/AuthGuard";

const Login = lazy(() => import("./pages/Login"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const AllSports = lazy(() => import("./pages/AllSports"));
const Match = lazy(() => import("./pages/Match"));
const EditMatch = lazy(() => import("./pages/matches/EditMatch"));
const ViewMatch = lazy(() => import("./pages/matches/ViewMatch"));
const Reviews = lazy(() => import("./pages/Reviews"));
const Content = lazy(() => import("./pages/Content"));
const Support = lazy(() => import("./pages/Support"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const Protected = ({ children }: { children: React.ReactNode }) => (
  <AuthGuard>
    <MainLayout>
      <Suspense fallback={<PageLoader />}>{children}</Suspense>
    </MainLayout>
  </AuthGuard>
);

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" expand={false} richColors />
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/auth-callback"
          element={
            <Suspense fallback={<PageLoader />}>
              <AuthCallback />
            </Suspense>
          }
        />
        <Route path="/" element={<Protected><Dashboard /></Protected>} />
        <Route path="/users" element={<Protected><Users /></Protected>} />
        <Route path="/users/:id" element={<Protected><UserProfile /></Protected>} />
        <Route path="/users/sports" element={<Protected><AllSports /></Protected>} />
        <Route path="/match" element={<Protected><Match /></Protected>} />
        <Route path="/match/view/:id" element={<Protected><ViewMatch /></Protected>} />
        <Route path="/match/edit/:id" element={<Protected><EditMatch /></Protected>} />
        <Route path="/reviews" element={<Protected><Reviews /></Protected>} />
        <Route path="/content" element={<Protected><Content /></Protected>} />
        <Route path="/support" element={<Protected><Support /></Protected>} />
        <Route path="/settings" element={<Protected><Settings /></Protected>} />
        <Route path="*" element={<Protected><NotFound /></Protected>} />
      </Routes>
    </Router>
  );
}
