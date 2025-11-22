import { BrowserRouter, Routes, Route } from "react-router";
import LoginComponent from "./components/AuthComponents/LoginComponent.jsx";
import Body from "./components/Body.jsx";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="login" element={<LoginComponent />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
