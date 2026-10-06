import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "../Layouts/Dashboard";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "../components/PageLoader";
import NotFound from "../components/NotFound";

// Each page is its own chunk, downloaded the first time it is opened
const SignIn = lazy(() => import("../Pages/Authentication/SignIn"));
const Signup = lazy(() => import("../Pages/Authentication/Signup"));
const OtpVerification = lazy(() => import("../Pages/Authentication/OtpVerification"));
const ForgetPasswordFlow = lazy(() => import("./ForgetPasswordFlow"));
const ProfilePage = lazy(() => import("../Pages/Authentication/Profile/ProfilePage"));
const HomePage = lazy(() => import("../Pages/Dashboard/HomePage/HomePage"));
const NoirChat = lazy(() => import("../Pages/Dashboard/NoirChat/NoirChat"));
const BookingList = lazy(() => import("../Pages/Dashboard/booking/BookingList"));
const BookingForm = lazy(() => import("../Pages/Dashboard/BookingForm/BookingForm"));
const OfferLibrary = lazy(() => import("../Pages/Dashboard/offer/OfferLibrary"));
const EmailAutomation = lazy(() => import("../Pages/Dashboard/Email/EmailAutomation"));
const WorkFlow = lazy(() => import("../Pages/Dashboard/Workflow/WorkFlow"));
const Search = lazy(() => import("../Pages/Dashboard/Workflow/Search"));
const SuccessPage = lazy(() => import("../components/SuccessPage"));
const CancelPage = lazy(() => import("../components/CancelPage"));

const page = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const publicPage = (Component) => <PublicRoute>{page(Component)}</PublicRoute>;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      { path: "/", element: page(HomePage) },
      { path: "/noir_chat", element: page(NoirChat) },
      { path: "/booking-list", element: page(BookingList) },
      { path: "/offer-library", element: page(OfferLibrary) },
      { path: "/email/:title", element: page(EmailAutomation) },
      { path: "/ai_search/:title", element: page(Search) },
      { path: "/workflow", element: page(WorkFlow) },
      { path: "/worlflow", element: <Navigate to="/workflow" replace /> }, // old URL
      { path: "/profile", element: page(ProfilePage) },
      { path: "/booking", element: page(BookingForm) },
      { path: "/booking/:bookingId", element: page(BookingForm) },
      { path: "/payment/success", element: page(SuccessPage) },
      { path: "/payment/cancel", element: page(CancelPage) },
    ],
  },
  { path: "/signin", element: publicPage(SignIn) },
  { path: "/signup", element: publicPage(Signup) },
  { path: "/otp", element: publicPage(OtpVerification) },
  { path: "/forget-password", element: publicPage(ForgetPasswordFlow) },
  { path: "*", element: <NotFound /> },
]);

export default router;
