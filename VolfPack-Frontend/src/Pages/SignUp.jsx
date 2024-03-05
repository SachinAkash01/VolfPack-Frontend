/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [shortPassword, setShortPassword] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isPasswordValid = (password) => {
    const isLengthValid = password.length >= 6;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return isLengthValid && hasLowercase && hasUppercase && hasSpecialCharacter;
  };

  const handleRegistration = async () => {
    if (
      username &&
      email &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      isPasswordValid(password)
    ) {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/signup",
          {
            username,
            email,
            password,
          }
        );

        const { userId, message } = response.data;
        console.log(message);
        navigate("/Login");
      } catch (error) {
        console.error(error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          alert(error.response.data.message);
        } else {
          alert("Registration failed. Please try again later.");
        }
      }
    } else {
      setEmptyFields(true);
      setPasswordMismatch(password !== confirmPassword);
      setShortPassword(password.length < 6);
      setInvalidPassword(!isPasswordValid(password));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500">
      <div className="bg-white p-8 rounded-3xl shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          User Sign Up
        </h2>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className={`w-full p-2 border rounded-md ${
                emptyFields && !username ? "border-red-500" : ""
              }`}
              placeholder="Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {emptyFields && !username && (
              <p className="text-red-500 text-xs mt-1">
                Username cannot be empty
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`w-full p-2 border rounded-md ${
                emptyFields && !email ? "border-red-500" : ""
              }`}
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emptyFields && !email && (
              <p className="text-red-500 text-xs mt-1">Email cannot be empty</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`w-full p-2 border rounded-md ${
                  emptyFields && !password ? "border-red-500" : ""
                } ${shortPassword || invalidPassword ? "border-red-500" : ""}`}
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {emptyFields && !password && (
              <p className="text-red-500 text-xs mt-1">
                Password cannot be empty
              </p>
            )}
            {shortPassword && password && (
              <p className="text-red-500 text-xs mt-1">
                Password must be at least 6 characters
              </p>
            )}
            {invalidPassword && (
              <p className="text-red-500 text-xs mt-1">
                Password must contain at least one lowercase letter, one
                uppercase letter, and one special character
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`w-full p-2 border rounded-md ${
                  (emptyFields || passwordMismatch) && !confirmPassword
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="absolute top-2 right-2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {(emptyFields || passwordMismatch) && !confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                Confirm Password cannot be empty
              </p>
            )}
            {passwordMismatch && confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                Passwords do not match
              </p>
            )}
          </div>
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-900 text-white font-semibold rounded-full py-2 px-4 w-full"
            onClick={handleRegistration}
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/Login")}
          >
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
