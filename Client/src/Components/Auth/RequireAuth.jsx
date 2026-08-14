
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RequireAuth({ allowedRoles }) {
    const { isLoggedIn, role } = useSelector((state) => state.auth);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const normalizedRole = String(role || "").toUpperCase();
    const allowed = allowedRoles.map((item) => String(item).toUpperCase());
    const hasAccess = allowed.includes(normalizedRole);

    if (!hasAccess) {
        return <Navigate to="/denied" replace />;
    }

    return <Outlet />;
}

export default RequireAuth;