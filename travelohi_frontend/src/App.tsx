import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./app.css";
// import LoginForm from "./Components/LoginForm/LoginForm"
// import RegisterForm from "./Components/RegisterForm/RegisterForm"
import Home from "./Components/Main-App/Home/Home";
import LocationChecker from "./Components/LocationChecker/LocationChecker";
import LoginOTP from "./Components/LoginForm/LoginOTP";
import Game from "./Components/Game/Game";
import Login from "./Components/LoginForm/Login";
import Register from "./Components/RegisterForm/Register";
import ForgotPassword from "./Components/LoginForm/ForgotPassword";
import Navbar from "./Components/Main-App/Navbar/Navbar";
import { useEffect, useState } from "react";
import Footer from "./Components/Main-App/Footer/Footer";
import Profile from "./Components/Main-App/Profile/Profile";
import Admin from "./Components/AdminPage/Admin";
import HotelDetail from "./Components/Main-App/Detail/HotelDetail/HotelDetail";
import SearchPage from "./Components/Main-App/Search/SearchPage";
import FlightDetail from "./Components/Main-App/Detail/FlightDetail/FlightDetail";
import Transactions from "./Components/Main-App/Transactions/Transactions";

const AuthLayout = ({ children }) => {
  return <div className="scrollable">{children}</div>;
};

const MainLayout = ({ children, theme, setTheme }) => {
  return (
    <div className="scrollable">
      <Navbar theme={theme} setTheme={setTheme} />
      {children}
      <Footer />
    </div>
  );
};

const App = () => {
  const [theme, setTheme] = useState("light");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />
        <Route
          path="/loginOTP"
          element={
            <AuthLayout>
              <LoginOTP />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <Register />
            </AuthLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />
      </Routes>
      <Routes>
        <Route
          index
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <Home theme={theme} setTheme={setTheme} />
            </MainLayout>
          }
        />
        <Route
          path="/home"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <Home theme={theme} setTheme={setTheme} />
            </MainLayout>
          }
        />
        <Route
          path="/location-checker"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <LocationChecker theme={theme} />
            </MainLayout>
          }
        />
        <Route
          path="/game"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <Game />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <Profile theme={theme} />
            </MainLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <Admin />
            </MainLayout>
          }
        />
        <Route
          path="/hoteldetail/:id/:name"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <HotelDetail />
            </MainLayout>
          }
        />

        <Route
          path="/search/:query"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <SearchPage />
            </MainLayout>
          }
        />
        <Route
          path="/flightdetail/:flightid"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <FlightDetail />
            </MainLayout>
          }
        />
        <Route
          path="/myreservations"
          element={
            <MainLayout theme={theme} setTheme={setTheme}>
              <Transactions />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
