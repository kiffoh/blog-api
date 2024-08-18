import LoginForm from '../components/users/LoginForm'; // Import your LoginForm component
import SignupForm from '../components/users/SignupForm'; // Import your SignupForm component
import UnpublishedPosts from '../components/users/UnpublishedPosts';
// import FindUser from '../components/FindUser'; // Import a component for viewing a user's profile

const userRoutes = [
  {
    path: "log-in", // This matches "/users/log-in"
    element: <LoginForm />,
  },
  {
    path: "sign-up", // This matches "/users/sign-up"
    element: <SignupForm />,
  },
  {
    path: ":userId/unpublished",
    element: <UnpublishedPosts />
  }
  /*
  {
    path: ":userId", // This matches "/users/:userId"
    element: <FindUser />, // Component for viewing a user's profile
  },
  */
];

export default userRoutes;
