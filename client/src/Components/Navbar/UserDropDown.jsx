import { Link } from "react-router";
import useAuthProvidor from "../../Hook/useAuthProvidor";
import Loader from "./../Loader/Loader";

const UserDropdown = ({ links }) => {
  const { user, logoutUser } = useAuthProvidor();
  return (
    <div className="dropdown dropdown-end mr-5">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar relative group"
      >
        <div className="w-10 rounded-full">
          <img alt="user" src={user?.profileImage} />
        </div>
        <p className="absolute left-1/2 -translate-x-1/2 -bottom-10  bg-gray-800 text-white text-xs rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
          {user?.name}
        </p>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-64 p-2 shadow space-y-4"
      >
        {links.map((link) => (
          <Link key={link.to} to={link.to}>
            {link.name}
          </Link>
        ))}

        <li>
          <button onClick={() => logoutUser()} className="btn">
            Log Out
          </button>
        </li>
      </ul>
    </div>
  );
};
export default UserDropdown;
