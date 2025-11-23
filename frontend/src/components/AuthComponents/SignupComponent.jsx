import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { validateSignupForm } from "../../utils/FormValidation/validateSignupForm.js";
import { BASE_URL, CLOSE_EYE, OPEN_EYE } from "../../utils/constant";
import LoadingScreen from "../LoadingScreen.jsx";
import axios from "axios";
const SignupComponent = () => {
  const [eyeOpen, setEyeOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const errorFormat = { emailError: "", passwordError: "" };
  const [signupError, setSignupError] = useState(errorFormat);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignupUser = async (e) => {
    e.preventDefault();
    setSignupError(errorFormat);
    const { isValidEmail, isValidPassword } = validateSignupForm(formData);
    if (!isValidEmail) {
      setSignupError((prev) => ({
        ...prev,
        emailError: "Please enter a valid email address",
      }));
      return;
    }
    if (!isValidPassword) {
      if (formData.password.length < 6) {
        setSignupError((prev) => ({
          ...prev,
          passwordError: "Password length should be greater than or equal to 6",
        }));
        return;
      }
      setSignupError((prev) => ({
        ...prev,
        passwordError:
          "Password must contain 1 Special,1 Uppercase and 1 Lowercase.",
      }));
      return
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auths/register`, formData);
      console.log("Response of Signup :: ", res);
      setSignupError(errorFormat);
      navigate("/login");
    } catch (error) {
      console.log("Error during user registeration. :: ", error.response.data);
      const statusCode = error.response.status;
      const msg = error.response.data.message || "Sign-up Failed.";

      let newError = { emailError: "", passwordError: "" };
      if (statusCode === 409) {
        newError.emailError = msg;
      }
      setSignupError(newError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen px-2 ">
      {loading && <LoadingScreen />}
      <div className="bg-white w-full max-w-md rounded-lg p-8 shadow-lg">
        <label className="text-2xl font-semibold ">Sign up</label>
        <form className="mt-6" onSubmit={handleSignupUser}>
          <div className="flex  space-x-2">
            <div className="w-1/2">
              <label className="block text-gray-600">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                required
                onChange={handleChange}
                className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              required
              onChange={handleChange}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-red-500 text-sm text-wrap">
              {signupError.emailError}
            </p>
          </div>
          <div className="mt-3 relative">
            <label className="block text-gray-600">Password</label>
            <input
              type={eyeOpen ? "text" : "password"}
              placeholder="Enter Password"
              required
              name="password"
              onChange={handleChange}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div
              onClick={() => setEyeOpen(!eyeOpen)}
              className="absolute bottom-2 right-2 hover:cursor-pointer "
            >
              <img
                className="w-5 "
                src={eyeOpen ? OPEN_EYE : CLOSE_EYE}
                alt="see-password-icon"
              />
            </div>
          </div>
          <p className="text-red-500 text-sm text-wrap">
            {signupError.passwordError}
          </p>
          <button
            type="submit"
            className="py-2 bg-blue-500 mt-6 w-full rounded-lg text-lg text-white hover:bg-blue-600 transition"
          >
            Signup
          </button>
        </form>
        <p className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <Link to={"/login"} className="hover:underline hover:cursor-pointer">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupComponent;
