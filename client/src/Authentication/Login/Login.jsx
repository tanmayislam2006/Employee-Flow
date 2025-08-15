import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router";
import useAuthProvidor from "../../Hook/useAuthProvidor";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxios from "../../Hook/useAxios";

const Login = () => {
  const { loginUser, googleLogin, refetchUserData } = useAuthProvidor();
  const axiosInstance = useAxios();
  const [showPass, setShowPass] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 🆕 Show alert for admin credentials on mount
  useEffect(() => {
    Swal.fire({
      title: "Admin Login Info",
      html: `
        <p><strong>Email:</strong> admin@gmail.com</p>
        <p><strong>Password:</strong> 123456Aa@</p>
        <p style="color:gray; font-size:14px;">Already filled in the form for your convenience.</p>
      `,
      icon: "info",
      confirmButtonColor: "#00BFB2",
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // 1️⃣ Check user status before Firebase login
      const userRes = await axiosInstance.get(`/user/email/${email}`);
      const foundUser = userRes.data;
      if (!foundUser) {
        Swal.fire({
          title: "User Not Found",
          text: "No account exists with this email.",
          icon: "error",
          confirmButtonColor: "#00BFB2",
        });
        return;
      }

      if (foundUser.status === "Fired") {
        Swal.fire({
          title: "Access Denied",
          text: "Your account has been marked as 'Fired'. Please contact Admin.",
          icon: "error",
          confirmButtonColor: "#00BFB2",
        });
        return;
      }

      // 2️⃣ Status OK → Proceed with Firebase login
      const result = await loginUser(email, password);
      if (result.user) {
        const lastSignInTime = result?.user?.metadata?.lastSignInTime;
        await axiosInstance.patch(`/login`, {
          lastSignInTime,
          email: result.user?.email,
        });

        Swal.fire({
          title: "Welcome Back",
          icon: "success",
          confirmButtonColor: "#00BFB2",
        });
        navigate(location?.state || "/");
      }
    } catch (error) {
      Swal.fire({
        title: "Log In Failed",
        text: error?.message,
        icon: "error",
        confirmButtonColor: "#00BFB2",
      });
    }
  };

  const handleGoogleLogin = () => {
    googleLogin().then(async (result) => {
      if (result.user) {
        const user = result.user;
        const profileInfo = {
          name: user.displayName,
          email: user.email,
          profileImage: user.photoURL,
          designation: "unknown",
          role: "Employee",
          salary: 0,
          bank_account: "",
          isVerified: false,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime,
        };
        await axiosInstance.post("/register", { profileInfo });
        await refetchUserData();
        navigate(location?.state || "/");
      }

      toast.success("Login successful!");
    });
  };

  return (
    <div className="max-w-md w-full border-2 border-primary/20 rounded-2xl shadow-lg p-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Login to Employee Flow
      </h2>
      <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          defaultValue={"admin@gmail.com"}
          className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
          required
        />
        <div className="mb-4 relative ">
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-8 bottom-4 cursor-pointer"
          >
            {showPass ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
          </button>
          <input
            type={showPass ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            defaultValue={"123456Aa@"}
            className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:border-primary"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary cursor-pointer text-white font-bold py-3 rounded-lg mt-2"
        >
          Login
        </button>
      </form>
      <div className="my-4 w-full flex items-center">
        <div className="flex-1 h-px bg-primary/20"></div>
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-primary/20"></div>
      </div>
      <button
        onClick={handleGoogleLogin}
        className="w-full cursor-pointer flex items-center justify-center gap-3 border border-primary/30 py-3 rounded-lg font-semibold text-primary "
      >
        <FcGoogle className="text-2xl" />
        Continue with Google
      </button>
      <p className="mt-6 text-sm">
        Don't have an account?{" "}
        <Link
          state={location.state}
          to="/register"
          className="text-primary font-semibold"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
