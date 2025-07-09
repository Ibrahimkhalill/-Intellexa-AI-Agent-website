import { createBrowserRouter } from "react-router";
import Dashboard from "../Layouts/Dashboard";
import Signup from "../Pages/Authentication/Signup";
import SignIn from "../Pages/Authentication/SignIn";
import ProfilePage from "../Pages/Authentication/Profile/ProfilePage";
import HomePage from "../Pages/Dashboard/HomePage/HomePage";
import Upgrade from "../Pages/Dashboard/Upgrade/Upgrade";
import UploadOneFile from "../Pages/Dashboard/HomePage/UploadOneFile";
import OtpVerification from "../Pages/Authentication/OtpVerification";
import ForgetEmail from "../Pages/Authentication/ForgetEmail";
import EmailAutomation from "../Pages/Dashboard/Email/EmailAutomation";
import WorkFlow from "../Pages/Dashboard/Worlflow/WorkFlow";
import BookingList from "../Pages/Dashboard/booking/BookingList";
import OfferLibrary from "../Pages/Dashboard/offer/OfferLibrary";
import AllOferLibrary from "../Pages/Dashboard/offer/AllOferLibrary";
import BookingDeatils from "../Pages/Dashboard/booking/BookingDeatils";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/",
        element: <HomePage/>
      },
      {
        path: "/upload_one",
        element: <UploadOneFile/>
      },
      {
        path: "/booking-list",
        element: <BookingList/>
      },
      {
        path: "/offer-library",
        element: <OfferLibrary/>
      },
      {
        path: "/upgrade",
        element: <Upgrade/>
      },
      {
        path: "/email-automation",
        element: <EmailAutomation/>
      },
      {
        path: "/worlflow",
        element: <WorkFlow/>
      },
      {
        path: "/profile",
        element: <ProfilePage/>
      },
      {
        path: "/offer-libray/:name",
        element: <AllOferLibrary/>
      },
      {
        path: "/booking-deatils",
        element: <BookingDeatils/>
      },

    ],
  },
  
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/otp",
    element: <OtpVerification />,
  },
  {
    path: "/forget-password",
    element: <ForgetEmail />,
  },
]);

export default router;
