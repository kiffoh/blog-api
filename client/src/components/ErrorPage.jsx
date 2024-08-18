import { Link, useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div>
      {message? <h1>{message}</h1> : <h1>Oh no, this route doesn't exist!</h1>}
      <Link to="/">
        You can go back to the home page by clicking here, though!
      </Link>
    </div>
  );
};

export default ErrorPage;