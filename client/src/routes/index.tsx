import { createBrowserRouter, Navigate } from "react-router";
import HomePage from "../pages/HomePage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import NotesManagement from "../pages/admin/NotesManagement";
import PostManagement from "../pages/admin/PostManagement";
import GroupedUsers from "../pages/admin/GroupedUsers";
import MyNotes from "../pages/MyNotes";
import CommunityFeed from "../pages/CommunityFeed";
import UserProfile from "../pages/UserProfile";
import NoteDetails from "../pages/NoteDetails";
import MainLayout from "../components/layout/MainLayout";
import DashboardLayout from "../components/layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import { ErrorPage } from "../pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "notes/:id",
        element: (
          <ProtectedRoute>
            <NoteDetails />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "my-notes",
        element: <MyNotes />,
      },
      {
        path: "community",
        element: <CommunityFeed />,
      },
      {
        path: "profile/:id",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to='/admin/dashboard' replace />,
      },
      {
        path: "dashboard",
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "user-management",
            element: <UserManagement />,
          },
          {
            path: "notes-management",
            element: <NotesManagement />,
          },
          {
            path: "posts-management",
            element: <PostManagement />,
          },
          {
            path: "grouped-users",
            element: <GroupedUsers />,
          },
        ],
      },
    ],
  },
]);
