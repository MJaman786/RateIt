import { Route } from "react-router-dom";
import RoleGuard from "./RoleGuard";
import Dashboard from "../pages/OWNER/Dashboard";
import OwnerRatingsPage from "../pages/OWNER/Ratings";
// import OwnerChangePasswordPage from "../pages/OWNER/Security/ChangePassword";
import OwnerProfilePage from "../pages/OWNER/Profile";

const OwnerRoutes = (
    <>
        <Route element={<RoleGuard allowedRoles={["STORE_OWNER"]} />}>
            {/* Dashboard Scope */}
            <Route path="/owner/dashboard" element={<Dashboard />} />

            {/* Ratings Scope */}
            <Route path="/owner/ratings" element={<OwnerRatingsPage />} />

            {/* Security Scope */}
            {/* <Route path="/owner/change-password" element={<OwnerChangePasswordPage />} /> */}

            {/* Profile Scope */}
            <Route path="/owner/profile" element={<OwnerProfilePage />} />
        </Route>
    </>
);

export default OwnerRoutes;