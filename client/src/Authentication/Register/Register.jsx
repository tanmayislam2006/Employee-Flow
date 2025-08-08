import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash, FaUserCircle } from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router";
import { FcGoogle } from "react-icons/fc";
import defaultAvatar from "../../assets/logo.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import useAuthProvidor from "../../Hook/useAuthProvidor";
import Swal from "sweetalert2";
import useAxios from "../../Hook/useAxios";

const Register = () => {
  const { createAccount, googleLogin, refetchUserData } = useAuthProvidor();
  const axiosInstance = useAxios();
  const location = useLocation();
  const [showPass, setShowPass] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(defaultAvatar);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Handle Google Sign-In
  const handleGoogleLogin = () => {
    googleLogin().then((result) => {
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
        axiosInstance.post("/register", { profileInfo });
        refetchUserData();
        navigate(location?.state || "/");
      }

      toast.success("Login successful!");
    });
  };

  // Handle Form Submit
  const onSubmit = (data) => {
    createAccount(data.email, data.password)
      .then((res) => {
        if (res.user) {
          const profileInfo = {
            name: data.firstName + " " + data.lastName,
            email: data.email,
            profileImage: image,
            designation: data.designation,
            role: data.role,
            salary: parseInt(data.salary),
            bank_account: data.bank_account_no,
            isVerified: `${data.role === "HR" ? true : false}`,
            creationTime: res.user?.metadata?.creationTime,
            lastSignInTime: res.user?.metadata?.lastSignInTime,
          };

          navigate("/");
          // save user information in database
          axiosInstance
            .post("/register", { profileInfo })
            .then((res) => console.log(res.data));

          Swal.fire({
            title: "Registration Complete",
            confirmButtonColor: "#00BFB2",
            icon: "success",
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Register Failed",
          text: `${err?.message}`,
          confirmButtonColor: "#00BFB2",
          icon: "error",
        });
      });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("image", file);
      axios
        .post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMMGBB_API_KEY
          }`,
          formData
        )
        .then((response) => {
          if (response.data.success) {
            setImage(response.data.data.url);
          } else {
            toast.error("Image upload failed");
          }
        })
        .catch(() => toast.error("Image upload failed"));
    }
  };
  return (
    <div className="max-w-full w-full border border-primary/20 rounded-2xl shadow-xl p-4 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-primary mb-2">
        Create your EmployeeFlow Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
        {/* Profile Image Upload - Centered above columns */}
        <div className="flex flex-col items-center col-span-2">
          <div className="relative w-24 h-24">
            <img
              src={image || preview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover border border-primary/20 shadow"
            />
            <label
              htmlFor="image"
              className="absolute bottom-0 right-0 bg-primary p-1 rounded-full cursor-pointer border-2 border-white shadow"
            >
              <FaUserCircle size={22} className="text-white" />
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
          <span className="text-xs text-gray-400 mt-1">
            Upload Profile Image
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-2">
            {/* Firt Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="First Name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.firstName ? "border-red-500" : "border-primary/20"
                } focus:outline-none focus:border-primary`}
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            {/* last name  */}
            <div className="relative">
              <input
                type="text"
                placeholder="Last  Name"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.lastName ? "border-red-500" : "border-primary/20"
                } focus:outline-none focus:border-primary`}
                {...register("lastName", { required: "Last Name is required" })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email Address"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-500" : "border-primary/20"
                } focus:outline-none focus:border-primary`}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password with Validation */}
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-primary/20"
                } focus:outline-none focus:border-primary`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  validate: {
                    hasUpperCase: (value) =>
                      /[A-Z]/.test(value) || "Must include an uppercase letter",
                    hasLowerCase: (value) =>
                      /[a-z]/.test(value) || "Must include a lowercase letter",
                    hasSpecialChar: (value) =>
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                      "Must include a special character",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-3 text-gray-400 cursor-pointer"
              >
                {showPass ? (
                  <FaRegEyeSlash size={20} />
                ) : (
                  <FaRegEye size={20} />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            {/* Role Selector */}
            <div className="relative">
              <select
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.role ? "border-red-500" : "border-primary/20"
                } focus:outline-none focus:border-primary`}
                {...register("role", { required: "Role is required" })}
              >
                <option value="">Select Role</option>
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Designation */}
            <div className="relative">
              <input
                type="text"
                placeholder="Designation (e.g. Sales Assistant)"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.designation ? "border-red-500" : "border-primary/20"
                } focus:outline-none focus:border-primary`}
                {...register("designation", {
                  required: "Designation is required",
                })}
              />
              {errors.designation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.designation.message}
                </p>
              )}
            </div>

            {/* Bank Account Number */}
            <div className="relative">
              <input
                type="text"
                placeholder="Bank Account Number"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.bank_account_no
                    ? "border-red-500"
                    : "border-primary/20"
                } focus:outline-none focus:border-primary`}
                {...register("bank_account_no", {
                  required: "Bank account number is required",
                })}
              />
              {errors.bank_account_no && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.bank_account_no.message}
                </p>
              )}
            </div>

            {/* Salary */}
            <div className="relative">
              <input
                type="number"
                placeholder="Salary (in USD)"
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.salary ? "border-red-500" : "border-primary/20"
                } focus:outline-none focus:border-primary`}
                {...register("salary", { required: "Salary is required" })}
              />
              {errors.salary && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.salary.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Register Button - Full width below columns */}
        <button
          type="submit"
          className="w-full bg-primary cursor-pointer text-white font-bold py-3 rounded-lg hover:bg-primary/90 transition"
        >
          Register
        </button>
      </form>

      {/* Divider */}
      <div className="my-2 w-full flex items-center">
        <div className="flex-1 h-px bg-primary/20"></div>
        <span className="mx-3 text-gray-400 text-sm">or</span>
        <div className="flex-1 h-px bg-primary/20"></div>
      </div>

      {/* Google Sign In */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border border-primary/30 py-3 rounded-lg font-semibold text-primary hover:bg-primary/10 transition"
      >
        <FcGoogle className="text-2xl" />
        Continue with Google
      </button>

      {/* Link to Login */}
      <p className="mt-2 text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
