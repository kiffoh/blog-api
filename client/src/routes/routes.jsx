import { createBrowserRouter } from 'react-router-dom';
// import HomePage from '../components/HomePage'; // Import your HomePage component
import ErrorPage from '../components/ErrorPage'; // Import your ErrorPage component
import UserLayout from '../layouts/UserLayout'; // Import a layout component for users
import userRoutes from './users'; // Import user routes
import postRoutes from './posts';
import HomePage from '../components/HomePage';
import PostLayout from '../layouts/PostLayout';
import { AuthProvider } from '../AuthContext';

// Main Router
const router = createBrowserRouter([
  {
    path: "/",
    element: (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
    ), //  Main page for the root path
    errorElement: <ErrorPage />, // Displayed if there's an error
  },
  {
    path: "users", // This matches "/users"
    element: (
    <AuthProvider>
      <UserLayout />
    </AuthProvider>
    ), // Layout component for user-related routes
    children: userRoutes, // Use user routes here
  },
  {
    path: "posts",
    element: (
    <AuthProvider>
      <PostLayout />
    </AuthProvider>
    ),
    children: postRoutes,
}
]);

export default router;
