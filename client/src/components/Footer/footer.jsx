import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import {
  AiFillTwitterCircle,
  AiFillFacebook,
  AiFillYoutube,
  AiFillInstagram,
  AiOutlineMail,
  AiOutlineWhatsApp,
} from "react-icons/ai";
import "./footer.css";
import logo from "../../assets/img/logo-find-museum.png";
import { scrollToUp } from "../../hooks/scrollToUp";

const Footer = () => {
  const { isLoggedIn } = useAuth();
  const [stateOfLogin, setStateOfLogin] = useState("");

  useEffect(() => {
    isLoggedIn ? setStateOfLogin("/favorites") : setStateOfLogin("/login");
  }, [isLoggedIn]);

  const handleFavorite = () => {
    if (!isLoggedIn) {
      toast.warn("Please, log in to see your favorites!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <footer className="container--footer">
      <div className="container--company-logo">
        <img src={logo} alt="Company Logo" className="logo-find-company" />
        <h2>FIND MUSEUM</h2>
      </div>

      <div className="container--company-section">
        <div className="container--company-information">
          <div className="container--follow-us">
            <h3>Follow Us</h3>
            <ul className="social-media-links">
              <li>
                <a href="/">
                  <AiFillTwitterCircle />
                </a>
              </li>
              <li>
                <a href="/">
                  <AiFillFacebook />
                </a>
              </li>
              <li>
                <a href="/">
                  <AiFillYoutube />
                </a>
              </li>
              <li>
                <a href="/">
                  <AiFillInstagram />
                </a>
              </li>
            </ul>
          </div>
          {/* <div className="container--mobile-app">
            <img src={mobileStores} alt="Google Play Store" />
          </div> */}
        </div>
        <div className="container--have-question">
          <h3>Do you have a question?</h3>
          <div className="container--info">
            <AiOutlineMail />
            <a href="/">info@museum.nl</a>
          </div>
          <div className="container--phone">
            <AiOutlineWhatsApp />
            <a href="/">+31 880 90 998</a>
          </div>
        </div>
        <div className="container--page-links">
          <h3>Short Links</h3>
          <ul className="short-links">
            <li className="footer-list-item">
              <Link to="/" onClick={scrollToUp}>
                Home
              </Link>
            </li>
            <li className="footer-list-item">
              <Link to="/museums">Museums</Link>
            </li>
            <li className="footer-list-item">
              <Link to={stateOfLogin} onClick={handleFavorite}>
                Favorites
              </Link>
            </li>
            <li className="footer-list-item">
              <Link to="/offers">Offers</Link>
            </li>
          </ul>
        </div>
        <div className="container--more">
          <h3>More</h3>
          <ul className="more">
            <li className="footer-list-item">
              <Link to="/">Press</Link>
            </li>
            <li className="footer-list-item">
              <Link to="/">Privacy</Link>
            </li>
            <li className="footer-list-item">
              <Link to="/">Terms</Link>
            </li>
            <li className="footer-list-item">
              <Link to="/">Partners</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container--copyright-section">
        Copyright 2023 - All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
