import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./common/ProtectedRoute";
import PublicRoutes from "./routes/PublicRoutes";
import Unauthorized from "./pages/UnAuthorized";
import OwnerRoutes from "./routes/OwnerRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          {PublicRoutes}
          {/* unauthorized route */}
          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />
          <Route element={<ProtectedRoutes />}>

            {/* user routes */}
            {UserRoutes}

            {/* super-admin routes */}
            {OwnerRoutes}

            {/* admin routes*/}
            {AdminRoutes}
            
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
