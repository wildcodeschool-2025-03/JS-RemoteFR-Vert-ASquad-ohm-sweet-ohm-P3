import { Outlet } from "react-router";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import NavMobile from "./components/NavMobile/NavMobile";

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <NavMobile />
    </>
  );
}

export default App;
