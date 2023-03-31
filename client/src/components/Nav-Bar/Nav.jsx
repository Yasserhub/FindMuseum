import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import logo from "../../assets/img/findh.png";
import "./nav.css";
import Profile from "./Profile/Profile";
import { useAuth } from "../../context/authContext";
import { scrollToUp } from "../../hooks/scrollToUp";

const Nav = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  // get user from context
  const { isLoggedIn } = useAuth();

  const handleClick = () => setMenuIsOpen(!menuIsOpen);
  const onClose = () => setMenuIsOpen(false);

  return (
    <header className="logoAndNavbar">
      <ToastContainer />
      <nav className="nav">
        <div className="logo-navbar-container container-nav">
          <Link
            to="/"
            onClick={() => {
              onClose();
              scrollToUp();
            }}
          >
            <img className="logo" src={logo} alt="Logo" />
          </Link>
          <div className="burger-menu-icon" onClick={handleClick}>
            {menuIsOpen ? <FaTimes /> : <FaBars />}
          </div>
          <ul className={menuIsOpen ? "navbar active" : "navbar"}>
            <li className="navbar-item">
              <h3>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "activeBar" : "")}
                  onClick={() => {
                    onClose();
                    scrollToUp();
                  }}
                >
                  Home
                </NavLink>
              </h3>
            </li>
            <li className="navbar-item">
              <h3>
                <NavLink
                  to="museums"
                  className={({ isActive }) => (isActive ? "activeBar" : "")}
                  onClick={onClose}
                >
                  Museums
                </NavLink>
              </h3>
            </li>

            <li className="navbar-item">
              <h3>
                <NavLink
                  to="offers"
                  className={({ isActive }) => (isActive ? "activeBar" : "")}
                  onClick={onClose}
                >
                  Offers
                </NavLink>
              </h3>
            </li>

            {isLoggedIn ? (
              <Profile onClose={onClose} />
            ) : (
              <>
                <li className="navbar-item">
                  <h3>
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "activeBar" : ""
                      }
                      onClick={onClose}
                    >
                      Log in
                    </NavLink>
                  </h3>
                </li>
                <li className="navbar-item">
                  <h3>
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        isActive ? "activeBar" : ""
                      }
                      onClick={onClose}
                    >
                      Register
                    </NavLink>
                  </h3>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
