// components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/authContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default PrivateRoute;
