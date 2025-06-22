import { Outlet } from "react-router";
import "./App.css";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import NavMobile from "./components/NavMobile/NavMobile";

function App() {
  return (
    <>
      <NavBar />
      <Outlet />
      <NavMobile />
      <Footer />
    </>
  );
}

export default App;
