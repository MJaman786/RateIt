import { Route } from "react-router-dom";
import RoleGuard from "./RoleGuard";
import Dashboard from "../pages/ADMIN/Dashboard";
import AdminUsersPage from "../pages/ADMIN/Users";
// import AdminCreateUserPage from "../pages/ADMIN/Users/CreateUser";
import AdminStoresPage from "../pages/ADMIN/Stores";
// import AdminCreateStorePage from "../pages/ADMIN/Stores/CreateStore";
import AdminRatingsPage from "../pages/ADMIN/Ratings";
import AdminProfilePage from "../pages/ADMIN/Profile";

const AdminRoutes = (
    <>
        <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
            {/* Dashboard Scope */}
            <Route path="/admin/dashboard" element={<Dashboard />} />

            {/* User Management Scope */}
            <Route path="/admin/users" element={<AdminUsersPage />} />
            {/* <Route path="/admin/users/create" element={<AdminCreateUserPage />} /> */}

            {/* Store Management Scope */}
            <Route path="/admin/stores" element={<AdminStoresPage />} />
            {/* <Route path="/admin/stores/create" element={<AdminCreateStorePage />} /> */}

            {/* Ratings Scope */}
            <Route path="/admin/ratings" element={<AdminRatingsPage />} />

            {/* Profile Scope */}
            <Route path="/admin/profile" element={<AdminProfilePage />} />
        </Route>
    </>
);

export default AdminRoutes;