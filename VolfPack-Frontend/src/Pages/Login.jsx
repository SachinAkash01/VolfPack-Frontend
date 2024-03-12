/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emptyFields, setEmptyFields] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the login process when the user submits the form.
   * Sends a request to the server for authentication.
   */
  const handleLogin = async () => {
    if (email && password) {
      try {
        // Send authentication request to the server
        const response = await axios.post("http://localhost:3001/api/login", {
          email: email,
          password: password,
        });
  
        // Extract user ID, username, token, and functions from the response
        const { token, username, functions } = response.data;
  
  
        // Store the email, user ID, token, and functions in cookies
        Cookies.set("email", email, { expires: 7 });
        Cookies.set("jwtToken", token, { expires: 1 });
        Cookies.set("username", username, { expires: 7 });
        Cookies.set("functions", functions, { expires: 7 });
  
        // Navigate to the Main page after successful login
        navigate("/Main");
      } catch (error) {
        // Handle authentication error
        console.error("Login error:", error);
        setIncorrectPassword(true);
        setEmptyFields(false);
      }
    } else {
      // Set validation flags for empty fields
      setEmptyFields(true);
      setIncorrectPassword(true);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500">
      <div className="bg-white p-8 rounded-3xl shadow-md max-w-md w-full">
        {/* Login form */}
        <h2 className="text-2xl font-semibold mb-4 text-center">User Login</h2>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {/* Email input */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className={`w-full p-2 border rounded-md ${
                (incorrectPassword || emptyFields) && !email
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {(incorrectPassword || emptyFields) && !email && (
              <p className="text-red-500 text-xs mt-1">Email cannot be empty</p>
            )}
          </div>
          {/* Password input */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"} // Show/hide password based on state
              id="password"
              className={`w-full p-2 border rounded-md ${
                (incorrectPassword || emptyFields) && password
                  ? "border-red-500"
                  : ""
              }`}
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* Eye icon to toggle password visibility */}
            <span
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {(incorrectPassword || emptyFields) && !password && (
              <p className="text-red-500 text-xs mt-1">
                Password cannot be empty
              </p>
            )}
            {(incorrectPassword || emptyFields) && password && (
              <p className="text-red-500 text-xs mt-1">
                Incorrect email or password
              </p>
            )}
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-900 text-white font-semibold rounded-full py-2 px-4 w-full"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
        {/* Registration link */}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
