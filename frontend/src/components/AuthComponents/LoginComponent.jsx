import { useState } from "react";
import { useNavigate, Link } from "react-router";
// import { useDispatch } from "react-redux";
// import { addUser } from "../../slices/userSlice";
import { validateLoginForm } from "../../utils/FormValidation/validateFormLogin.js";
import { BASE_URL, CLOSE_EYE, OPEN_EYE } from "../../utils/constant.js";
import LoadingScreen from "../LoadingScreen.jsx";
import axios from "axios";
const LoginComponent = () => {
  // const [email, setEmail] = useState("dilip@g.com");
  // const [password, setPassword] = useState("12345678");
  const loginErrorStruct = {
    emailError: "",
    passwordError: "",
  };
  const [loginError, setLoginError] = useState(loginErrorStruct);
  const [eyeOpen, setEyeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginFormStructure = {
    email: "",
    password: "",
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
    const isValid = validateLoginForm(formLogin);

    if (isValid) {
        setLoading(true);
      try {
        const res = await axios.post(`${BASE_URL}/auths/login`, formLogin, {
          withCredentials: true,
        });
        console.log("Login response ::: ", res);
        setLoginError(loginErrorStruct);
        navigate("/");
      } catch (error) {
        console.log("Auth Error :: ",error)
        const msg = error.response?.data?.message || "Login failed";
        msg.includes("email")
          ? setLoginError((prev) => ({ ...prev, emailError: msg }))
          : setLoginError((prev) => ({ ...prev, passwordError: msg }));
      }
      //   const loginInfo = await loginUser(formLogin);
      //   if (loginInfo.data) {
      //     dispatch(addUser(loginInfo?.data?.user));
      //     setLoginError({});
      //     navigate("/");
      //   } else {
      //     setLoginError(loginInfo);
      //   }
    } else {
      console.log("Invalid email format");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center w-screen ">
      {loading && <LoadingScreen />}
      <div className="bg-white w-full max-w-sm rounded-lg p-8 shadow-lg">
        <label className="text-2xl font-semibold ">Login</label>
        <form className="mt-6" onSubmit={handleLoginUser}>
          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formLogin.email}
              required
              onChange={handleChange}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <p className="text-red-500">{loginError.emailError}</p>
          </div>
          <div className="mt-5 relative">
            <label className="block text-gray-600">Password</label>
            <input
              type={eyeOpen ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              required
              value={formLogin.password}
              onChange={handleChange}
              className=" bg-slate-100 w-full px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
