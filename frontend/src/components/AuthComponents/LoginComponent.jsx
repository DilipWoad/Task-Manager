import { useState } from "react";
import { useNavigate, Link } from "react-router";
// import { useDispatch } from "react-redux";
// import { addUser } from "../../slices/userSlice";
import { validateLoginForm } from "../../utils/FormValidation/validateFormLogin.js";
import { BASE_URL, CLOSE_EYE, OPEN_EYE, quaternaryColor, secondaryColor, tertiaryColor } from "../../utils/constant.js";
import LoadingScreen from "../LoadingScreen.jsx";
import axios from "axios";
import useAuth from "../../hooks/useAuth.js";
const LoginComponent = () => {
  // const [email, setEmail] = useState("dilip@g.com");
  // const [password, setPassword] = useState("12345678");
  const { setAuth } = useAuth();
  const loginErrorStruct = {
    emailError: "",
    passwordError: "",
  };
  const [loginError, setLoginError] = useState(loginErrorStruct);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginFormStructure = {
    email: "d@g.com",
    password: "12345678",
  };

  const [formLogin, setFormLogin] = useState(loginFormStructure);
  const navigate = useNavigate();
  //   const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginUser = async (e) => {
    e.preventDefault();
    setLoginError(loginErrorStruct);
    const isValid = validateLoginForm(formLogin);
    if (!isValid) {
      //email validation fails
      //then set the error here
      setLoginError((prev) => ({
        ...prev,
        emailError: "Please enter a valid email address",
      }));

      //and get out from here
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/auths/login`, formLogin, {
        withCredentials: true,
      });
      console.log("Login response ::: ", res);
      setLoginError(loginErrorStruct);
      setAuth(res.data.data);
      if (res.data.data.role === "user") {
        navigate("/all-tasks");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.log("Auth Error :: ", error);
      const statusCode = error.response.status;
      const msg = error.response?.data?.message || "Login failed";

      let newError = { emailError: "", passwordError: "" };

      if (statusCode === 404) {
        newError.emailError = msg;
      } else if (statusCode === 400) {
        newError.passwordError = msg;
      } else {
        newError.passwordError = msg;
      }
      setLoginError(newError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center text-black shrink h-full ">
      {loading && <LoadingScreen />}
      <div className={`bg-[${tertiaryColor}] w-full max-w-sm rounded-lg p-8 shadow-xl mx-2`}>
        <label className="text-2xl font-semibold ">Login</label>
        <form className="mt-6" onSubmit={handleLoginUser}>
          <div>
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formLogin.email}
              required
              onChange={handleChange}
              className={` bg-[${quaternaryColor}] w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            <p className="text-red-500 sm:text-nowrap text-wrap">
              {loginError.emailError}
            </p>
          </div>
          <div className="mt-5 relative">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type={eyeOpen ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              required
              value={formLogin.password}
              onChange={handleChange}
              className={` bg-[${quaternaryColor}] w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            <div
              onClick={() => setEyeOpen(!eyeOpen)}
              className="absolute bottom-2 right-2 hover:cursor-pointer"
            >
              <img
                className="w-5 "
                src={eyeOpen ? OPEN_EYE : CLOSE_EYE}
                alt="see-password-icon"
              />
            </div>
          </div>
          <p className="text-red-500 sm:text-nowrap text-wrap">
            {loginError.passwordError}
          </p>
          <button
            type="submit"
            className="py-2 bg-blue-500 mt-10 w-full rounded-lg text-lg text-white hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link to={"/signup"} className="hover:underline hover:cursor-pointer">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginComponent;
