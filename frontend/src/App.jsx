import { BrowserRouter, Routes, Route } from "react-router";
import LoginComponent from "./components/AuthComponents/LoginComponent.jsx";
import Body from "./components/Body.jsx";
import SignupComponent from "./components/AuthComponents/SignupComponent.jsx";
import TaskPage from "./components/TaskComponents/TaskPage.jsx";
import MissingRoute from "./components/MissingRoute.jsx";
import UnauthorizedPage from "./components/UnauthorizedPage.jsx";
import RequireAuth from "./components/AuthComponents/RequireAuth.jsx";
import CompletedTask from "./components/TaskComponents/CompletedTask.jsx";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="login" element={<LoginComponent />} />
            <Route path="signup" element={<SignupComponent />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />

            {/* protected routes */}

            <Route
              element={<RequireAuth allowedRoles={["user"]}></RequireAuth>}>
              <Route path="/" element={<TaskPage />} />
              <Route path="/completed" element={<CompletedTask />} />
            </Route>
            {/* any unmatched route */}
            <Route path="*" element={<MissingRoute />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
