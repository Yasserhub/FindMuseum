import React from "react";
import heart from "../../assets/heart/heart-regular.svg";
import heartSolid from "../../assets/heart/heart-solid.svg";
import PropTypes from "prop-types";
import "./Heart.css";
import { useAuth } from "../../context/authContext";

const Heart = ({ id }) => {
  const { isLoggedIn, handleFavorite, isFavorite } = useAuth();

  Heart.propTypes = {
    id: PropTypes.string.isRequired,
  };

  const inFav = isFavorite(id);

  return (
    <>
      <div className="img-wrapper">
        <img
          src={inFav ? heartSolid : heart}
          alt={inFav ? "heartSolid" : "heart"}
          className="fav_icon"
          onClick={(event) => {
            handleFavorite(id, isLoggedIn);
            event.stopPropagation();
          }}
        />
      </div>
    </>
  );
};

export default Heart;
