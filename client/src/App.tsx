import { Outlet } from "react-router";
import "./App.css";
import { useState } from "react";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import NavMobile from "./components/NavMobile/NavMobile";

type User = {
  id: number;
  email: string;
};

type Auth = {
  user: User;
  token: string;
};

function App() {
  const [auth, setAuth] = useState<Auth | null>(null);
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Outlet context={{ auth, setAuth }} />
      </main>
      <NavMobile />
      <Footer />
    </div>
  );
}

export default App;
