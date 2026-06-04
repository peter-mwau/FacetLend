import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFoundPage from "./pages/404";
import { ToastContainer } from "react-toastify";
import MasterPage from "./pages/Masterpage/MasterPage";

function App() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        theme="colored"
        className="z-9999"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mainpage" element={<MasterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
