import { BrowserRouter, Routes, Route } from "react-router";
import LoginComponent from "./components/AuthComponents/LoginComponent.jsx";
import Body from "./components/Body.jsx";
import SignupComponent from "./components/AuthComponents/SignupComponent.jsx";
import TaskPage from "./components/TaskComponents/TaskPage.jsx";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<TaskPage/>}/>
            <Route path="login" element={<LoginComponent />} />
            <Route path="signup" element={<SignupComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
