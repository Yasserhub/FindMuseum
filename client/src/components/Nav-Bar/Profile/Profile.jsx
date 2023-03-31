import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./profile.css";
import avatar from "../../../assets/drop/user.png";
import star from "../../../assets/drop/star.png";
import edit from "../../../assets/drop/edit.png";
import logout from "../../../assets/drop/log-out.png";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/authContext";

const Profile = ({ onClose }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {
    clearFavorites,
    authUser,
    setIsLoggedIn,
    setAuthUser,
    handleLogoutFavorite,
  } = useAuth();
  const userId = JSON.parse(localStorage.getItem("authUser"));
  const menuRef = useRef();

  //profile menu items
  function DropdownItem(props) {
    return (
      <li className="dropdownItem">
        <img src={props.img}></img>
        <Link
          to={props.link}
          onClick={() => {
            props.logout();
            onClose();
          }}
        >
          {props.text}
        </Link>
      </li>
    );
  }

  DropdownItem.propTypes = {
    img: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    logout: PropTypes.func,
  };

  //when user click on outside of the profile menu , profile menu will close
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    <li className="navbar-item-profile">
      <div className="profile-section">
        <div className="menu-container" ref={menuRef}>
          <div
            className="menu-trigger"
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
            }}
          >
            {authUser?.profilePicture ? (
              <img
                src={authUser?.profilePicture}
                alt=""
                style={{ width: "50px", height: "50px" }}
              />
            ) : (
              <img
                src={avatar}
                alt=""
                style={{ width: "50px", height: "50px" }}
              />
            )}
            {/* <img src={avatar}></img> */}
          </div>

          <div
            className={`dropdown-menu ${isProfileOpen ? "active" : "inactive"}`}
          >
            <div className="container--user">
              {/* <img src={avatar}></img> */}
              {authUser?.profilePicture ? (
                <img
                  src={authUser?.profilePicture}
                  alt=""
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
              ) : (
                <img
                  src={avatar}
                  alt=""
                  style={{ width: "50px", height: "50px" }}
                />
              )}
              <h3 className="profile-name">
                {authUser ? authUser.firstName : "No Name"}
              </h3>
            </div>

            <ul className="menu-items">
              <DropdownItem
                img={avatar}
                text={"My Profile"}
                link={`/profile/${authUser?._id}`}
              />
              <DropdownItem img={star} text={"Favorites"} link={"/favorites"} />
              <DropdownItem
                img={edit}
                text={"Comments"}
                link={`/user/comments/${userId && userId._id}`}
              />
              <DropdownItem
                img={logout}
                text={"Logout"}
                link={"/"}
                logout={async () => {
                  await handleLogoutFavorite();
                  setIsLoggedIn(false);
                  setAuthUser(null);
                  clearFavorites();
                }}
              />
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
};

Profile.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Profile;
