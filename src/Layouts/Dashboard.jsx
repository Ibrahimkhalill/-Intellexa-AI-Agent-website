import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  RiArrowRightSLine,
  RiLogoutBoxRLine,
  RiVipCrownLine,
  RiMapPinUserLine,
  RiHome9Line,
  RiFolderUploadLine,
} from "react-icons/ri";
import { SiBilibili } from "react-icons/si";
import { HiOutlineBookmarkSquare } from "react-icons/hi2";
import { useAuth } from "../components/authContext";
import saveToken from "../components/saveToken";
import { confirmAction } from "../utils/notify";
import logo from "../assets/logo/logo.png";

const MOBILE_BREAKPOINT = 768;

// `match` lists extra path prefixes that should highlight the menu item
const Menus = [
  { title: "Home", path: "/", icon: RiHome9Line, gap: true },
  { title: "AI Chat", path: "/noir_chat", icon: RiFolderUploadLine },
  { title: "Work Flow", path: "/workflow", icon: RiVipCrownLine, match: ["/ai_search", "/email"] },
  { title: "Offer Library", path: "/offer-library", icon: SiBilibili },
  { title: "Booking List", path: "/booking-list", icon: HiOutlineBookmarkSquare, match: ["/booking"] },
];

const isMenuActive = (menu, pathname) =>
  pathname === menu.path || (menu.match || []).some((prefix) => pathname.startsWith(prefix));

const Dashboard = () => {
  const location = useLocation();
  const { logout, isAuthenticated, auth } = useAuth();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [open, setOpen] = useState(() => window.innerWidth >= MOBILE_BREAKPOINT);

  useEffect(() => {
    if (isAuthenticated) {
      saveToken(); // register this browser for booking reminders
    }
  }, [isAuthenticated]);

  const isMobileRef = useRef(isMobile);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      if (mobile === isMobileRef.current) return; // only react when crossing the breakpoint
      isMobileRef.current = mobile;
      setIsMobile(mobile);
      setOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // On mobile the menu is an overlay - close it after navigating
  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [location.pathname, isMobile]);

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: "Log out?",
      text: "You will need to sign in again.",
      confirmButtonText: "Log out",
    });
    if (confirmed) logout();
  };

  const labelClass = `${!open && "hidden"} origin-left duration-200 whitespace-nowrap`;

  return (
    <div className="flex">
      {/* Backdrop for the mobile overlay menu */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        className={`${
          open ? "!w-52 !p-4" : "!w-14 !text-center"
        } !h-screen !bg-base-300 fixed left-0 top-0 bottom-0 z-50 !pt-8 transition-all duration-500`}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Collapse menu" : "Expand menu"}
          className="absolute -right-5 top-9">
          <RiArrowRightSLine
            className={`cursor-pointer !text-gray-400 !bg-base-300 shadow-2xl w-10 h-10 rounded-full transition-transform ${
              open && "rotate-180"
            }`}
          />
        </button>
        <div className="flex items-center gap-x-4 p-2">
          <img src={logo} alt="Intellexa" className="w-full md:w-9/12 p-1 duration-500" />
        </div>

        <ul className={open ? "" : "flex flex-col items-center justify-center"}>
          {Menus.map((menu) => {
            const Icon = menu.icon;
            return (
              <li key={menu.path} className={menu.gap ? "mt-9" : "mt-2"}>
                <Link
                  to={menu.path}
                  title={menu.title}
                  className={`flex rounded-full py-1.5 px-4 text-sm items-center gap-x-2 ${
                    isMenuActive(menu, location.pathname)
                      ? "!bg-[#1E2839] !text-white"
                      : "hover:!bg-white"
                  }`}>
                  <Icon className="text-lg shrink-0" />
                  <span className={labelClass}>{menu.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Profile + Logout */}
        <ul className="mt-28 ms-3.5 md:ms-0 bottom-20 absolute w-full">
          <li>
            <Link
              to="/profile"
              title="Profile"
              className={`-ml-3.5 flex p-2 pl-6 text-sm items-center gap-x-4 w-full ${
                location.pathname === "/profile" ? "!bg-white" : "hover:!bg-white"
              }`}>
              <RiMapPinUserLine className="text-xl shrink-0" />
              <span className={`${labelClass} truncate`}>{auth.username || "Profile"}</span>
            </Link>
          </li>
          <li>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="flex !text-red-400 p-2 text-sm items-center gap-x-4 cursor-pointer w-full">
              <RiLogoutBoxRLine className="text-xl shrink-0" />
              <span className={labelClass}>Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area - on mobile the open menu overlays instead of pushing */}
      <main
        className={`${
          open && !isMobile ? "!pl-52" : "!pl-14 !pr-2"
        } flex-1 min-w-0 overflow-y-auto transition-all duration-500 h-[100vh]`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
