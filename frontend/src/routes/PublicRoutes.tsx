import { Route } from "react-router-dom";
import Login from "../components/Auth/Login";
import Signup from "../components/Auth/SignUp";
import { OtpVerification } from "../components/Auth/OtpVerification";

const PublicRoutes = (
  <>
    <Route
      path="/"
      element={<Login />}
    />

    <Route
      path="/signup"
      element={<Signup />}
    />

    <Route
      path="/verify-otp/:userId/:type"
      element={<OtpVerification />}
    />
  </>
);

export default PublicRoutes;