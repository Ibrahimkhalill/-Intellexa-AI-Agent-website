// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/authContext";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
