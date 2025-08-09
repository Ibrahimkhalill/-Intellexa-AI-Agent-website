import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Layouts/Dashboard";
import Signup from "../Pages/Authentication/Signup";
import SignIn from "../Pages/Authentication/SignIn";
import ProfilePage from "../Pages/Authentication/Profile/ProfilePage";
import HomePage from "../Pages/Dashboard/HomePage/HomePage";
import OtpVerification from "../Pages/Authentication/OtpVerification";
import EmailAutomation from "../Pages/Dashboard/Email/EmailAutomation";
import WorkFlow from "../Pages/Dashboard/Worlflow/WorkFlow";
import BookingList from "../Pages/Dashboard/booking/BookingList";
import OfferLibrary from "../Pages/Dashboard/offer/OfferLibrary";
import AllOferLibrary from "../Pages/Dashboard/offer/AllOferLibrary";
import BookingDeatils from "../Pages/Dashboard/booking/BookingDeatils";
import BookingForm from "../Pages/Dashboard/BookingForm/BookingForm";
import Search from "../Pages/Dashboard/Worlflow/Search";
import NoirChat from "../Pages/Dashboard/NoirChat/NoirChat";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ForgetPasswordFlow from "./ForgetPasswordFlow";
import CancelPage from "../components/CancelPage";
import SuccessPage from "../components/SuccessPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/noir_chat", element: <NoirChat /> },
      { path: "/booking-list", element: <BookingList /> },
      { path: "/offer-library", element: <OfferLibrary /> },
      { path: "/email-automation", element: <EmailAutomation /> },
      { path: "/ai_search", element: <Search /> },
      { path: "/worlflow", element: <WorkFlow /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/offer-libray/:name", element: <AllOferLibrary /> },
      { path: "/booking-deatils", element: <BookingDeatils /> },
      { path: "/booking/:id", element: <BookingForm /> },
      { path: "/payment/success", element: <SuccessPage /> },
      { path: "/payment/cancel", element: <CancelPage /> },
    ],
  },

  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "/otp",
    element: (
      <PublicRoute>
        <OtpVerification />
      </PublicRoute>
    ),
  },
  {
    path: "/forget-password",
    element: (
      <PublicRoute>
        <ForgetPasswordFlow />
      </PublicRoute>
    ),
  },
]);

export default router;
