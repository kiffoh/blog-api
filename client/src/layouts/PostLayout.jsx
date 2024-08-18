import { Outlet } from 'react-router-dom';

function PostLayout() {
  return (
    <div>
      <Outlet /> {/* This is where the nested routes will be rendered */}
    </div>
  );
}

export default PostLayout;
