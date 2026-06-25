import { Route } from "react-router-dom";
import RoleGuard from "./RoleGuard";
import Dashboard from "../pages/USER/Dashboard";
import UserStoresPage from "../pages/USER/Stores";
import UserRatingsPage from "../pages/USER/Ratings";
// import UserChangePasswordPage from "../pages/USER/Security/ChangePassword";
import UserProfilePage from "../pages/USER/Profile";

const UserRoutes = (
  <>
    <Route element={<RoleGuard allowedRoles={["USER"]} />}>
      {/* Dashboard Scope */}
      <Route path="/user/dashboard" element={<Dashboard />} />

      {/* Stores Browsing Discovery Scope */}
      <Route path="/user/stores" element={<UserStoresPage />} />

      {/* Personal Submitted Ratings Scope */}
      <Route path="/user/ratings" element={<UserRatingsPage />} />

      {/* Security Scope */}
      {/* <Route path="/user/change-password" element={<UserChangePasswordPage />} /> */}

      {/* Profile Scope */}
      <Route path="/user/profile" element={<UserProfilePage />} />
    </Route>
  </>
);

export default UserRoutes;