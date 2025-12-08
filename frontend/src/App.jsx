import { BrowserRouter, Routes, Route } from "react-router";
import LoginComponent from "./components/AuthComponents/LoginComponent.jsx";
import Body from "./components/Body.jsx";
import SignupComponent from "./components/AuthComponents/SignupComponent.jsx";
import TaskPage from "./components/TaskComponents/TaskPage.jsx";
import MissingRoute from "./components/MissingRoute.jsx";
import UnauthorizedPage from "./components/UnauthorizedPage.jsx";
import RequireAuth from "./components/AuthComponents/RequireAuth.jsx";
import CompletedTask from "./components/TaskComponents/CompletedTask.jsx";
import TodayTask from "./components/TaskComponents/TodayTask.jsx";
import UpcomingTask from "./components/TaskComponents/UpcomingTask.jsx";
import PastDue from "./components/TaskComponents/PastDue.jsx";
import TaskDetailCard from "./components/TaskComponents/TaskDetailCard.jsx";
import AdminPage from "./components/TaskComponents/AdminPage.jsx";
import Group from "./components/GroupComponents/Group.jsx";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="login" element={<LoginComponent />} />
            <Route path="signup" element={<SignupComponent />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            <Route path="/groups" element={<Group />} />

            {/* <Route path="yo" element={<TaskDetailCard />} /> */}

            {/* protected routes */}

            <Route
              element={<RequireAuth allowedRoles={["user"]}></RequireAuth>}
            >
              <Route path="/" element={<TaskPage />} />
              <Route path="all-tasks" element={<TaskPage />} />
              <Route path="completed" element={<CompletedTask />} />
              <Route path="today" element={<TodayTask />} />
              <Route path="upcoming" element={<UpcomingTask />} />
              <Route path="past-due" element={<PastDue />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminPage />} />
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
