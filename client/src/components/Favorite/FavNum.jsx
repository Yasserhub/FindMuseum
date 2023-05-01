import React from "react";
import heartSolid from "../../assets/heart/heart-solid.svg";
import "./FavNum.css";
import PropTypes from "prop-types";
import { useFavNum } from "../../context/favNumContext";
const FavHeart = ({ id }) => {
  FavHeart.propTypes = {
    id: PropTypes.string.isRequired,
  };

  const { allUsers } = useFavNum();

  const result = allUsers.filter((user) => {
    if (user.favoriteMuseums.includes(id)) return user;
  });

  const numFav = result.length;

  return (
    <>
      <div className="fav-wrapper_num">
        <img src={heartSolid} alt="heartSolid" className="fav_num" />
      </div>

      <div className="fav-wrapper_num1">
        <div className="fav_num1"> {numFav}</div>
      </div>
    </>
  );
};

export default FavHeart;
