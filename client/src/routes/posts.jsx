// import FindUser from '../components/FindUser'; // Import a component for viewing a user's profile
import CreatePost from '../components/posts/CreatePost';
import DisplayPost from '../components/posts/DisplayPost';

const postRoutes = [
  {
    path: "", // This matches "/users/log-in"
    element: <CreatePost />,
  },
  {
    path:":postId",
    element: <DisplayPost />
  }
  /*
  {
    path: ":userId", // This matches "/users/:userId"
    element: <FindUser />, // Component for viewing a user's profile
  },
  */
];

export default postRoutes;
