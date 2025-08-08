import { Link, NavLink } from "react-router";
import { FiHome, FiMail, FiUser, FiGrid, FiBell, FiInfo } from "react-icons/fi";
import EmployeeFlow from "../EmployeeFlow/EmployeeFlow";
import ThemeToggle from "./../Theme/ThemeToggle";
import Notification from "./Notification";
import UserDropdown from "./UserDropDown";
import { FaSignInAlt } from "react-icons/fa";
import useAuthProvidor from "../../Hook/useAuthProvidor";

const Navbar = () => {
  const { firebaseUser } = useAuthProvidor();
  const links = [
    { name: "Home", to: "/", icon: <FiHome size={22} /> },
    { name: "Contact", to: "/contact", icon: <FiMail size={22} /> },
    { name: "About", to: "/about", icon: <FiInfo size={22} /> },
    ...(firebaseUser
      ? [{ name: "Dashboard", to: "/dashboard", icon: <FiGrid size={22} /> }]
      : []),
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="border-b border-primary/10 bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-1  max-w-7xl mx-auto  ">
          {/* Left: Logo */}
          <EmployeeFlow />

          {/* Center: Links */}
          <div className="hidden lg:flex space-x-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-montserrat font-medium px-3 py-2 rounded-full transition ${
                    isActive ? "bg-primary text-white" : ""
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right: Utilities */}
          <div className="flex items-center space-x-6 md:space-x-16">
            <ThemeToggle />

            {/* Notification */}
            <Notification />

            {firebaseUser ? (
              <UserDropdown links={links} />
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-bold"
              >
                <FaSignInAlt /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-100 border-t border-primary/10 shadow-inner z-50">
        <div className="flex justify-around items-center py-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center text-xs font-montserrat px-2 py-1 transition ${
                  isActive
                    ? "text-primary"
                    : "text-secondary hover:text-accent/80"
                }`
              }
            >
              {link.icon}
              <span className="mt-1">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
