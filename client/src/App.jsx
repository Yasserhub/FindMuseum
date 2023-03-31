import React from "react";
import { Routes, Route } from "react-router-dom";
import MuseumDetails from "./components/Home-Page/museum/MuseumDetails";
import Nav from "./components/Nav-Bar/Nav";
import LoginForm from "./pages/Auth/LoginForm";
import RegisterForm from "./pages/Auth/RegisterForm";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/footer";
// import Museums from "./pages/Museums/Museums";
import MuseumOverview from "./pages/MuseumOverview/MuseumOverview";
import Offers from "./pages/Offers/Offers";
import Favorites from "./pages/Museums/Favorites";
import { AuthProvider } from "./context/authContext";
import MyProfile from "./pages/MyProfile/MyProfile";
import { MuseumsProvider } from "./context/museumContext";
import SearchedOverview from "./pages/MuseumOverview/SearchedOverview";

// import SearchedOverview from "./pages/MuseumOverview/SearchedOverview";
import UserComments from "./pages/MyProfile/UserComments";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import OtpInput from "./pages/Auth/OTPInput";

const App = () => {
  return (
    <>
      <MuseumsProvider>
        <AuthProvider>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/museums/:key" element={<SearchedOverview />} />
            <Route path="/museums" element={<MuseumOverview />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/museum/:museumId" element={<MuseumDetails />} />
            <Route path="/profile/:id" element={<MyProfile />} />
            <Route path="/user/comments/:userId" element={<UserComments />} />
            {/* <Route path="/user/comment/edit" element={<ReviewEdit/>} /> */}
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/otp/:userId" element={<OtpInput />} />
            <Route path="/resetPassword/:userId" element={<ResetPassword />} />
          </Routes>
          <Footer />
        </AuthProvider>
      </MuseumsProvider>
    </>
  );
};

export default App;
