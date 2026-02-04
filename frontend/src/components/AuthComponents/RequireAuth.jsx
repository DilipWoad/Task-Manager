import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import LoadingScreen from "../LoadingScreen";

const RequireAuth = ({ allowedRoles }) => {
  const { auth,isCheckingAuth } = useAuth();
  const location = useLocation();
 
  if(isCheckingAuth){
    return <LoadingScreen/>
  }
  
  return allowedRoles?.includes(auth?.role) ? (
    <Outlet />
  ) : auth?.fullName ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
