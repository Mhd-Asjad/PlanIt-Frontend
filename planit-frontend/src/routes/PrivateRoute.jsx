import { useAuth } from "../context/AuthProvider";
import { Navigate } from "react-router-dom";
function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
export default PrivateRoute;